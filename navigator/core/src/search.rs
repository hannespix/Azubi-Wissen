//! Lese- und Suchzugriffe. Die FTS5-Anfrage wird aus Nutzereingaben
//! sicher aufgebaut (Anführungszeichen maskiert, Präfixsuche je Token,
//! Synonyme als OR-Gruppen).

use crate::model::{Article, ArticleSummary, Category, SearchHit};
use crate::Result;
use rusqlite::Connection;

pub fn list_categories(conn: &Connection) -> Result<Vec<Category>> {
    let mut stmt = conn.prepare(
        "SELECT c.id, c.titel, c.beschreibung,
                (SELECT COUNT(*) FROM articles a WHERE a.kategorie_id = c.id)
         FROM categories c ORDER BY c.sortierung, c.titel",
    )?;
    let zeilen = stmt.query_map([], |z| {
        Ok(Category { id: z.get(0)?, titel: z.get(1)?, beschreibung: z.get(2)?, artikel_anzahl: z.get(3)? })
    })?;
    Ok(zeilen.collect::<std::result::Result<_, _>>()?)
}

pub fn list_articles(conn: &Connection, kategorie: Option<&str>) -> Result<Vec<ArticleSummary>> {
    let sql = "SELECT a.id, a.titel, a.kurz, a.kategorie_id, c.titel, a.status, a.geprueft_am
               FROM articles a JOIN categories c ON c.id = a.kategorie_id
               WHERE (?1 IS NULL OR a.kategorie_id = ?1)
               ORDER BY c.sortierung, c.titel, a.titel";
    let mut stmt = conn.prepare(sql)?;
    let zeilen = stmt.query_map([kategorie], |z| {
        Ok(ArticleSummary {
            id: z.get(0)?, titel: z.get(1)?, kurz: z.get(2)?, kategorie_id: z.get(3)?,
            kategorie_titel: z.get(4)?, status: z.get(5)?, geprueft_am: z.get(6)?,
        })
    })?;
    Ok(zeilen.collect::<std::result::Result<_, _>>()?)
}

pub fn load_article(conn: &Connection, id: &str) -> Result<Option<Article>> {
    let mut stmt = conn.prepare(
        "SELECT a.id, a.titel, a.kurz, a.kategorie_id, c.titel, a.status, a.geprueft_am,
                a.region, a.quelle, a.inhalt_md
         FROM articles a JOIN categories c ON c.id = a.kategorie_id WHERE a.id = ?1",
    )?;
    let artikel = stmt
        .query_row([id], |z| {
            Ok(Article {
                id: z.get(0)?, titel: z.get(1)?, kurz: z.get(2)?, kategorie_id: z.get(3)?,
                kategorie_titel: z.get(4)?, status: z.get(5)?, geprueft_am: z.get(6)?,
                region: z.get(7)?, quelle: z.get(8)?, inhalt_md: z.get(9)?,
                tags: Vec::new(), rechtsgrundlagen: Vec::new(),
            })
        })
        .map(Some)
        .or_else(|e| match e {
            rusqlite::Error::QueryReturnedNoRows => Ok(None),
            andere => Err(andere),
        })?;

    let Some(mut artikel) = artikel else { return Ok(None) };
    let mut tags = conn.prepare(
        "SELECT t.name FROM tags t JOIN article_tags at ON at.tag_id = t.id
         WHERE at.article_id = ?1 ORDER BY t.name",
    )?;
    artikel.tags = tags
        .query_map([id], |z| z.get::<_, String>(0))?
        .collect::<std::result::Result<_, _>>()?;
    let mut refs = conn.prepare(
        "SELECT CASE WHEN l.titel = '' THEN l.norm ELSE l.norm || ' — ' || l.titel END
         FROM legal_references l JOIN article_legal_refs r ON r.ref_id = l.id
         WHERE r.article_id = ?1 ORDER BY l.norm",
    )?;
    artikel.rechtsgrundlagen = refs
        .query_map([id], |z| z.get::<_, String>(0))?
        .collect::<std::result::Result<_, _>>()?;
    Ok(Some(artikel))
}

/// Baut aus einer freien Eingabe eine FTS5-MATCH-Anfrage:
/// je Token eine OR-Gruppe aus Präfixsuche + hinterlegten Synonymen.
fn match_anfrage(conn: &Connection, eingabe: &str) -> Result<Option<String>> {
    let mut gruppen: Vec<String> = Vec::new();
    for roh in eingabe.split_whitespace().take(8) {
        let token: String = roh
            .chars()
            .filter(|c| c.is_alphanumeric())
            .collect::<String>()
            .to_lowercase();
        if token.len() < 2 {
            continue;
        }
        let mut alternativen = vec![format!("\"{token}\"*")];
        let mut stmt = conn.prepare(
            "SELECT synonym FROM search_synonyms WHERE begriff = ?1
             UNION SELECT begriff FROM search_synonyms WHERE synonym = ?1",
        )?;
        let synonyme: Vec<String> = stmt
            .query_map([&token], |z| z.get::<_, String>(0))?
            .collect::<std::result::Result<_, _>>()?;
        for syn in synonyme {
            for wort in syn.split_whitespace() {
                let sauber: String = wort.chars().filter(|c| c.is_alphanumeric()).collect();
                if sauber.len() >= 2 {
                    alternativen.push(format!("\"{sauber}\"*"));
                }
            }
        }
        alternativen.dedup();
        gruppen.push(format!("({})", alternativen.join(" OR ")));
    }
    if gruppen.is_empty() {
        return Ok(None);
    }
    Ok(Some(gruppen.join(" AND ")))
}

pub fn search_articles(conn: &Connection, eingabe: &str, limit: i64) -> Result<Vec<SearchHit>> {
    let Some(anfrage) = match_anfrage(conn, eingabe)? else { return Ok(Vec::new()) };
    let mut stmt = conn.prepare(
        "SELECT a.id, a.titel, a.kategorie_id, c.titel, a.status,
                snippet(articles_fts, 2, '<mark>', '</mark>', ' … ', 14)
         FROM articles_fts f
         JOIN articles a ON a.rowid = f.rowid
         JOIN categories c ON c.id = a.kategorie_id
         WHERE articles_fts MATCH ?1
         ORDER BY bm25(articles_fts, 8.0, 4.0, 1.0, 4.0)
         LIMIT ?2",
    )?;
    let zeilen = stmt.query_map((anfrage, limit), |z| {
        Ok(SearchHit {
            id: z.get(0)?, titel: z.get(1)?, kategorie_id: z.get(2)?,
            kategorie_titel: z.get(3)?, status: z.get(4)?, schnipsel: z.get(5)?,
        })
    })?;
    Ok(zeilen.collect::<std::result::Result<_, _>>()?)
}
