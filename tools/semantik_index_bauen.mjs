#!/usr/bin/env node
// semantik_index_bauen.mjs — erzeugt assets/daten/semantik-index.json:
// vorberechnete Embeddings aller Wissensartikel und FAQ für die
// semantische Suche des Assistenten (assets/js/semantik.js).
//
// Muss nur laufen, wenn sich Inhalte in wissen.js geändert haben.
// Benötigt einmalig:  npm i @huggingface/transformers   (Build-Werkzeug,
// KEINE Laufzeitabhängigkeit — zur Laufzeit ist alles vendored).
// Aufruf aus dem Repo-Stamm:  node tools/semantik_index_bauen.mjs
//
// Das Modell kommt aus assets/vendor/semantik/ (gleiche Gewichte wie im
// Browser); die dort wegen der GitHub-Dateigrenze gesplittete ONNX-Datei
// wird in ein Temp-Verzeichnis zusammengesetzt.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELL = "Xenova/multilingual-e5-small";
const VENDOR = path.join(REPO, "assets", "vendor", "semantik", "modell", MODELL);
const ZIEL = path.join(REPO, "assets", "daten", "semantik-index.json");

// ---- Bibliothek laden (aus Repo-node_modules oder dem Aufruf-Verzeichnis)
async function bibliothek() {
  try { return await import("@huggingface/transformers"); } catch (e) { /* weiter */ }
  for (const wurzel of [process.cwd(), REPO]) {
    for (const name of ["transformers.node.mjs", "transformers.mjs"]) {
      const p = path.join(wurzel, "node_modules", "@huggingface", "transformers", "dist", name);
      if (fs.existsSync(p)) return await import(pathToFileURL(p).href);
    }
  }
  console.error("@huggingface/transformers nicht gefunden — bitte `npm i @huggingface/transformers` ausführen.");
  process.exit(1);
}

// ---- Datenmodule des Werkzeugs einlesen (reine Datendateien ohne DOM)
function datenLaden() {
  const fenster = {};
  for (const datei of ["assets/js/wissen.js", "assets/js/nachschlag.js",
    "assets/js/vorlagen.js", "assets/js/checklisten.js", "assets/js/module.js"]) {
    const code = fs.readFileSync(path.join(REPO, datei), "utf8");
    new Function("window", code)(fenster);
  }
  return fenster;
}

// Querlink-/Fettsyntax für den Embedding-Text auflösen.
function klartext(s) {
  return String(s || "")
    .replace(/\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([a-z0-9-]+)\]\]/g, (m, id) => id.replace(/-/g, " "))
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ").trim();
}

// ---- Modellverzeichnis mit zusammengesetzter ONNX-Datei vorbereiten
function modellVorbereiten() {
  const teile = fs.readdirSync(path.join(VENDOR, "onnx"))
    .filter(n => /\.teil-[a-z]+$/.test(n)).sort();
  if (!teile.length) { console.error("Keine ONNX-Teile unter " + VENDOR); process.exit(1); }
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "semantik-modell-"));
  const ziel = path.join(temp, MODELL);
  fs.mkdirSync(path.join(ziel, "onnx"), { recursive: true });
  for (const n of ["config.json", "tokenizer.json", "tokenizer_config.json", "special_tokens_map.json"]) {
    fs.copyFileSync(path.join(VENDOR, n), path.join(ziel, n));
  }
  const aus = fs.createWriteStream(path.join(ziel, "onnx", "model_quantized.onnx"));
  for (const t of teile) aus.write(fs.readFileSync(path.join(VENDOR, "onnx", t)));
  return new Promise(res => aus.end(() => res(temp)));
}

const { pipeline, env } = await bibliothek();
const DATEN = datenLaden();
const W = DATEN.WISSEN;
if (!W || !W.artikel) { console.error("wissen.js lieferte kein window.WISSEN."); process.exit(1); }

env.allowRemoteModels = false;
env.localModelPath = await modellVorbereiten();
const einbetter = await pipeline("feature-extraction", MODELL, { dtype: "q8" });
async function einbetten(text) {
  const aus = await einbetter("passage: " + text, { pooling: "mean", normalize: true });
  return Array.from(aus.data, x => Math.round(x * 1e4) / 1e4);
}

const eintraege = [];
let nr = 0;
for (const a of W.artikel) {
  const text = klartext(a.titel + ". " + (a.kurz || "") +
    " Stichworte: " + (a.stichworte || []).join(", ") + ". " +
    (a.fakten || []).join(" ")).slice(0, 1600);
  eintraege.push({ typ: "artikel", id: a.id, titel: a.titel, v: await einbetten(text) });
  for (let i = 0; i < (a.faq || []).length; i++) {
    const f = a.faq[i];
    eintraege.push({ typ: "faq", id: a.id + "#" + i, artikelId: a.id, titel: f.f,
      v: await einbetten(klartext(f.f + " " + f.a).slice(0, 1200)) });
  }
  nr++;
  process.stdout.write(`\r${nr}/${W.artikel.length} Artikel eingebettet …`);
}
console.log("");

// ---- Werkzeug-Einträge (S1): Module, Nachschlag-Karten, Vorlagen und
// Checklisten — damit „Wo finde ich …?" auch frei formuliert trifft.
const werkzeuge = [];
for (const m of (DATEN.MODULE || [])) {
  werkzeuge.push({ art: m.art, id: "modul:" + (m.ziel || m.titel), titel: m.titel, ziel: m.ziel,
    text: `${m.titel}. ${m.info || ""} ${m.extra || ""}` });
}
for (const k of ((DATEN.NACHSCHLAG || {}).karten || [])) {
  werkzeuge.push({ art: k.rechner ? "Rechner" : "Nachschlag", id: "karte:" + k.id, titel: k.titel,
    ziel: "#/nachschlag?karte=" + k.id,
    text: `${k.titel}. ${(k.stichworte || []).join(", ")}. ${k.rechner ? "Rechner zum Ausrechnen im Schnellnachschlag." : "Tabelle im Schnellnachschlag."}` });
}
for (const v of ((DATEN.VORLAGEN || {}).vorlagen || [])) {
  werkzeuge.push({ art: "Vorlage", id: "vorlage:" + v.id, titel: v.titel, ziel: "#/vorlagen?id=" + v.id,
    text: `E-Mail-Vorlage, Anschreiben: ${v.titel}. Betreff: ${v.betreff || ""}. ${(v.stichworte || []).join(", ")}` });
}
for (const c of ((DATEN.CHECKLISTEN || {}).listen || [])) {
  werkzeuge.push({ art: "Checkliste", id: "liste:" + c.id, titel: c.titel, ziel: "#/checklisten?id=" + c.id,
    text: `Checkliste zum Abhaken: ${c.titel}. ${c.kurz || ""} ${(c.stichworte || []).join(", ")}` });
}
for (const w of werkzeuge) {
  eintraege.push({ typ: "werkzeug", art: w.art, id: w.id, titel: w.titel, ziel: w.ziel,
    v: await einbetten(klartext(w.text).slice(0, 800)) });
}
console.log(`${werkzeuge.length} Werkzeug-Einträge eingebettet.`);

const index = {
  format: "azubi-semantik-index", version: 2, modell: MODELL, dim: 384,
  praefixFrage: "query: ", stand: W.stand || "", eintraege
};
fs.mkdirSync(path.dirname(ZIEL), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify(index));
console.log(`OK -> ${ZIEL} (${(fs.statSync(ZIEL).size / 1024).toFixed(0)} KB, ${eintraege.length} Einträge)`);
