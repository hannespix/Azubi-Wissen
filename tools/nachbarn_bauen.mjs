#!/usr/bin/env node
// nachbarn_bauen.mjs — erzeugt assets/js/nachbarn.js: die nächsten
// inhaltlichen Nachbarn jedes Index-Eintrags, beim Bauen ausgerechnet (N2).
//
// Warum getrennt vom Index-Bau: Das Rechnen braucht nur die fertigen
// Vektoren aus assets/daten/semantik-index.json — kein Modell, keine
// npm-Abhängigkeit, Laufzeit ein paar Sekunden statt zehn Minuten.
// semantik_index_bauen.mjs ruft diesen Schritt am Ende selbst auf; von Hand:
//   node tools/nachbarn_bauen.mjs            (Bericht + Datei schreiben)
//   node tools/nachbarn_bauen.mjs --bericht  (nur messen, nichts schreiben)
//
// Der Nutzen: „Passt inhaltlich dazu“ steht damit ohne den 150-MB-Download
// des Modells bereit — auch in der Einzeldatei, wo die Bedeutungssuche
// abgeschaltet ist.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = path.join(REPO, "assets", "daten", "semantik-index.json");
const ZIEL = path.join(REPO, "assets", "js", "nachbarn.js");

// Wie viele Nachbarn je Eintrag und wie viele je Art. Die Deckelung je Art
// erzwingt die Mischung: sonst hängen an einem Prüfungsartikel sechs
// Paragrafen und keine einzige Vorlage.
const MAX = 6;
const PRO_ART = 2;
// Gemessen, nicht geraten. Zwei beliebige Einträge ähneln sich im Median mit
// 0,840, im 99. Perzentil mit 0,919 — das Modell setzt alles in derselben
// Fachsprache dicht beieinander. Die Auswahl trifft deshalb die Rangfolge;
// die Schwelle schneidet nur den Rest ab. In den Stichproben (Probezeit,
// Berichtsheft, Abschlussprüfung, § 21 BBiG, Externenprüfung) trägt der
// letzte brauchbare Treffer 0,899, der erste unpassende 0,898 — daher 0,90.
const SCHWELLE = 0.90;

// Nur diese Arten bekommen eine eigene Zeile in der Oberfläche. Ziel von
// Nachbarschaft können alle sein — eine Frage taucht als Nachbar auf, hat
// aber keine eigene Seite, an der eine Zeile stünde.
const MIT_ZEILE = new Set(["artikel", "werkzeug", "paragraf", "quelle"]);
// Die Modul-Einträge (Startseite, Download-Center …) sind Wegweiser für den
// Assistenten („Wo finde ich …?“), keine Inhalte. Als Nachbar wären sie eine
// Rückfahrkarte ins Menü — und zwei von ihnen teilen sich ohnehin ein Ziel.
const ausgeschlossen = e => e.typ === "werkzeug" && e.id.slice(0, 6) === "modul:";

// Schlüssel = wie die Oberfläche den Eintrag wiederfindet. Werkzeug-Einträge
// tragen ihr Präfix schon in der ID („vorlage:…“, „liste:…“, „karte:…“,
// „modul:…“), alle anderen bekommen ihre Art vorangestellt.
function schluessel(e) {
  return e.typ === "werkzeug" ? e.id : e.typ + ":" + e.id;
}
// Art für die Deckelung: Artikel und ihre Fragen zählen zusammen, sonst
// verdrängen drei Fragen desselben Themas alles andere.
function art(e) {
  if (e.typ === "faq") return "artikel";
  if (e.typ === "werkzeug") return e.id.split(":")[0];
  return e.typ;
}
// Zu welchem Artikel gehört der Eintrag (für die Entdopplung).
function heimat(e) {
  return e.typ === "faq" ? e.artikelId : e.typ === "artikel" ? e.id : null;
}

const idx = JSON.parse(fs.readFileSync(INDEX, "utf8"));
const E = idx.eintraege;
if (!E || !E.length) { console.error("Kein Index unter " + INDEX); process.exit(1); }

// Vektoren in einen flachen Float32Array — 644 × 384 Werte lassen sich so
// deutlich schneller multiplizieren als über Objekt-Arrays.
const DIM = idx.dim || E[0].v.length;
const V = new Float32Array(E.length * DIM);
E.forEach((e, i) => V.set(e.v, i * DIM));

const alleWerte = [];
const nachbarn = {};
let mitNachbarn = 0, summe = 0;

for (let i = 0; i < E.length; i++) {
  if (!MIT_ZEILE.has(E[i].typ) || ausgeschlossen(E[i])) continue;
  const meinHeim = heimat(E[i]), meinSchluessel = schluessel(E[i]);
  const kandidaten = [];
  for (let j = 0; j < E.length; j++) {
    if (j === i || ausgeschlossen(E[j])) continue;
    // Eigene Fragen bzw. der eigene Artikel stehen ohnehin auf derselben
    // Seite — als „passt dazu“ wären sie ein Zirkelschluss.
    if (meinHeim && heimat(E[j]) === meinHeim) continue;
    let s = 0;
    const a = i * DIM, b = j * DIM;
    for (let d = 0; d < DIM; d++) s += V[a + d] * V[b + d];
    kandidaten.push({ j, s });
  }
  kandidaten.sort((x, y) => y.s - x.s);
  if (kandidaten.length) alleWerte.push(kandidaten[0].s);

  const gewaehlt = [], jeArt = {}, jeHeimat = {};
  for (const k of kandidaten) {
    if (gewaehlt.length >= MAX || k.s < SCHWELLE) break;
    const e = E[k.j], a = art(e), hm = heimat(e);
    if ((jeArt[a] || 0) >= PRO_ART) continue;
    // Höchstens ein Treffer je Artikel: entweder der Artikel oder eine
    // seiner Fragen, nicht beides.
    if (hm && jeHeimat[hm]) continue;
    jeArt[a] = (jeArt[a] || 0) + 1;
    if (hm) jeHeimat[hm] = 1;
    gewaehlt.push(schluessel(e));
  }
  if (gewaehlt.length) { nachbarn[meinSchluessel] = gewaehlt; mitNachbarn++; summe += gewaehlt.length; }
}

// ---- Bericht: der Schwellenwert soll nachvollziehbar sein --------------
alleWerte.sort((a, b) => a - b);
const p = q => alleWerte[Math.min(alleWerte.length - 1, Math.round(q * (alleWerte.length - 1)))];
const zeilen = E.filter(e => MIT_ZEILE.has(e.typ) && !ausgeschlossen(e)).length;
console.log(`Beste Ähnlichkeit je Eintrag: Minimum ${p(0).toFixed(3)}, ` +
  `25 % ${p(0.25).toFixed(3)}, Median ${p(0.5).toFixed(3)}, 75 % ${p(0.75).toFixed(3)}, Maximum ${p(1).toFixed(3)}`);
console.log(`Schwelle ${SCHWELLE}: ${mitNachbarn} von ${zeilen} Einträgen mit Zeile ` +
  `(${(100 * mitNachbarn / zeilen).toFixed(0)} %), im Schnitt ${(summe / (mitNachbarn || 1)).toFixed(1)} Nachbarn.`);
if (process.argv.includes("--bericht")) process.exit(0);

const kopf = `// nachbarn.js — ERZEUGT von tools/nachbarn_bauen.mjs, nicht von Hand ändern.
// Die nächsten inhaltlichen Nachbarn jedes Eintrags, beim Bauen aus den
// Vektoren von assets/daten/semantik-index.json gerechnet (N2). Dadurch
// zeigt die Oberfläche „Passt inhaltlich dazu“ ohne Modell-Download — auch
// in der Einzeldatei, wo die Bedeutungssuche abgeschaltet ist.
// Schlüssel und Werte sind Ziele: artikel:<id> · faq:<artikel>#<nr> ·
// paragraf:<werk>-<nr> · vorlage:<id> · liste:<id> · karte:<id> ·
// modul:<ziel> · quelle:<id>. Aufgelöst wird in app.js (nachbarZiel).
// Neu bauen nach jeder Inhaltsänderung:
//   node tools/semantik_index_bauen.mjs   (baut Index und Nachbarn)
//   node tools/nachbarn_bauen.mjs         (nur Nachbarn, wenige Sekunden)
`;
const koerper = Object.keys(nachbarn).sort().map(k =>
  "  " + JSON.stringify(k) + ": " + JSON.stringify(nachbarn[k])).join(",\n");
fs.writeFileSync(ZIEL, kopf + `window.NACHBARN = {
  format: "azubi-nachbarn", version: 1, modell: ${JSON.stringify(idx.modell || "")},
  stand: ${JSON.stringify(idx.stand || "")}, schwelle: ${SCHWELLE}, max: ${MAX}, proArt: ${PRO_ART},
  eintraege: {
${koerper}
  }
};
`);
console.log(`OK -> ${ZIEL} (${(fs.statSync(ZIEL).size / 1024).toFixed(0)} KB, ${mitNachbarn} Einträge)`);
