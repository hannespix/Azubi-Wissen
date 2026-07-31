# Architektur

## Überblick

```
navigator/
  app/         React 18 + TypeScript + Vite + Tailwind 4 (UI)
  src-tauri/   Tauri-2-Shell: Fenster, IPC-Kommandos, Ressourcen-Bundling
  core/        navigator-core (Rust): SQLite, Migrationen, Import, Suche
  knowledge/   Wissensbasis: Markdown + YAML-Frontmatter (versioniert)
  data/        Seed-Daten (Synonyme)
  scripts/     Export aus Azubi-Wissen v1, Inhalts-Validierung
```

**Datenfluss (Desktop):** UI → `@tauri-apps/api` invoke →
`src-tauri` (Commands, `State<Mutex<Connection>>`) → `navigator-core` →
SQLite-Datei im Benutzerprofil (`app_data_dir/navigator.db`). Beim ersten
Start (leere DB) importiert die Shell die als Ressourcen mitgelieferte
Wissensbasis und die Synonyme.

**Datenfluss (Browser-Vorschau):** identische UI; der Provider erkennt die
Umgebung und lädt statt IPC einen sql.js-Treiber, der dieselben
Migrationen (`@core/migrations/*.sql?raw`) ausführt und dieselben
Markdown-Dateien (`import.meta.glob`) importiert. Zweck: Entwicklung und
UI-Tests ohne Desktop-Build. Kein FTS5 im sql.js-Build → normalisierte
In-Memory-Suche als gekennzeichneter Fallback. **Maßgeblich ist immer
`navigator-core`** (durch Integrationstests abgedeckt).

## Entscheidungen

- **Kern ohne Tauri-Abhängigkeit:** `navigator-core` kompiliert und testet
  ohne GUI-Systembibliotheken — CI-freundlich, wiederverwendbar (CLI,
  spätere Services), klare Schnittstelle.
- **SQLite gebündelt (rusqlite `bundled`)** inkl. FTS5; Volltext als
  contentless-FTS mit `rowid`-Kopplung an `articles`, BM25-Gewichtung
  Titel > Kurztext = Tags > Inhalt.
- **Synonyme in der Datenbank** (`search_synonyms`), zur Anfragezeit als
  OR-Gruppen je Token expandiert; Tokens untereinander UND.
- **Markdown bleibt Quelle der Wahrheit** für Inhalte; die DB ist
  Importziel und Suchindex. Redaktion/Versionierung der Inhalte läuft
  über Git (M2: Editor + Versionshistorie in der App).
- **Sicherheit:** CSP ohne Fremdhosts, DOMPurify vor jedem
  `dangerouslySetInnerHTML`, Suchtreffer-Snippets nur mit `<mark>`.

## Bewusste M1-Grenzen

- Kein Fuzzy/Tippfehler-Matching in FTS5 (M3: Trigramm-/Spellfix-Ansatz im Core).
- KI-Assistent nur als Platzhalterseite (M7; Standard „deaktiviert").
- Icons sind neutrale Platzhalter (Lizenzfrage RPF-Logo fürs App-Icon offen).
- Desktop-Build wird im CI verifiziert (Windows-Workflow, Linux `cargo check`
  mit WebKitGTK) — nicht in der Entwicklungs-Sandbox.
