//! Import der Markdown-Wissensbasis (YAML-Frontmatter + Markdown-Rumpf)
//! und der Synonymliste. Der Import ist idempotent: Vorhandene Artikel
//! werden ersetzt, der Volltextindex wird je Artikel neu aufgebaut.

use crate::model::Frontmatter;
use crate::{CoreError, Result};
use rusqlite::Connection;
use serde::Serialize;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Default, Serialize)]
pub struct ImportReport {
    pub artikel: usize,
    pub kategorien: usize,
    pub synonyme: usize,
    pub uebersprungen: Vec<String>,
}

/// Trennt `---`-Frontmatter vom Markdown-Rumpf.
fn frontmatter_teilen(inhalt: &str) -> Option<(&str, &str)> {
    let rest = inhalt.strip_prefix("---")?;
    let ende = rest.find("\n---")?;
    let yaml = &rest[..ende];
    let body = rest[ende + 4..].trim_start_matches(['\r', '\n']);
    Some((yaml, body))
}

pub fn import_knowledge_dir(conn: &mut Connection, dir: &Path) -> Result<ImportReport> {
    let mut report = ImportReport::default();
    let tx = conn.transaction()?;

    for eintrag in WalkDir::new(dir).sort_by_file_name() {
        let eintrag = eintrag.map_err(|e| CoreError::Io(e.into()))?;
        if !eintrag.file_type().is_file()
            || eintrag.path().extension().and_then(|e| e.to_str()) != Some("md")
        {
            continue;
        }
        let pfad = eintrag.path();
        let anzeige = pfad.strip_prefix(dir).unwrap_or(pfad).display().to_string();
        let text = std::fs::read_to_string(pfad)?;

        let Some((yaml, body)) = frontmatter_teilen(&text) else {
            report.uebersprungen.push(anzeige);
            continue;
        };
        let fm: Frontmatter = serde_yaml::from_str(yaml).map_err(|e| CoreError::Metadata {
            datei: anzeige.clone(),
            grund: e.to_string(),
        })?;
        if fm.id.trim().is_empty() || fm.title.trim().is_empty() {
            return Err(CoreError::Frontmatter(anzeige));
        }

        // Kategorie anlegen/aktualisieren (Titel gewinnt, wenn angegeben)
        let kat_titel = fm.category_title.clone().unwrap_or_else(|| fm.category.clone());
        tx.execute(
            "INSERT INTO categories (id, titel) VALUES (?1, ?2)
             ON CONFLICT(id) DO UPDATE SET titel = excluded.titel",
            (&fm.category, &kat_titel),
        )?;

        let kurz = fm.summary.clone().unwrap_or_default();
        tx.execute(
            "INSERT INTO articles
               (id, titel, kurz, kategorie_id, status, geprueft_am, region, quelle, inhalt_md, geaendert_am)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9, datetime('now'))
             ON CONFLICT(id) DO UPDATE SET
               titel=excluded.titel, kurz=excluded.kurz, kategorie_id=excluded.kategorie_id,
               status=excluded.status, geprueft_am=excluded.geprueft_am, region=excluded.region,
               quelle=excluded.quelle, inhalt_md=excluded.inhalt_md, geaendert_am=datetime('now')",
            (
                &fm.id,
                &fm.title,
                &kurz,
                &fm.category,
                fm.status.as_deref().unwrap_or("ungeprüft"),
                &fm.reviewed_at,
                &fm.region,
                &fm.source,
                body,
            ),
        )?;

        // Tags neu setzen
        tx.execute("DELETE FROM article_tags WHERE article_id = ?1", [&fm.id])?;
        for tag in &fm.tags {
            tx.execute("INSERT OR IGNORE INTO tags (name) VALUES (?1)", [tag])?;
            tx.execute(
                "INSERT OR IGNORE INTO article_tags (article_id, tag_id)
                 SELECT ?1, id FROM tags WHERE name = ?2",
                (&fm.id, tag),
            )?;
        }

        // Rechtsgrundlagen ("§ 66 BBiG — Titel" oder nur Norm)
        tx.execute("DELETE FROM article_legal_refs WHERE article_id = ?1", [&fm.id])?;
        for eintrag in &fm.legal_references {
            let (norm, titel) = match eintrag.split_once(" — ") {
                Some((n, t)) => (n.trim(), t.trim()),
                None => (eintrag.trim(), ""),
            };
            tx.execute(
                "INSERT OR IGNORE INTO legal_references (norm, titel) VALUES (?1, ?2)",
                (norm, titel),
            )?;
            tx.execute(
                "INSERT OR IGNORE INTO article_legal_refs (article_id, ref_id)
                 SELECT ?1, id FROM legal_references WHERE norm = ?2 AND titel = ?3",
                (&fm.id, norm, titel),
            )?;
        }

        // Quelle als sources-Eintrag führen
        tx.execute("DELETE FROM sources WHERE article_id = ?1", [&fm.id])?;
        if let Some(q) = &fm.source {
            tx.execute(
                "INSERT INTO sources (article_id, bezeichnung, typ, stand)
                 VALUES (?1, ?2, 'arbeitshilfe', ?3)",
                (&fm.id, q, &fm.reviewed_at),
            )?;
        }

        // Volltextindex je Artikel neu aufbauen (rowid = articles.rowid)
        let rowid: i64 =
            tx.query_row("SELECT rowid FROM articles WHERE id = ?1", [&fm.id], |z| z.get(0))?;
        tx.execute("DELETE FROM articles_fts WHERE rowid = ?1", [rowid])?;
        tx.execute(
            "INSERT INTO articles_fts (rowid, titel, kurz, inhalt, tags)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            (rowid, &fm.title, &kurz, body, fm.tags.join(" ")),
        )?;

        report.artikel += 1;
    }

    report.kategorien =
        tx.query_row("SELECT COUNT(*) FROM categories", [], |z| z.get::<_, i64>(0))? as usize;
    tx.commit()?;
    Ok(report)
}

/// Synonyme aus einer JSON-Datei der Form {"begriff": ["synonym", …]} laden.
pub fn import_synonyms_json(conn: &Connection, json: &str) -> Result<usize> {
    let map: std::collections::BTreeMap<String, Vec<String>> =
        serde_json::from_str(json).map_err(|e| CoreError::Metadata {
            datei: "synonyme.json".into(),
            grund: e.to_string(),
        })?;
    let mut anzahl = 0usize;
    for (begriff, synonyme) in map {
        for syn in synonyme {
            conn.execute(
                "INSERT OR IGNORE INTO search_synonyms (begriff, synonym) VALUES (?1, ?2)",
                (&begriff, &syn),
            )?;
            anzahl += 1;
        }
    }
    Ok(anzahl)
}
