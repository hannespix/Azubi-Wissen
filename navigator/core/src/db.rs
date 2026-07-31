//! Verbindung und Migrationen.
//!
//! Migrationsregeln: Dateien in `migrations/` sind unveränderlich; neue
//! Schemaänderungen kommen als neue, höher nummerierte Datei dazu. Der
//! Stand wird in `schema_version` festgehalten.

use crate::Result;
use rusqlite::Connection;
use std::path::Path;

/// Eingebettete Migrationen in Ausführungsreihenfolge.
const MIGRATIONS: &[(i64, &str, &str)] = &[(
    1,
    "0001_init",
    include_str!("../migrations/0001_init.sql"),
)];

pub fn open_db(path: &Path) -> Result<Connection> {
    if let Some(eltern) = path.parent() {
        std::fs::create_dir_all(eltern)?;
    }
    let conn = Connection::open(path)?;
    konfigurieren(&conn)?;
    migrieren(&conn)?;
    Ok(conn)
}

pub fn open_memory_db() -> Result<Connection> {
    let conn = Connection::open_in_memory()?;
    konfigurieren(&conn)?;
    migrieren(&conn)?;
    Ok(conn)
}

fn konfigurieren(conn: &Connection) -> Result<()> {
    conn.pragma_update(None, "journal_mode", "WAL").ok(); // im Memory-Modus nicht verfügbar
    conn.pragma_update(None, "foreign_keys", "ON")?;
    Ok(())
}

pub fn migrieren(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_version (
           version INTEGER PRIMARY KEY,
           name TEXT NOT NULL,
           angewendet_am TEXT NOT NULL DEFAULT (datetime('now'))
         );",
    )?;
    let aktuell: i64 = conn
        .query_row("SELECT COALESCE(MAX(version), 0) FROM schema_version", [], |z| z.get(0))?;
    for (version, name, sql) in MIGRATIONS {
        if *version > aktuell {
            conn.execute_batch(sql)?;
            conn.execute(
                "INSERT INTO schema_version (version, name) VALUES (?1, ?2)",
                (version, name),
            )?;
        }
    }
    Ok(())
}

/// Prüft, ob das gebündelte SQLite mit FTS5 übersetzt wurde.
pub fn fts5_verfuegbar(conn: &Connection) -> bool {
    conn.prepare("SELECT 1 FROM articles_fts LIMIT 1").is_ok()
}
