//! navigator-core — Datenhaltung des Fachwerker-Navigators.
//!
//! Bewusst ohne UI- und Tauri-Abhängigkeiten gehalten: Dieses Crate kapselt
//! SQLite (gebündelt, inkl. FTS5), Migrationen, den Import der Markdown-
//! Wissensbasis und die Volltextsuche. Die Tauri-Shell (src-tauri) und die
//! Tests greifen ausschließlich über diese API zu.

pub mod db;
pub mod import;
pub mod model;
pub mod search;

pub use db::{open_db, open_memory_db};
pub use import::{import_knowledge_dir, import_synonyms_json, ImportReport};
pub use model::{Article, ArticleSummary, Category, SearchHit};
pub use search::{list_articles, list_categories, load_article, search_articles};

use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("Datenbankfehler: {0}")]
    Db(#[from] rusqlite::Error),
    #[error("Dateifehler: {0}")]
    Io(#[from] std::io::Error),
    #[error("Frontmatter fehlt oder ist unvollständig in {0}")]
    Frontmatter(String),
    #[error("Metadaten ungültig in {datei}: {grund}")]
    Metadata { datei: String, grund: String },
}

pub type Result<T> = std::result::Result<T, CoreError>;
