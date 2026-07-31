#!/usr/bin/env node
// export-wissen.mjs — überführt die Wissensbasis des Browsertools
// (assets/js/wissen.js) in die Markdown-Wissensbasis des Navigators
// (navigator/knowledge/<kategorie>/<id>.md) sowie die Synonymliste
// (navigator/data/synonyms/synonyme.json). Einmalige Migration + bei
// Bedarf wiederholbar (überschreibt deterministisch).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const hier = dirname(fileURLToPath(import.meta.url));
const repo = join(hier, "..", "..");
const zielWissen = join(hier, "..", "knowledge");
const zielSynonyme = join(hier, "..", "data", "synonyms", "synonyme.json");

// Wissensbasis laden (definiert window.WISSEN)
globalThis.window = {};
await import(join(repo, "assets", "js", "wissen.js"));
const W = globalThis.window.WISSEN;

// Synonymkarte aus app.js extrahieren (Objektliteral "var SYN = {...};")
const appJs = readFileSync(join(repo, "assets", "js", "app.js"), "utf8");
const synMatch = appJs.match(/var SYN = (\{[\s\S]*?\n  \});/);
if (!synMatch) throw new Error("SYN-Literal in app.js nicht gefunden");
const SYN = new Function("return " + synMatch[1])();

const y = (s) => JSON.stringify(String(s ?? ""));
const heute = "2026-07-31";

rmSync(zielWissen, { recursive: true, force: true });
let anzahl = 0;
for (const a of W.artikel) {
  const thema = W.themen.find((t) => t.id === a.thema);
  const fm = [
    "---",
    `id: ${y(a.id)}`,
    `title: ${y(a.titel)}`,
    `category: ${y(a.thema)}`,
    `category_title: ${y(thema?.titel ?? a.thema)}`,
    `summary: ${y(a.kurz)}`,
    `tags: [${(a.stichworte ?? []).map(y).join(", ")}]`,
    "legal_references:",
    ...(a.recht ?? []).map((r) => `  - ${y(`${r.n} — ${r.t}`)}`),
    `status: ${y("fachlich geprüft")}`,
    `reviewed_at: ${y(heute)}`,
    `region: ${y("Baden-Württemberg")}`,
    `source: ${y(a.quelle ?? "Azubi-Wissen v1 (Browsertool des RP Freiburg), Stand " + W.stand)}`,
    "---",
    "",
  ];

  const teile = [];
  teile.push("## Das Wichtigste in Kürze", "");
  for (const f of a.fakten ?? []) teile.push(`- ${f}`);
  teile.push("");
  for (const ab of a.abschnitte ?? []) {
    const marker = (ab.d ?? 2) >= 3 ? " *(ausführlich)*" : "";
    teile.push(`## ${ab.t}${marker}`, "", ab.text.trim(), "");
  }
  if (a.rollen) {
    teile.push("## Praxishinweise", "");
    const rollen = [["azubi", "Für Auszubildende"], ["betrieb", "Für Betriebe"], ["beratung", "Für die Ausbildungsberatung"]];
    for (const [k, titel] of rollen) {
      if (a.rollen[k]) teile.push(`### ${titel}`, "", a.rollen[k].trim(), "");
    }
  }
  if ((a.faq ?? []).length) {
    teile.push("## Häufige Fragen", "");
    for (const f of a.faq) teile.push(`### ${f.f}`, "", f.a.trim(), "");
  }
  if ((a.verwandt ?? []).length) {
    teile.push("## Verwandte Artikel", "");
    for (const id of a.verwandt) {
      const v = W.artikel.find((x) => x.id === id);
      if (v) teile.push(`- ${v.titel} (\`${id}\`)`);
    }
    teile.push("");
  }

  const ordner = join(zielWissen, a.thema);
  mkdirSync(ordner, { recursive: true });
  writeFileSync(join(ordner, `${a.id}.md`), fm.join("\n") + teile.join("\n"));
  anzahl++;
}

// Synonyme: normalisierte Schreibweise beibehalten (Suche normalisiert selbst)
mkdirSync(dirname(zielSynonyme), { recursive: true });
writeFileSync(zielSynonyme, JSON.stringify(SYN, null, 2) + "\n");

console.log(`OK: ${anzahl} Artikel → knowledge/, ${Object.keys(SYN).length} Synonymgruppen → data/synonyms/`);
