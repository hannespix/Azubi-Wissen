# Roadmap Fachwerker-Navigator

Prozess: ein Milestone = ein PR (Basis: Masterbriefing §20).

## ✅ M1 — Projektgrundlage (umgesetzt)

**Geliefert:** Tauri-2-Projekt (React/TS/Vite/Tailwind 4), Grundlayout
(Seitennavigation, globale Suchleiste, Inhaltsbereich, Kontextleiste),
SQLite-Anbindung über `navigator-core` (rusqlite bundled inkl. FTS5),
Migrationsrunner + Schema 0001, Markdown-Import aus `knowledge/` (38
Artikel aus Azubi-Wissen v1 inkl. Fachwerker-Handreichung), Synonym-Seed,
Artikelübersicht/-ansicht (sichere Markdown-Darstellung), FTS5-Volltextsuche
mit Synonymen/Präfix/BM25, Dashboard, Einstellungen (hell/dunkel/System,
Schriftgröße, KI-Modus „deaktiviert"), Browser-Vorschau via sql.js,
Inhalts-Validierung, CI (Tests + Linux-Check + Windows-Build).

**Abnahmekriterium erfüllt:** Anwendung startet offline und zeigt die lokal
gespeicherten Artikel (verifiziert: `cargo test` für Kern/Import/Suche;
Playwright-Lauf der Oberfläche ohne externe Requests).

**Bekannte Grenzen:** kein Fuzzy in FTS5 (→ M3), KI nur Platzhalter (→ M7),
Platzhalter-Icons, Desktop-Build via CI statt lokal.

## ✅ M1.1 — Inhalts-Sync auf Azubi-Wissen-Endstand (umgesetzt 01.08.2026)

**Geliefert:** Wissensbasis per `scripts/export-wissen.mjs` auf den
Endstand des Browsertools gebracht — jetzt **39 Artikel** (neu:
`ap-noten` — Notenberechnung & Bestehensregeln der Abschlussprüfung)
mit allen vertieften Fakten/FAQ der D-Serie und 76 Synonymgruppen.
Der Exporter löst die Querlink-Syntax des Browsertools
(`[[artikel-id]]`, `[[id|Label]]`) jetzt in Klartext auf — die
Markdown-Basis verlinkt weiterhin über „Verwandte Artikel".
Verifiziert: Inhalts-Validierung 39/39, `cargo test -p navigator-core`,
Vite-Browser-Build.

## Nächste Milestones (Briefing)

- **M2 Wissensdatenbank:** Editor, interne Links (§-Verlinkung),
  Versionshistorie (`article_versions`), Quellenverwaltung im UI.
- **M3 Suche:** Tippfehlertoleranz (Trigramm/Spellfix im Core),
  Filter (Kategorie/Status/Rechtsgebiet), Suchverlauf.
- **M4 Kontakte & Einrichtungen:** Datenmodell + UI, Ampelklassifizierung,
  Landkreisfilter, CSV-Import/-Export. *Personenbezogene Kontaktdaten
  bleiben lokal beim Nutzer — kein Seed im Repo.*
- **M5 Checklisten & Fälle** (aus Handreichung Kap. 13), PDF-Export.
- **M6 Dokumentenimport** (PDF/DOCX/EML, lokale Indexierung).
- **M7 KI-Assistent** quellengebunden (RAG), Datenschutzvorschau,
  Ollama-Anbindung; Standard bleibt „deaktiviert".
- **M8 Portable Version & eAkte-Nutzung** („Öffnen mit", Dateiübergabe).
- **M9 Qualität & Veröffentlichung** (Handbuch, Release, Prüfsummen).
