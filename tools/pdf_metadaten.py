#!/usr/bin/env python3
"""pdf_metadaten.py — keine Personennamen im Dateikopf der PDFs.

Amtliche Vordrucke tragen im Dateikopf oft Namen oder Benutzerkürzel der
Person, die sie zuletzt bearbeitet hat (Info-Feld /Author, XMP dc:creator).
Sichtbar ist das nirgends — aber die Dateien liegen im Repo und werden mit
dem Werkzeug verteilt. Personenbezogene Daten gehören dort nicht hin
(CLAUDE.md §3.4, AGENTS.md).

  python3 tools/pdf_metadaten.py                    prüft formulare/ (Exit 1 bei Fund)
  python3 tools/pdf_metadaten.py DATEI …            prüft nur diese Dateien
  python3 tools/pdf_metadaten.py --bereinigen DATEI …
        entfernt Autor und XMP-Paket; Seiten, Text und Formularfelder
        bleiben unverändert (wird nach dem Schreiben nachgeprüft)
  python3 tools/pdf_metadaten.py --bereinigen DATEI --titel "…"
        setzt dabei einen lesbaren Titel (statt „Microsoft Word - Dokument1“)

Erlaubt sind Herausgeber-Angaben von Institutionen (ORGANISATIONEN). Braucht
pypdf (pip install pypdf).
"""
import argparse
import glob
import html
import logging
import os
import re
import sys

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:  # pragma: no cover
    sys.exit("pypdf fehlt — bitte installieren: pip install pypdf")

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# pypdf meldet bei der Textprüfung harmlose Schriftwarnungen — nur Fehler zeigen.
logging.getLogger("pypdf").setLevel(logging.ERROR)

# Institutionen statt Personen — dürfen als Autor stehen bleiben.
ORGANISATIONEN = {
    "IBYKUS", "BIBB", "'BIBB'", "Bundesagentur für Arbeit",
    "Gewerbliche schule radolfzell", "Windows Anwender",
}
# Diese Info-Felder sagen nichts über Personen und bleiben beim Bereinigen.
UNVERFAENGLICH = ("/Title", "/Subject", "/Keywords", "/Creator", "/Producer",
                  "/CreationDate", "/ModDate")


def _xmp_personen(leser):
    """Autorenangaben aus dem XMP-Paket (dc:creator, pdf:Author)."""
    wurzel = leser.trailer["/Root"]
    if "/Metadata" not in wurzel:
        return []
    roh = wurzel["/Metadata"].get_object().get_data().decode("utf-8", "replace")
    namen = []
    for block in re.findall(r"<dc:creator>(.*?)</dc:creator>", roh, re.S):
        namen += [n.strip() for n in re.findall(r"<rdf:li[^>]*>(.*?)</rdf:li>", block, re.S)]
    namen += [n.strip() for n in re.findall(r"<pdf:Author>(.*?)</pdf:Author>", roh, re.S)]
    namen += [n.strip() for n in re.findall(r'pdf:Author="([^"]*)"', roh)]
    return [html.unescape(n) for n in namen if n]


def befunde(pfad):
    """Liste der Autorenangaben, die nicht auf der Liste der Institutionen stehen."""
    leser = PdfReader(pfad)
    raus = []
    autor = str((leser.metadata or {}).get("/Author") or "").strip()
    if autor and autor not in ORGANISATIONEN:
        raus.append("/Author")
    if any(n not in ORGANISATIONEN for n in _xmp_personen(leser)):
        raus.append("XMP-Autor")
    return raus


def _fingerabdruck(leser):
    seiten = [re.sub(r"\s+", " ", s.extract_text() or "") for s in leser.pages]
    felder = sorted((leser.get_fields() or {}).keys())
    return len(leser.pages), seiten, felder


def bereinigen(pfad, titel=None):
    leser = PdfReader(pfad)
    vorher = _fingerabdruck(leser)
    alt = leser.metadata or {}
    schreiber = PdfWriter(clone_from=leser)
    if "/Metadata" in schreiber._root_object:
        del schreiber._root_object["/Metadata"]
    neu = {k: str(v) for k, v in alt.items() if k in UNVERFAENGLICH and v}
    if titel:
        neu["/Title"] = titel
    schreiber.metadata = neu
    schreiber.compress_identical_objects()
    tmp = pfad + ".tmp"
    with open(tmp, "wb") as f:
        schreiber.write(f)
    nachher = _fingerabdruck(PdfReader(tmp))
    if nachher != vorher:
        os.remove(tmp)
        raise SystemExit(f"{pfad}: Inhalt hätte sich verändert — nichts geschrieben.")
    os.replace(tmp, pfad)
    rest = befunde(pfad)
    if rest:
        raise SystemExit(f"{pfad}: weiterhin {', '.join(rest)} im Dateikopf.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dateien", nargs="*")
    ap.add_argument("--bereinigen", action="store_true")
    ap.add_argument("--titel")
    arg = ap.parse_args()

    if arg.bereinigen:
        if not arg.dateien:
            ap.error("--bereinigen braucht mindestens eine Datei")
        if arg.titel and len(arg.dateien) != 1:
            ap.error("--titel geht nur mit genau einer Datei")
        for d in arg.dateien:
            bereinigen(d, arg.titel)
            print(f"bereinigt: {os.path.relpath(d, WURZEL)}")
        return 0

    dateien = arg.dateien or sorted(glob.glob(os.path.join(WURZEL, "formulare", "**", "*.pdf"), recursive=True))
    funde = 0
    for d in dateien:
        b = befunde(d)
        if b:
            funde += 1
            print(f"PERSONENANGABE im Dateikopf ({', '.join(b)}): {os.path.relpath(d, WURZEL)}")
    if funde:
        print(f"\n{funde} Datei(en) betroffen. Bereinigen mit: python3 tools/pdf_metadaten.py --bereinigen DATEI")
        return 1
    print(f"PDF-METADATEN OK — {len(dateien)} Dateien ohne Personenangaben im Dateikopf.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
