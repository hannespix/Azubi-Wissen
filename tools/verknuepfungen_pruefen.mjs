#!/usr/bin/env node
// verknuepfungen_pruefen.mjs — Redaktionswerkzeug für die Inhaltspflege (N3).
//
// Meldet, was inhaltlich zusammengehört, aber nicht verknüpft ist:
//   1. Artikelpaare ohne Querverweis      → [[artikel-id]] bzw. `verwandt`
//   2. Normen ohne Zitat im Artikel       → §-Zitat in Fakten/Abschnitten
//   3. Dokumente ohne Artikelzuordnung    → `artikel: [...]` in quellen.js
//   4. Artikel mit Themen-Drift (N4)      → Themenbereich prüfen
//
// Das Ergebnis ist ein **Bericht für Menschen**, keine Automatik: das
// Werkzeug ändert nichts und taucht in der Oberfläche nicht auf. Ob ein
// Vorschlag ein echter Verweis wird, entscheidet die Redaktion.
//
// Grundlage sind die fertigen Vektoren aus assets/daten/semantik-index.json
// — kein Modell, keine npm-Abhängigkeit, Laufzeit ein paar Sekunden.
//   node tools/verknuepfungen_pruefen.mjs            (voller Bericht)
//   node tools/verknuepfungen_pruefen.mjs --top 10   (je Abschnitt kürzen)
//   node tools/verknuepfungen_pruefen.mjs --md       (Markdown zum Ablegen)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = path.join(REPO, "assets", "daten", "semantik-index.json");

// ---- Schwellenwerte -----------------------------------------------------
// Das Modell setzt alles in derselben Fachsprache dicht beieinander: zwei
// beliebige Einträge ähneln sich im Median mit rund 0,84. Ein absoluter Wert
// sagt deshalb wenig — entscheidend ist, wo er in der jeweiligen Verteilung
// liegt. Abschnitt 5 des Berichts misst alle drei Verteilungen mit und nennt
// die Perzentile der gewählten Werte; wer die Liste länger haben will, senkt
// hier ab und sieht sofort, wie viel Rauschen dazukommt.
//
// Die Werte sind so gewählt, dass jede Liste in einer Sitzung durchgehbar
// bleibt (Stand Inhalte Juli 2026: 14 Paare, 9 Artikel, 5 Dokumente):
//   0,92 bei Artikelpaaren liefert nichts mehr — die Querverlinkung aus R2
//   sitzt. Erst 0,90 bringt wieder Kandidaten.
const S_ARTIKEL = 0.90;   // Artikel ↔ Artikel
const S_NORM = 0.91;      // Artikel ↔ Paragraf
const S_DOKUMENT = 0.90;  // Artikel ↔ Quelle (Beschreibungen sind knapper)

const argv = process.argv.slice(2);
const MD = argv.includes("--md");
const TOP = (() => {
  const i = argv.indexOf("--top");
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : Infinity;
})();

// ---- Daten --------------------------------------------------------------
const fenster = {};
for (const datei of ["assets/js/wissen.js", "assets/js/quellen.js"]) {
  new Function("window", fs.readFileSync(path.join(REPO, datei), "utf8"))(fenster);
}
const W = fenster.WISSEN, Q = fenster.QUELLEN;
const idx = JSON.parse(fs.readFileSync(INDEX, "utf8"));
const E = idx.eintraege, DIM = idx.dim || E[0].v.length;
const V = new Float32Array(E.length * DIM);
E.forEach((e, i) => V.set(e.v, i * DIM));
const sim = (i, j) => {
  let s = 0; const a = i * DIM, b = j * DIM;
  for (let d = 0; d < DIM; d++) s += V[a + d] * V[b + d];
  return s;
};
const platz = {};
E.forEach((e, i) => { platz[(e.typ === "werkzeug" ? e.id : e.typ + ":" + e.id)] = i; });

const ARTIKEL = W.artikel;
const artVon = {}; ARTIKEL.forEach(a => { artVon[a.id] = a; });
const themaName = {}; (W.themen || []).forEach(t => { themaName[t.id] = t.titel; });

// Der ganze Text eines Artikels — daraus lesen wir Querverweise und Zitate.
// `recht` ist eine Liste von Rechtsgrundlagen ({n: "§ 8 JArbSchG", t: "…"}),
// also genau die Stelle, an der die Normen stehen: sie muss mit hinein,
// sonst meldet der Bericht zitierte Normen als fehlend.
function volltext(a) {
  const teile = [a.titel || "", a.kurz || "", (a.fakten || []).join(" ")];
  (a.recht || []).forEach(r => teile.push(typeof r === "string" ? r : (r.n || "") + " " + (r.t || "")));
  (a.abschnitte || []).forEach(s => teile.push(s.t || "", s.text || ""));
  (a.rollen ? Object.values(a.rollen) : []).forEach(r => teile.push(String(r)));
  (a.faq || []).forEach(f => teile.push(f.f || "", f.a || ""));
  return teile.join(" \n ");
}
const text = {}; ARTIKEL.forEach(a => { text[a.id] = volltext(a); });

// Verknüpft = Querverweis in eine der beiden Richtungen oder `verwandt`.
// (Die Oberfläche symmetrisiert `verwandt` ohnehin.)
function verknuepft(a, b) {
  if ((a.verwandt || []).indexOf(b.id) >= 0 || (b.verwandt || []).indexOf(a.id) >= 0) return true;
  const linkA = new RegExp("\\[\\[" + b.id + "(\\||\\]\\])").test(text[a.id]);
  const linkB = new RegExp("\\[\\[" + a.id + "(\\||\\]\\])").test(text[b.id]);
  return linkA || linkB;
}

// ---- 1. Artikelpaare ohne Querverweis -----------------------------------
const paare = [];
const alleArtikelWerte = [];
for (let x = 0; x < ARTIKEL.length; x++) {
  for (let y = x + 1; y < ARTIKEL.length; y++) {
    const i = platz["artikel:" + ARTIKEL[x].id], j = platz["artikel:" + ARTIKEL[y].id];
    if (i === undefined || j === undefined) continue;
    const s = sim(i, j);
    alleArtikelWerte.push(s);
    if (s >= S_ARTIKEL && !verknuepft(ARTIKEL[x], ARTIKEL[y])) {
      paare.push({ s, a: ARTIKEL[x], b: ARTIKEL[y] });
    }
  }
}
paare.sort((p, q) => q.s - p.s);

// ---- 2. Normen, die der Artikel nie zitiert -----------------------------
// Zitate stehen im Werkzeug in allen üblichen Formen: „§ 8 JArbSchG",
// „§ 22 Abs. 1 BBiG", „§§ 34–36 BBiG", „§§ 22, 23 JArbSchG". Alle werden zu
// Schlüsseln „nr|WERK" aufgelöst — Bereiche ausgeschrieben, damit § 35 als
// zitiert gilt, wenn der Artikel „§§ 34–36 BBiG" nennt.
const ZITAT = /§{1,2}\s?(\d+[a-z]?(?:\s*(?:[–—-]|bis)\s*\d+[a-z]?)?(?:\s*,\s*\d+[a-z]?)*)((?:\s+(?:Abs|Satz|Nr|Halbsatz|lit)\.?\s*[\da-z]+)*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß]{2,})/g;
function zitierteNormen(s) {
  const raus = new Set();
  let m;
  ZITAT.lastIndex = 0;
  while ((m = ZITAT.exec(s))) {
    const werk = m[3];
    for (const stueck of m[1].split(",")) {
      const bereich = stueck.split(/\s*(?:[–—-]|bis)\s*/).map(x => x.trim()).filter(Boolean);
      if (bereich.length === 2 && /^\d+$/.test(bereich[0]) && /^\d+$/.test(bereich[1])) {
        for (let n = Number(bereich[0]); n <= Number(bereich[1]); n++) raus.add(n + "|" + werk);
      } else if (bereich[0]) {
        raus.add(bereich[0].trim() + "|" + werk);
      }
    }
  }
  return raus;
}
const zitate = {}; ARTIKEL.forEach(a => { zitate[a.id] = zitierteNormen(text[a.id]); });

const normen = [];
const alleNormWerte = [];
for (const a of ARTIKEL) {
  const i = platz["artikel:" + a.id];
  if (i === undefined) continue;
  const treffer = [];
  E.forEach((e, j) => {
    if (e.typ !== "paragraf") return;
    const s = sim(i, j);
    alleNormWerte.push(s);
    if (s < S_NORM) return;
    const m = /^§ (\S+) (\S+)/.exec(e.titel);
    if (!m || zitate[a.id].has(m[1] + "|" + m[2])) return;
    treffer.push({ s, titel: e.titel, ziel: e.ziel });
  });
  treffer.sort((x, y) => y.s - x.s);
  if (treffer.length) normen.push({ a, treffer: treffer.slice(0, 3) });
}
normen.sort((x, y) => y.treffer[0].s - x.treffer[0].s);

// ---- 3. Dokumente ohne Artikelzuordnung ---------------------------------
const dokumente = [];
const alleDokumentWerte = [];
for (const q of (Q.eintraege || [])) {
  const i = platz["quelle:" + q.id];
  if (i === undefined) continue;
  const treffer = [];
  for (const a of ARTIKEL) {
    const j = platz["artikel:" + a.id];
    if (j === undefined) continue;
    const s = sim(i, j);
    alleDokumentWerte.push(s);
    if ((q.artikel || []).indexOf(a.id) >= 0) continue;
    if (s >= S_DOKUMENT) treffer.push({ s, a });
  }
  treffer.sort((x, y) => y.s - x.s);
  if (treffer.length) dokumente.push({ q, treffer: treffer.slice(0, 3) });
}
dokumente.sort((x, y) => y.treffer[0].s - x.treffer[0].s);

// ---- 4. Themen-Drift (N4) ----------------------------------------------
// Kein Cluster-Verfahren, sondern die einfache Frage: Liegt ein Artikel im
// Schnitt näher an einem fremden Themenbereich als an seinem eigenen? Das
// ist ein Redaktionshinweis — die neun Bereiche sind fachlich gesetzt und
// bleiben es. Bereiche mit nur einem Artikel bleiben außen vor: dort gibt
// es kein „eigenes Umfeld", mit dem sich vergleichen ließe.
const proThema = {};
ARTIKEL.forEach(a => { (proThema[a.thema] = proThema[a.thema] || []).push(a); });
const drift = [];
for (const a of ARTIKEL) {
  const i = platz["artikel:" + a.id];
  if (i === undefined || (proThema[a.thema] || []).length < 2) continue;
  const werte = Object.keys(proThema).map(t => {
    const andere = proThema[t].filter(x => x.id !== a.id);
    if (!andere.length) return null;
    const summe = andere.reduce((acc, x) => {
      const j = platz["artikel:" + x.id];
      return j === undefined ? acc : acc + sim(i, j);
    }, 0);
    return { thema: t, mittel: summe / andere.length };
  }).filter(Boolean).sort((x, y) => y.mittel - x.mittel);
  const eigen = werte.find(x => x.thema === a.thema);
  if (werte[0] && eigen && werte[0].thema !== a.thema) {
    drift.push({ a, naeher: werte[0], eigen, abstand: werte[0].mittel - eigen.mittel });
  }
}
drift.sort((x, y) => y.abstand - x.abstand);

// ---- Ausgabe ------------------------------------------------------------
const zeilen = [];
const P = s => zeilen.push(s);
const kopf = (n, t) => P(MD ? `\n## ${n}. ${t}\n` : `\n=== ${n}. ${t} ===`);
const z = n => n.toFixed(3).replace(".", ",");
const punkt = s => (MD ? "- " : "  · ") + s;

P(MD ? "# Verknüpfungs-Vorschläge\n" : "Verknüpfungs-Vorschläge (Redaktionsbericht)");
P((MD ? "" : "") + `Stand der Inhalte: ${W.stand || "—"} · Index: ${E.length} Einträge` +
  ` · Schwellen: Artikel ${z(S_ARTIKEL)}, Normen ${z(S_NORM)}, Dokumente ${z(S_DOKUMENT)}`);

kopf(1, `Artikelpaare ohne Querverweis (${paare.length})`);
if (!paare.length) P(punkt("Nichts offen — alle nahen Paare sind verknüpft."));
paare.slice(0, TOP).forEach(p => {
  P(punkt(`${z(p.s)}  **${p.a.titel}** ↔ **${p.b.titel}**`));
  P((MD ? "  " : "      ") + `[[${p.a.id}]] / [[${p.b.id}]] — ` +
    `${themaName[p.a.thema] || p.a.thema} / ${themaName[p.b.thema] || p.b.thema}`);
});

kopf(2, `Normen, die der Artikel nie nennt (${normen.length} Artikel)`);
if (!normen.length) P(punkt("Nichts offen."));
normen.slice(0, TOP).forEach(n => {
  P(punkt(`**${n.a.titel}** (${n.a.id})`));
  n.treffer.forEach(t => P((MD ? "  - " : "      · ") + `${z(t.s)}  ${t.titel}`));
});

kopf(3, `Dokumente ohne Artikelzuordnung (${dokumente.length})`);
if (!dokumente.length) P(punkt("Nichts offen."));
dokumente.slice(0, TOP).forEach(d => {
  P(punkt(`**${d.q.titel}** (${d.q.id})`));
  d.treffer.forEach(t => P((MD ? "  - " : "      · ") + `${z(t.s)}  ${t.a.titel} → artikel: ["${t.a.id}"]`));
});

kopf(4, `Themen-Drift — Artikel näher an einem fremden Bereich (${drift.length})`);
P(MD ? "*Redaktionshinweis, keine Nutzerfunktion: die neun Themenbereiche sind fachlich gesetzt.*"
  : "  (Redaktionshinweis — die neun Themenbereiche sind fachlich gesetzt.)");
if (!drift.length) P(punkt("Nichts offen — jeder Artikel liegt am nächsten bei seinem Bereich."));
drift.slice(0, TOP).forEach(d => {
  P(punkt(`+${z(d.abstand)}  **${d.a.titel}** — eingeordnet in „${themaName[d.eigen.thema]}" ` +
    `(${z(d.eigen.mittel)}), näher an „${themaName[d.naeher.thema]}" (${z(d.naeher.mittel)})`));
});

// Begründung der Schwellen: ohne die gemessene Verteilung ist „0,90" eine
// Behauptung. Deshalb steht sie im Bericht — für jede der drei Vergleichsarten
// einzeln, weil lange Artikel, mittellange Normen und knappe
// Dokumentbeschreibungen nicht dieselbe Streuung haben.
kopf(5, "Wie die Schwellen zustande kommen");
function verteilung(name, werte, schwelle, einheit) {
  werte.sort((a, b) => a - b);
  const pz = p => z(werte[Math.round(p * (werte.length - 1))]);
  // Wo liegt die Schwelle in dieser Verteilung?
  let unter = 0;
  while (unter < werte.length && werte[unter] < schwelle) unter++;
  P(punkt(`**${name}** — ${werte.length} Vergleiche: Median ${pz(0.5)}, 90 % ${pz(0.9)}, ` +
    `99 % ${pz(0.99)}, Maximum ${pz(1)}. Schwelle ${z(schwelle)} = ` +
    `${(100 * unter / werte.length).toFixed(1).replace(".", ",")}. Perzentil, ` +
    `darüber liegen ${werte.length - unter} ${einheit}.`));
}
verteilung("Artikel ↔ Artikel", alleArtikelWerte, S_ARTIKEL, "Paare");
verteilung("Artikel ↔ Paragraf", alleNormWerte, S_NORM, "Kombinationen");
verteilung("Artikel ↔ Dokument", alleDokumentWerte, S_DOKUMENT, "Kombinationen");
P(punkt(`Alles ähnelt sich, weil alles dieselbe Fachsprache spricht — der Median liegt ` +
  `überall bei etwa 0,86. Gemeldet wird deshalb nur die äußerste Spitze; was davon ein ` +
  `echter Verweis wird, entscheidet die Redaktion. Wer mehr sehen will, senkt S_ARTIKEL, ` +
  `S_NORM oder S_DOKUMENT im Kopf der Datei.`));

console.log(zeilen.join("\n"));
