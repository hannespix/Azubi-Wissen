-- 0001_init.sql — Grundschema des Fachwerker-Navigators.
-- Migrationen werden ausschließlich ergänzt, nie verändert (siehe docs/DATA_MODEL.md).

CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  titel       TEXT NOT NULL,
  beschreibung TEXT NOT NULL DEFAULT '',
  sortierung  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE articles (
  id            TEXT PRIMARY KEY,
  titel         TEXT NOT NULL,
  kurz          TEXT NOT NULL DEFAULT '',
  kategorie_id  TEXT NOT NULL REFERENCES categories(id),
  status        TEXT NOT NULL DEFAULT 'ungeprüft',
  geprueft_am   TEXT,
  geprueft_von  TEXT,
  region        TEXT,
  quelle        TEXT,
  inhalt_md     TEXT NOT NULL,
  erstellt_am   TEXT NOT NULL DEFAULT (datetime('now')),
  geaendert_am  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_articles_kategorie ON articles(kategorie_id);

CREATE TABLE tags (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE article_tags (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE legal_references (
  id    INTEGER PRIMARY KEY,
  norm  TEXT NOT NULL,
  titel TEXT NOT NULL DEFAULT '',
  UNIQUE(norm, titel)
);

CREATE TABLE article_legal_refs (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  ref_id     INTEGER NOT NULL REFERENCES legal_references(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, ref_id)
);

CREATE TABLE sources (
  id          INTEGER PRIMARY KEY,
  article_id  TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  bezeichnung TEXT NOT NULL,
  typ         TEXT NOT NULL DEFAULT 'arbeitshilfe',   -- rechtsgrundlage | arbeitshilfe | extern
  stand       TEXT
);

CREATE TABLE search_synonyms (
  id      INTEGER PRIMARY KEY,
  begriff TEXT NOT NULL,
  synonym TEXT NOT NULL,
  UNIQUE(begriff, synonym)
);

CREATE TABLE application_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Volltextindex (contentless); rowid ist an articles.rowid gekoppelt.
CREATE VIRTUAL TABLE articles_fts USING fts5(
  titel, kurz, inhalt, tags,
  tokenize = 'unicode61 remove_diacritics 2'
);
