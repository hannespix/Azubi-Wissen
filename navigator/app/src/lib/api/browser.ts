// Browser-Vorschau-Treiber: SQLite als WASM (sql.js) im Speicher.
// Nutzt dieselben Migrationen (@core) und dieselbe Wissensbasis
// (@knowledge) wie die Rust-Seite. Fällt ohne FTS5 auf eine einfache
// LIKE-Suche zurück und kennzeichnet das im Modus.
import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { parse as yamlParse } from "yaml";
import migration0001 from "@core/migrations/0001_init.sql?raw";
import synonyme from "@data/synonyms/synonyme.json";
import type { Article, ArticleSummary, Category, DataProvider, SearchHit } from "@/lib/types";

const wissenDateien = import.meta.glob("@knowledge/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

interface Frontmatter {
  id: string;
  title: string;
  category: string;
  category_title?: string;
  summary?: string;
  tags?: string[];
  legal_references?: string[];
  status?: string;
  reviewed_at?: string;
  region?: string;
  source?: string;
}

function frontmatterTeilen(text: string): { fm: Frontmatter; body: string } | null {
  if (!text.startsWith("---")) return null;
  const ende = text.indexOf("\n---", 3);
  if (ende < 0) return null;
  const fm = yamlParse(text.slice(3, ende)) as Frontmatter;
  const body = text.slice(ende + 4).replace(/^\r?\n/, "");
  if (!fm?.id || !fm?.title) return null;
  return { fm, body };
}

/** Diakritika-Normalisierung mit 1:1-Zeichenlänge (für Snippet-Positionen). */
function normalisieren(t: string): string {
  return t
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "s");
}

interface SuchDok {
  id: string; titel: string; kurz: string; inhalt: string;
  titelN: string; kurzN: string; inhaltN: string;
  kategorie_id: string; kategorie_titel: string; status: string;
}
const suchCache: SuchDok[] = [];

let ftsVerfuegbar = true;

function migrationAusfuehren(db: Database) {
  // Statement-weise ausführen: Fehlt FTS5 im sql.js-Build, wird nur das
  // betroffene Statement übersprungen (Suche fällt auf LIKE zurück) —
  // alle übrigen Tabellen entstehen genau einmal.
  const statements = migration0001
    .split(/;\s*(?:\n|$)/)
    .map((s) =>
      s
        .split("\n")
        .filter((zeile) => !zeile.trim().startsWith("--"))
        .join("\n")
        .trim()
    )
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    try {
      db.run(stmt + ";");
    } catch (e) {
      if (/VIRTUAL TABLE/i.test(stmt)) {
        ftsVerfuegbar = false;
        console.warn("Browser-Vorschau ohne FTS5 — Suche nutzt LIKE-Fallback.");
      } else {
        throw e;
      }
    }
  }
}

function importieren(db: Database) {
  const einf = db.prepare(
    `INSERT INTO articles (id, titel, kurz, kategorie_id, status, geprueft_am, region, quelle, inhalt_md)
     VALUES (?,?,?,?,?,?,?,?,?)`
  );
  const kat = db.prepare(
    `INSERT INTO categories (id, titel) VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET titel = excluded.titel`
  );
  for (const [pfad, text] of Object.entries(wissenDateien)) {
    const teile = frontmatterTeilen(text);
    if (!teile) {
      console.warn("Übersprungen (Frontmatter fehlt):", pfad);
      continue;
    }
    const { fm, body } = teile;
    kat.run([fm.category, fm.category_title ?? fm.category]);
    einf.run([
      fm.id, fm.title, fm.summary ?? "", fm.category, fm.status ?? "ungeprüft",
      fm.reviewed_at ?? null, fm.region ?? null, fm.source ?? null, body,
    ]);
    for (const tag of fm.tags ?? []) {
      db.run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [tag]);
      db.run(
        "INSERT OR IGNORE INTO article_tags (article_id, tag_id) SELECT ?, id FROM tags WHERE name = ?",
        [fm.id, tag]
      );
    }
    for (const eintrag of fm.legal_references ?? []) {
      const [norm, titel = ""] = eintrag.split(" — ").map((s) => s.trim());
      db.run("INSERT OR IGNORE INTO legal_references (norm, titel) VALUES (?, ?)", [norm, titel]);
      db.run(
        "INSERT OR IGNORE INTO article_legal_refs (article_id, ref_id) SELECT ?, id FROM legal_references WHERE norm = ? AND titel = ?",
        [fm.id, norm, titel]
      );
    }
    if (ftsVerfuegbar) {
      db.run(
        `INSERT INTO articles_fts (rowid, titel, kurz, inhalt, tags)
         SELECT rowid, ?, ?, ?, ? FROM articles WHERE id = ?`,
        [fm.title, fm.summary ?? "", body, (fm.tags ?? []).join(" "), fm.id]
      );
    }
    const inhaltMitTags = body + "\n" + (fm.tags ?? []).join(" ");
    suchCache.push({
      id: fm.id, titel: fm.title, kurz: fm.summary ?? "", inhalt: inhaltMitTags,
      titelN: normalisieren(fm.title), kurzN: normalisieren(fm.summary ?? ""),
      inhaltN: normalisieren(inhaltMitTags),
      kategorie_id: fm.category, kategorie_titel: fm.category_title ?? fm.category,
      status: fm.status ?? "ungeprüft",
    });
  }
  einf.free();
  kat.free();
  for (const [begriff, liste] of Object.entries(synonyme as Record<string, string[]>)) {
    for (const syn of liste) {
      db.run("INSERT OR IGNORE INTO search_synonyms (begriff, synonym) VALUES (?, ?)", [begriff, syn]);
    }
  }
}

function alle<T>(db: Database, sql: string, params: unknown[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params as never[]);
  const zeilen: T[] = [];
  while (stmt.step()) zeilen.push(stmt.getAsObject() as T);
  stmt.free();
  return zeilen;
}

function matchAnfrage(db: Database, eingabe: string): string | null {
  const gruppen: string[] = [];
  for (const roh of eingabe.split(/\s+/).slice(0, 8)) {
    const token = roh.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
    if (token.length < 2) continue;
    const alternativen = [`"${token}"*`];
    const syns = alle<{ s: string }>(
      db,
      "SELECT synonym AS s FROM search_synonyms WHERE begriff = ? UNION SELECT begriff FROM search_synonyms WHERE synonym = ?",
      [token, token]
    );
    for (const { s } of syns) {
      for (const wort of s.split(/\s+/)) {
        const sauber = wort.replace(/[^\p{L}\p{N}]/gu, "");
        if (sauber.length >= 2) alternativen.push(`"${sauber}"*`);
      }
    }
    gruppen.push(`(${[...new Set(alternativen)].join(" OR ")})`);
  }
  return gruppen.length ? gruppen.join(" AND ") : null;
}

export async function browserProvider(): Promise<DataProvider> {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const db = new SQL.Database();
  db.run("PRAGMA foreign_keys = ON");
  migrationAusfuehren(db);
  importieren(db);

  return {
    modus: "browser",
    async listCategories() {
      return alle<Category>(
        db,
        `SELECT c.id, c.titel, c.beschreibung,
                (SELECT COUNT(*) FROM articles a WHERE a.kategorie_id = c.id) AS artikel_anzahl
         FROM categories c ORDER BY c.sortierung, c.titel`
      );
    },
    async listArticles(kategorie) {
      return alle<ArticleSummary>(
        db,
        `SELECT a.id, a.titel, a.kurz, a.kategorie_id, c.titel AS kategorie_titel, a.status, a.geprueft_am
         FROM articles a JOIN categories c ON c.id = a.kategorie_id
         WHERE (? IS NULL OR a.kategorie_id = ?)
         ORDER BY c.titel, a.titel`,
        [kategorie ?? null, kategorie ?? null]
      );
    },
    async getArticle(id) {
      const zeilen = alle<Article>(
        db,
        `SELECT a.id, a.titel, a.kurz, a.kategorie_id, c.titel AS kategorie_titel, a.status,
                a.geprueft_am, a.region, a.quelle, a.inhalt_md
         FROM articles a JOIN categories c ON c.id = a.kategorie_id WHERE a.id = ?`,
        [id]
      );
      if (!zeilen.length) return null;
      const artikel = zeilen[0];
      artikel.tags = alle<{ name: string }>(
        db,
        "SELECT t.name FROM tags t JOIN article_tags at ON at.tag_id = t.id WHERE at.article_id = ? ORDER BY t.name",
        [id]
      ).map((z) => z.name);
      artikel.rechtsgrundlagen = alle<{ r: string }>(
        db,
        `SELECT CASE WHEN l.titel = '' THEN l.norm ELSE l.norm || ' — ' || l.titel END AS r
         FROM legal_references l JOIN article_legal_refs x ON x.ref_id = l.id
         WHERE x.article_id = ? ORDER BY l.norm`,
        [id]
      ).map((z) => z.r);
      return artikel;
    },
    async searchArticles(eingabe, limit = 20) {
      if (ftsVerfuegbar) {
        const anfrage = matchAnfrage(db, eingabe);
        if (!anfrage) return [];
        return alle<SearchHit>(
          db,
          `SELECT a.id, a.titel, a.kategorie_id, c.titel AS kategorie_titel, a.status,
                  snippet(articles_fts, 2, '<mark>', '</mark>', ' … ', 14) AS schnipsel
           FROM articles_fts f JOIN articles a ON a.rowid = f.rowid
           JOIN categories c ON c.id = a.kategorie_id
           WHERE articles_fts MATCH ? ORDER BY bm25(articles_fts, 8.0, 4.0, 1.0, 4.0) LIMIT ?`,
          [anfrage, limit]
        );
      }
      // Fallback ohne FTS5: normalisierte In-Memory-Suche über den Cache
      // (Synonyme, UND über Tokens, Feldgewichtung Titel > Kurz > Inhalt).
      const gruppen: string[][] = [];
      for (const roh of eingabe.split(/\s+/).slice(0, 8)) {
        const token = normalisieren(roh.replace(/[^\p{L}\p{N}]/gu, ""));
        if (token.length < 2) continue;
        const alternativen = new Set([token]);
        for (const { s } of alle<{ s: string }>(
          db,
          "SELECT synonym AS s FROM search_synonyms WHERE begriff = ? UNION SELECT begriff FROM search_synonyms WHERE synonym = ?",
          [token, token]
        )) {
          for (const wort of s.split(/\s+/)) {
            const sauber = normalisieren(wort.replace(/[^\p{L}\p{N}]/gu, ""));
            if (sauber.length >= 2) alternativen.add(sauber);
          }
        }
        gruppen.push([...alternativen]);
      }
      if (!gruppen.length) return [];

      const treffer: (SearchHit & { rang: number })[] = [];
      for (const dok of suchCache) {
        let rang = 0;
        let passt = true;
        for (const alternativen of gruppen) {
          let bestes = 0;
          for (const alt of alternativen) {
            if (dok.titelN.includes(alt)) { bestes = Math.max(bestes, 4); break; }
            if (dok.kurzN.includes(alt)) bestes = Math.max(bestes, 2);
            else if (dok.inhaltN.includes(alt)) bestes = Math.max(bestes, 1);
          }
          if (!bestes) { passt = false; break; }
          rang += bestes;
        }
        if (!passt) continue;

        // Snippet: erste Fundstelle (Kurztext bevorzugt), Markdown-Zeichen entfernt
        let schnipsel = dok.kurz.slice(0, 160);
        aussen: for (const alternativen of gruppen) {
          for (const alt of alternativen) {
            for (const [textN, text] of [[dok.kurzN, dok.kurz], [dok.inhaltN, dok.inhalt]] as const) {
              const idx = textN.indexOf(alt);
              if (idx >= 0) {
                const start = Math.max(0, idx - 60);
                const vor = text.slice(start, idx).replace(/[*_#>`]/g, "");
                const wort = text.slice(idx, idx + alt.length);
                const nach = text.slice(idx + alt.length, idx + alt.length + 90).replace(/[*_#>`]/g, "");
                schnipsel = `${start > 0 ? "… " : ""}${vor}<mark>${wort}</mark>${nach} …`;
                break aussen;
              }
            }
          }
        }
        treffer.push({
          id: dok.id, titel: dok.titel, kategorie_id: dok.kategorie_id,
          kategorie_titel: dok.kategorie_titel, status: dok.status, schnipsel, rang,
        });
      }
      treffer.sort((a, b) => b.rang - a.rang || a.titel.localeCompare(b.titel, "de"));
      return treffer.slice(0, limit).map(({ rang: _r, ...rest }) => rest);
    },
  };
}
