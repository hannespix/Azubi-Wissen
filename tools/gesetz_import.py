#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gesetz_import.py — überführt das amtliche gii-XML eines Gesetzes von
gesetze-im-internet.de in das Datenmodul assets/js/gesetzestexte.js
(window.GESETZESTEXTE). Amtliche Werke sind nach § 5 UrhG gemeinfrei.

Aufruf (Build-Zeit, Netz erlaubt):
    python3 tools/gesetz_import.py            # lädt BBiG-XML und schreibt das Modul
    python3 tools/gesetz_import.py datei.xml  # nutzt eine bereits geladene XML

Nur Python-Standardbibliothek. Nach Gesetzesänderungen einfach erneut
ausführen (das Modul wird deterministisch überschrieben).
"""
import io
import json
import re
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ZIEL = ROOT / "assets" / "js" / "gesetzestexte.js"
WERKE = [
    {"schluessel": "bbig", "kurz": "BBiG", "xmlzip": "https://www.gesetze-im-internet.de/bbig_2005/xml.zip",
     "portal": "https://www.gesetze-im-internet.de/bbig_2005/"},
]


def text_von(el, einzug=""):
    """P-Inhalt rekursiv zu Klartext: BR → Umbruch, DL/DT/DD → nummerierte
    Zeilen (verschachtelt eingerückt), Auszeichnungs-Tags nur Text."""
    teile = []
    if el.text:
        teile.append(el.text)
    for kind in el:
        tag = kind.tag.upper()
        if tag == "BR":
            teile.append("\n" + einzug)
        elif tag == "DL":
            teile.append(dl_von(kind, einzug))
        elif tag in ("B", "I", "U", "F", "SP", "NB", "SUP", "SUB", "LA", "P", "SMALL"):
            teile.append(text_von(kind, einzug))
        # sonstige (IMG, FnR …) überspringen
        if kind.tail:
            teile.append(kind.tail)
    return "".join(teile)


def dl_von(dl, einzug):
    """Definitionsliste (Nummerierungen) als eingerückte Zeilen."""
    zeilen = []
    label = ""
    for kind in dl:
        tag = kind.tag.upper()
        if tag == "DT":
            label = (kind.text or "").strip()
        elif tag == "DD":
            inhalt = text_von(kind, einzug + "   ").strip()
            zeilen.append(einzug + "  " + (label + " " if label else "") + inhalt)
            label = ""
    return "\n" + "\n".join(zeilen) + "\n" + einzug


def glatt(s):
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" ?\n ?", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def parse_werk(xml_bytes, meta):
    wurzel = ET.fromstring(xml_bytes)
    stand_zeilen = []
    for st in wurzel.iter("standangabe"):
        k = st.findtext("standkommentar") or ""
        if k:
            stand_zeilen.append(k)
    # Gliederungs-Stack: die Kennzahl kodiert die Ebene (3 Ziffern je Stufe),
    # daraus entsteht der volle Pfad „Teil 2 — … › Abschnitt 1 — …".
    stack = []
    paragrafen = []
    for norm in wurzel.iter("norm"):
        md = norm.find("metadaten")
        if md is None:
            continue
        g = md.find("gliederungseinheit")
        if g is not None:
            bez = (g.findtext("gliederungsbez") or "").strip()
            tit = (g.findtext("gliederungstitel") or "").strip()
            kenn = (g.findtext("gliederungskennzahl") or "").strip()
            ebene = max(1, len(kenn) // 3)
            eintrag = (bez + (" — " + tit if tit else "")).strip()
            del stack[ebene - 1:]
            stack.append(eintrag)
            continue
        gliederung = " › ".join(stack)
        enbez = (md.findtext("enbez") or "").strip()
        m = re.match(r"^§ (\d+[a-z]?)$", enbez)
        if not m:
            continue  # Inhaltsübersicht, Fußnoten, Anlagen
        titel = (md.findtext("titel") or "").strip()
        absaetze = []
        td = norm.find("textdaten/text/Content")
        if td is not None:
            for p in td.findall("P"):
                t = glatt(text_von(p))
                if t:
                    absaetze.append(t)
        paragrafen.append({
            "nr": m.group(1),
            "titel": titel,
            "teil": gliederung,
            "absaetze": absaetze or ["(weggefallen)"],
        })
    langname = wurzel.findtext(".//langue") or meta["kurz"]
    return {
        "kurz": meta["kurz"],
        "titel": langname.strip(),
        "stand": "; ".join(stand_zeilen),
        "portal": meta["portal"],
        "paragrafen": paragrafen,
    }


def lade_xml(meta):
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).read_bytes()
    with urllib.request.urlopen(meta["xmlzip"], timeout=60) as antwort:
        rohzip = antwort.read()
    with zipfile.ZipFile(io.BytesIO(rohzip)) as z:
        name = [n for n in z.namelist() if n.endswith(".xml")][0]
        return z.read(name)


def main():
    werke = {}
    for meta in WERKE:
        werk = parse_werk(lade_xml(meta), meta)
        werke[meta["schluessel"]] = werk
        print(f"{meta['kurz']}: {len(werk['paragrafen'])} Paragrafen, Stand: {werk['stand'][:80]}")
    js = (
        "// gesetzestexte.js — amtliche Gesetzes-Volltexte (gemeinfrei nach § 5 UrhG),\n"
        "// GENERIERT von tools/gesetz_import.py aus dem gii-XML von\n"
        "// gesetze-im-internet.de. NICHT von Hand bearbeiten — nach\n"
        "// Gesetzesänderungen den Import erneut ausführen.\n"
        "window.GESETZESTEXTE = " + json.dumps(werke, ensure_ascii=False, indent=1) + ";\n"
    )
    ZIEL.write_text(js, encoding="utf-8")
    kb = ZIEL.stat().st_size / 1024
    print(f"OK -> {ZIEL} ({kb:.0f} KB)")


if __name__ == "__main__":
    main()
