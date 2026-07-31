#!/usr/bin/env node
// validate-content.mjs — prüft die Markdown-Wissensbasis (Frontmatter-Pflicht-
// felder, eindeutige IDs, gültige Daten). Läuft lokal und im CI.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..", "knowledge");
const PFLICHT = ["id", "title", "category", "summary", "status", "reviewed_at"];
const STATUS = new Set(["Entwurf", "ungeprüft", "fachlich geprüft", "rechtlich geprüft", "regional bestätigt", "veraltet", "archiviert"]);

function* mdDateien(dir) {
  for (const name of readdirSync(dir)) {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) yield* mdDateien(pfad);
    else if (name.endsWith(".md")) yield pfad;
  }
}

// Bewusst schlanker Frontmatter-Leser (nur die hier genutzte Teilmenge von
// YAML: Skalare in Anführungszeichen, Listen in [] oder als "- "-Blöcke).
function frontmatter(text) {
  if (!text.startsWith("---")) return null;
  const ende = text.indexOf("\n---", 3);
  if (ende < 0) return null;
  const fm = {};
  let listenSchluessel = null;
  for (const zeile of text.slice(3, ende).split("\n")) {
    const listen = zeile.match(/^\s+-\s+(.*)$/);
    if (listen && listenSchluessel) {
      fm[listenSchluessel].push(JSON.parse(listen[1]));
      continue;
    }
    const kv = zeile.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    if (v === "") { fm[k] = []; listenSchluessel = k; continue; }
    listenSchluessel = null;
    fm[k] = v.startsWith("[") ? JSON.parse(v.replace(/'/g, '"')) : JSON.parse(v);
  }
  return fm;
}

const ids = new Map();
const fehler = [];
let anzahl = 0;
for (const pfad of mdDateien(wurzel)) {
  anzahl++;
  const rel = relative(wurzel, pfad);
  let fm;
  try {
    fm = frontmatter(readFileSync(pfad, "utf8"));
  } catch (e) {
    fehler.push(`${rel}: Frontmatter nicht lesbar (${e.message})`);
    continue;
  }
  if (!fm) { fehler.push(`${rel}: Frontmatter fehlt`); continue; }
  for (const k of PFLICHT) if (!fm[k]) fehler.push(`${rel}: Pflichtfeld „${k}" fehlt`);
  if (fm.id) {
    if (ids.has(fm.id)) fehler.push(`${rel}: ID „${fm.id}" doppelt (auch in ${ids.get(fm.id)})`);
    ids.set(fm.id, rel);
  }
  if (fm.status && !STATUS.has(fm.status)) fehler.push(`${rel}: unbekannter Status „${fm.status}"`);
  if (fm.reviewed_at && !/^\d{4}-\d{2}-\d{2}$/.test(fm.reviewed_at)) fehler.push(`${rel}: reviewed_at nicht im Format JJJJ-MM-TT`);
  if (!fm.category_title) fehler.push(`${rel}: category_title fehlt (Anzeigename der Kategorie)`);
}

if (fehler.length) {
  console.error(`Inhaltsprüfung FEHLGESCHLAGEN (${fehler.length} Problem(e) in ${anzahl} Dateien):`);
  for (const f of fehler) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`Inhaltsprüfung OK — ${anzahl} Artikel, ${ids.size} eindeutige IDs.`);
