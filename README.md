# Ausbildung Grüne Berufe — Wissens- und Arbeitstool der Ausbildungsberatung (RP Freiburg)

Offline-Wissensdatenbank und Arbeitswerkzeug der Ausbildungsberatung für
**alle grünen Berufe** (Gärtner/in, Landwirt/in, Winzer/in, Fischwirt/in,
Tierwirt/in, Forstwirt/in u. v. m. — inkl. der § 66-Fachwerkerausbildung).
Intelligente Suche, lokaler KI-Assistent, sechs Rechner, Jahreskreis der
Beratung, automatisierte E-Mail-Vorlagen, PDF-Export und Aktenvermerk-
Generator — gebaut im Landes-CD Baden-Württemberg auf Basis der
RPF-Browsertool-Vorlage. **Läuft vollständig offline — keine externen
Requests, keine Cloud, keine Telemetrie.**

## Nutzung

**Online (GitHub Pages, nach jedem Merge automatisch aktualisiert):**
`https://hannespix.github.io/Azubi-Wissen/` — als **PWA installierbar**
(„Zum Startbildschirm hinzufügen"), danach auch im Flugmodus nutzbar.

**Variante 1 — Einzeldatei (empfohlen für Zero-Trust-Arbeitsplätze):**
[`azubi-wissen-offline.html`](azubi-wissen-offline.html) herunterladen und
per **Doppelklick** öffnen. Eine Datei, alles enthalten; Notizen, Vermerke
und Merkliste bleiben lokal im Browser gespeichert.

**Variante 2 — Repo-Ordner über lokalen Server** (für Entwicklung):
```
python3 -m http.server 8000     # dann http://localhost:8000/
```

## Funktionen

| Bereich | Was es kann |
|---|---|
| **Wissensdatenbank** | 39 Artikel in 9 Themenbereichen mit 3 Detailstufen, 101 FAQ, Praxishinweisen je Rolle (Azubi/Betrieb/Beratung) und ~150 Querverweisen; **33 Gesetze und Verordnungen klickbar verlinkt** (§§-Zitate öffnen den amtlichen Volltext, Bereichszitate wie „§§ 34–36 BBiG" inklusive) |
| **Grüne Berufe** | 18 Berufe mit Fachrichtungen, amtlichen Verordnungskürzeln, direktem Volltext-Link zur Ausbildungsordnung, BERUFENET-Link und Sprung in die vorbelegten E-Mail-Vorlagen |
| **Schnellnachschlag** | 12 Karten: Tarif-/Urlaubstabellen, Fristen, Arbeitszeit, Fachrichtungen + **6 Rechner** (Urlaub nach Alter, Mindestvergütung, Probezeit/Fristen, Teilzeit, **Ausbildungsfahrplan** mit Jugendschutz-Fristen, **Notenrechner** mit Bestehens-Checkliste nach GärtnAusbV) |
| **Jahreskreis** | Das wiederkehrende Jahr der Ausbildungsberatung als 12-Monats-Timeline: Prüfungsrunden, Zulassung & Berichtsheftkontrolle, Schulbesuche (Eingangs-/Abschlussklassen), Anerkennungs-Fixtermine 20.04./20.09., Gremien, Jahreswechsel-Aufgaben |
| **Suche (Strg+K oder /)** | global, multitoken, fuzzy (tippfehler- und diakritikatolerant), Synonyme, Gruppierung, Tastaturnavigation — über Artikel, FAQ, Berufe, Quellen, Vorlagen, Checklisten, Glossar und eigene Inhalte |
| **E-Mail-Vorlagen** | 14 Vorlagen mit Automatik: Berufs- und Fachrichtungs-Dropdowns, Datums-/Fristfelder, gemerkte Eingabewerte und Eingabe-Historie — ausfüllen, kopieren, versenden |
| **Checklisten** | 4 interaktive Listen (Erstberatung Fachwerker, Eintragung, Betriebsbesuch, AP-Anmeldung) mit lokal gespeichertem Abhak-Stand und Druckfassung |
| **Glossar** | 35 Fachbegriffe von 80-Prozent-Regel bis Zwischenprüfung — mit §§-Links, Artikel- und Quellen-Chips |
| **Download-Center** | 100 Quellen im Baum: RP-Formulare (BAV!), Ausbildungspläne, 48 lokale PDFs, alle 14 Ausbildungsordnungen der grünen Berufe, Gesetze, **Verwaltungsvorschriften des Landes (VwV Berichtsheft, VOAPLandw, BBiG-ZuVO) und BIBB-Hauptausschuss-Empfehlungen**, BA-Förderung, SVLFG, öffentliche Portale |
| **KI-Assistent (lokal)** | Antworten ausschließlich aus der Wissensbasis mit Quellenangaben (§§ + Artikel) — rechnet (Urlaub, Vergütung, Teilzeit, Probezeit, Noten), kennt alle Module, bietet passende Vorlagen/Checklisten/Formulare an; keine Eingabe verlässt das Gerät, keine Rechtsberatung |
| **Bedeutungssuche (optional)** | Auf Klick lädt der Assistent ein lokales Sprachmodell (multilingual-e5-small, quantisiert, ≈ 150 MB aus `assets/vendor/semantik/`) und versteht dann frei formulierte Fragen („Chef zahlt zu spät" → Vergütung). Komplett offline, keine Cloud; ohne Modell arbeitet die Stichwortsuche unverändert. Index neu bauen nach Inhaltsänderungen: `node tools/semantik_index_bauen.mjs` |
| **Merkliste & Druck** | Stern an Artikeln und Karten → Schnellzugriff auf der Startseite; „Karte drucken" macht aus Jahreskreis, Fahrplan & Co. ein A4-Handout für Schulbesuche |
| **Export & Vermerk** | PDF-Handout je Zielgruppe und Detailgrad; formulargestützter Aktenvermerk mit Rechtsgrundlagen-Bausteinen und Autosave |
| **Eigene Inhalte** | Artikel und Dokumente selbst anlegen (lokal, überall auffindbar) + **Komplettsicherung** als JSON: eigene Inhalte, Vermerke, Notizen, Checklisten-Stände und Einstellungen — für Netzlaufwerk-Ablage und Gerätewechsel |

## Inhalte pflegen

Alle Fachinhalte liegen in **`assets/js/`** als Datenmodule (Pflegehinweise
in den Dateiköpfen): `wissen.js` (Artikel), `berufe.js`, `quellen.js`,
`vorlagen.js`, `nachschlag.js` (inkl. Jahreskreis), `checklisten.js`,
`glossar.js`. Wichtigste Wartungspunkte:

- **Mindestausbildungsvergütung**: jährliche Bekanntmachung im Bundesanzeiger
  → Tabelle im Artikel `mindestverguetung`, MIAV-Konstante in `app.js` und
  `stand` aktualisieren (Jahreskreis erinnert im 4. Quartal daran).
- **Querverweise**: `[[artikel-id]]` bzw. `[[artikel-id|Linktext]]` in
  Fakten, Abschnitten, FAQ und Hinweisen; §§-Zitate werden automatisch
  verlinkt, wenn das Werk in `GESETZ_QUELLE` (app.js) steht.
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
index.html                     App-Shell (Router, Navigation, PWA)
bw-theme.css                   Design-System (Single Source of Truth)
sw.js                          Service Worker (versionierte App-Shell)
azubi-wissen-offline.html      Einzeldatei-Auslieferung (generiert, versioniert)
assets/js/wissen.js …          Datenmodule (Inhalte — hier pflegen)
assets/js/app.js               Ansichten, Suche, Rechner, Jahreskreis, Merkliste
assets/js/assistent.js         lokaler KI-Assistent (Retrieval + Synthese)
assets/js/export.js            PDF-Handout + Aktenvermerk-Generator
assets/js/lokaldb.js           lokale Datenbank (IndexedDB/localStorage)
assets/css/app.css             App-Komponenten (nur --bw-*-Tokens) + Druck (A4)
formulare/                     36 lokale PDFs mit Herkunftsnachweis (QUELLEN.md)
tools/                         Offline-Check, Single-File-Builder
```

## Rechtliches

Fachinformation der Ausbildungsberatung — **keine Rechtsberatung im
Einzelfall**. Schriften (BaWue Sans/Serif) und RPF-Logo sind lizenziert →
`assets/fonts/LIZENZ.md`, `assets/logo/LIZENZ.md`; **Repo privat halten**.
Keine personenbezogenen Echtdaten im Repo; Nutzerdaten (Notizen, Vermerke,
Merkliste, Sicherungen) verbleiben ausschließlich lokal.

Prozess & Weiterentwicklung: `AGENTS.md`, `ROADMAP.md`. Design & Technik:
`CLAUDE.md`.
