#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""aktualitaet_pruefen.py — sind Dokumente, Anträge, Gesetze und Links noch aktuell?

Läuft NIE im Werkzeug selbst (Zero-Trust, CLAUDE.md §2), sondern lokal oder als
GitHub Action „Aktualitätsprüfung“ (.github/workflows/aktualitaet.yml) — dort ist
Netz erlaubt. Das Werkzeug zeigt nur das Ergebnis (assets/js/pruefstand.js).

  python3 tools/aktualitaet_pruefen.py                prüft alles, Bericht auf stdout
  python3 tools/aktualitaet_pruefen.py --bericht B.md --json B.json --pruefstand
  python3 tools/aktualitaet_pruefen.py --nur links,pdf,gesetze,intern,ablauf
  python3 tools/aktualitaet_pruefen.py --aktualisieren übernimmt, was maschinell geht
  python3 tools/aktualitaet_pruefen.py --pdf-suchen   schlägt direkte PDF-Adressen vor
  python3 tools/aktualitaet_pruefen.py --selbsttest   prüft das Werkzeug offline

Was geprüft wird
  links    jeder Link aus den Datenmodulen und dem Code: erreichbar? umgezogen?
           Fehlerseite? Optionales Kennwort je Quelle (`erwartet: "…"`) fängt
           Seiten, die trotz Fehler „200 OK“ melden.
  pdf      lokale PDFs mit Online-Quelle (`pdf:` oder URL auf .pdf): Online-
           Fassung laden und den TEXT vergleichen (Bytes allein melden zu viel).
  gesetze  Stand jedes Gesetzes auf gesetze-im-internet.de (amtliches XML) —
           gegen den hinterlegten Volltext bzw. gegen die letzte Prüfung.
  intern   Vordrucke ohne Online-Quelle: Erinnerung nach Alter.
  ablauf   Werte mit Ablaufdatum aus assets/js/ablaufdaten.js.

Nur Python-Standardbibliothek; für den PDF-Textvergleich pypdf (pip install pypdf).
"""
import argparse
import concurrent.futures as cf
import datetime as dt
import difflib
import hashlib
import html
import http.client
import importlib.util
import io
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

sys.dont_write_bytecode = True   # kein __pycache__ im Repo (der Workflow committet mit `git add -A`)
ROOT = Path(__file__).resolve().parent.parent
JS = ROOT / "assets" / "js"
PRUEFSTAND = JS / "pruefstand.js"
UA = ("Mozilla/5.0 (compatible; AzubiWissen-Aktualitaetspruefung/1.0; "
      "+https://github.com/hannespix/Azubi-Wissen)")
ZEITLIMIT = 25
MAX_HTML = 2_000_000
MAX_PDF = 40_000_000
INTERN_ALT_JAHRE = 5          # interne Vordrucke: ab diesem Alter erinnern
ABLAUF_VORLAUF_TAGE = 60      # Ablaufdaten: so früh warnen

# Rangfolge der Befunde: der schwerste bestimmt den Status einer Quelle.
STUFE = {"aktuell": 0, "weitergeleitet": 1, "nicht-pruefbar": 2, "alt": 3, "laeuft-ab": 3,
         "umgezogen": 4, "neue-fassung": 5, "geaendert": 5, "inhalt-fehlt": 6,
         "abgelaufen": 6, "defekt": 7}
NAME = {"aktuell": "aktuell", "weitergeleitet": "weitergeleitet", "nicht-pruefbar": "nicht prüfbar",
        "alt": "Stand alt", "laeuft-ab": "läuft bald ab", "umgezogen": "umgezogen",
        "neue-fassung": "neue Fassung online", "geaendert": "geändert", "inhalt-fehlt": "Inhalt fehlt",
        "abgelaufen": "abgelaufen", "defekt": "defekt"}
HANDLUNG = {"defekt", "inhalt-fehlt", "neue-fassung", "geaendert", "abgelaufen"}
BEACHTEN = {"umgezogen", "alt", "laeuft-ab", "nicht-pruefbar"}

FEHLERSEITE = re.compile(r"<title>[^<]*(404|nicht gefunden|not found|seite existiert nicht|"
                         r"fehlerseite|page not found|error)[^<]*</title>", re.I)


# ======================================================================
# Datenmodule lesen und schreiben
# ======================================================================
def lade_module() -> dict:
    """Liest die Datenmodule über node (sie sind JavaScript, kein JSON)."""
    module = ["quellen", "berufe", "wissen", "nachschlag", "checklisten", "vorlagen",
              "glossar", "kontakt", "ablaufdaten", "pruefstand", "gesetzestexte"]
    code = ["const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);"]
    for m in module:
        p = JS / (m + ".js")
        if p.exists():
            code.append(f"try{{vm.runInContext(fs.readFileSync({json.dumps(str(p))},'utf8'),c);}}"
                        f"catch(e){{process.stderr.write('Modul {m}: '+e.message+'\\n');}}")
    # Gesetzestexte nur mit Stand — die Volltexte braucht hier niemand.
    code.append("const w=c.window;if(w.GESETZESTEXTE){const g={};for(const k in w.GESETZESTEXTE)"
                "g[k]={kurz:w.GESETZESTEXTE[k].kurz,stand:w.GESETZESTEXTE[k].stand,"
                "portal:w.GESETZESTEXTE[k].portal};w.GESETZESTEXTE=g;}")
    code.append("process.stdout.write(JSON.stringify(w));")
    aus = subprocess.run(["node", "-e", "".join(code)], capture_output=True, text=True, check=True)
    if aus.stderr.strip():
        print(aus.stderr.strip(), file=sys.stderr)
    return json.loads(aus.stdout)


def quelle_feld_setzen(text: str, qid: str, feld: str, wert) -> str:
    """Setzt `feld: "…"` im Eintrag `qid` von quellen.js (Text bleibt sonst unberührt)."""
    m = re.search(r'\{\s*id:\s*"' + re.escape(qid) + r'"', text)
    if not m:
        raise KeyError(qid)
    ende = re.search(r"\n\s*\{\s*id:\s*\"|\n\s*\]\s*\n", text[m.end():])
    stop = m.end() + (ende.start() if ende else len(text) - m.end())
    block = text[m.start():stop]
    neu_wert = "null" if wert is None else json.dumps(wert, ensure_ascii=False)
    muster = re.compile(r"(\b" + re.escape(feld) + r":\s*)(\"(?:[^\"\\]|\\.)*\"|null)")
    if muster.search(block):
        block = muster.sub(lambda x: x.group(1) + neu_wert, block, count=1)
    else:   # Feld neu anlegen — direkt hinter `url:` bzw. `stand:`
        anker = re.search(r"(\burl:\s*(?:\"(?:[^\"\\]|\\.)*\"|null),)", block) or \
            re.search(r"(\bstand:\s*\"(?:[^\"\\]|\\.)*\",)", block)
        if not anker:
            raise ValueError(f"{qid}: kein Ankerfeld für {feld}")
        block = block[:anker.end()] + f" {feld}: {neu_wert}," + block[anker.end():]
    return text[:m.start()] + block + text[stop:]


# ======================================================================
# HTTP
# ======================================================================
class Weiterleitungen(urllib.request.HTTPRedirectHandler):
    """Merkt sich die Weiterleitungskette (301/308 = dauerhaft)."""
    def __init__(self):
        self.kette = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.kette.append((code, newurl))
        return super().redirect_request(req, fp, code, msg, headers, newurl)


_host_sperren = {}
_host_lock = threading.Lock()


def _host_sperre(url: str) -> threading.Lock:
    host = urllib.parse.urlsplit(url).netloc
    with _host_lock:
        return _host_sperren.setdefault(host, threading.Lock())


def url_sicher(url: str) -> str:
    """Umlaute und Leerzeichen in Adressen prozentkodieren (urllib verlangt ASCII)."""
    return urllib.parse.quote(url.replace("\ufffd", ""), safe=":/?#[]@!$&'()*+,;=%~")


def abrufen(url: str, max_bytes: int = MAX_HTML) -> dict:
    """GET mit Weiterleitungskette; nie Exceptions, immer ein Ergebnis-dict."""
    url = url_sicher(url)
    kette = Weiterleitungen()
    opener = urllib.request.build_opener(kette)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*",
                                               "Accept-Language": "de-DE,de;q=0.9"})
    ergebnis = {"url": url, "status": None, "final": url, "kette": [], "typ": "", "daten": b"",
                "fehler": ""}
    with _host_sperre(url):            # ein Abruf je Host gleichzeitig — höflich bleiben
        for versuch in range(2):
            try:
                with opener.open(req, timeout=ZEITLIMIT) as r:
                    ergebnis["status"] = r.status
                    ergebnis["final"] = r.geturl()
                    ergebnis["typ"] = r.headers.get("Content-Type", "")
                    ergebnis["daten"] = r.read(max_bytes)
                ergebnis["fehler"] = ""
                break
            except urllib.error.HTTPError as e:
                ergebnis["status"] = e.code
                ergebnis["final"] = e.geturl() or url
                ergebnis["fehler"] = f"HTTP {e.code}"
                if e.code not in (429, 500, 502, 503, 504):
                    break
            except (urllib.error.URLError, http.client.HTTPException, ssl.SSLError,
                    TimeoutError, ConnectionError, OSError) as e:
                grund = getattr(e, "reason", e)
                ergebnis["fehler"] = f"{type(grund).__name__}: {grund}"[:160]
            except (ValueError, UnicodeError) as e:       # kaputte Adresse — nicht wiederholen
                ergebnis["fehler"] = f"{type(e).__name__}: {e}"[:160]
                break
            time.sleep(1.5)
        time.sleep(0.25)
    ergebnis["kette"] = kette.kette
    return ergebnis


def normiere(url: str) -> str:
    """Für den Vergleich „umgezogen?“: Schema, www., Schrägstrich am Ende egal."""
    t = urllib.parse.urlsplit(url)
    host = t.netloc.lower().removeprefix("www.")
    pfad = t.path.rstrip("/") or "/"
    return f"{host}{pfad}?{t.query}" if t.query else f"{host}{pfad}"


def text_aus_html(daten: bytes, typ: str) -> str:
    m = re.search(r"charset=([\w-]+)", typ or "", re.I)
    kodierung = m.group(1) if m else "utf-8"
    try:
        s = daten.decode(kodierung, errors="replace")
    except LookupError:
        s = daten.decode("utf-8", errors="replace")
    return s


def kennwort_normal(s: str) -> str:
    s = s.lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss"), ("&auml;", "ae"),
                 ("&ouml;", "oe"), ("&uuml;", "ue"), ("&szlig;", "ss")):
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", html.unescape(s))


# ======================================================================
# Prüfungen
# ======================================================================
def link_pruefen(url: str, erwartet=None) -> dict:
    """Ein Link → Befund (status, hinweis, neueUrl)."""
    r = abrufen(url)
    st, kette = r["status"], r["kette"]
    if st is None:
        if re.search(r"Name or service not known|getaddrinfo|nodename nor servname", r["fehler"]):
            return {"status": "defekt", "hinweis": "Adresse nicht auflösbar: " + r["fehler"]}
        return {"status": "nicht-pruefbar", "hinweis": "nicht erreichbar: " + r["fehler"]}
    if st in (404, 410):
        return {"status": "defekt", "hinweis": f"HTTP {st} — Seite gibt es nicht mehr"}
    if st in (401, 403, 429) or st >= 500:
        return {"status": "nicht-pruefbar", "hinweis": f"HTTP {st} — Server lässt keine automatische Prüfung zu"}
    if st >= 400:
        return {"status": "defekt", "hinweis": f"HTTP {st}"}
    befund = {"status": "aktuell", "hinweis": ""}
    dauerhaft = any(code in (301, 308) for code, _ in kette)
    if kette and normiere(r["final"]) != normiere(url):
        ziel = r["final"]
        startseite = urllib.parse.urlsplit(ziel).path in ("", "/")
        von_start = (urllib.parse.urlsplit(url).path in ("", "/") and
                     normiere(ziel).split("/")[0] == normiere(url).split("/")[0])
        if von_start:      # Startseite leitet auf ihre eigene Unterseite — normal
            befund = {"status": "weitergeleitet", "hinweis": "Startseite leitet weiter nach " + ziel}
        elif dauerhaft and not startseite:
            befund = {"status": "umgezogen", "hinweis": "dauerhaft weitergeleitet", "neueUrl": ziel}
        elif dauerhaft and startseite:
            befund = {"status": "defekt", "hinweis": "leitet auf die Startseite um — Seite vermutlich entfernt",
                      "neueUrl": ziel}
        else:
            befund = {"status": "weitergeleitet", "hinweis": "vorübergehend weitergeleitet nach " + ziel}
    if "html" in (r["typ"] or "").lower() or not r["typ"]:
        seite = text_aus_html(r["daten"], r["typ"])
        if FEHLERSEITE.search(seite[:20000]):
            return {"status": "defekt", "hinweis": "Fehlerseite trotz HTTP 200 (Seitentitel)"}
        if erwartet:
            woerter = [erwartet] if isinstance(erwartet, str) else list(erwartet)
            fehlt = [w for w in woerter if kennwort_normal(w) not in kennwort_normal(seite)]
            if fehlt:
                return {"status": "inhalt-fehlt", "hinweis": "Kennwort fehlt auf der Seite: " + ", ".join(fehlt),
                        **({"neueUrl": befund["neueUrl"]} if "neueUrl" in befund else {})}
    return befund


def pdf_text(daten: bytes):
    try:
        from pypdf import PdfReader
    except ImportError:
        return None
    import logging
    logging.getLogger("pypdf").setLevel(logging.ERROR)
    try:
        leser = PdfReader(io.BytesIO(daten))
        roh = "\n".join((s.extract_text() or "") for s in leser.pages)
    except Exception:  # noqa: BLE001 — kaputte PDFs sind ein Befund, kein Absturz
        return None
    roh = re.sub(r"-\n(?=[a-zäöü])", "", roh)          # Silbentrennung
    zeilen = [re.sub(r"\s+", " ", z).strip() for z in roh.splitlines()]
    # Seitenfüße und Kopfzeilen verschieben sich bei jeder Änderung — sie sagen
    # nichts über den Inhalt und würden jeden Vergleich aufblähen.
    return [z for z in zeilen if z and not SEITENFUSS.match(z)]


SEITENFUSS = re.compile(r"^(-\s*Seite \d+ von \d+\s*-|Seite \d+( von \d+)?|\d+\s*/\s*\d+|"
                        r"Ein Service des Bundesministeriums? der Justiz.*|sowie des Bundesamts? für Justiz.*|- \d+ -|"
                        r"www\.gesetze-im-internet\.de)$", re.I)


def pdf_moddatum(daten: bytes) -> str:
    try:
        from pypdf import PdfReader
        md = PdfReader(io.BytesIO(daten)).metadata or {}
        roh = str(md.get("/ModDate") or md.get("/CreationDate") or "")
        m = re.search(r"D:(\d{4})(\d{2})", roh)
        return f"{m.group(2)}/{m.group(1)}" if m else ""
    except Exception:  # noqa: BLE001
        return ""


def pdf_pruefen(quelle: dict) -> dict:
    """Online-Fassung eines lokalen PDFs laden und den Text vergleichen."""
    url = quelle.get("pdf") or quelle.get("url")
    lokal = ROOT / quelle["datei"]
    r = abrufen(url, MAX_PDF)
    if r["status"] is None or r["status"] >= 400:
        st = link_pruefen(url)        # Befund der Adresse selbst
        st["hinweis"] = "PDF-Adresse: " + st["hinweis"]
        return st
    if not r["daten"].startswith(b"%PDF"):
        return {"status": "inhalt-fehlt", "hinweis": "unter der PDF-Adresse liegt kein PDF mehr"}
    online, hier = pdf_text(r["daten"]), pdf_text(lokal.read_bytes())
    if online is None or hier is None:
        gleich = hashlib.sha256(r["daten"]).digest() == hashlib.sha256(lokal.read_bytes()).digest()
        return ({"status": "aktuell", "hinweis": "byte-gleich"} if gleich else
                {"status": "nicht-pruefbar", "hinweis": "Textvergleich nicht möglich (pypdf fehlt oder PDF ohne Text)"})
    if online == hier:
        return {"status": "aktuell", "hinweis": "Text unverändert"}
    diff = [z for z in difflib.unified_diff(hier, online, lineterm="", n=0)
            if z[:1] in "+-" and not z.startswith(("+++", "---"))]
    aehnlich = difflib.SequenceMatcher(None, "\n".join(hier)[:60000], "\n".join(online)[:60000]).ratio()
    return {"status": "neue-fassung",
            "hinweis": f"Text weicht ab ({len(diff)} geänderte Zeilen, {aehnlich:.0%} ähnlich)",
            "beispiele": diff[:8], "standOnline": pdf_moddatum(r["daten"]), "pdfUrl": r["final"]}


def gii_slug(url: str):
    m = re.match(r"https?://(?:www\.)?gesetze-im-internet\.de/([^/?#]+)/", url)
    return m.group(1) if m else None


def gii_stand(slug: str) -> dict:
    """Stand eines Gesetzes aus dem amtlichen XML (xml.zip) von gesetze-im-internet.de."""
    r = abrufen(f"https://www.gesetze-im-internet.de/{slug}/xml.zip", MAX_PDF)
    if r["status"] != 200 or not r["daten"].startswith(b"PK"):
        return {"fehler": r["fehler"] or f"HTTP {r['status']}"}
    import xml.etree.ElementTree as ET
    with zipfile.ZipFile(io.BytesIO(r["daten"])) as z:
        name = [n for n in z.namelist() if n.endswith(".xml")][0]
        wurzel = ET.fromstring(z.read(name))
    stand = "; ".join(s.findtext("standkommentar") or "" for s in wurzel.iter("standangabe")
                      if s.findtext("standkommentar"))
    datum = wurzel.findtext(".//ausfertigung-datum") or ""
    return {"stand": stand, "ausfertigung": datum}


def stand_jahr(stand: str):
    """„12/2006“, „19.11.2020“, „2018“, „Stand 08/2010“ → Jahr."""
    jahre = [int(j) for j in re.findall(r"(?<!\d)(19\d\d|20\d\d)(?!\d)", stand or "")]
    return max(jahre) if jahre else None


# ======================================================================
# Sammeln
# ======================================================================
def links_sammeln(daten: dict) -> list:
    """Alle Links aus Datenmodulen und Code: (url, wo, quelle-id|None, erwartet)."""
    funde = {}

    def merke(url, wo, qid=None, erwartet=None):
        url = url.strip()
        if not re.match(r"https?://[^\s…]+$", url) or "localhost" in url or "127.0.0.1" in url:
            return
        e = funde.setdefault(url, {"url": url, "wo": [], "quellen": [], "erwartet": None})
        if wo not in e["wo"]:
            e["wo"].append(wo)
        if qid and qid not in e["quellen"]:
            e["quellen"].append(qid)
        if erwartet:
            e["erwartet"] = erwartet

    for q in (daten.get("QUELLEN") or {}).get("eintraege", []):
        if q.get("url"):
            merke(q["url"], "quellen.js", q["id"], q.get("erwartet"))
    def durchlaufen(obj, wo):
        if isinstance(obj, dict):
            for k, v in obj.items():
                durchlaufen(v, wo)
        elif isinstance(obj, list):
            for v in obj:
                durchlaufen(v, wo)
        elif isinstance(obj, str):
            for url in re.findall(r"https?://[^\s\"'<>)\]]+", obj):
                merke(url.rstrip(".,;:"), wo)
    for modul, wo in (("BERUFE", "berufe.js"), ("WISSEN", "wissen.js"), ("NACHSCHLAG", "nachschlag.js"),
                      ("CHECKLISTEN", "checklisten.js"), ("VORLAGEN", "vorlagen.js"), ("GLOSSAR", "glossar.js"),
                      ("KONTAKT", "kontakt.js"), ("ABLAUFDATEN", "ablaufdaten.js")):
        durchlaufen(daten.get(modul), wo)
    for datei in ("app.js", "assistent.js", "module.js"):
        for url in re.findall(r"https?://[^\s\"'<>)\]]+", (JS / datei).read_text(encoding="utf-8")):
            url = url.rstrip(".,;:")
            if url.endswith("="):          # Such-Basis wie BERUFENET: mit Beispielbegriff prüfen
                url += "G%C3%A4rtner"
            merke(url, datei)
    return list(funde.values())


# ======================================================================
# Hauptlauf
# ======================================================================
def pruefen(daten: dict, nur: set, vorher: dict) -> dict:
    heute = dt.date.today()
    quellen = {q["id"]: q for q in (daten.get("QUELLEN") or {}).get("eintraege", [])}
    ergebnis = {"geprueft": heute.isoformat(), "quellen": {}, "links": [], "gesetze": {}, "ablauf": []}

    def befund_zu_quelle(qid, art, befund):
        e = ergebnis["quellen"].setdefault(qid, {"status": "aktuell", "befunde": []})
        e["befunde"].append({"art": art, **befund})
        if STUFE[befund["status"]] > STUFE[e["status"]]:
            e["status"] = befund["status"]

    # --- Links ---------------------------------------------------------------
    if "links" in nur:
        links = links_sammeln(daten)
        print(f"Links: {len(links)} Adressen …", file=sys.stderr)
        with cf.ThreadPoolExecutor(max_workers=12) as pool:
            zukunft = {pool.submit(link_pruefen, l["url"], l["erwartet"]): l for l in links}
            for f in cf.as_completed(zukunft):
                l = zukunft[f]
                befund = f.result()
                ergebnis["links"].append({**l, **befund})
                for qid in l["quellen"]:
                    befund_zu_quelle(qid, "link", befund)
        ergebnis["links"].sort(key=lambda x: (-STUFE[x["status"]], x["url"]))

    # --- PDFs mit Online-Fassung ---------------------------------------------
    if "pdf" in nur:
        kandidaten = [q for q in quellen.values() if q.get("datei") and q.get("pruefung") != "ohne-vergleich"
                      and (q.get("pdf") or re.search(r"\.pdf(\?|$)", q.get("url") or "", re.I))]
        print(f"PDF-Vergleich: {len(kandidaten)} Dokumente …", file=sys.stderr)
        with cf.ThreadPoolExecutor(max_workers=6) as pool:
            for q, befund in zip(kandidaten, pool.map(pdf_pruefen, kandidaten)):
                befund_zu_quelle(q["id"], "pdf", befund)

    # --- Gesetze ---------------------------------------------------------------
    if "gesetze" in nur:
        slugs = {}
        for q in quellen.values():
            s = gii_slug(q.get("url") or "")
            if s:
                slugs.setdefault(s, []).append(q["id"])
        vendored = {}
        for k, g in (daten.get("GESETZESTEXTE") or {}).items():
            s = gii_slug(g.get("portal") or "")
            if s:
                vendored[s] = (k, g)
                slugs.setdefault(s, [])
        print(f"Gesetze: {len(slugs)} Werke …", file=sys.stderr)
        alt = (vorher.get("gesetze") or {})
        with cf.ThreadPoolExecutor(max_workers=6) as pool:
            for s, st in zip(slugs, pool.map(gii_stand, list(slugs))):
                eintrag = {"stand": st.get("stand", ""), "quellen": slugs[s]}
                if "fehler" in st:
                    befund = {"status": "nicht-pruefbar", "hinweis": "XML nicht abrufbar: " + st["fehler"]}
                    eintrag["stand"] = (alt.get(s) or {}).get("stand", "")
                elif s in vendored:
                    k, g = vendored[s]
                    eintrag["volltext"] = k
                    if (g.get("stand") or "") != st["stand"]:
                        befund = {"status": "geaendert", "hinweis": f"Volltext {g.get('kurz')} veraltet — neu importieren",
                                  "standNeu": st["stand"], "standAlt": g.get("stand") or ""}
                    else:
                        befund = {"status": "aktuell", "hinweis": "Volltext entspricht dem amtlichen Stand"}
                elif s in alt and (alt[s].get("stand") or "") != st["stand"]:
                    befund = {"status": "geaendert", "hinweis": "seit der letzten Prüfung geändert",
                              "standNeu": st["stand"], "standAlt": alt[s].get("stand") or ""}
                else:
                    befund = {"status": "aktuell", "hinweis": "Stand unverändert" if s in alt else "Stand erfasst"}
                eintrag.update(befund)
                ergebnis["gesetze"][s] = eintrag
                for qid in slugs[s]:
                    befund_zu_quelle(qid, "gesetz", befund)

    # --- Interne Vordrucke ohne Online-Fassung ----------------------------------
    if "intern" in nur:
        for q in quellen.values():
            if not q.get("datei"):
                continue
            online_vergleich = q.get("pdf") or re.search(r"\.pdf(\?|$)", q.get("url") or "", re.I)
            if online_vergleich and q.get("pruefung") != "ohne-vergleich":
                continue
            # Von der Redaktion bestätigt („noch gültig“, Feld `bestaetigt: "JJJJ-MM"`)?
            # Dann erst nach zwölf Monaten wieder erinnern.
            if q.get("bestaetigt"):
                try:
                    j, mo = (int(x) for x in q["bestaetigt"].split("-")[:2])
                    if (heute.year - j) * 12 + heute.month - mo < 12:
                        continue
                except ValueError:
                    pass
            jahr = stand_jahr(q.get("stand"))
            if jahr and heute.year - jahr >= INTERN_ALT_JAHRE:
                befund_zu_quelle(q["id"], "intern", {
                    "status": "alt", "hinweis": f"Stand {q.get('stand')} — keine Online-Fassung zum Vergleich; "
                    f"beim Herausgeber ({q.get('herausgeber') or 'unbekannt'}) nach einer neueren Fassung fragen",
                    "aufgabe": f"Gilt die Fassung noch, in quellen.js `bestaetigt: \"{heute:%Y-%m}\"` setzen."})

    # --- Ablaufdaten ------------------------------------------------------------
    if "ablauf" in nur:
        for w in (daten.get("ABLAUFDATEN") or {}).get("werte", []):
            try:
                bis = dt.date.fromisoformat(w["gueltigBis"])
            except (KeyError, ValueError):
                continue
            tage = (bis - heute).days
            if tage < 0:
                status, hinweis = "abgelaufen", f"seit {-tage} Tagen abgelaufen ({bis:%d.%m.%Y})"
            elif tage <= ABLAUF_VORLAUF_TAGE:
                status, hinweis = "laeuft-ab", f"läuft in {tage} Tagen ab ({bis:%d.%m.%Y})"
            else:
                status, hinweis = "aktuell", f"gültig bis {bis:%d.%m.%Y}"
            ergebnis["ablauf"].append({"id": w["id"], "was": w.get("was", w["id"]), "status": status,
                                       "hinweis": hinweis, "gueltigBis": w["gueltigBis"],
                                       "aufgabe": w.get("aufgabe", ""), "wo": w.get("wo", [])})
        ergebnis["ablauf"].sort(key=lambda x: (-STUFE[x["status"]], x["gueltigBis"]))
    return ergebnis


def zaehlen(ergebnis: dict) -> dict:
    z = {}
    for e in ergebnis["quellen"].values():
        z[e["status"]] = z.get(e["status"], 0) + 1
    links_ohne_quelle = [l for l in ergebnis["links"] if not l["quellen"]]
    for l in links_ohne_quelle:
        z[l["status"]] = z.get(l["status"], 0) + 1
    for a in ergebnis["ablauf"]:
        z[a["status"]] = z.get(a["status"], 0) + 1
    return z


# ======================================================================
# Ausgabe
# ======================================================================
def bericht_markdown(ergebnis: dict, daten: dict) -> str:
    quellen = {q["id"]: q for q in (daten.get("QUELLEN") or {}).get("eintraege", [])}
    z = zaehlen(ergebnis)
    handlung = sum(v for k, v in z.items() if k in HANDLUNG)
    beachten = sum(v for k, v in z.items() if k in BEACHTEN)
    ok = z.get("aktuell", 0) + z.get("weitergeleitet", 0)
    datum = dt.date.fromisoformat(ergebnis["geprueft"]).strftime("%d.%m.%Y")
    zeilen = [f"## Aktualitätsprüfung vom {datum}", "",
              f"**{handlung} mit Handlungsbedarf · {beachten} zu beachten · {ok} aktuell** "
              f"({len(ergebnis['quellen'])} Quellen, {len(ergebnis['links'])} Links, "
              f"{len(ergebnis['gesetze'])} Gesetze, {len(ergebnis['ablauf'])} Werte mit Ablaufdatum)", ""]

    def titel(qid):
        q = quellen.get(qid) or {}
        return f"**{q.get('titel', qid)}** (`{qid}`)"

    def abschnitt(ueberschrift, stati):
        punkte = []
        for qid, e in sorted(ergebnis["quellen"].items(), key=lambda x: (-STUFE[x[1]["status"]], x[0])):
            if e["status"] not in stati:
                continue
            for b in e["befunde"]:
                if b["status"] not in stati:
                    continue
                zeile = f"- [ ] {titel(qid)} — {NAME[b['status']]}: {b.get('hinweis', '')}"
                if b.get("neueUrl"):
                    zeile += f" → {b['neueUrl']}"
                if b.get("aufgabe"):
                    zeile += f" — {b['aufgabe']}"
                punkte.append(zeile)
                for bsp in (b.get("beispiele") or [])[:4]:
                    punkte.append(f"  - `{bsp[:140]}`")
        for l in ergebnis["links"]:
            if l["status"] in stati and not l["quellen"]:
                punkte.append(f"- [ ] Link in {', '.join(l['wo'])}: {l['url']} — {NAME[l['status']]}: "
                              f"{l.get('hinweis', '')}" + (f" → {l['neueUrl']}" if l.get("neueUrl") else ""))
        for a in ergebnis["ablauf"]:
            if a["status"] in stati:
                punkte.append(f"- [ ] **{a['was']}** — {NAME[a['status']]}: {a['hinweis']}"
                              + (f". {a['aufgabe']}" if a.get("aufgabe") else ""))
        if punkte:
            zeilen.extend([f"### {ueberschrift}", ""] + punkte + [""])

    abschnitt("Handlungsbedarf", HANDLUNG)
    abschnitt("Zu beachten", BEACHTEN)
    if not handlung and not beachten:
        zeilen.append("Alles aktuell — nichts zu tun. 🌱")
    zeilen += ["", "<sub>Erzeugt von `tools/aktualitaet_pruefen.py`. Maschinell übernehmbare Änderungen "
               "(Gesetzes-Volltexte, neue PDF-Fassungen, umgezogene Links) schlägt der Lauf als "
               "Aktualisierungs-PR vor.</sub>"]
    return "\n".join(zeilen)


def pruefstand_schreiben(ergebnis: dict):
    """Kompakte Fassung für das Werkzeug (Download-Center, #/pruefstand)."""
    knapp = {"geprueft": ergebnis["geprueft"], "zaehlung": zaehlen(ergebnis), "quellen": {}, "links": [],
             "gesetze": {s: {"stand": g.get("stand", ""), "status": g["status"], "hinweis": g.get("hinweis", ""),
                             "quellen": g.get("quellen", [])}
                         for s, g in ergebnis["gesetze"].items()},
             "ablauf": ergebnis["ablauf"]}
    for qid, e in ergebnis["quellen"].items():
        schwer = max(e["befunde"], key=lambda b: STUFE[b["status"]])
        knapp["quellen"][qid] = {"status": e["status"]}
        if schwer.get("hinweis") and e["status"] != "aktuell":
            knapp["quellen"][qid]["hinweis"] = schwer["hinweis"]
        if schwer.get("neueUrl"):
            knapp["quellen"][qid]["neueUrl"] = schwer["neueUrl"]
    knapp["links"] = [{"url": l["url"], "wo": l["wo"], "status": l["status"], "hinweis": l.get("hinweis", "")}
                      for l in ergebnis["links"] if not l["quellen"] and l["status"] != "aktuell"]
    PRUEFSTAND.write_text(
        "// pruefstand.js — ERZEUGT von tools/aktualitaet_pruefen.py (Aktualitätsprüfung).\n"
        "// Nicht von Hand bearbeiten. Das Werkzeug liest nur diese Datei — es prüft\n"
        "// selbst nichts im Netz (Zero-Trust). Neu erzeugen: siehe README „Aktualität“.\n"
        "window.PRUEFSTAND = " + json.dumps(knapp, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print(f"OK -> {PRUEFSTAND.relative_to(ROOT)}", file=sys.stderr)


# ======================================================================
# Aktualisieren (maschinell übernehmbare Änderungen)
# ======================================================================
def aktualisieren(ergebnis: dict, daten: dict) -> list:
    """Übernimmt Gesetzes-Volltexte, neue PDF-Fassungen und umgezogene Links.
    Gibt eine Liste lesbarer Änderungen zurück (für den PR-Text)."""
    aenderungen = []
    quellen = {q["id"]: q for q in (daten.get("QUELLEN") or {}).get("eintraege", [])}
    qpfad = JS / "quellen.js"
    qtext = qpfad.read_text(encoding="utf-8")

    # 1. Gesetze: Volltext neu importieren, wenn ein hinterlegtes Gesetz geändert ist
    geaendert = [g for g in ergebnis["gesetze"].values() if g.get("volltext") and g["status"] == "geaendert"]
    if geaendert:
        subprocess.run([sys.executable, str(ROOT / "tools" / "gesetz_import.py")], check=True)
        for g in geaendert:
            aenderungen.append(f"Gesetz `{g['volltext']}` neu importiert — neuer Stand: {g.get('standNeu', '')[:160]}")

    # 2. Neue PDF-Fassungen übernehmen (Dateikopf bereinigen, Stand nachziehen)
    meta = None
    for qid, e in ergebnis["quellen"].items():
        for b in e["befunde"]:
            if b["art"] != "pdf" or b["status"] != "neue-fassung":
                continue
            q = quellen[qid]
            r = abrufen(b.get("pdfUrl") or q.get("pdf") or q["url"], MAX_PDF)
            if r["status"] != 200 or not r["daten"].startswith(b"%PDF"):
                continue
            ziel = ROOT / q["datei"]
            ziel.write_bytes(r["daten"])
            if meta is None:
                spec = importlib.util.spec_from_file_location("pdf_metadaten", ROOT / "tools" / "pdf_metadaten.py")
                meta = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(meta)
            if meta.befunde(str(ziel)):
                meta.bereinigen(str(ziel))
            if b.get("standOnline"):
                qtext = quelle_feld_setzen(qtext, qid, "stand", b["standOnline"])
            aenderungen.append(f"Neue Fassung übernommen: `{q['datei']}` ({b['hinweis']}"
                               + (f", Stand {b['standOnline']}" if b.get("standOnline") else "") + ")")

    # 3. Umgezogene Links eintragen (nur dauerhafte Weiterleitungen, nie auf Startseiten)
    for qid, e in ergebnis["quellen"].items():
        for b in e["befunde"]:
            if b["art"] == "link" and b["status"] == "umgezogen" and b.get("neueUrl"):
                alt = quellen[qid].get("url")
                qtext = quelle_feld_setzen(qtext, qid, "url", b["neueUrl"])
                aenderungen.append(f"Link `{qid}` umgezogen: {alt} → {b['neueUrl']}")

    if qtext != qpfad.read_text(encoding="utf-8"):
        qpfad.write_text(qtext, encoding="utf-8")
    return aenderungen


# ======================================================================
# Direkte PDF-Adressen finden (einmalig, Redaktionshilfe)
# ======================================================================
def pdf_suchen(daten: dict):
    """Für lokale PDFs, deren `url` auf eine Seite zeigt: PDF-Links der Seite laden
    und per Textähnlichkeit die Online-Fassung finden. Gibt Vorschläge aus."""
    quellen = [q for q in (daten.get("QUELLEN") or {}).get("eintraege", [])
               if q.get("datei") and q.get("url") and not q.get("pdf")
               and not re.search(r"\.pdf(\?|$)", q["url"], re.I)]
    seiten = {}
    for q in quellen:
        seiten.setdefault(q["url"], []).append(q)
    vorschlaege = {}
    for url, qs in seiten.items():
        r = abrufen(url)
        if r["status"] != 200:
            continue
        seite = text_aus_html(r["daten"], r["typ"])
        pdfs = sorted({urllib.parse.urljoin(r["final"], html.unescape(h))
                       for h in re.findall(r'href="([^"]+\.pdf[^"]*)"', seite, re.I)})
        if not pdfs:
            continue
        texte = {}
        for p in pdfs[:25]:
            pr = abrufen(p, MAX_PDF)
            if pr["status"] == 200 and pr["daten"].startswith(b"%PDF"):
                texte[p] = "\n".join(pdf_text(pr["daten"]) or [])
        for q in qs:
            hier = "\n".join(pdf_text((ROOT / q["datei"]).read_bytes()) or [])
            if not hier:
                continue
            bester = max(texte.items(), key=lambda kv: difflib.SequenceMatcher(None, hier[:20000], kv[1][:20000]).ratio(),
                         default=None)
            if bester:
                quote = difflib.SequenceMatcher(None, hier[:20000], bester[1][:20000]).ratio()
                if quote >= 0.6:
                    vorschlaege[q["id"]] = (bester[0], quote)
                    print(f"{q['id']}: {quote:.0%} → {bester[0]}")
    return vorschlaege


# ======================================================================
# Selbsttest (offline, lokaler Testserver)
# ======================================================================
def selbsttest() -> int:
    import http.server
    import socketserver
    pdf_a = (ROOT / "formulare" / "praktikantenvertrag.pdf").read_bytes()
    pdf_b = (ROOT / "formulare" / "urlaubstabelle-galabau.pdf").read_bytes()
    seiten = {
        "/ok": (200, "text/html; charset=utf-8", "<title>Berufsausbildungsvertrag</title>Hier der Vordruck".encode()),
        "/neu": (200, "text/html", b"<title>Neue Seite</title>Berufsausbildungsvertrag"),
        "/leer": (200, "text/html", b"<title>Seite nicht gefunden</title>"),
        "/ohne": (200, "text/html", b"<title>Portal</title>Willkommen"),
        "/gleich.pdf": (200, "application/pdf", pdf_a),
        "/anders.pdf": (200, "application/pdf", pdf_b),
    }

    class H(http.server.BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def do_GET(self):
            if self.path == "/alt":
                self.send_response(301); self.send_header("Location", "/neu"); self.end_headers(); return
            if self.path == "/zur-start":
                self.send_response(301); self.send_header("Location", "/"); self.end_headers(); return
            if self.path == "/kurz":
                self.send_response(302); self.send_header("Location", "/neu"); self.end_headers(); return
            if self.path == "/gesperrt":
                self.send_response(403); self.end_headers(); return
            st, typ, daten = seiten.get(self.path, (404, "text/html", b"<title>404</title>"))
            if self.path == "/":
                st, typ, daten = 200, "text/html", b"<title>Start</title>"
            self.send_response(st); self.send_header("Content-Type", typ)
            self.send_header("Content-Length", str(len(daten))); self.end_headers(); self.wfile.write(daten)

    server = socketserver.ThreadingTCPServer(("127.0.0.1", 0), H)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    b = f"http://127.0.0.1:{server.server_address[1]}"
    faelle = [
        ("erreichbar + Kennwort", link_pruefen(b + "/ok", "Berufsausbildungsvertrag"), "aktuell"),
        ("dauerhaft umgezogen", link_pruefen(b + "/alt"), "umgezogen"),
        ("Umzug auf Startseite = entfernt", link_pruefen(b + "/zur-start"), "defekt"),
        ("vorübergehende Weiterleitung", link_pruefen(b + "/kurz"), "weitergeleitet"),
        ("404", link_pruefen(b + "/gibtsnicht"), "defekt"),
        ("Fehlerseite trotz 200", link_pruefen(b + "/leer"), "defekt"),
        ("Kennwort fehlt", link_pruefen(b + "/ohne", "Berufsausbildungsvertrag"), "inhalt-fehlt"),
        ("403 = nicht prüfbar", link_pruefen(b + "/gesperrt"), "nicht-pruefbar"),
        ("PDF unverändert", pdf_pruefen({"datei": "formulare/praktikantenvertrag.pdf", "pdf": b + "/gleich.pdf"}), "aktuell"),
        ("PDF neue Fassung", pdf_pruefen({"datei": "formulare/praktikantenvertrag.pdf", "pdf": b + "/anders.pdf"}), "neue-fassung"),
    ]
    neu = faelle[1][1].get("neueUrl", "")
    ok = 0
    for name, befund, soll in faelle:
        gut = befund["status"] == soll
        ok += gut
        print(f"  {'✓' if gut else '✗'} {name}: {befund['status']}" + ("" if gut else f" (erwartet {soll}) — {befund}"))
    gut = neu.endswith("/neu")
    ok += gut
    print(f"  {'✓' if gut else '✗'} neue Adresse erkannt: {neu}")
    # Quellen-Datei bearbeiten ohne Struktur zu zerstören
    probe = '  { id: "x", titel: "T",\n    typ: "link", stand: "1/2000",\n    datei: null, url: "https://a.de/",\n    beschreibung: "B" },\n  { id: "y", url: "https://b.de/" }\n  ]\n'
    t1 = quelle_feld_setzen(probe, "x", "url", "https://neu.de/")
    t2 = quelle_feld_setzen(t1, "x", "stand", "10/2026")
    t3 = quelle_feld_setzen(t2, "x", "pdf", "https://neu.de/a.pdf")
    gut = ('url: "https://neu.de/"' in t3 and 'stand: "10/2026"' in t3 and 'pdf: "https://neu.de/a.pdf"' in t3
           and 'url: "https://b.de/"' in t3)
    ok += gut
    print(f"  {'✓' if gut else '✗'} quellen.js gezielt bearbeitet (url, stand, neues Feld pdf)")
    server.shutdown()
    gesamt = len(faelle) + 2
    print(f"\n  {ok}/{gesamt} bestanden")
    return 0 if ok == gesamt else 1


# ======================================================================
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--nur", default="links,pdf,gesetze,intern,ablauf")
    ap.add_argument("--bericht", help="Markdown-Bericht in diese Datei schreiben")
    ap.add_argument("--json", help="vollständiges Ergebnis als JSON schreiben")
    ap.add_argument("--pruefstand", action="store_true", help="assets/js/pruefstand.js schreiben")
    ap.add_argument("--aktualisieren", action="store_true", help="maschinell übernehmbare Änderungen einspielen")
    ap.add_argument("--aenderungen", help="Liste der Aktualisierungen als Markdown hierhin schreiben")
    ap.add_argument("--aus-json", help="Ergebnis eines früheren Laufs laden statt neu zu prüfen")
    ap.add_argument("--pdf-suchen", action="store_true")
    ap.add_argument("--selbsttest", action="store_true")
    arg = ap.parse_args()

    if arg.selbsttest:
        return selbsttest()
    daten = lade_module()
    if arg.pdf_suchen:
        pdf_suchen(daten)
        return 0
    vorher = daten.get("PRUEFSTAND") or {}
    if arg.aus_json:
        ergebnis = json.loads(Path(arg.aus_json).read_text(encoding="utf-8"))
    else:
        ergebnis = pruefen(daten, set(arg.nur.split(",")), vorher)
    md = bericht_markdown(ergebnis, daten)
    z = zaehlen(ergebnis)
    if os.environ.get("GITHUB_OUTPUT"):        # Kennzahlen für den Workflow
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as f:
            f.write(f"handlung={sum(v for k, v in z.items() if k in HANDLUNG)}\n")
            f.write(f"beachten={sum(v for k, v in z.items() if k in BEACHTEN)}\n")
    if arg.bericht:
        Path(arg.bericht).write_text(md + "\n", encoding="utf-8")
    else:
        print(md)
    if arg.json:
        Path(arg.json).write_text(json.dumps(ergebnis, ensure_ascii=False, indent=1), encoding="utf-8")
    if arg.pruefstand:
        pruefstand_schreiben(ergebnis)
    if arg.aktualisieren:
        aenderungen = aktualisieren(ergebnis, daten)
        text = "\n".join(f"- {a}" for a in aenderungen)
        if arg.aenderungen:
            Path(arg.aenderungen).write_text(text + ("\n" if text else ""), encoding="utf-8")
        print(f"{len(aenderungen)} Aktualisierung(en) eingespielt", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
