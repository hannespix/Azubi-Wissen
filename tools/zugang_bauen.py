#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
zugang_bauen.py — Zugangsschutz der Online-Fassung (S48).

Verschlüsselt beim Pages-Deploy im zusammengestellten Seitenordner (_site):
  1. die Offline-Datei azubi-wissen-offline.html → kleine Hülle mit
     Anmeldefenster; das Werkzeug steckt verschlüsselt darin
  2. alle Skripte zwischen <!-- geschuetzt:anfang … --> und
     <!-- geschuetzt:ende --> in index.html → EIN Paket assets/daten/inhalt.azw;
     die Klartext-Dateien werden gelöscht, index.html bekommt die
     Zugangskonfiguration
  3. sw.js: Kern-Liste ohne die gelöschten Skripte, mit dem Paket
  4. den Suchindex assets/daten/semantik-index.json (an Ort und Stelle)
  5. alle Dateien unter formulare/ (an Ort und Stelle, Namen bleiben)
Unverschlüsselt bleiben nur Hülle, Theme, Schriften, Zeichen, Menü
(nav.js), Impressum (kontakt.js, rechtliches.js) und das Anmeldefenster
(zugang.js) — und das öffentliche Sprachmodell unter assets/vendor/.

Verfahren: AES-256-GCM; Schlüssel = PBKDF2-HMAC-SHA-256(Passwort, SALZ,
ITERATIONEN). Dateiaufbau: b"AWZ1" · 12 Byte IV · Geheimtext mit Prüfsumme.
assets/js/zugang.js entschlüsselt im Browser mit WebCrypto und merkt sich
den Schlüssel je Gerät.

Passwort: Umgebungsvariable ZUGANG_PASSWORT (im Pages-Workflow das
gleichnamige GitHub-Secret). Fehlt es, bricht das Werkzeug ab — die Seite
wird nie unverschlüsselt veröffentlicht. Passwort ändern = Secret ändern und
Pages neu laufen lassen; alle Geräte fragen dann einmal das neue Passwort ab.

Aufruf:  ZUGANG_PASSWORT=… python3 tools/zugang_bauen.py _site
         python3 tools/zugang_bauen.py --selbsttest
Abhängigkeit: cryptography (pip install cryptography).
"""
import base64
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_singlefile as einzeldatei  # noqa: E402  (Inline-Helfer der Einzeldatei)

from cryptography.hazmat.primitives.ciphers.aead import AESGCM  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
# Fester, öffentlicher Salt: Er macht vorberechnete Tabellen nutzlos und hält
# den abgeleiteten Schlüssel über alle Deploys gleich — sonst müsste sich
# jedes Gerät nach jeder Veröffentlichung neu anmelden.
SALZ = base64.b64decode("vq5+6tz4snnzUcDTfjrzGA==")
ITERATIONEN = 600_000            # OWASP-Empfehlung für PBKDF2-HMAC-SHA-256
MAGIE = b"AWZ1"
PROBE_TEXT = b"azubi-wissen"     # muss zu PROBE_TEXT in zugang.js passen
PAKET = "assets/daten/inhalt.azw"
INDEX = "assets/daten/semantik-index.json"
OFFLINE = "azubi-wissen-offline.html"
ZUGANG_TAG = '<script src="assets/js/zugang.js"></script>'
BLOCK = re.compile(r"<!-- geschuetzt:anfang.*?-->(.*?)<!-- geschuetzt:ende -->\n?", re.S)
SKRIPT = re.compile(r'<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*</script>')


def b64(daten: bytes) -> str:
    return base64.b64encode(daten).decode("ascii")


def schluessel(passwort: str) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", passwort.encode("utf-8"), SALZ, ITERATIONEN, 32)


def verschluesseln(key: bytes, daten: bytes) -> bytes:
    iv = os.urandom(12)
    return MAGIE + iv + AESGCM(key).encrypt(iv, daten, None)


def entschluesseln(key: bytes, daten: bytes) -> bytes:
    if daten[:4] != MAGIE:
        raise ValueError("kein verschlüsseltes Format")
    return AESGCM(key).decrypt(daten[4:16], daten[16:], None)


def konfig_tag(key: bytes, **extra) -> str:
    konfig = {"version": 1, "salz": b64(SALZ), "iterationen": ITERATIONEN,
              "probe": b64(verschluesseln(key, PROBE_TEXT)), **extra}
    return "<script>window.ZUGANG_KONFIG = " + json.dumps(konfig, ensure_ascii=False) + ";</script>\n"


def gesperrt(html: str) -> str:
    """Kopf ab dem ersten Bild ohne Menü — kein Aufblitzen vor zugang.js."""
    return html.replace('<html lang="de">', '<html lang="de" class="zugang-gesperrt">', 1)


def huelle_bauen(site: Path, key: bytes) -> bool:
    """Offline-Datei → Hülle mit Anmeldefenster (Modus „datei“)."""
    ziel = site / OFFLINE
    if not ziel.exists():
        return False
    nutzlast = verschluesseln(key, ziel.read_bytes())
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = BLOCK.sub("", html)
    html = re.sub(r"<script>\s*// PWA:.*?</script>\s*", "", html, flags=re.S)
    html = re.sub(r'\s*<link[^>]+rel=["\']manifest["\'][^>]*>', "", html)
    html = gesperrt(html)
    html = einzeldatei.inline_stylesheets(html, ROOT)
    html = einzeldatei.inline_html_assets(html, ROOT)
    html = html.replace(ZUGANG_TAG, konfig_tag(key, modus="datei", nutzlast=b64(nutzlast)) + ZUGANG_TAG, 1)
    html = einzeldatei.inline_scripts(html, ROOT)
    ziel.write_text(html, encoding="utf-8")
    return True


def seite_bauen(site: Path, key: bytes) -> list:
    """Geschützte Skripte → ein verschlüsseltes Paket; index.html anpassen."""
    index = site / "index.html"
    html = index.read_text(encoding="utf-8")
    m = BLOCK.search(html)
    if not m:
        raise SystemExit("index.html: Markierung <!-- geschuetzt:anfang --> … <!-- geschuetzt:ende --> fehlt.")
    dateien = SKRIPT.findall(m.group(1))
    if ZUGANG_TAG not in html or not dateien:
        raise SystemExit("index.html: zugang.js oder geschützte Skripte fehlen.")
    paket = [{"datei": d, "code": (site / d).read_text(encoding="utf-8")} for d in dateien]
    (site / PAKET).parent.mkdir(parents=True, exist_ok=True)
    (site / PAKET).write_bytes(verschluesseln(key, json.dumps(paket, ensure_ascii=False).encode("utf-8")))
    for d in dateien:
        (site / d).unlink()
    html = html[:m.start()] + html[m.end():]
    html = html.replace(ZUGANG_TAG, konfig_tag(key, modus="seite", inhalt=PAKET) + ZUGANG_TAG, 1)
    index.write_text(gesperrt(html), encoding="utf-8")
    return dateien


def sw_anpassen(site: Path, dateien: list) -> None:
    sw = site / "sw.js"
    text = sw.read_text(encoding="utf-8")
    for d in dateien:
        text = text.replace(f'  "./{d}",\n', "")
    zeile = '  "./assets/js/zugang.js",\n'
    if zeile not in text:
        raise SystemExit("sw.js: zugang.js fehlt in der Kern-Liste.")
    sw.write_text(text.replace(zeile, zeile + f'  "./{PAKET}",\n', 1), encoding="utf-8")


def kern_liste(site: Path) -> list:
    text = (site / "sw.js").read_text(encoding="utf-8")
    block = re.search(r"var KERN = \[(.*?)\];", text, re.S).group(1)
    return re.findall(r'"\./([^"]*)"', block)


def kern_pruefen(site: Path) -> None:
    """Fehlt eine Kern-Datei, scheitert die Installation des Service Workers."""
    fehlt = [p for p in kern_liste(site) if p and not (site / p).exists()]
    if fehlt:
        raise SystemExit("sw.js nennt fehlende Dateien: " + ", ".join(fehlt))


def an_ort_verschluesseln(key: bytes, pfad: Path) -> None:
    pfad.write_bytes(verschluesseln(key, pfad.read_bytes()))


def klartext_marker() -> list:
    """Betreffzeilen der E-Mail-Vorlagen — dürfen nirgends lesbar stehen."""
    text = (ROOT / "assets/js/vorlagen.js").read_text(encoding="utf-8")
    return sorted(set(re.findall(r'betreff: "([^"\[]{20,})', text)))


def klartext_pruefen(site: Path) -> None:
    marker = [m.encode("utf-8") for m in klartext_marker()] + [b"window.VORLAGEN", b"window.WISSEN"]
    for pfad in site.rglob("*"):
        rel = pfad.relative_to(site).as_posix()
        if not pfad.is_file() or rel.startswith(("navigator/", "assets/vendor/")):
            continue
        daten = pfad.read_bytes()
        for m in marker:
            if m in daten:
                raise SystemExit(f"Klartext gefunden in {rel}: {m.decode('utf-8')[:60]}")


def bauen(site: Path, passwort: str) -> dict:
    if not (site / "index.html").exists():
        raise SystemExit(f"{site}: index.html fehlt — erst die Seite zusammenstellen.")
    key = schluessel(passwort)
    huelle = huelle_bauen(site, key)
    dateien = seite_bauen(site, key)
    sw_anpassen(site, dateien)
    if (site / INDEX).exists():
        an_ort_verschluesseln(key, site / INDEX)
    formulare = [p for p in sorted((site / "formulare").rglob("*")) if p.is_file()] if (site / "formulare").exists() else []
    for p in formulare:
        an_ort_verschluesseln(key, p)
    kern_pruefen(site)
    klartext_pruefen(site)
    return {"skripte": len(dateien), "formulare": len(formulare), "huelle": huelle}


def selbsttest() -> int:
    ok = gesamt = 0

    def check(name, bedingung, extra=""):
        nonlocal ok, gesamt
        gesamt += 1
        ok += bool(bedingung)
        print(f"  {'✓' if bedingung else '✗'} {name}" + ("" if bedingung else f" — {extra}"))

    tmp = Path(tempfile.mkdtemp(prefix="zugang-"))
    try:
        site = tmp / "_site"
        site.mkdir()
        for n in ["index.html", "bw-theme.css", "site.webmanifest", "sw.js", OFFLINE]:
            shutil.copy(ROOT / n, site / n)
        shutil.copytree(ROOT / "assets", site / "assets", ignore=shutil.ignore_patterns("vendor"))
        shutil.copytree(ROOT / "formulare", site / "formulare")
        passwort = "selbsttest-passwort"
        ergebnis = bauen(site, passwort)
        key = schluessel(passwort)

        dateien = SKRIPT.findall(BLOCK.search((ROOT / "index.html").read_text(encoding="utf-8")).group(1))
        check(f"{len(dateien)} geschützte Skripte, alle aus dem Seitenordner entfernt",
              len(dateien) >= 15 and not any((site / d).exists() for d in dateien))
        paket = json.loads(entschluesseln(key, (site / PAKET).read_bytes()))
        check("Paket entschlüsselt sich vollständig und originalgetreu",
              [t["datei"] for t in paket] == dateien and
              all(t["code"] == (ROOT / t["datei"]).read_text(encoding="utf-8") for t in paket))
        html = (site / "index.html").read_text(encoding="utf-8")
        konfig = json.loads(re.search(r"window\.ZUGANG_KONFIG = (\{.*?\});", html).group(1))
        probe = base64.b64decode(konfig["probe"])
        check("Probe passt zum richtigen Passwort", entschluesseln(key, probe) == PROBE_TEXT)
        try:
            entschluesseln(schluessel("falsch"), probe)
            falsch_abgewiesen = False
        except Exception:
            falsch_abgewiesen = True
        check("Falsches Passwort wird abgewiesen", falsch_abgewiesen)
        check("index.html: gesperrt, Konfiguration vor zugang.js, keine geschützten Skript-Tags",
              'class="zugang-gesperrt"' in html and konfig["modus"] == "seite" and
              html.index("ZUGANG_KONFIG") < html.index(ZUGANG_TAG) and not any(f'src="{d}"' in html for d in dateien))
        pdfs = [p for p in (site / "formulare").rglob("*.pdf")]
        stichprobe = pdfs[0].relative_to(site)
        check(f"{len(pdfs)} PDFs verschlüsselt, Stichprobe entschlüsselt originalgetreu",
              pdfs and all(p.read_bytes()[:4] == MAGIE for p in pdfs) and
              entschluesseln(key, (site / stichprobe).read_bytes()) == (ROOT / stichprobe).read_bytes())
        check("Suchindex verschlüsselt und originalgetreu",
              entschluesseln(key, (site / INDEX).read_bytes()) == (ROOT / INDEX).read_bytes())
        huelle = (site / OFFLINE).read_text(encoding="utf-8")
        k2 = json.loads(re.search(r"window\.ZUGANG_KONFIG = (\{.*?\});", huelle).group(1))
        check("Offline-Datei: Hülle im Modus „datei“, Werkzeug originalgetreu darin",
              ergebnis["huelle"] and k2["modus"] == "datei" and
              entschluesseln(key, base64.b64decode(k2["nutzlast"])) == (ROOT / OFFLINE).read_bytes())
        check("Offline-Hülle läuft für sich (Theme, Skripte inline, kein Service Worker)",
              "<link" not in re.sub(r'<link rel="icon"[^>]*>|<link rel="apple-touch-icon"[^>]*>', "", huelle) and
              'src="assets/' not in huelle and "serviceWorker" not in huelle and "window.RECHTLICHES" in huelle)
        kern = kern_liste(site)
        check("Service Worker: Kern vollständig, mit Paket, ohne geschützte Skripte",
              PAKET in kern and not any(d in kern for d in dateien) and all((site / p).exists() for p in kern if p))
        # bauen() hat den Ordner bereits geprüft; hier nur, ob die Prüfung anschlägt.
        (site / "leck.txt").write_text(klartext_marker()[0], encoding="utf-8")
        try:
            klartext_pruefen(site)
            erkannt = False
        except SystemExit:
            erkannt = True
        check(f"Klartextprüfung ({len(klartext_marker())} Vorlagen-Betreffzeilen) erkennt ein Leck",
              len(klartext_marker()) >= 10 and erkannt)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"\n  {ok}/{gesamt} bestanden")
    return 0 if ok == gesamt else 1


def main():
    if "--selbsttest" in sys.argv:
        sys.exit(selbsttest())
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    passwort = os.environ.get("ZUGANG_PASSWORT", "")
    if not passwort:
        raise SystemExit(
            "ZUGANG_PASSWORT fehlt — die Seite wird nicht unverschlüsselt veröffentlicht.\n"
            "Einrichten: GitHub → Settings → Secrets and variables → Actions → "
            "„New repository secret“, Name ZUGANG_PASSWORT. Danach Pages erneut starten.")
    if len(passwort) < 10:
        raise SystemExit("ZUGANG_PASSWORT ist zu kurz — bitte mindestens 10 Zeichen (besser eine Passphrase).")
    ergebnis = bauen(Path(sys.argv[1]), passwort)
    print(f"OK  Zugangsschutz: {ergebnis['skripte']} Skripte als Paket, "
          f"{ergebnis['formulare']} Dateien unter formulare/, Suchindex"
          + (" und Offline-Datei" if ergebnis["huelle"] else "") + " verschlüsselt.")


if __name__ == "__main__":
    main()
