//! Datentypen der öffentlichen API (serde-serialisierbar für Tauri-IPC).

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub titel: String,
    pub beschreibung: String,
    pub artikel_anzahl: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArticleSummary {
    pub id: String,
    pub titel: String,
    pub kurz: String,
    pub kategorie_id: String,
    pub kategorie_titel: String,
    pub status: String,
    pub geprueft_am: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Article {
    pub id: String,
    pub titel: String,
    pub kurz: String,
    pub kategorie_id: String,
    pub kategorie_titel: String,
    pub status: String,
    pub geprueft_am: Option<String>,
    pub region: Option<String>,
    pub quelle: Option<String>,
    pub inhalt_md: String,
    pub tags: Vec<String>,
    pub rechtsgrundlagen: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchHit {
    pub id: String,
    pub titel: String,
    pub kategorie_id: String,
    pub kategorie_titel: String,
    pub status: String,
    pub schnipsel: String,
}

/// Frontmatter einer Wissensdatei (YAML zwischen `---`-Zeilen).
#[derive(Debug, Deserialize)]
pub struct Frontmatter {
    pub id: String,
    pub title: String,
    pub category: String,
    #[serde(default)]
    pub category_title: Option<String>,
    #[serde(default)]
    pub summary: Option<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub legal_references: Vec<String>,
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default)]
    pub reviewed_at: Option<String>,
    #[serde(default)]
    pub region: Option<String>,
    #[serde(default)]
    pub source: Option<String>,
}
