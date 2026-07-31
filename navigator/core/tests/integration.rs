//! Integrationstests: Migration, Import der echten Wissensbasis, FTS5-Suche.

use navigator_core as core;
use std::path::PathBuf;

fn knowledge_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../knowledge")
}

#[test]
fn migration_und_fts5_stehen() {
    let conn = core::open_memory_db().expect("Memory-DB");
    assert!(core::db::fts5_verfuegbar(&conn), "FTS5 muss im gebündelten SQLite aktiv sein");
    let version: i64 = conn
        .query_row("SELECT MAX(version) FROM schema_version", [], |z| z.get(0))
        .unwrap();
    assert_eq!(version, 1);
}

#[test]
fn import_der_wissensbasis_und_suche() {
    let mut conn = core::open_memory_db().unwrap();
    let report = core::import_knowledge_dir(&mut conn, &knowledge_dir()).expect("Import");
    assert!(report.artikel >= 38, "erwarte >= 38 Artikel, war {}", report.artikel);
    assert!(report.kategorien >= 9, "erwarte >= 9 Kategorien");
    assert!(report.uebersprungen.is_empty(), "übersprungen: {:?}", report.uebersprungen);

    // Synonyme laden
    let json = std::fs::read_to_string(
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../data/synonyms/synonyme.json"),
    )
    .unwrap();
    let anzahl = core::import_synonyms_json(&conn, &json).unwrap();
    assert!(anzahl > 20);

    // Kategorien & Artikel lesen
    let kategorien = core::list_categories(&conn).unwrap();
    assert!(kategorien.iter().any(|k| k.id == "fachwerker"));
    let artikel = core::list_articles(&conn, Some("fachwerker")).unwrap();
    assert_eq!(artikel.len(), 6);

    // Artikel vollständig laden
    let a = core::load_article(&conn, "fw-grundlagen").unwrap().expect("Artikel");
    assert!(a.inhalt_md.contains("Fachrichtungen"));
    assert!(!a.rechtsgrundlagen.is_empty());
    assert!(a.quelle.as_deref().unwrap_or("").contains("Netzwerkfassung"));

    // Direkte Suche
    let treffer = core::search_articles(&conn, "Mindestvergütung", 10).unwrap();
    assert!(treffer.iter().any(|t| t.id == "mindestverguetung"), "Treffer: {:?}",
        treffer.iter().map(|t| &t.id).collect::<Vec<_>>());
    assert!(treffer[0].schnipsel.contains("<mark>"));

    // Synonymsuche: „Gehalt" → Vergütung
    let treffer = core::search_articles(&conn, "gehalt", 10).unwrap();
    assert!(treffer.iter().any(|t| t.id == "mindestverguetung"));

    // Präfix: „fachwerk" → Fachwerker-Artikel
    let treffer = core::search_articles(&conn, "fachwerk", 10).unwrap();
    assert!(treffer.iter().any(|t| t.id.starts_with("fw-")));

    // UND-Verknüpfung zweier Begriffe
    let treffer = core::search_articles(&conn, "urlaub jugendliche", 10).unwrap();
    assert!(treffer.iter().any(|t| t.id == "urlaub"));

    // Leere/zu kurze Eingabe -> keine Treffer, kein Fehler
    assert!(core::search_articles(&conn, "  a ", 10).unwrap().is_empty());
    // Anführungszeichen dürfen die Anfrage nicht brechen
    assert!(core::search_articles(&conn, "\"urlaub\" OR", 10).is_ok());
}

#[test]
fn import_ist_idempotent() {
    let mut conn = core::open_memory_db().unwrap();
    core::import_knowledge_dir(&mut conn, &knowledge_dir()).unwrap();
    let vorher: i64 = conn.query_row("SELECT COUNT(*) FROM articles", [], |z| z.get(0)).unwrap();
    core::import_knowledge_dir(&mut conn, &knowledge_dir()).unwrap();
    let nachher: i64 = conn.query_row("SELECT COUNT(*) FROM articles", [], |z| z.get(0)).unwrap();
    assert_eq!(vorher, nachher, "Doppelimport darf nichts duplizieren");
    let fts: i64 = conn.query_row("SELECT COUNT(*) FROM articles_fts", [], |z| z.get(0)).unwrap();
    assert_eq!(fts, nachher, "FTS-Index muss 1:1 zu Artikeln passen");
}
