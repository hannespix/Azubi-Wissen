#!/usr/bin/env node
// quellen-md.mjs — erzeugt formulare/QUELLEN.md (Herkunftsnachweis aller
// lokalen Dateien) aus assets/js/quellen.js. Nach jeder Quellen-Änderung
// mit lokalen Dateien ausführen:  node tools/quellen-md.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const fenster = {};
new Function("window", readFileSync(join(REPO, "assets/js/quellen.js"), "utf8"))(fenster);
const E = fenster.QUELLEN.eintraege.filter((e) => e.datei);

let fehlend = 0;
for (const e of E) if (!existsSync(join(REPO, e.datei))) { console.error("FEHLT:", e.datei); fehlend++; }
if (fehlend) process.exit(1);

const zeilen = E.map((e) =>
  `| \`${e.datei.replace(/^formulare\//, "")}\` | ${e.titel} | ${e.herausgeber} | ${e.stand || "–"} | ${e.url || "–"} |`);

const md = `# Herkunft der lokalen Dateien

Automatisch aus assets/js/quellen.js erzeugt (node tools/quellen-md.mjs).
Amtliche Gesetzestexte, Verordnungen und Verwaltungsvorschriften sind nach
§ 5 UrhG gemeinfrei; BIBB-Hauptausschuss-Empfehlungen sind amtliche
Verlautbarungen (Veröffentlichung im Bundesanzeiger); Formulare der
zuständigen Stelle sind zur Verwendung im Ausbildungsverfahren bestimmt.
Stand der Sammlung: ${fenster.QUELLEN.stand || "siehe quellen.js"}.

| Datei | Titel | Herausgeber | Stand | Quelle |
|---|---|---|---|---|
${zeilen.join("\n")}
`;
writeFileSync(join(REPO, "formulare/QUELLEN.md"), md);
console.log(`OK -> formulare/QUELLEN.md (${E.length} lokale Dateien nachgewiesen)`);
