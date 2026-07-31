# Fachwerker-Navigator Gartenbau

Offlinefähige Desktop-Anwendung (Tauri 2) für die Beratung rund um die
Fachwerkerausbildung im Gartenbau — Wissensdatenbank, Volltextsuche und
(in späteren Milestones) Kontakte, Checklisten, Fälle und quellengebundener
KI-Assistent. Grundlage: das Vibecoding-Masterbriefing; Prozess: ein
Milestone = ein Pull Request.

**Stand: Milestone 1 (Projektgrundlage) umgesetzt** — Details in
[`docs/ROADMAP.md`](docs/ROADMAP.md).

## Architektur in einem Satz

React/TypeScript-Oberfläche → schmale IPC-Schicht → **`navigator-core`**
(Rust: SQLite gebündelt inkl. FTS5, Migrationen, Markdown-Import, Suche);
die Wissensbasis liegt als Markdown mit YAML-Frontmatter in
[`knowledge/`](knowledge/) und wird beim ersten Start in die lokale
SQLite-Datenbank importiert. Kein Server, keine Cloud, KI standardmäßig aus.

## Entwicklung

```bash
# Browser-Vorschau (ohne Rust/Tauri) — sql.js statt nativer SQLite
cd navigator/app
npm install
npm run dev          # http://localhost:5173

# Kernlogik testen (maßgebliche Implementierung)
cd navigator
cargo test -p navigator-core

# Desktop-App lokal (benötigt Rust + Plattform-Abhängigkeiten von Tauri 2)
cd navigator/app
npm run tauri dev
```

Die **Browser-Vorschau** nutzt dieselben Migrationen und Inhalte über
sql.js; da dessen Build kein FTS5 enthält, greift dort eine normalisierte
In-Memory-Suche mit Synonymen. Fachlich maßgeblich ist die Rust-Seite
(FTS5 + BM25), abgesichert durch `cargo test`.

## Windows-Build

GitHub Actions [`navigator-build.yml`](../.github/workflows/navigator-build.yml)
baut Installer (NSIS) **und portable EXE** — manuell über „Run workflow"
oder per Tag `navigator-v*`. Windows ist die primäre Zielplattform;
Admin-Rechte sind für die portable EXE nicht erforderlich.

## Inhalte pflegen

- Artikel: `knowledge/<kategorie>/<id>.md` — Pflichtfelder siehe
  [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md); prüfen mit
  `node scripts/validate-content.mjs`.
- Synonyme: `data/synonyms/synonyme.json`.
- Startbestand (38 Artikel) wurde per `scripts/export-wissen.mjs` aus dem
  Browsertool **Azubi-Wissen v1** übernommen (inkl. Handreichung
  Fachwerkerausbildung, Netzwerkfassung 1.2) — ohne personenbezogene Daten.

## Leitplanken (aus dem Briefing)

- Offline-first; nur optionale KI-Funktionen dürfen online gehen —
  **Standard: deaktiviert**, Cloud-KI ist in M1 nicht implementiert.
- Keine API-Schlüssel im Repo; keine Telemetrie; sichere
  Markdown-Darstellung (DOMPurify) und strikte CSP in `tauri.conf.json`.
- Migrationsdateien sind unveränderlich (nur ergänzen).
- Fehlermeldungen auf Deutsch; Tastaturbedienung und Fokusmarkierung
  von Anfang an.
