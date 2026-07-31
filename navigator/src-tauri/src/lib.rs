//! Tauri-Shell des Fachwerker-Navigators.
//!
//! Dünne Schicht: Zustand ist eine SQLite-Verbindung aus `navigator-core`;
//! jedes Kommando delegiert dorthin. Beim ersten Start (leere Datenbank)
//! werden die mitgelieferten Wissensinhalte und Synonyme importiert.

use navigator_core as core;
use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

pub struct Db(pub Mutex<Connection>);

fn fehler(e: impl std::fmt::Display) -> String {
    // Fehler verständlich und auf Deutsch an die Oberfläche geben.
    format!("{e}")
}

fn ressourcen_pfad(app: &AppHandle, relativ: &str) -> Option<PathBuf> {
    app.path()
        .resolve(relativ, tauri::path::BaseDirectory::Resource)
        .ok()
        .filter(|p| p.exists())
}

fn db_initialisieren(app: &AppHandle) -> Result<Connection, String> {
    let daten_dir = app.path().app_data_dir().map_err(fehler)?;
    let db_pfad = daten_dir.join("navigator.db");
    let mut conn = core::open_db(&db_pfad).map_err(fehler)?;

    let artikel: i64 = conn
        .query_row("SELECT COUNT(*) FROM articles", [], |z| z.get(0))
        .map_err(fehler)?;
    if artikel == 0 {
        if let Some(wissen) = ressourcen_pfad(app, "knowledge") {
            core::import_knowledge_dir(&mut conn, &wissen).map_err(fehler)?;
        }
        if let Some(syn) = ressourcen_pfad(app, "data/synonyms/synonyme.json") {
            let json = std::fs::read_to_string(syn).map_err(fehler)?;
            core::import_synonyms_json(&conn, &json).map_err(fehler)?;
        }
    }
    Ok(conn)
}

#[tauri::command]
fn list_categories(db: State<Db>) -> Result<Vec<core::Category>, String> {
    core::list_categories(&db.0.lock().unwrap()).map_err(fehler)
}

#[tauri::command]
fn list_articles(db: State<Db>, kategorie: Option<String>) -> Result<Vec<core::ArticleSummary>, String> {
    core::list_articles(&db.0.lock().unwrap(), kategorie.as_deref()).map_err(fehler)
}

#[tauri::command]
fn get_article(db: State<Db>, id: String) -> Result<Option<core::Article>, String> {
    core::load_article(&db.0.lock().unwrap(), &id).map_err(fehler)
}

#[tauri::command]
fn search_articles(db: State<Db>, eingabe: String, limit: Option<i64>) -> Result<Vec<core::SearchHit>, String> {
    core::search_articles(&db.0.lock().unwrap(), &eingabe, limit.unwrap_or(20)).map_err(fehler)
}

#[tauri::command]
fn reimport_knowledge(app: AppHandle, db: State<Db>) -> Result<core::ImportReport, String> {
    let wissen = ressourcen_pfad(&app, "knowledge")
        .ok_or_else(|| "Wissensverzeichnis nicht gefunden".to_string())?;
    let mut conn = db.0.lock().unwrap();
    core::import_knowledge_dir(&mut conn, &wissen).map_err(fehler)
}

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let conn = db_initialisieren(app.handle())
                .map_err(|e| std::io::Error::other(format!("Datenbankstart fehlgeschlagen: {e}")))?;
            app.manage(Db(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_categories,
            list_articles,
            get_article,
            search_articles,
            reimport_knowledge
        ])
        .run(tauri::generate_context!())
        .expect("Fachwerker-Navigator konnte nicht gestartet werden");
}
