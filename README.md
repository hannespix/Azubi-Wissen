# Azubi-Wissen — Wissensdatenbank der Ausbildungsberatung (RP Freiburg)

Offline-Wissensdatenbank zu **Rechten & Pflichten in der Berufsausbildung**
mit Schwerpunkt grüne Berufe/Gartenbau — inklusive intelligenter Suche,
lokalem KI-Assistenten, PDF-Export je Zielgruppe, Aktenvermerk-Generator
und lokaler Datenbank. Gebaut im Landes-CD Baden-Württemberg auf Basis der
RPF-Browsertool-Vorlage. **Läuft vollständig offline — keine externen
Requests, keine Cloud, keine Telemetrie.**

## Nutzung

**Online (GitHub Pages, nach jedem Merge automatisch aktualisiert):**
Browsertool unter `https://hannespix.github.io/Azubi-Wissen/` — die
Navigator-Vorschau unter `…/navigator/`.


**Variante 1 — Einzeldatei (empfohlen für Zero-Trust-Arbeitsplätze):**
[`azubi-wissen-offline.html`](azubi-wissen-offline.html) herunterladen und
per **Doppelklick** öffnen. Eine Datei (≈1 MB), alles enthalten; Notizen und
Vermerke bleiben lokal im Browser gespeichert (IndexedDB).

**Variante 2 — Repo-Ordner über lokalen Server** (für Entwicklung):
```
python3 -m http.server 8000     # dann http://localhost:8000/
```

## Funktionen

| Bereich | Was es kann |
|---|---|
| **Wissensdatenbank** | 38 Artikel in 9 Themenbereichen (Vertrag, Pflichten, Vergütung, Arbeitszeit/Urlaub, Berufsschule/Prüfungen, Konflikte/Kündigung, Beratung/Aufsicht, **Fachwerker-Ausbildung**), je 3 Detailstufen, Rechtsgrundlagen, Praxishinweise je Rolle, 83 FAQ, Quellenvermerke |
| **Suche (Strg+K oder /)** | global, multitoken, fuzzy (tippfehler- und diakritikatolerant), Synonyme (Gehalt→Vergütung, Fachwercker→Fachwerker …), Stoppwortfilter, Gruppierung, Tastaturnavigation, Treffer-Highlighting |
| **KI-Assistent (lokal)** | Antworten ausschließlich aus der Wissensbasis mit Quellenangaben (§§ + Artikel), Folgefragen, ehrlicher Fallback — keine Eingabe verlässt das Gerät, keine Rechtsberatung |
| **Export** | PDF-Handout je Zielgruppe (Beratung/Betrieb/Azubi), Themenauswahl, 3 Detailgrade, Optionen (Deckblatt, Inhaltsverzeichnis, §§, Praxistipps, FAQ) — Ausgabe über den Browser-Druckdialog |
| **Aktenvermerk** | Formulargestützter Vermerk mit Rechtsgrundlagen-Bausteinen, Autosave-Entwurf, Ablage in der lokalen Datenbank, formale Druckfassung |
| **Lokale Datenbank** | IndexedDB (Fallback localStorage): Vermerk-Entwürfe, abgelegte Vermerke, eigene Notizen je Artikel — auch in der Einzeldatei |

## Inhalte pflegen

Alle Fachinhalte liegen in **`assets/js/wissen.js`** (Pflegehinweise im
Dateikopf). Wichtigste Wartungspunkte:

- **Mindestausbildungsvergütung**: jährliche Bekanntmachung im Bundesanzeiger
  → Tabelle im Artikel `mindestverguetung` ergänzen, `stand` aktualisieren.
- **Fachwerker-Bereich**: Quelle ist die Handreichung „Fachwerkerausbildung
  im Gartenbau" (Netzwerkfassung 1.2, 31.07.2026) — bei neuer Fassung
  Artikel und Quellenvermerke nachziehen. Der personenbezogene Kontaktteil
  der Handreichung wird bewusst **nicht** im Repo geführt.
- Nach Inhaltsänderungen: `python3 tools/build_singlefile.py --release`
  ausführen und die neue `azubi-wissen-offline.html` mitcommitten.

## Prüfungen & Build

```
python3 tools/check_offline.py              # Offline-/CDN-Gate (läuft im CI)
python3 tools/build_singlefile.py           # dist/index.html (unversioniert)
python3 tools/build_singlefile.py --release # + azubi-wissen-offline.html
node --check assets/js/*.js                 # Syntax
```

## Struktur

```
index.html                     App-Shell (Router, Navigation)
bw-theme.css                   Design-System (Single Source of Truth)
azubi-wissen-offline.html      Einzeldatei-Auslieferung (generiert, versioniert)
assets/js/wissen.js            Wissensbasis (Inhalte — hier pflegen)
assets/js/app.js               Ansichten, Suche/Palette, Artikel, Notizen
assets/js/assistent.js         lokaler KI-Assistent (Retrieval + Synthese)
assets/js/export.js            PDF-Handout + Aktenvermerk-Generator
assets/js/lokaldb.js           lokale Datenbank (IndexedDB/localStorage)
assets/js/nav.js · search.js   Bausteine aus der Vorlage
assets/css/app.css             App-Komponenten (nur --bw-*-Tokens) + Druck (A4)
tools/                         Offline-Check, Single-File-Builder
```

## Rechtliches

Fachinformation der Ausbildungsberatung — **keine Rechtsberatung im
Einzelfall**. Schriften (BaWue Sans/Serif) und RPF-Logo sind lizenziert →
`assets/fonts/LIZENZ.md`, `assets/logo/LIZENZ.md`; **Repo privat halten**.
Keine personenbezogenen Echtdaten im Repo; Nutzerdaten (Notizen, Vermerke)
verbleiben ausschließlich lokal im Browser.

Prozess & Weiterentwicklung: `AGENTS.md`, `ROADMAP.md`. Design & Technik:
`CLAUDE.md`.
