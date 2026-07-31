# Datenmodell

Migrationen: `core/migrations/NNNN_name.sql` — **unveränderlich**, neue
Änderungen ausschließlich als neue Datei; angewendeter Stand in
`schema_version` (version, name, angewendet_am).

## Tabellen (0001_init)

| Tabelle | Zweck / Kernfelder |
|---|---|
| `categories` | id (Slug), titel, beschreibung, sortierung |
| `articles` | id (Slug), titel, kurz, kategorie_id→categories, status, geprueft_am, geprueft_von, region, quelle, inhalt_md, erstellt_am, geaendert_am |
| `tags` / `article_tags` | Schlagwörter n:m |
| `legal_references` / `article_legal_refs` | Rechtsgrundlagen (norm, titel) n:m |
| `sources` | Quellen je Artikel (bezeichnung, typ: rechtsgrundlage/arbeitshilfe/extern, stand) |
| `search_synonyms` | begriff ↔ synonym (beidseitig ausgewertet) |
| `application_settings` | Schlüssel/Wert (App-Einstellungen) |
| `articles_fts` | FTS5 (contentless): titel, kurz, inhalt, tags; rowid = articles.rowid; tokenize `unicode61 remove_diacritics 2` |

Vorbereitet laut Briefing, aber erst in späteren Milestones angelegt:
institutions/contacts (M4), checklists/cases (M5), attachments (M6),
ai_conversations (M7), article_versions/audit_log (M2/M9).

## Frontmatter der Wissensdateien

Pflicht: `id`, `title`, `category`, `category_title`, `summary`,
`status`, `reviewed_at` (JJJJ-MM-TT). Optional: `tags[]`,
`legal_references[]` („Norm — Titel"), `region`, `source`.
Statuswerte: Entwurf · ungeprüft · fachlich geprüft · rechtlich geprüft ·
regional bestätigt · veraltet · archiviert.
Prüfung: `node scripts/validate-content.mjs` (auch im CI).
