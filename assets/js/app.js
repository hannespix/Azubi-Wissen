// app.js — Anwendungskern von „Ausbildung Grüne Berufe" (vormals Azubi-Wissen).
// Hash-Router, Ansichten (Start / Wissen / Artikel), globale Suchpalette.
// Assistent und Export liegen in eigenen Modulen (assistent.js, export.js)
// und werden hier nur eingehängt, falls vorhanden.
(function () {
  "use strict";
  var W = window.WISSEN;
  var S = window.bwSearch;

  /* ---------------- Hilfen ---------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }

  // Flüssige Übergänge (View Transitions API) — progressiv: ohne Browser-
  // Unterstützung oder bei reduzierter Bewegung wird direkt gerendert.
  var REDUZIERT = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  // Liefert ein Promise, das erfüllt ist, sobald die DOM-Änderung angewendet
  // wurde (nicht erst nach der Animation) — wichtig für Folgeschritte wie
  // Statusmeldungen nach einem Neu-Rendern.
  function mitUebergang(fn) {
    if (document.startViewTransition && !REDUZIERT.matches) {
      var uebergang = document.startViewTransition(fn);
      return uebergang.updateCallbackDone["catch"](function () {});
    }
    fn();
    return Promise.resolve();
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Mini-Format: Absätze (Leerzeile), Listen ("- " / "1. "), **fett**.
  function fmt(text) {
    var blocks = String(text || "").split(/\n\n+/);
    return blocks.map(function (b) {
      var lines = b.split("\n");
      var isUl = lines.every(function (l) { return /^\s*-\s+/.test(l); });
      var isOl = lines.every(function (l) { return /^\s*\d+\.\s+/.test(l); });
      if (isUl || isOl) {
        var items = lines.map(function (l) {
          return "<li>" + inline(l.replace(/^\s*(?:-|\d+\.)\s+/, "")) + "</li>";
        }).join("");
        return isUl ? "<ul>" + items + "</ul>" : "<ol>" + items + "</ol>";
      }
      return "<p>" + inline(b).replace(/\n/g, "<br>") + "</p>";
    }).join("");
    function inline(s) {
      return fmtInline(s);
    }
  }

  // §§-Verlinkung (M11, erweitert D1): Normzitate im bereits escapten Text
  // mit den Gesetzes-Quellen verknüpfen — z. B. „§ 20 BBiG",
  // „§§ 10, 11 und 36 BBiG", „§§ 34–36 BBiG", „§ 21 Abs. 3 BBiG",
  // „Art. 6 DSGVO". Jedes zitierte Werk gehört in diese Map (Ziel: keine
  // unverlinkte Rechtsgrundlage); die Regex entsteht aus den Schlüsseln.
  var GESETZ_QUELLE = {
    BBiG: "gesetz-bbig", JArbSchG: "gesetz-jarbschg", ArbZG: "gesetz-arbzg",
    BUrlG: "gesetz-burlg", EntgFG: "gesetz-entgfg", EFZG: "gesetz-entgfg", AEVO: "gesetz-aevo",
    "GärtnAusbV": "gesetz-gaertnausbv", GBFWVO: "gesetz-gbfwvo",
    BGB: "gesetz-bgb", ArbSchG: "gesetz-arbschg", KSchG: "gesetz-kschg",
    BetrVG: "gesetz-betrvg", TzBfG: "gesetz-tzbfg", "SGB III": "gesetz-sgb3", "SGB IV": "gesetz-sgb4",
    "SGB IX": "gesetz-sgb9", "BAföG": "gesetz-bafoeg", DSGVO: "gesetz-dsgvo",
    LwAusbV: "ausbv-landwirt", WinzerAusbV: "ausbv-winzer",
    FischwAusbV: "ausbv-fischwirt", BrennAusbV: "ausbv-brenner",
    TWirtAusbV: "ausbv-tierwirt", PfWirtAusbV: "ausbv-pferdewirt",
    ForstwiAusbV: "ausbv-forstwirt", AgrarAusbV: "ausbv-agrarservice",
    MilchtAusbV: "ausbv-milchtechnologe", MilchwLabAusbV: "ausbv-milchw-laborant",
    PflanzTechnAusbV: "ausbv-pflanzentechnologe", RevjAusbV: "ausbv-revierjaeger",
    HaWiAusbV: "ausbv-hauswirtschafter", HufBeschlV: "ausbv-hufbeschlag"
  };
  var NORM_RE = (function () {
    var werke = Object.keys(GESETZ_QUELLE).sort(function (a, b) { return b.length - a.length; })
      .map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s"); })
      .join("|");
    return new RegExp(
      "((?:§§?|Art\\.)\\s?\\d+[a-z]?(?:(?:,\\s?|\\s?und\\s?|\\s?bis\\s?|\\s?[–-]\\s?)\\d+[a-z]?)*" +
      "(?:\\s?Abs\\.\\s?\\d+)?(?:\\s?Nr\\.\\s?\\d+)?(?:\\s?Satz\\s?\\d+)?(?:\\s?ff\\.)?\\s)(" + werke + ")\\b", "g");
  })();
  function normVerlinken(htmlText) {
    if (!window.QUELLEN) return htmlText;
    // Bestehende Links (z. B. Querlinks mit §-Zitat im Linktext) unangetastet
    // lassen — sonst entstehen verschachtelte <a>-Elemente.
    return String(htmlText).split(/(<a\b[^>]*>[\s\S]*?<\/a>)/).map(function (teil, i) {
      if (i % 2 === 1) return teil;
      return teil.replace(NORM_RE, function (ganz, para, gesetz) {
        var e = null, ziel = GESETZ_QUELLE[gesetz.replace(/\s+/g, " ")];
        window.QUELLEN.eintraege.forEach(function (x) { if (x.id === ziel) e = x; });
        if (!e) return ganz;
        var z = quelleZiel(e);
        return '<a class="norm-link" href="' + esc(z.href) + '" target="_blank" rel="noopener" title="' +
          esc(gesetz) + " öffnen" + (z.extern ? " (online)" : " (PDF)") + '">' + para + gesetz + "</a>";
      });
    }).join("");
  }
  // Querverweise (D1): [[artikel-id]] bzw. [[artikel-id|Linktext]] in
  // Fließtexten (fakten, abschnitte, faq, rollen, Glossar) werden zu
  // internen Links. Nicht in `kurz`-Feldern verwenden (Trefferlisten).
  var QL_RE = /\[\[([a-z0-9-]+)(?:\|([^\]|]+))?\]\]/g;
  function qlAufloesen(s) {
    return String(s == null ? "" : s).replace(QL_RE, function (ganz, id, label) {
      if (label) return label;
      var a = artikelVon(id);
      return a ? a.titel : id;
    });
  }
  function querlinks(html) {
    return String(html).replace(QL_RE, function (ganz, id, label) {
      var a = artikelVon(id);
      if (!a) return label || id;
      return '<a class="querlink" href="#/artikel/' + esc(id) + '">' + (label || esc(a.titel)) + "</a>";
    });
  }
  // Eigene Inhalte (lokal angelegte Artikel/Dokumente) — Cache über LokalDB,
  // wird bei init() geladen und nach jeder Änderung aktualisiert.
  var EIGENE = { artikel: [], dokumente: [], geladen: false };
  var THEMA_EIGENE = { id: "eigene", titel: "Eigene Artikel", kurz: "Selbst angelegte Inhalte — nur lokal auf diesem Gerät gespeichert" };

  function themaVon(id) {
    if (id === THEMA_EIGENE.id) return THEMA_EIGENE;
    for (var i = 0; i < W.themen.length; i++) if (W.themen[i].id === id) return W.themen[i];
    return null;
  }
  function artikelVon(id) {
    for (var i = 0; i < W.artikel.length; i++) if (W.artikel[i].id === id) return W.artikel[i];
    for (var j = 0; j < EIGENE.artikel.length; j++) if (EIGENE.artikel[j].id === id) return EIGENE.artikel[j];
    return null;
  }
  var ICON = {
    stern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2.6 15.1 8.9 22 9.9 17 14.8 18.2 21.7 12 18.4 5.8 21.7 7 14.8 2 9.9 8.9 8.9"></polygon></svg>',
    drucker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>',
    suche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    buch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="13" y2="17"></line></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
    blitz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><polyline points="8 12 11 15 16 9"></polyline></svg>',
    blatt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 4c-8 0-14 5-14 13 0 1.5.3 2.6.8 3.6"></path><path d="M20 4c0 8-5 14-13 14"></path><path d="M4 21c4-7 9-11 16-13"></path></svg>'
  };

  /* ---------------- Suche: Synonyme + Bewertung -------------------- */
  var SYN = {
    gehalt: ["vergutung"], lohn: ["vergutung"], verdienst: ["vergutung"], bezahlung: ["vergutung"],
    geld: ["vergutung"], mindestlohn: ["mindestvergutung", "vergutung"],
    ferien: ["urlaub"], urlaubstage: ["urlaub"],
    krankschreibung: ["krank", "arbeitsunfahig"], attest: ["krank", "au"], au: ["krank"],
    chef: ["ausbilder", "betrieb"], chefin: ["ausbilder", "betrieb"], boss: ["ausbilder"], meister: ["ausbilder"],
    schule: ["berufsschule"], unterricht: ["berufsschule"], blockunterricht: ["berufsschule", "block"],
    gekundigt: ["kundigung"], rauswurf: ["kundigung"], rausgeworfen: ["kundigung"], feuern: ["kundigung"], entlassen: ["kundigung"],
    heft: ["berichtsheft", "ausbildungsnachweis"], berichtsheft: ["ausbildungsnachweis"],
    mehrarbeit: ["uberstunden"], uberstunde: ["uberstunden"],
    prufung: ["abschlussprufung", "zwischenprufung"], gesellenprufung: ["abschlussprufung"],
    durchgefallen: ["nicht bestanden", "wiederholung"],
    wechseln: ["wechsel", "aufhebung"], wechselbetrieb: ["wechsel"],
    eltern: ["minderjahrig", "gesetzliche vertreter"], minderjahrige: ["jugendliche"],
    arzt: ["arztliche untersuchung", "krank"], untersuchung: ["arztliche untersuchung"],
    vermerk: ["aktenvermerk"], notiz: ["aktenvermerk"],
    kammer: ["zustandige stelle"], ihk: ["zustandige stelle"],
    azubi: ["auszubildende"], lehrling: ["auszubildende", "azubi"], lehre: ["ausbildung"],
    lehrjahr: ["ausbildungsjahr"], ausbildungsjahr: ["jahr"], verdienen: ["vergutung"],
    probe: ["probezeit"], kundigungsfrist: ["kundigung", "frist"],
    teilzeitausbildung: ["teilzeit"], verkurzen: ["verkurzung"], verlangern: ["verlangerung"],
    pause: ["pausen", "ruhepause"], wochenende: ["samstag", "sonntag"],
    nachtarbeit: ["nachtruhe"], spatschicht: ["nachtruhe", "arbeitszeit"],
    pflanzenschutz: ["gefahrstoffe", "gefahrliche arbeiten"],
    fachwerker: ["fachpraktiker", "gartenbaufachwerker"], fachpraktiker: ["fachwerker"], werker: ["fachwerker"],
    gbfwvo: ["fachwerker", "gartenbaufachwerkerverordnung"], reza: ["rehabilitationspadagogische zusatzqualifikation"],
    reha: ["rehabilitation", "rehabilitationstrager"], bbw: ["berufsbildungswerk", "besondere einrichtung"],
    arbeitsagentur: ["agentur arbeit"], asa: ["assistierte ausbildung"],
    bav: ["berufsausbildungsvertrag", "vertrag", "vordruck"], vordruck: ["formular"],
    formulare: ["formular"], antrag: ["formular", "antrag"], download: ["formular", "datei", "pdf"],
    zeugnisse: ["zeugnis"], arbeitszeugnis: ["zeugnis"],
    hilfe: ["beratung", "unterstutzung"], mobbing: ["konflikt"], streit: ["konflikt"], arger: ["konflikt", "probleme"]
  };
  // Wie bwSearch.normalize, zusätzlich ohne Satz-/Sonderzeichen — sonst
  // verhindert ein angehängtes „?" oder „." den Treffer (UND-Logik).
  function norm(s) { return S.normalize(qlAufloesen(s)).replace(/[^a-z0-9]+/g, " ").trim(); }
  function tokenAlternativen(tok) {
    var alts = [tok];
    var syn = SYN[tok];
    if (syn) syn.forEach(function (s) {
      norm(s).split(" ").forEach(function (t) {
        // Füllwörter nie als Alternative aufnehmen („nicht bestanden" → nur „bestanden")
        if (t && !STOP[t] && alts.indexOf(t) < 0) alts.push(t);
      });
    });
    return alts;
  }
  function lev(a, b) {
    var m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }
  function tol(len) { return len <= 3 ? 0 : len <= 6 ? 1 : 2; }
  // Bewertet EIN Alternativ-Token gegen einen normalisierten Text.
  function tokenScore(tok, hay) {
    if (!hay) return 0;
    var idx = hay.indexOf(tok);
    if (idx >= 0) return (idx === 0 || hay.charAt(idx - 1) === " ") ? 3 : 2;
    var k = tol(tok.length); if (!k) return 0;
    var words = hay.split(" ");
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (Math.abs(w.length - tok.length) > k + 3) continue;
      if (Math.abs(w.length - tok.length) <= k && lev(tok, w) <= k) return 1;
      // Präfix-fuzzy in beide Richtungen (Flexionsendungen: „durchgefallen" ~ „durchfalle")
      if (w.length > tok.length + 1 && lev(tok, w.slice(0, tok.length)) <= k) return 1;
      if (tok.length > w.length + 1 && w.length >= 5 && lev(tok.slice(0, w.length), w) <= k) return 1;
    }
    return 0;
  }

  // Suchindex: Artikel + FAQ, mit gewichteten Feldern (vor-normalisiert).
  // Querverweise symmetrisch machen: Verweist A auf B, erscheint A auch
  // unter „Verwandte Artikel" von B (R2 — gilt automatisch für künftige
  // Artikel mit).
  (function verwandtSymmetrisieren() {
    var map = {};
    W.artikel.forEach(function (a) { map[a.id] = a; });
    W.artikel.forEach(function (a) {
      (a.verwandt || []).forEach(function (v) {
        var ziel = map[v];
        if (!ziel) return;
        ziel.verwandt = ziel.verwandt || [];
        if (ziel.verwandt.indexOf(a.id) < 0) ziel.verwandt.push(a.id);
      });
    });
  })();

  var INDEX = [];
  (function bauen() {
    W.artikel.forEach(function (a) {
      var th = themaVon(a.thema);
      var absTitel = (a.abschnitte || []).map(function (x) { return x.t; }).join(" ");
      var absText = (a.abschnitte || []).map(function (x) { return x.text; }).join(" ");
      var recht = (a.recht || []).map(function (r) { return r.n + " " + r.t; }).join(" ");
      INDEX.push({
        typ: "artikel", id: a.id, titel: a.titel, kurz: a.kurz, thema: th,
        felder: [
          [norm(a.titel), 5],
          [norm((a.stichworte || []).join(" ")), 4],
          [norm(a.kurz), 2.5],
          [norm(recht), 2.2],
          [norm(absTitel), 2],
          [norm((a.fakten || []).join(" ")), 1.6],
          [norm(absText), 1],
          [norm(th ? th.titel : ""), 1.5]
        ]
      });
      (a.faq || []).forEach(function (f, i) {
        INDEX.push({
          typ: "faq", id: a.id, faqIndex: i, titel: f.f, kurz: f.a, thema: th,
          felder: [
            [norm(f.f), 5],
            [norm(f.a), 1.6],
            [norm((a.stichworte || []).join(" ")), 2],
            [norm(a.titel), 2]
          ]
        });
      });
    });
  })();

  // Suchindex über Formulare/Quellen (falls quellen.js geladen ist)
  var QINDEX = [];
  (function bauenQuellen() {
    var Q = window.QUELLEN;
    if (!Q) return;
    Q.eintraege.forEach(function (e) {
      QINDEX.push({
        eintrag: e,
        felder: [
          [norm(e.titel), 5],
          [norm((e.stichworte || []).join(" ")), 4],
          [norm(e.beschreibung || ""), 1.5],
          [norm(e.herausgeber || "") + " " + norm(e.typ), 1]
        ]
      });
    });
  })();

  // Eigene Artikel/Dokumente in die Suchindizes einhängen (nach Laden und
  // nach jeder Änderung aufrufen). Eigene Einträge tragen rec.eigen = true.
  function indexEigeneNeu() {
    INDEX = INDEX.filter(function (r) { return !r.eigen; });
    QINDEX = QINDEX.filter(function (r) { return !r.eigen; });
    EIGENE.artikel.forEach(function (a) {
      var absText = (a.abschnitte || []).map(function (x) { return x.text; }).join(" ");
      INDEX.push({
        typ: "artikel", eigen: true, id: a.id, titel: a.titel, kurz: a.kurz, thema: themaVon(a.thema),
        felder: [
          [norm(a.titel), 5],
          [norm((a.stichworte || []).join(" ")), 4],
          [norm(a.kurz), 2.5],
          [norm(absText), 1],
          [norm("eigener artikel eigene"), 1]
        ]
      });
    });
    EIGENE.dokumente.forEach(function (d) {
      QINDEX.push({
        eigen: true, eintrag: d,
        felder: [
          [norm(d.titel), 5],
          [norm((d.stichworte || []).join(" ")), 4],
          [norm(d.beschreibung || ""), 1.5],
          [norm("eigenes dokument eigene ablage " + (d.dateiName || "")), 1]
        ]
      });
    });
  }

  function eigeneLaden() {
    if (!window.LokalDB) { EIGENE.geladen = true; return Promise.resolve(); }
    return Promise.all([
      window.LokalDB.alle("eigeneArtikel"),
      window.LokalDB.alle("eigeneDokumente")
    ]).then(function (r) {
      function neueste(a, b) { return (b.geaendert || 0) - (a.geaendert || 0); }
      EIGENE.artikel = (r[0] || []).sort(neueste);
      EIGENE.dokumente = (r[1] || []).sort(neueste);
      EIGENE.geladen = true;
      indexEigeneNeu();
    }, function () { EIGENE.geladen = true; });
  }

  function suchenQuellen(q, limit) {
    var tokens = norm(q).split(" ").filter(function (t) { return t && !STOP[t]; });
    if (!tokens.length) tokens = norm(q).split(" ").filter(Boolean);
    if (!tokens.length) return [];
    var treffer = [];
    QINDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length; f++) {
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], rec.felder[f][0]);
            if (sc) best = Math.max(best, sc * rec.felder[f][1] * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; }
        summe += best;
      }
      if (summe > 0) treffer.push({ eintrag: rec.eintrag, score: summe });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    return treffer.slice(0, limit || 4).map(function (t) { return t.eintrag; });
  }

  var TYP_NAME = { formular: "Formular", merkblatt: "Merkblatt", plan: "Ausbildungsplan", gesetz: "Gesetz", link: "Link", portal: "Portal", video: "Video", eigen: "Eigenes Dokument" };
  function quelleZiel(e) {
    // Eigene Dokumente liegen als data:-URL in der lokalen Datenbank und
    // werden mit Original-Dateinamen heruntergeladen.
    if (e.eigen && e.dataUrl) return { href: e.dataUrl, extern: false, download: e.dateiName || (e.titel + ".pdf") };
    // In der Einzeldatei-Auslieferung liegen die PDF-Dateien nicht bei —
    // dort führt der Eintrag direkt zur Online-Quelle.
    if (e.datei && !window.EINZELDATEI) return { href: e.datei, extern: false };
    return { href: e.url, extern: true };
  }

  // Füllwörter, die für das Ranking ignoriert werden (außer die Anfrage
  // besteht nur aus solchen Wörtern).
  var STOP = {};
  ("wie viel viele was wer wann wo warum darf durfen muss mussen kann konnen soll sollen will wollen ich du er sie es wir ihr mein meine meinem meinen dein deine der die das den dem des ein eine einen einem einer und oder aber auch noch schon nur nicht kein keine im in an am auf fur von vor nach bei mit ohne zu zum zur uber unter als wenn dann ist sind war bin bist hat habe haben hatte werden wird wurde bekomme bekommt bekommen gibt es mir mich dir dich uns euch man tun machen mache macht gilt heisst bedeutet eigentlich denn jetzt bitte mal so da dazu damit doch trotzdem keinen keinem keiner unser unsere gegen ab aus bis je pro").split(" ").forEach(function (w) { STOP[w] = 1; });

  // Globale Suche über den Index. Liefert {artikel:[],faq:[],themen:[]}.
  function suchen(q) {
    var alle = norm(q).split(" ").filter(Boolean);
    var tokens = alle.filter(function (t) { return !STOP[t]; });
    if (!tokens.length) tokens = alle;
    if (!tokens.length) return { artikel: [], faq: [], themen: [], tokens: [] };
    var treffer = [];
    INDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length && best < 15; f++) {
          var hay = rec.felder[f][0], w = rec.felder[f][1];
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], hay);
            // Synonymtreffer zählen etwas schwächer als Originaltreffer
            if (sc) best = Math.max(best, sc * w * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; } // UND-Verknüpfung
        summe += best;
      }
      if (summe > 0) treffer.push({ rec: rec, score: summe + (rec.typ === "artikel" ? 0.5 : 0) });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    var artikel = [], faq = [];
    treffer.forEach(function (t) {
      t.rec.score = t.score; // transient, wird je Suche überschrieben
      if (t.rec.typ === "artikel" && artikel.length < 7) artikel.push(t.rec);
      if (t.rec.typ === "faq" && faq.length < 5) faq.push(t.rec);
    });
    var themen = W.themen.filter(function (th) {
      return tokens.every(function (tok) {
        return tokenAlternativen(tok).some(function (al) { return tokenScore(al, norm(th.titel)) > 0; });
      });
    }).slice(0, 3);
    return { artikel: artikel, faq: faq, themen: themen, tokens: tokens };
  }

  /* ---------------- Suchpalette (Strg+K) --------------------------- */
  var palette = null, palInput = null, palListe = null, palStatus = null;
  var palAuswahl = -1, palEintraege = [], vorherFokus = null;

  function paletteBauen() {
    palette = document.createElement("div");
    palette.className = "palette";
    palette.innerHTML =
      '<div class="palette__hintergrund" data-schliessen></div>' +
      '<div class="palette__panel" role="dialog" aria-modal="true" aria-label="Globale Suche">' +
      '  <div class="palette__eingabe">' + ICON.suche +
      '    <input type="text" id="palette-eingabe" role="combobox" aria-expanded="true"' +
      '      aria-controls="palette-liste" aria-autocomplete="list" autocomplete="off"' +
      '      placeholder="Suchen: Urlaub, Kündigung, Berichtsheft … (tipptolerant)" aria-label="Suchbegriff">' +
      '    <button class="bw-iconbtn" type="button" data-schliessen aria-label="Suche schließen">' +
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      '    </button>' +
      '  </div>' +
      '  <ul class="palette__liste" id="palette-liste" role="listbox" aria-label="Suchergebnisse"></ul>' +
      '  <div class="palette__fuss">' +
      '    <span><kbd class="kbd">↑</kbd> <kbd class="kbd">↓</kbd> wählen</span>' +
      '    <span><kbd class="kbd">Enter</kbd> öffnen</span>' +
      '    <span><kbd class="kbd">Esc</kbd> schließen</span>' +
      '    <span id="palette-status" role="status" aria-live="polite" style="margin-left:auto"></span>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(palette);
    palInput = $("#palette-eingabe", palette);
    palListe = $("#palette-liste", palette);
    palStatus = $("#palette-status", palette);

    palette.addEventListener("click", function (e) {
      if (e.target.closest("[data-schliessen]")) paletteSchliessen();
    });
    palInput.addEventListener("input", function () { paletteSuchen(palInput.value); });
    palInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); paletteWaehlen(palAuswahl + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); paletteWaehlen(palAuswahl - 1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var ziel = palEintraege[palAuswahl] || palEintraege[0];
        if (ziel) {
          var anker = ziel.querySelector("a");
          if (anker && !ziel.getAttribute("data-ziel")) anker.click();
          else if (ziel.getAttribute("data-ziel")) location.hash = ziel.getAttribute("data-ziel");
          paletteSchliessen();
        }
      } else if (e.key === "Escape") { paletteSchliessen(); }
    });
  }

  function paletteOeffnen(startwert) {
    if (!palette) paletteBauen();
    vorherFokus = document.activeElement;
    palette.setAttribute("data-offen", "true");
    document.body.style.overflow = "hidden";
    palInput.value = startwert || "";
    paletteSuchen(palInput.value);
    palInput.focus();
  }
  function paletteSchliessen() {
    if (!palette) return;
    palette.removeAttribute("data-offen");
    document.body.style.overflow = "";
    if (vorherFokus && vorherFokus.focus) vorherFokus.focus();
  }

  function schnipsel(text, tokens) {
    var t = String(text || "");
    var n = norm(t);
    var pos = -1;
    tokens.some(function (tok) {
      var alts = tokenAlternativen(tok);
      for (var i = 0; i < alts.length; i++) {
        var p = n.indexOf(alts[i]);
        if (p >= 0) { pos = p; return true; }
      }
      return false;
    });
    if (pos < 0) pos = 0;
    var start = Math.max(0, pos - 40);
    var aus = (start > 0 ? "… " : "") + t.slice(start, start + 140) + (t.length > start + 140 ? " …" : "");
    return S.highlight(aus, tokens.join(" "));
  }

  function paletteSuchen(q) {
    var erg = suchen(q);
    var html = "";
    function eintrag(ziel, titel, sub, wo) {
      return '<li class="palette__eintrag" role="option" aria-selected="false" data-ziel="' + esc(ziel) + '">' +
        '<a href="' + esc(ziel) + '"><span class="wo">' + esc(wo) + '</span>' +
        '<span class="titel">' + titel + '</span>' +
        (sub ? '<span class="schnipsel">' + sub + '</span>' : "") + "</a></li>";
    }
    if (!q.trim()) {
      html += '<li class="palette__gruppe" role="presentation">Themenbereiche</li>';
      W.themen.forEach(function (th) {
        html += eintrag("#/wissen?thema=" + th.id, esc(th.titel), esc(th.kurz), "Thema");
      });
    } else {
      if (erg.themen.length) {
        html += '<li class="palette__gruppe" role="presentation">Themenbereiche</li>';
        erg.themen.forEach(function (th) {
          html += eintrag("#/wissen?thema=" + th.id, S.highlight(th.titel, q), esc(th.kurz), "Thema");
        });
      }
      var qerg = suchenQuellen(q, 4);
      if (qerg.length) {
        html += '<li class="palette__gruppe" role="presentation">Formulare &amp; Dateien</li>';
        qerg.forEach(function (e) {
          var z = quelleZiel(e);
          html += '<li class="palette__eintrag" role="option" aria-selected="false">' +
            '<a href="' + esc(z.href) + '"' + (z.download ? ' download="' + esc(z.download) + '"' : ' target="_blank" rel="noopener"') + '>' +
            '<span class="wo">' + esc(TYP_NAME[e.typ] || e.typ) + (z.extern ? " ↗" : "") + "</span>" +
            '<span class="titel">' + S.highlight(e.titel, q) + "</span>" +
            '<span class="schnipsel">' + esc(e.herausgeber + (e.stand ? " · Stand " + e.stand : "")) + "</span></a></li>";
        });
      }
      var verg = suchenVorlagen(q, 3);
      if (verg.length) {
        html += '<li class="palette__gruppe" role="presentation">E-Mail-Vorlagen</li>';
        verg.forEach(function (v) {
          html += '<li class="palette__eintrag" role="option" aria-selected="false" data-ziel="#/vorlagen?id=' + v.id + '">' +
            '<a href="#/vorlagen?id=' + v.id + '"><span class="wo">Vorlage</span>' +
            '<span class="titel">' + S.highlight(v.titel, q) + "</span>" +
            '<span class="schnipsel">' + esc(v.betreff) + "</span></a></li>";
        });
      }
      var nerg = suchenNachschlag(q, 2);
      if (nerg.length) {
        html += '<li class="palette__gruppe" role="presentation">Schnellnachschlag</li>';
        nerg.forEach(function (k) {
          html += '<li class="palette__eintrag" role="option" aria-selected="false" data-ziel="#/nachschlag?karte=' + k.id + '">' +
            '<a href="#/nachschlag?karte=' + k.id + '"><span class="wo">Nachschlag</span>' +
            '<span class="titel">' + S.highlight(k.titel, q) + "</span>" +
            '<span class="schnipsel">' + esc(k.recht || "") + "</span></a></li>";
        });
      }
      var cerg = suchenChecklisten(q, 2);
      if (cerg.length) {
        html += '<li class="palette__gruppe" role="presentation">Checklisten</li>';
        cerg.forEach(function (c) {
          html += '<li class="palette__eintrag" role="option" aria-selected="false" data-ziel="#/checklisten?id=' + c.id + '">' +
            '<a href="#/checklisten?id=' + c.id + '"><span class="wo">Checkliste</span>' +
            '<span class="titel">' + S.highlight(c.titel, q) + "</span>" +
            '<span class="schnipsel">' + esc(c.kurz || "") + "</span></a></li>";
        });
      }
      var berg = suchenBerufe(q, 2);
      if (berg.length) {
        html += '<li class="palette__gruppe" role="presentation">Grüne Berufe</li>';
        berg.forEach(function (b) {
          html += '<li class="palette__eintrag" role="option" aria-selected="false" data-ziel="#/berufe?b=' + b.id + '">' +
            '<a href="#/berufe?b=' + b.id + '"><span class="wo">Beruf</span>' +
            '<span class="titel">' + S.highlight(b.titel, q) + "</span>" +
            '<span class="schnipsel">' + esc(b.dauer + ((b.fachrichtungen || []).length ? " · " + b.fachrichtungen.length + " Fachrichtungen" : "")) + "</span></a></li>";
        });
      }
      var gerg = suchenGlossar(q, 2);
      if (gerg.length) {
        html += '<li class="palette__gruppe" role="presentation">Glossar</li>';
        gerg.forEach(function (g) {
          html += '<li class="palette__eintrag" role="option" aria-selected="false" data-ziel="#/glossar?b=' + g.id + '">' +
            '<a href="#/glossar?b=' + g.id + '"><span class="wo">Begriff</span>' +
            '<span class="titel">' + S.highlight(g.b, q) + "</span>" +
            '<span class="schnipsel">' + esc(g.k.slice(0, 90)) + " …</span></a></li>";
        });
      }
      if (erg.artikel.length) {
        html += '<li class="palette__gruppe" role="presentation">Artikel</li>';
        erg.artikel.forEach(function (r) {
          html += eintrag("#/artikel/" + r.id, S.highlight(r.titel, q), schnipsel(r.kurz, erg.tokens), r.thema ? r.thema.titel : "");
        });
      }
      if (erg.faq.length) {
        html += '<li class="palette__gruppe" role="presentation">Häufige Fragen</li>';
        erg.faq.forEach(function (r) {
          html += eintrag("#/artikel/" + r.id + "?faq=" + r.faqIndex, S.highlight(r.titel, q), schnipsel(r.kurz, erg.tokens), "FAQ");
        });
      }
      if (!erg.artikel.length && !erg.faq.length && !erg.themen.length && !qerg.length && !verg.length && !nerg.length && !cerg.length && !gerg.length && !berg.length) {
        html = '<li class="palette__leer" role="presentation">Kein Treffer für „' + esc(q) + '“.<br>' +
          '<a class="bw-btn bw-btn--sekundaer" href="#/assistent?frage=' + encodeURIComponent(q) + '" data-schliessen-nach>Frage dem Assistenten stellen</a></li>';
      }
    }
    palListe.innerHTML = html;
    palEintraege = Array.prototype.slice.call(palListe.querySelectorAll(".palette__eintrag"));
    palEintraege.forEach(function (li) {
      li.addEventListener("click", function () { paletteSchliessen(); });
    });
    var leerLink = palListe.querySelector("[data-schliessen-nach]");
    if (leerLink) leerLink.addEventListener("click", function () { paletteSchliessen(); });
    var n = palEintraege.length;
    palStatus.textContent = q.trim() ? (n ? n + " Treffer" : "keine Treffer") : "";
    paletteWaehlen(n ? 0 : -1);
  }

  function paletteWaehlen(i) {
    if (!palEintraege.length) { palAuswahl = -1; palInput.removeAttribute("aria-activedescendant"); return; }
    if (i < 0) i = palEintraege.length - 1;
    if (i >= palEintraege.length) i = 0;
    palEintraege.forEach(function (li, x) {
      li.setAttribute("aria-selected", String(x === i));
      if (!li.id) li.id = "pal-opt-" + x;
    });
    palAuswahl = i;
    palInput.setAttribute("aria-activedescendant", palEintraege[i].id);
    palEintraege[i].scrollIntoView({ block: "nearest" });
  }

  // Tastenkürzel: Strg/Cmd+K oder "/" außerhalb von Eingabefeldern
  document.addEventListener("keydown", function (e) {
    var inFeld = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "");
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); paletteOeffnen(); }
    else if (e.key === "/" && !inFeld) { e.preventDefault(); paletteOeffnen(); }
    else if (e.key === "Escape" && palette && palette.getAttribute("data-offen") === "true") paletteSchliessen();
  });

  /* ---------------- Router ----------------------------------------- */
  function parseHash() {
    var h = location.hash || "#/";
    var m = h.slice(1).split("?");
    var pfad = m[0].split("/").filter(Boolean);
    var params = {};
    (m[1] || "").split("&").forEach(function (p) {
      if (!p) return;
      var kv = p.split("=");
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });
    return { pfad: pfad, params: params };
  }

  var erstLauf = true;
  function rendern() {
    if (erstLauf) { rendernJetzt(); return Promise.resolve(); }
    return mitUebergang(rendernJetzt);
  }
  // Fangnetz: Ein Fehler in einer Ansicht darf die Seite nie leer lassen.
  function rendernJetzt() {
    try {
      rendernAnsicht();
      var wurzel = $("#inhalt");
      if (wurzel) { merkVerhalten(wurzel); druckVerhalten(wurzel); }
    }
    catch (fehler) {
      var haupt = $("#inhalt");
      if (haupt) {
        haupt.innerHTML = "<h1>Ausbildung Grüne Berufe</h1>" +
          '<div class="bw-hinweis bw-hinweis--fehler"><p><strong>Diese Ansicht konnte nicht aufgebaut werden.</strong> ' +
          'Bitte die Seite neu laden (Strg+F5). Bleibt der Fehler, hilft die Browser-Konsole bei der Ursache.</p></div>' +
          '<p><a class="bw-btn" href="#/">Zur Startseite</a></p>';
      }
      if (window.console && console.error) console.error("Renderfehler:", fehler);
      erstLauf = false;
    }
  }
  function rendernAnsicht() {
    var r = parseHash();
    var haupt = $("#inhalt");
    var view = r.pfad[0] || "start";
    var titel = "Ausbildung Grüne Berufe — RP Freiburg";

    if (view === "artikel" && r.pfad[1] && artikelVon(r.pfad[1])) {
      var a = artikelVon(r.pfad[1]);
      haupt.innerHTML = viewArtikel(a, r.params);
      artikelVerhalten(haupt, a, r.params);
      titel = a.titel + " — Grüne Berufe BW";
      zuletztMerken("#/artikel/" + a.id, a.titel, "Artikel");
    } else if (view === "wissen") {
      haupt.innerHTML = viewWissen(r.params);
      wissenVerhalten(haupt, r.params);
      titel = "Wissensdatenbank — Grüne Berufe BW";
    } else if (view === "vorlagen") {
      haupt.innerHTML = viewVorlagen(r.params);
      vorlagenVerhalten(haupt, r.params);
      titel = "E-Mail-Vorlagen — Grüne Berufe BW";
      if (r.params.id && window.VORLAGEN) {
        window.VORLAGEN.vorlagen.forEach(function (v) {
          if (v.id === r.params.id) zuletztMerken("#/vorlagen?id=" + v.id, v.titel, "Vorlage");
        });
      }
    } else if (view === "downloads") {
      haupt.innerHTML = viewDownloads();
      downloadsVerhalten(haupt);
      titel = "Download-Center — Grüne Berufe BW";
    } else if (view === "nachschlag") {
      haupt.innerHTML = viewNachschlag();
      nachschlagVerhalten(haupt, r.params);
      titel = "Schnellnachschlag — Grüne Berufe BW";
    } else if (view === "checklisten") {
      haupt.innerHTML = viewChecklisten(r.params);
      checklistenVerhalten(haupt, r.params);
      titel = "Checklisten — Grüne Berufe BW";
    } else if (view === "glossar") {
      haupt.innerHTML = viewGlossar();
      glossarVerhalten(haupt, r.params);
      titel = "Glossar — Grüne Berufe BW";
    } else if (view === "berufe") {
      haupt.innerHTML = viewBerufe(r.params);
      berufeVerhalten(haupt, r.params);
      titel = "Grüne Berufe — Grüne Berufe BW";
    } else if (view === "eigene") {
      haupt.innerHTML = viewEigene();
      eigeneVerhalten(haupt, r.params);
      titel = "Eigene Inhalte — Grüne Berufe BW";
    } else if (view === "quellen") {
      haupt.innerHTML = viewQuellen(r.params);
      quellenVerhalten(haupt, r.params);
      titel = "Formulare & Quellen — Grüne Berufe BW";
    } else if (view === "assistent") {
      if (window.AzubiAssistent) { window.AzubiAssistent.renderView(haupt, r.params); }
      else haupt.innerHTML = platzhalter("KI-Assistent", "Der lokale Assistent wird im nächsten Ausbauschritt eingebaut.");
      titel = "KI-Assistent — Grüne Berufe BW";
    } else if (view === "export") {
      if (window.AzubiExport) { window.AzubiExport.renderView(haupt, r.params); }
      else haupt.innerHTML = platzhalter("Export & Aktenvermerk", "PDF-Export und Aktenvermerk-Generator folgen im nächsten Ausbauschritt.");
      titel = "Export & Vermerk — Grüne Berufe BW";
    } else {
      haupt.innerHTML = viewStart();
      startVerhalten(haupt);
    }
    document.title = titel;

    // Navigation: aktiven Link markieren
    document.querySelectorAll(".bw-nav__links a").forEach(function (a) {
      var ziel = a.getAttribute("href").replace(/^#/, "").split("?")[0].replace(/\/$/, "") || "/";
      var aktuell = "/" + (view === "artikel" ? "wissen" : view === "start" ? "" : view);
      aktuell = aktuell.replace(/\/$/, "") || "/";
      if (ziel === aktuell) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    // Fokus für Screenreader/Tastatur auf die Überschrift setzen
    if (!erstLauf) {
      var h1 = haupt.querySelector("h1");
      if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: false }); }
      window.scrollTo(0, 0);
    }
    erstLauf = false;
  }

  function platzhalter(t, s) {
    return '<h1>' + esc(t) + '</h1><div class="bw-hinweis"><p>' + esc(s) + '</p></div>';
  }

  /* ---------------- Zuletzt angesehen ------------------------------ */
  function zuletztLesen() {
    try { return JSON.parse(localStorage.getItem("aw.zuletzt") || "[]"); } catch (e) { return []; }
  }
  function zuletztMerken(ziel, titel, wo) {
    try {
      var liste = zuletztLesen().filter(function (e) { return e && e.ziel !== ziel; });
      liste.unshift({ ziel: ziel, titel: titel, wo: wo });
      localStorage.setItem("aw.zuletzt", JSON.stringify(liste.slice(0, 6)));
    } catch (e) {}
  }

  /* ---------------- Merkliste (R7) ---------------------------------
     Häufig gebrauchte Inhalte per Stern merken — lokal gespeichert
     (localStorage "aw.merkliste"), Schnellzugriff auf der Startseite. */
  function merklisteLesen() {
    try { return JSON.parse(localStorage.getItem("aw.merkliste") || "[]"); } catch (e) { return []; }
  }
  function merklisteSchreiben(liste) {
    try { localStorage.setItem("aw.merkliste", JSON.stringify(liste.slice(0, 40))); } catch (e) {}
  }
  function istGemerkt(ziel) {
    return merklisteLesen().some(function (e) { return e && e.ziel === ziel; });
  }
  function merklisteUmschalten(ziel, titel, wo) {
    var liste = merklisteLesen();
    var ohne = liste.filter(function (e) { return e && e.ziel !== ziel; });
    var neu = ohne.length === liste.length;
    if (neu) ohne.unshift({ ziel: ziel, titel: titel, wo: wo });
    merklisteSchreiben(ohne);
    return neu;
  }
  function merkKnopf(ziel, titel, wo) {
    var aktiv = istGemerkt(ziel);
    return '<button type="button" class="bw-iconbtn merk-knopf' + (aktiv ? " merk-knopf--aktiv" : "") +
      '" data-merk-ziel="' + esc(ziel) + '" data-merk-titel="' + esc(titel) + '" data-merk-wo="' + esc(wo) +
      '" aria-pressed="' + (aktiv ? "true" : "false") + '" aria-label="Merken" title="' +
      (aktiv ? "Von der Merkliste entfernen" : "Auf die Merkliste setzen") + '">' + ICON.stern + "</button>";
  }
  function merkVerhalten(root) {
    root.querySelectorAll("[data-merk-ziel]").forEach(function (b) {
      b.addEventListener("click", function () {
        var aktiv = merklisteUmschalten(b.getAttribute("data-merk-ziel"),
          b.getAttribute("data-merk-titel"), b.getAttribute("data-merk-wo"));
        b.classList.toggle("merk-knopf--aktiv", aktiv);
        b.setAttribute("aria-pressed", aktiv ? "true" : "false");
        b.title = aktiv ? "Von der Merkliste entfernen" : "Auf die Merkliste setzen";
      });
    });
  }
  // Karten-Druck (R7): druckt genau eine Nachschlag-Karte als A4-Handout.
  function druckVerhalten(root) {
    root.querySelectorAll("[data-druck-karte]").forEach(function (b) {
      b.addEventListener("click", function () {
        var karte = document.getElementById("n-" + b.getAttribute("data-druck-karte"));
        if (!karte) return;
        document.body.classList.add("druck-nur-karte");
        karte.classList.add("karte--druckziel");
        var fertig = false;
        function aufraeumen() {
          if (fertig) return;
          fertig = true;
          document.body.classList.remove("druck-nur-karte");
          karte.classList.remove("karte--druckziel");
          window.removeEventListener("afterprint", aufraeumen);
        }
        window.addEventListener("afterprint", aufraeumen);
        window.print();
        setTimeout(aufraeumen, 1500);
      });
    });
  }

  /* ---------------- Ansicht: Start --------------------------------- */
  var HAEUFIG = [
    { a: "urlaub", faq: 0, text: "Wie viele Urlaubstage habe ich?" },
    { a: "mindestverguetung", faq: 0, text: "Wie hoch ist die Mindestvergütung?" },
    { a: "freistellung", faq: 0, text: "Muss ich nach der Schule in den Betrieb?" },
    { a: "ueberstunden", faq: 0, text: "Müssen Überstunden bezahlt werden?" },
    { a: "kuendigung", faq: 0, text: "Kann mir nach der Probezeit gekündigt werden?" },
    { a: "berichtsheft", faq: 0, text: "Muss ich das Berichtsheft zu Hause schreiben?" }
  ];

  function viewStart() {
    var anzahlFaq = W.artikel.reduce(function (s, a) { return s + (a.faq || []).length; }, 0);
    var h = '<div class="hero"><div>' +
      '<h1>Ausbildung Grüne Berufe</h1>' +
      '<p class="bw-unterzeile">Wissensdatenbank und Arbeitshilfen der Ausbildungsberatung — alle grünen Berufe, komplett offline</p>' +
      '<button type="button" class="suchfeld-gross" data-palette>' + ICON.suche +
      '<span>Suchen: Urlaub, Kündigung, Vergütung …</span><kbd class="kbd">Strg K</kbd></button>' +
      '</div>' +
      '<div class="hero__stoerer"><span class="bw-stoerer">' + W.artikel.length + ' Artikel<br>' + anzahlFaq + ' FAQ</span></div></div>';

    h += '<div class="schnellzeile">' +
      '<a class="schnellkarte" href="#/nachschlag">' + ICON.blitz + "<span><h3>Schnellnachschlag</h3><p>Vergütung, Urlaub nach Alter, Fristen, Arbeitszeit, Fachrichtungen — auf einen Blick.</p></span></a>" +
      '<a class="schnellkarte" href="#/berufe">' + ICON.blatt + "<span><h3>Grüne Berufe</h3><p>Alle Ausbildungsberufe mit Fachrichtungen, Verordnungen und Ansprechseiten.</p></span></a>" +
      '<a class="schnellkarte" href="#/checklisten">' + ICON.check + "<span><h3>Checklisten</h3><p>Erstberatung, Eintragung, Betriebsbesuch, AP-Anmeldung — abhaken, drucken, ablegen.</p></span></a>" +
      '<a class="schnellkarte" href="#/vorlagen">' + ICON.doc + "<span><h3>E-Mail-Vorlagen</h3><p>Vertrag, Prüfung, Beratungsalltag — Platzhalter füllen, kopieren, versenden.</p></span></a>" +
      '<a class="schnellkarte" href="#/downloads">' + ICON.buch + "<span><h3>Download-Center</h3><p>Alle Formulare, Pläne und Gesetze in der Baumansicht — inkl. BAV-Vordruck.</p></span></a>" +
      '<a class="schnellkarte" href="#/glossar">' + ICON.buch + "<span><h3>Glossar</h3><p>Fachbegriffe von 80-Prozent-Regel bis Zwischenprüfung — kurz erklärt und verlinkt.</p></span></a>" +
      '<a class="schnellkarte" href="#/eigene">' + ICON.plus + "<span><h3>Eigene Inhalte</h3><p>Artikel, Dokumente und Verträge selbst anlegen — lokal gespeichert, überall auffindbar.</p></span></a>" +
      '<a class="schnellkarte" href="#/assistent">' + ICON.chat + "<span><h3>KI-Assistent fragen</h3><p>Freie Fragen stellen — Antworten mit Quellen, komplett offline.</p></span></a>" +
      '<a class="schnellkarte" href="#/export">' + ICON.doc + "<span><h3>PDF-Export &amp; Aktenvermerk</h3><p>Themen als PDF je Zielgruppe — und Vermerke strukturiert erstellen.</p></span></a>" +
      "</div>";

    var gemerkt = merklisteLesen();
    if (gemerkt.length) {
      h += '<h2>Merkliste</h2><ul class="chipzeile" id="start-merkliste">';
      gemerkt.forEach(function (e) {
        h += '<li><a class="chip" href="' + esc(e.ziel) + '"><span class="bw-leise">' + esc(e.wo) + ":</span> " + esc(e.titel) + "</a></li>";
      });
      h += '</ul><p class="bw-klein bw-leise">Merken und Entfernen über den Stern am Artikel bzw. an der Nachschlag-Karte — lokal auf diesem Gerät gespeichert.</p>';
    }

    var zuletzt = zuletztLesen();
    if (zuletzt.length) {
      h += '<h2>Zuletzt angesehen</h2><ul class="chipzeile">';
      zuletzt.forEach(function (e) {
        h += '<li><a class="chip" href="' + esc(e.ziel) + '"><span class="bw-leise">' + esc(e.wo) + ":</span> " + esc(e.titel) + "</a></li>";
      });
      h += "</ul>";
    }

    h += '<h2>Themenbereiche</h2><ul class="kacheln">';
    W.themen.forEach(function (th) {
      var n = W.artikel.filter(function (a) { return a.thema === th.id; }).length;
      h += '<li><a class="kachel" href="#/wissen?thema=' + th.id + '">' +
        '<span class="anzahl">' + n + " Artikel</span><h3>" + esc(th.titel) + "</h3><p>" + esc(th.kurz) + "</p></a></li>";
    });
    h += "</ul>";

    h += '<h2>Häufig gefragt</h2><ul class="chipzeile">';
    HAEUFIG.forEach(function (f) {
      h += '<li><a class="chip chip--frage" href="#/artikel/' + f.a + "?faq=" + f.faq + '">' + esc(f.text) + "</a></li>";
    });
    h += "</ul>";

    h += '<p class="stand-hinweis">' + esc(W.hinweis) + " Stand: " + esc(W.stand) + ".</p>";
    return h;
  }
  function startVerhalten(root) {
    var b = root.querySelector("[data-palette]");
    if (b) b.addEventListener("click", function () { paletteOeffnen(); });
  }

  /* ---------------- Ansicht: Wissensdatenbank ---------------------- */
  function viewWissen(params) {
    var aktiv = params.thema || "";
    var gesamt = W.artikel.length + EIGENE.artikel.length;
    var h = '<h1>Wissensdatenbank</h1>' +
      '<p class="bw-unterzeile">' + gesamt + " Artikel rund um Ausbildung und Beratung in den grünen Berufen" +
      (EIGENE.artikel.length ? " — davon " + EIGENE.artikel.length + " eigene" : "") + "</p>" +
      '<div class="bw-search" style="max-width:34rem"><label for="wq" class="bw-skip-link">Artikel filtern</label>' +
      '<input id="wq" type="search" placeholder="Filtern… (tipptolerant, alle Felder)" aria-label="Artikel filtern">' +
      '<button type="button" aria-label="Suchen">' + ICON.suche + "</button></div>";
    h += '<ul class="chipzeile" role="group" aria-label="Nach Themenbereich filtern">';
    h += '<li><button class="chip" data-thema="" aria-pressed="' + (!aktiv) + '">Alle</button></li>';
    W.themen.forEach(function (th) {
      h += '<li><button class="chip" data-thema="' + th.id + '" aria-pressed="' + (aktiv === th.id) + '">' + esc(th.titel) + "</button></li>";
    });
    if (EIGENE.artikel.length) {
      h += '<li><button class="chip" data-thema="eigene" aria-pressed="' + (aktiv === "eigene") + '">Eigene Artikel</button></li>';
    }
    h += "</ul>";
    h += '<ul class="karten" id="artikel-liste"></ul>';
    h += '<p class="leer" id="wissen-leer" hidden>Kein Artikel passt zu Filter und Suchbegriff.</p>';
    return h;
  }

  function wissenVerhalten(root, params) {
    var aktiv = params.thema || "";
    var eingabe = $("#wq", root);
    var liste = $("#artikel-liste", root);
    var leer = $("#wissen-leer", root);

    function zeigen() { mitUebergang(zeigenJetzt); }
    function zeigenJetzt() {
      var q = eingabe.value.trim();
      var artikel;
      if (q) {
        var erg = suchen(q);
        artikel = erg.artikel.map(function (r) { return artikelVon(r.id); }).filter(Boolean);
        // Bei Suche zusätzlich FAQ-only-Treffer als Artikel aufnehmen
        erg.faq.forEach(function (r) {
          var a = artikelVon(r.id);
          if (a && artikel.indexOf(a) < 0) artikel.push(a);
        });
      } else {
        artikel = W.artikel.concat(EIGENE.artikel);
      }
      if (aktiv === "eigene") artikel = artikel.filter(function (a) { return a.eigen; });
      else if (aktiv) artikel = artikel.filter(function (a) { return a.thema === aktiv; });
      liste.innerHTML = artikel.map(function (a) {
        var th = themaVon(a.thema);
        var recht = (a.recht || []).slice(0, 2).map(function (r) { return '<span class="etikett etikett--recht">' + esc(r.n) + "</span>"; }).join("");
        return '<li class="karte"><a class="karte__link" href="#/artikel/' + a.id + '">' +
          '<span class="etikett">' + esc(th ? th.titel : "") + "</span>" +
          (a.eigen ? '<span class="etikett etikett--eigen">Eigen</span>' : "") +
          "<h3>" + (q ? S.highlight(a.titel, q) : esc(a.titel)) + "</h3>" +
          "<p>" + (q ? S.highlight(a.kurz, q) : esc(a.kurz)) + "</p>" +
          '<span class="meta">' + recht + ((a.faq || []).length ? '<span class="etikett">' + a.faq.length + " FAQ</span>" : "") + "</span>" +
          "</a></li>";
      }).join("");
      leer.hidden = artikel.length > 0;
    }

    root.querySelectorAll(".chip[data-thema]").forEach(function (c) {
      c.addEventListener("click", function () {
        aktiv = c.getAttribute("data-thema");
        root.querySelectorAll(".chip[data-thema]").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x === c));
        });
        var neu = "#/wissen" + (aktiv ? "?thema=" + aktiv : "");
        history.replaceState(null, "", neu); // Filter in URL halten, ohne neu zu rendern
        zeigen();
      });
    });
    eingabe.addEventListener("input", zeigen);
    zeigenJetzt();
  }

  /* ---------------- Ansicht: Artikel ------------------------------- */
  var DETAILSTUFEN = [
    { n: 1, name: "Kurzübersicht" },
    { n: 2, name: "Standard" },
    { n: 3, name: "Ausführlich" }
  ];
  var ROLLEN = [
    { id: "azubi", name: "Für Azubis" },
    { id: "betrieb", name: "Für Betriebe" },
    { id: "beratung", name: "Für die Beratung" }
  ];
  function detailStufe() {
    var v = parseInt(localStorage.getItem("aw.detail") || "2", 10);
    return v >= 1 && v <= 3 ? v : 2;
  }
  function rolleAktiv() {
    var v = localStorage.getItem("aw.rolle");
    return ["azubi", "betrieb", "beratung"].indexOf(v) >= 0 ? v : "azubi";
  }

  function viewArtikel(a, params) {
    var th = themaVon(a.thema);
    var stufe = params.d ? Math.max(1, Math.min(3, parseInt(params.d, 10) || 2)) : detailStufe();
    var h = '<nav class="crumb" aria-label="Pfad"><a href="#/wissen">Wissensdatenbank</a> › ' +
      '<a href="#/wissen?thema=' + a.thema + '">' + esc(th ? th.titel : "") + "</a></nav>";
    h += "<h1>" + esc(a.titel) + "</h1>";
    if (a.eigen) {
      h += '<p class="bw-klein"><span class="etikett etikett--eigen">Eigener Artikel</span> ' +
        'nur lokal gespeichert · <a href="#/eigene?artikel=' + esc(a.id) + '">Bearbeiten</a>' +
        (a.stand ? ' · <span class="bw-leise">Stand ' + esc(a.stand) + "</span>" : "") + "</p>";
    }
    h += '<p class="artikel-lead">' + esc(a.kurz) + "</p>";

    if (!a.eigen) {
      h += '<div class="detail-schalter" role="group" aria-label="Detailgrad">';
      DETAILSTUFEN.forEach(function (d) {
        h += '<button type="button" data-stufe="' + d.n + '" aria-pressed="' + (d.n === stufe) + '">' + d.name + "</button>";
      });
      h += "</div>";
    }

    if ((a.fakten || []).length) {
      h += '<div class="fakten bw-hinweis"><strong>Das Wichtigste in Kürze</strong><ul>' +
        a.fakten.map(function (f) { return "<li>" + fmtInline(f) + "</li>"; }).join("") + "</ul></div>";
    }

    h += '<div class="artikel-inhalt" id="artikel-inhalt"></div>';

    if ((a.recht || []).length || a.quelle) {
      h += '<div class="recht-box bw-card">';
      if ((a.recht || []).length) {
        h += "<strong>Rechtsgrundlagen</strong><ul>" +
          a.recht.map(function (r) { return '<li><span class="norm">' + normVerlinken(esc(r.n)) + "</span> — " + esc(r.t) + "</li>"; }).join("") +
          "</ul>";
      }
      if (a.quelle) h += '<p class="bw-klein bw-leise" style="margin:var(--bw-space-2) 0 0">Quelle: ' + esc(a.quelle) + "</p>";
      h += "</div>";
    }

    if (a.rollen) {
      var rolle = rolleAktiv();
      h += '<div class="rollen"><h2 id="rollen-titel">Praxishinweise</h2><div role="tablist" aria-labelledby="rollen-titel">';
      ROLLEN.forEach(function (r) {
        h += '<button role="tab" id="tab-' + r.id + '" aria-controls="panel-' + r.id + '" aria-selected="' + (r.id === rolle) + '" tabindex="' + (r.id === rolle ? "0" : "-1") + '">' + r.name + "</button>";
      });
      h += "</div>";
      ROLLEN.forEach(function (r) {
        h += '<div role="tabpanel" id="panel-' + r.id + '" aria-labelledby="tab-' + r.id + '"' + (r.id === rolle ? "" : " hidden") + "><p>" + fmtInline(a.rollen[r.id] || "") + "</p></div>";
      });
      h += "</div>";
    }

    if ((a.faq || []).length) {
      h += '<div class="faq"><h2>Häufige Fragen</h2>';
      a.faq.forEach(function (f, i) {
        h += '<details id="faq-' + i + '"><summary>' + esc(f.f) + '</summary><div class="faq__antwort"><p>' + fmtInline(f.a) + "</p></div></details>";
      });
      h += "</div>";
    }

    if ((a.verwandt || []).length) {
      h += '<h2>Verwandte Artikel</h2><ul class="chipzeile">' +
        a.verwandt.map(function (id) {
          var v = artikelVon(id);
          return v ? '<li><a class="chip chip--frage" href="#/artikel/' + v.id + '">' + esc(v.titel) + "</a></li>" : "";
        }).join("") + "</ul>";
    }

    var passende = (window.QUELLEN ? window.QUELLEN.eintraege : []).filter(function (e) {
      return (e.artikel || []).indexOf(a.id) >= 0;
    });
    if (passende.length) {
      h += '<h2>Formulare &amp; Links zum Thema</h2><ul class="quellen-liste">';
      passende.forEach(function (e) {
        var z = quelleZiel(e);
        h += '<li><a href="' + esc(z.href) + '" target="_blank" rel="noopener">' +
          '<span class="etikett">' + esc(TYP_NAME[e.typ] || e.typ) + "</span> " +
          esc(e.titel) + (z.extern ? ' <span class="bw-leise">↗ online</span>' : "") + "</a>" +
          '<span class="bw-klein bw-leise"> — ' + esc(e.herausgeber) + "</span></li>";
      });
      h += "</ul>";
    }

    if (window.LokalDB) {
      h += '<div class="notiz"><h2>Eigene Notiz</h2>' +
        '<div class="bw-card"><label for="artikel-notiz">Notiz zu diesem Artikel (bleibt lokal auf diesem Gerät)</label>' +
        '<textarea id="artikel-notiz" rows="3" placeholder="z. B. regionale Besonderheiten, Ansprechpersonen, eigene Beispiele …"></textarea>' +
        '<p class="bw-klein bw-leise" id="notiz-status" role="status"></p></div></div>';
    }

    h += '<div class="artikel-aktionen">' +
      '<a class="bw-btn bw-btn--gelb" href="#/export?artikel=' + a.id + '">Als PDF exportieren</a>' +
      '<a class="bw-btn bw-btn--sekundaer" href="#/assistent?frage=' + encodeURIComponent(a.titel + "?") + '">Frage dazu stellen</a>' +
      merkKnopf("#/artikel/" + a.id, a.titel, "Artikel") +
      "</div>";
    return h;
  }
  function fmtInline(s) {
    // Reihenfolge: erst Querlinks, dann §§-Verlinkung — normVerlinken lässt
    // bestehende Links aus, damit [[id|§ 15 BBiG]] keinen Link im Link erzeugt.
    return normVerlinken(querlinks(esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")));
  }

  function artikelVerhalten(root, a, params) {
    var stufe = params.d ? Math.max(1, Math.min(3, parseInt(params.d, 10) || 2)) : detailStufe();
    var inhalt = $("#artikel-inhalt", root);

    function inhaltZeigen() {
      var teile = (a.abschnitte || []).filter(function (x) { return (x.d || 2) <= stufe; });
      if (!teile.length) {
        inhalt.innerHTML = stufe === 1
          ? '<p class="bw-leise bw-klein">Kurzübersicht: nur die Faktenliste oben. Für Erläuterungen „Standard“ oder „Ausführlich“ wählen.</p>'
          : "";
        return;
      }
      inhalt.innerHTML = teile.map(function (x) {
        return "<h2>" + esc(x.t) + "</h2>" + fmt(x.text);
      }).join("");
    }

    root.querySelectorAll(".detail-schalter button").forEach(function (b) {
      b.addEventListener("click", function () {
        stufe = parseInt(b.getAttribute("data-stufe"), 10);
        localStorage.setItem("aw.detail", String(stufe));
        root.querySelectorAll(".detail-schalter button").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x === b));
        });
        inhaltZeigen();
      });
    });

    // Rollen-Tabs (mit Pfeiltasten-Navigation)
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { tabWaehlen(i); });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); tabWaehlen((i + 1) % tabs.length); tabs[(i + 1) % tabs.length].focus(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); tabWaehlen((i + tabs.length - 1) % tabs.length); tabs[(i + tabs.length - 1) % tabs.length].focus(); }
      });
    });
    function tabWaehlen(i) {
      tabs.forEach(function (t, x) {
        t.setAttribute("aria-selected", String(x === i));
        t.setAttribute("tabindex", x === i ? "0" : "-1");
        var panel = $("#" + t.getAttribute("aria-controls"), root);
        if (panel) panel.hidden = x !== i;
      });
      var id = tabs[i].id.replace("tab-", "");
      localStorage.setItem("aw.rolle", id);
    }

    // Eigene Notiz (lokale Datenbank)
    var notizFeld = $("#artikel-notiz", root);
    if (notizFeld && window.LokalDB) {
      var notizStatus = $("#notiz-status", root);
      window.LokalDB.holen("notizen", a.id).then(function (n) {
        if (n && n.text) { notizFeld.value = n.text; notizStatus.textContent = "Gespeicherte Notiz geladen."; }
      });
      var notizTimer = null;
      notizFeld.addEventListener("input", function () {
        clearTimeout(notizTimer);
        notizTimer = setTimeout(function () {
          if (notizFeld.value.trim()) {
            window.LokalDB.speichern("notizen", { id: a.id, text: notizFeld.value, geaendert: Date.now() })
              .then(function () { notizStatus.textContent = "Notiz gespeichert."; },
                function () { notizStatus.textContent = "Notiz konnte nicht gespeichert werden (Speicher voll)."; });
          } else {
            window.LokalDB.loeschen("notizen", a.id).then(function () { notizStatus.textContent = "Notiz gelöscht."; });
          }
        }, 500);
      });
    }

    // FAQ per Deep-Link öffnen
    if (params.faq !== undefined) {
      var d = $("#faq-" + params.faq, root);
      if (d) { d.open = true; setTimeout(function () { d.scrollIntoView({ block: "center" }); }, 0); }
    }
    inhaltZeigen();
  }

  /* ---------------- Ansicht: Formulare & Quellen ------------------- */
  var TYP_FILTER = ["formular", "plan", "gesetz", "merkblatt", "portal", "video", "link"];

  function viewQuellen(params) {
    var aktiv = params.typ || "";
    var h = "<h1>Formulare &amp; Quellen</h1>" +
      '<p class="bw-unterzeile">Amtliche Vordrucke, Gesetze und geprüfte externe Angebote — durchsuchbar auch über die globale Suche (Strg+K)</p>';
    if (window.EINZELDATEI) {
      h += '<div class="bw-hinweis"><p><strong>Einzeldatei-Version:</strong> Die PDF-Dateien liegen dieser Datei nicht bei — die Einträge öffnen die jeweilige Online-Quelle. Im Ordner-/Intranet-Betrieb stehen alle Dateien lokal bereit.</p></div>';
    }
    h += '<div class="bw-search" style="max-width:34rem"><label for="qq" class="bw-skip-link">Quellen filtern</label>' +
      '<input id="qq" type="search" placeholder="Filtern: BAV, Urlaub, Ausbildungsplan …" aria-label="Quellen filtern">' +
      '<button type="button" aria-label="Suchen">' + ICON.suche + "</button></div>";
    h += '<ul class="chipzeile" role="group" aria-label="Nach Typ filtern">' +
      '<li><button class="chip" data-qtyp="" aria-pressed="' + (!aktiv) + '">Alle</button></li>';
    TYP_FILTER.forEach(function (t) {
      h += '<li><button class="chip" data-qtyp="' + t + '" aria-pressed="' + (aktiv === t) + '">' + TYP_NAME[t] + "</button></li>";
    });
    h += "</ul>";
    h += '<ul class="karten" id="quellen-liste"></ul>' +
      '<p class="leer" id="quellen-leer" hidden>Kein Eintrag passt zu Filter und Suchbegriff.</p>' +
      '<p class="stand-hinweis">Lokale Dateien: Herkunft und Stand je Datei in <code>formulare/QUELLEN.md</code>. ' +
      "Externe Einträge (↗) öffnen Angebote der jeweiligen öffentlichen Stelle — im reinen Offline-Betrieb nicht erreichbar. Stand der Sammlung: " + esc(window.QUELLEN ? window.QUELLEN.stand : "") + ".</p>";
    return h;
  }

  function quellenVerhalten(root, params) {
    var aktiv = params.typ || "";
    var eingabe = $("#qq", root);
    var liste = $("#quellen-liste", root);
    var leer = $("#quellen-leer", root);
    var alle = window.QUELLEN ? window.QUELLEN.eintraege : [];

    function zeigen() { mitUebergang(zeigenJetzt); }
    function zeigenJetzt() {
      var q = eingabe.value.trim();
      var eintraege = q ? suchenQuellen(q, 100) : alle.slice();
      if (aktiv) eintraege = eintraege.filter(function (e) { return e.typ === aktiv; });
      liste.innerHTML = eintraege.map(function (e) {
        var z = quelleZiel(e);
        var aktion = z.extern
          ? '<a class="bw-btn bw-btn--sekundaer" href="' + esc(z.href) + '" target="_blank" rel="noopener">Öffnen ↗</a>'
          : '<a class="bw-btn" href="' + esc(z.href) + '" target="_blank">PDF öffnen</a>' +
            ' <a class="chip chip--frage" href="' + esc(e.url) + '" target="_blank" rel="noopener">Quelle online ↗</a>';
        return '<li class="karte"><span class="etikett">' + esc(TYP_NAME[e.typ] || e.typ) + "</span>" +
          '<h3 style="margin-top:var(--bw-space-1)">' + (q ? S.highlight(e.titel, q) : esc(e.titel)) + "</h3>" +
          "<p>" + esc(e.beschreibung || "") + "</p>" +
          '<p class="bw-klein bw-leise">' + esc(e.herausgeber) + (e.stand ? " · Stand " + esc(e.stand) : "") + "</p>" +
          '<span class="meta">' + aktion + "</span></li>";
      }).join("");
      leer.hidden = eintraege.length > 0;
    }

    root.querySelectorAll(".chip[data-qtyp]").forEach(function (c) {
      c.addEventListener("click", function () {
        aktiv = c.getAttribute("data-qtyp");
        root.querySelectorAll(".chip[data-qtyp]").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x === c));
        });
        history.replaceState(null, "", "#/quellen" + (aktiv ? "?typ=" + aktiv : ""));
        zeigen();
      });
    });
    eingabe.addEventListener("input", zeigen);
    zeigenJetzt();
  }

  /* ---------------- Ansicht: E-Mail-Vorlagen ----------------------- */
  var VINDEX = [];
  (function bauenVorlagen() {
    var V = window.VORLAGEN;
    if (!V) return;
    V.vorlagen.forEach(function (v) {
      VINDEX.push({
        vorlage: v,
        felder: [
          [norm(v.titel), 5],
          [norm((v.stichworte || []).join(" ")), 4],
          [norm(v.betreff), 2],
          [norm(v.text), 1]
        ]
      });
    });
  })();

  function suchenVorlagen(q, limit) {
    var tokens = norm(q).split(" ").filter(function (t) { return t && !STOP[t]; });
    if (!tokens.length) tokens = norm(q).split(" ").filter(Boolean);
    if (!tokens.length) return [];
    var treffer = [];
    VINDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length; f++) {
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], rec.felder[f][0]);
            if (sc) best = Math.max(best, sc * rec.felder[f][1] * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; }
        summe += best;
      }
      if (summe > 0) treffer.push({ vorlage: rec.vorlage, score: summe });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    return treffer.slice(0, limit || 3).map(function (t) { return t.vorlage; });
  }

  /* ---------------- Suchindex: Schnellnachschlag ------------------- */
  var NINDEX = [];
  (function bauenNachschlag() {
    var N = window.NACHSCHLAG;
    if (!N) return;
    N.karten.forEach(function (k) {
      var inhalt = "";
      if (k.tabelle) inhalt += k.tabelle.spalten.join(" ") + " " + k.tabelle.zeilen.map(function (z) { return z.join(" "); }).join(" ");
      if (k.liste) inhalt += k.liste.map(function (e) { return e.t + " " + e.text; }).join(" ");
      NINDEX.push({
        karte: k,
        felder: [
          [norm(k.titel), 5],
          [norm((k.stichworte || []).join(" ")), 4],
          [norm(k.kurz || ""), 2],
          [norm(inhalt), 1]
        ]
      });
    });
  })();

  function suchenNachschlag(q, limit) {
    var tokens = norm(q).split(" ").filter(function (t) { return t && !STOP[t]; });
    if (!tokens.length) return [];
    var treffer = [];
    NINDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length; f++) {
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], rec.felder[f][0]);
            if (sc) best = Math.max(best, sc * rec.felder[f][1] * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; }
        summe += best;
      }
      if (summe > 0) treffer.push({ karte: rec.karte, score: summe });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    return treffer.slice(0, limit || 2).map(function (t) { return t.karte; });
  }

  function platzhalterVon(v) {
    var m = (v.betreff + " " + v.text).match(/\[([A-ZÄÖÜ_]+)\]/g) || [];
    var seen = {}, aus = [];
    m.forEach(function (x) {
      var k = x.slice(1, -1);
      if (!seen[k]) { seen[k] = 1; aus.push(k); }
    });
    return aus;
  }
  /* --- G2: Feldtypen, Vorbelegung und Eingabe-Historie ------------- */
  var DATUMSFELDER = { TERMIN: 1, FRIST: 1, ANTRAGSFRIST: 1, ANMELDESCHLUSS: 1, AUSBILDUNGSBEGINN: 1, PRUEFUNGSDATUM: 1, DATUM_ENDE: 1, NEUES_ENDE: 1 };
  var FRISTFELDER = { FRIST: 1, ANTRAGSFRIST: 1, ANMELDESCHLUSS: 1 }; // Vorbelegung: heute + 14 Tage

  function heuteISO(tagePlus) {
    var d = new Date();
    if (tagePlus) d.setDate(d.getDate() + tagePlus);
    return d.toISOString().slice(0, 10);
  }
  function deDatum(iso) {
    if (!iso) return "";
    var t = iso.split("-");
    return t.length === 3 ? t[2] + "." + t[1] + "." + t[0] : iso;
  }
  function isoVonDe(de) {
    var m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(String(de || "").trim());
    if (!m) return "";
    function p(x) { return (x.length < 2 ? "0" : "") + x; }
    return m[3] + "-" + p(m[2]) + "-" + p(m[1]);
  }
  function berufsTitelListe() {
    if (!window.BERUFE) return ["Gärtner/in"];
    return window.BERUFE.berufe.filter(function (b) { return !b.sonderweg; }).map(function (b) { return b.titel; });
  }
  function fachrichtungenFuerBeruf(berufTitel) {
    if (!window.BERUFE) return [];
    var b = null;
    window.BERUFE.berufe.forEach(function (x) { if (x.titel === berufTitel) b = x; });
    if (!b) return [];
    if (b.id === "gartenbaufachwerker") return fachrichtungenFuerBeruf("Gärtner/in");
    return (b.fachrichtungen || []).slice();
  }
  function pruefungstermine() {
    var j = new Date().getFullYear();
    return ["Sommertermin " + j, "Wintertermin " + j + "/" + (j + 1), "Sommertermin " + (j + 1)];
  }
  function feldDefFuer(k) {
    if (k === "BERUF") return { typ: "auswahl", optionen: berufsTitelListe(), standard: "Gärtner/in" };
    if (k === "FACHRICHTUNG") return { typ: "auswahl", abhaengigVon: "BERUF" };
    if (k === "PRUEFUNGSTERMIN") return { typ: "auswahl", optionen: pruefungstermine() };
    if (DATUMSFELDER[k]) return { typ: "datum", vorISO: heuteISO(FRISTFELDER[k] ? 14 : 0) };
    return { typ: "text" };
  }
  function historieLesen() {
    try { return JSON.parse(localStorage.getItem("aw.vorlagenhistorie") || "{}"); } catch (e) { return {}; }
  }
  function historieMerken(werte, ph) {
    try {
      var h = historieLesen();
      ph.forEach(function (k) {
        if (feldDefFuer(k).typ !== "text") return;
        var wert = String(werte[k] || "").trim();
        if (!wert || wert.length < 2) return;
        var liste = (h[k] || []).filter(function (x) { return x !== wert; });
        liste.unshift(wert);
        h[k] = liste.slice(0, 8);
      });
      localStorage.setItem("aw.vorlagenhistorie", JSON.stringify(h));
    } catch (e) {}
  }

  function werteLesen() {
    try { return JSON.parse(localStorage.getItem("aw.vorlagenwerte") || "{}"); } catch (e) { return {}; }
  }
  function werteSchreiben(w) {
    try { localStorage.setItem("aw.vorlagenwerte", JSON.stringify(w)); } catch (e) {}
  }
  function vorlageFuellen(text, werte) {
    // **Fett**-Auszeichnung entfernen — E-Mails sind Reintext.
    var erg = text.replace(/\*\*/g, "").replace(/\[([A-ZÄÖÜ_]+)\]/g, function (_, k) {
      var wert = (werte[k] || "").trim();
      if (wert) return wert;
      // Bewusst leere Auswahl (z. B. Fachrichtung „entfällt") füllt mit
      // Leerstring, offene Felder bleiben als [PLATZHALTER] sichtbar.
      return Object.prototype.hasOwnProperty.call(werte, k) && werte[k] === "" && (k === "FACHRICHTUNG") ? "" : "[" + k + "]";
    });
    // Leergelaufene Fachrichtungs-Floskeln aufräumen (Beruf ohne Fachrichtungen).
    return erg
      .replace(/,\s*Fachrichtung\s*(,|\))/g, "$1")
      .replace(/\s*\(Fachrichtung:?\s*\)/g, "")
      .replace(/\s*in der Fachrichtung\s*(\.|,|\n)/g, "$1");
  }

  function viewVorlagen(params) {
    var V = window.VORLAGEN;
    if (!V) return platzhalter("E-Mail-Vorlagen", "Vorlagenmodul nicht geladen.");
    if (params.id) {
      var v = null;
      V.vorlagen.forEach(function (x) { if (x.id === params.id) v = x; });
      if (!v) return platzhalter("Vorlage nicht gefunden", "Zurück zur Übersicht: #/vorlagen");
      return viewVorlageDetail(v);
    }
    var aktiv = params.kat || "";
    var h = "<h1>E-Mail-Vorlagen</h1>" +
      '<p class="bw-unterzeile">Formulierungsvorlagen für den Alltag der zuständigen Stelle — Platzhalter ausfüllen, kopieren, versenden</p>';
    h += '<ul class="chipzeile" role="group" aria-label="Nach Kategorie filtern">' +
      '<li><button class="chip" data-vkat="" aria-pressed="' + (!aktiv) + '">Alle</button></li>';
    V.kategorien.forEach(function (k) {
      h += '<li><button class="chip" data-vkat="' + k.id + '" aria-pressed="' + (aktiv === k.id) + '">' + esc(k.titel) + "</button></li>";
    });
    h += "</ul>";
    h += '<ul class="karten" id="vorlagen-liste"></ul>';
    h += '<p class="stand-hinweis">Vorlagen sind Formulierungshilfen — vor Versand fachlich prüfen und anpassen. Stand: ' + esc(V.stand) + ".</p>";
    return h;
  }

  function vorlagenVerhalten(root, params) {
    if (params.id) { vorlageDetailVerhalten(root, params); return; }
    var V = window.VORLAGEN;
    var aktiv = params.kat || "";
    var liste = $("#vorlagen-liste", root);
    function zeigen() { mitUebergang(zeigenJetzt); }
    function zeigenJetzt() {
      var vs = V.vorlagen.filter(function (v) { return !aktiv || v.kategorie === aktiv; });
      liste.innerHTML = vs.map(function (v) {
        var kat = V.kategorien.filter(function (k) { return k.id === v.kategorie; })[0];
        return '<li class="karte"><a class="karte__link" href="#/vorlagen?id=' + v.id + '">' +
          '<span class="etikett">' + esc(kat ? kat.titel : "") + "</span>" +
          '<h3 style="margin-top:var(--bw-space-1)">' + esc(v.titel) + "</h3>" +
          "<p>" + esc(v.betreff) + "</p></a></li>";
      }).join("");
    }
    root.querySelectorAll(".chip[data-vkat]").forEach(function (c) {
      c.addEventListener("click", function () {
        aktiv = c.getAttribute("data-vkat");
        root.querySelectorAll(".chip[data-vkat]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
        history.replaceState(null, "", "#/vorlagen" + (aktiv ? "?kat=" + aktiv : ""));
        zeigen();
      });
    });
    zeigenJetzt();
  }

  function viewVorlageDetail(v) {
    var werte = werteLesen();
    var ph = platzhalterVon(v);
    var h = '<nav class="crumb" aria-label="Pfad"><a href="#/vorlagen">E-Mail-Vorlagen</a></nav>';
    h += "<h1>" + esc(v.titel) + "</h1>";
    if (v.hinweise) h += '<div class="bw-hinweis"><p><strong>Hinweis:</strong> ' + fmtInline(v.hinweise) + "</p></div>";
    h += '<div class="vorlage-raster">';
    h += '<section aria-label="Angaben"><h2>Angaben</h2>' +
      '<p class="bw-klein bw-leise">Auswahlfelder und Datum sind vorbelegt; Textfelder schlagen frühere Eingaben vor.</p>' +
      '<div class="platzhalter-felder">';
    var historie = historieLesen();
    ph.forEach(function (k) {
      var label = k.replace(/_/g, " ").toLowerCase();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      var def = feldDefFuer(k);
      var wert = werte[k] || "";
      h += '<div class="bw-field"><label for="ph-' + k + '">' + esc(label) + "</label>";
      if (def.typ === "auswahl") {
        var optionen = def.abhaengigVon ? fachrichtungenFuerBeruf(werte.BERUF || "Gärtner/in") : def.optionen;
        var gewaehlt = optionen.indexOf(wert) >= 0 ? wert : (def.standard && optionen.indexOf(def.standard) >= 0 ? def.standard : optionen[0] || "");
        h += '<select id="ph-' + k + '" data-ph="' + k + '"' + (def.abhaengigVon ? ' data-abhaengig="' + def.abhaengigVon + '"' : "") +
          (optionen.length ? "" : " disabled") + ">";
        if (!optionen.length) h += '<option value="">— entfällt bei diesem Beruf —</option>';
        optionen.forEach(function (o) {
          h += '<option value="' + esc(o) + '"' + (o === gewaehlt ? " selected" : "") + ">" + esc(o) + "</option>";
        });
        h += "</select>";
      } else if (def.typ === "datum") {
        var iso = isoVonDe(wert) || def.vorISO;
        h += '<input type="date" id="ph-' + k + '" data-ph="' + k + '" value="' + esc(iso) + '">';
      } else {
        h += '<input id="ph-' + k + '" data-ph="' + k + '" value="' + esc(wert) + '" list="hist-' + k + '" autocomplete="off">';
        h += '<datalist id="hist-' + k + '">' + (historie[k] || []).map(function (v) {
          return '<option value="' + esc(v) + '"></option>';
        }).join("") + "</datalist>";
      }
      h += "</div>";
    });
    h += "</div></section>";
    h += '<section aria-label="Vorschau"><h2>Vorschau</h2>' +
      '<div class="bw-field"><label for="v-betreff">Betreff</label><input id="v-betreff" readonly></div>' +
      '<div class="bw-field"><label for="v-text">Text</label><textarea id="v-text" rows="18" readonly></textarea></div>' +
      '<div class="export-aktionen">' +
      '<button class="bw-btn" id="v-kopieren" type="button">Text kopieren</button>' +
      '<button class="bw-btn bw-btn--sekundaer" id="v-betreff-kopieren" type="button">Betreff kopieren</button>' +
      '<a class="bw-btn bw-btn--sekundaer" id="v-mailto" href="#">Im E-Mail-Programm öffnen</a>' +
      '<span class="bw-klein bw-leise" id="v-status" role="status"></span></div></section>';
    h += "</div>";
    if ((v.anhaenge || []).length && window.QUELLEN) {
      h += "<h2>Empfohlene Anhänge</h2><ul class=\"quellen-liste\">";
      v.anhaenge.forEach(function (id) {
        var e = null;
        window.QUELLEN.eintraege.forEach(function (x) { if (x.id === id) e = x; });
        if (!e) return;
        var z = quelleZiel(e);
        h += '<li><a href="' + esc(z.href) + '" target="_blank" rel="noopener"><span class="etikett">' +
          esc(TYP_NAME[e.typ] || e.typ) + "</span> " + esc(e.titel) + (z.extern ? ' <span class="bw-leise">↗ online</span>' : "") + "</a></li>";
      });
      h += "</ul>";
    }
    if ((v.artikel || []).length) {
      h += '<h2>Fachlicher Hintergrund</h2><ul class="chipzeile">' +
        v.artikel.map(function (id) {
          var a = artikelVon(id);
          return a ? '<li><a class="chip chip--frage" href="#/artikel/' + id + '">' + esc(a.titel) + "</a></li>" : "";
        }).join("") + "</ul>";
    }
    return h;
  }

  function vorlageDetailVerhalten(root, params) {
    var V = window.VORLAGEN;
    var v = null;
    V.vorlagen.forEach(function (x) { if (x.id === params.id) v = x; });
    if (!v) return;
    var betreffFeld = $("#v-betreff", root), textFeld = $("#v-text", root), status = $("#v-status", root);
    var ph = platzhalterVon(v);

    function feldwert(feld) {
      if (feld.type === "date") return deDatum(feld.value);
      return feld.value;
    }
    function aktualisieren() {
      var werte = werteLesen();
      root.querySelectorAll("[data-ph]").forEach(function (i) { werte[i.getAttribute("data-ph")] = feldwert(i); });
      werteSchreiben(werte);
      betreffFeld.value = vorlageFuellen(v.betreff, werte);
      textFeld.value = vorlageFuellen(v.text, werte);
      $("#v-mailto", root).setAttribute("href",
        "mailto:?subject=" + encodeURIComponent(betreffFeld.value) + "&body=" + encodeURIComponent(textFeld.value));
    }
    function merken() { historieMerken(werteLesen(), ph); }
    function kopieren(text, meldung) {
      function ok() { status.textContent = meldung; merken(); }
      function fallback() { textFeld.select(); document.execCommand && document.execCommand("copy"); ok(); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, fallback);
      } else fallback();
    }
    root.querySelectorAll("[data-ph]").forEach(function (i) {
      i.addEventListener("input", aktualisieren);
      i.addEventListener("change", aktualisieren);
    });
    // Beruf gewählt → Fachrichtungs-Auswahl passend neu befüllen
    var berufFeld = root.querySelector('[data-ph="BERUF"]');
    var frFeld = root.querySelector('[data-ph="FACHRICHTUNG"][data-abhaengig]');
    if (berufFeld && frFeld) {
      berufFeld.addEventListener("change", function () {
        var optionen = fachrichtungenFuerBeruf(berufFeld.value);
        var alt = frFeld.value;
        frFeld.innerHTML = optionen.length
          ? optionen.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("")
          : '<option value="">— entfällt bei diesem Beruf —</option>';
        frFeld.disabled = !optionen.length;
        if (optionen.indexOf(alt) >= 0) frFeld.value = alt;
        aktualisieren();
      });
    }
    $("#v-kopieren", root).addEventListener("click", function () { kopieren(textFeld.value, "Text kopiert."); });
    $("#v-betreff-kopieren", root).addEventListener("click", function () { kopieren(betreffFeld.value, "Betreff kopiert."); });
    $("#v-mailto", root).addEventListener("click", merken);
    aktualisieren();
  }

  /* ---------------- Ansicht: Download-Center ----------------------- */
  function downloadBaum() {
    var E = window.QUELLEN ? window.QUELLEN.eintraege : [];
    function nach(f) { return E.filter(f); }
    var baum = [
      { titel: "Verträge & Anträge", eintraege: nach(function (e) { return e.typ === "formular"; }) },
      { titel: "Betriebliche Ausbildungspläne", kinder: [
        { titel: "Gärtner/in (7 Fachrichtungen)", eintraege: nach(function (e) { return e.id.indexOf("plan-gaertner-") === 0; }) },
        { titel: "Fachwerker/in (7 Fachrichtungen)", eintraege: nach(function (e) { return e.id.indexOf("plan-fachwerker-") === 0; }) }
      ] },
      { titel: "Tabellen & Merkblätter", eintraege: nach(function (e) { return e.typ === "merkblatt"; }) },
      { titel: "Gesetze & Verordnungen", eintraege: nach(function (e) { return e.typ === "gesetz" && e.id.indexOf("ausbv-") !== 0 || e.id.indexOf("gesetz-") === 0; }) },
      { titel: "Ausbildungsordnungen der grünen Berufe", eintraege: nach(function (e) { return e.id.indexOf("ausbv-") === 0; }) },
      { titel: "Prüfung, Berufsschule & Berichtsheft", eintraege: nach(function (e) {
        return ["pflanzenlisten", "schule-anmeldungen", "berichtsheft-gaertner", "berichtsheft-galabau"].indexOf(e.id) >= 0; }) },
      { titel: "Förderung & Arbeitsagentur", eintraege: nach(function (e) { return e.id.indexOf("ba-") === 0; }) },
      { titel: "Arbeitsschutz (SVLFG)", eintraege: nach(function (e) { return e.id.indexOf("svlfg") === 0; }) },
      { titel: "Portale der zuständigen Stelle", eintraege: nach(function (e) { return e.id.indexOf("rp-") === 0; }) },
      { titel: "Weitere öffentliche Stellen (LRA Karlsruhe, BiBB, Bildungsserver)", eintraege: nach(function (e) {
        return /^(lra-|ka-|bibb-|bildungsserver|lw-)/.test(e.id); }) }
    ];
    if (EIGENE.dokumente.length) {
      baum.unshift({ titel: "Eigene Dokumente", eintraege: EIGENE.dokumente.slice() });
    }
    return baum;
  }

  function baumKnoten(knoten, filterTokens) {
    function passt(e) {
      if (!filterTokens.length) return true;
      var hay = norm(e.titel + " " + (e.stichworte || []).join(" ") + " " + (e.beschreibung || ""));
      return filterTokens.every(function (tok) {
        return tokenAlternativen(tok).some(function (al) { return tokenScore(al, hay) > 0; });
      });
    }
    var eintraege = (knoten.eintraege || []).filter(passt);
    var kinderHtml = "", kinderAnzahl = 0;
    (knoten.kinder || []).forEach(function (k) {
      var sub = baumKnoten(k, filterTokens);
      kinderHtml += sub.html;
      kinderAnzahl += sub.anzahl;
    });
    var anzahl = eintraege.length + kinderAnzahl;
    if (!anzahl) return { html: "", anzahl: 0 };
    var offen = filterTokens.length ? " open" : "";
    var h = "<details" + offen + "><summary>" + esc(knoten.titel) +
      ' <span class="etikett">' + anzahl + "</span></summary>";
    if (eintraege.length) {
      h += '<ul class="baum-liste">' + eintraege.map(function (e) {
        var z = quelleZiel(e);
        return '<li><a href="' + esc(z.href) + '"' + (z.download ? ' download="' + esc(z.download) + '"' : ' target="_blank" rel="noopener"') + '>' + esc(e.titel) +
          (z.extern ? ' <span class="bw-leise">↗</span>' : "") + "</a>" +
          '<span class="bw-klein bw-leise"> — ' + esc(e.herausgeber) + (e.stand ? ", Stand " + esc(e.stand) : "") + "</span></li>";
      }).join("") + "</ul>";
    }
    h += kinderHtml + "</details>";
    return { html: h, anzahl: anzahl };
  }

  function viewDownloads() {
    var h = "<h1>Download-Center</h1>" +
      '<p class="bw-unterzeile">Alle Dokumente und geprüften Quellen — thematisch sortiert</p>';
    if (window.EINZELDATEI) {
      h += '<div class="bw-hinweis"><p><strong>Einzeldatei-Version:</strong> Einträge öffnen die jeweilige Online-Quelle; im Ordner-/Intranet-Betrieb liegen die Dateien lokal bei.</p></div>';
    }
    h += '<div class="bw-search" style="max-width:34rem"><label for="dq" class="bw-skip-link">Downloads filtern</label>' +
      '<input id="dq" type="search" placeholder="Filtern: BAV, Urlaub, Gesetz …" aria-label="Downloads filtern">' +
      '<button type="button" aria-label="Suchen">' + ICON.suche + "</button></div>" +
      '<p class="bw-klein"><button class="chip" id="baum-auf" type="button">Alle aufklappen</button> ' +
      '<button class="chip" id="baum-zu" type="button">Alle zuklappen</button></p>' +
      '<div class="baum" id="download-baum"></div>' +
      '<p class="stand-hinweis">Lokale Dateien mit Herkunftsnachweis in <code>formulare/QUELLEN.md</code>; Einträge mit ↗ öffnen externe Angebote öffentlicher Stellen.</p>';
    return h;
  }

  function downloadsVerhalten(root) {
    var eingabe = $("#dq", root), ziel = $("#download-baum", root);
    function zeigen() { mitUebergang(zeigenJetzt); }
    function zeigenJetzt() {
      var tokens = norm(eingabe.value).split(" ").filter(function (t) { return t && !STOP[t]; });
      var html = "", gesamt = 0;
      downloadBaum().forEach(function (k) {
        var sub = baumKnoten(k, tokens);
        html += sub.html; gesamt += sub.anzahl;
      });
      ziel.innerHTML = gesamt ? html : '<p class="leer">Kein Dokument passt zum Filter.</p>';
    }
    eingabe.addEventListener("input", zeigen);
    $("#baum-auf", root).addEventListener("click", function () {
      root.querySelectorAll(".baum details").forEach(function (d) { d.open = true; });
    });
    $("#baum-zu", root).addEventListener("click", function () {
      root.querySelectorAll(".baum details").forEach(function (d) { d.open = false; });
    });
    zeigenJetzt();
  }

  /* ---------------- Ansicht: Schnellnachschlag --------------------- */
  function viewNachschlag() {
    var N = window.NACHSCHLAG;
    if (!N) return platzhalter("Schnellnachschlag", "Nachschlagemodul nicht geladen.");
    var h = "<h1>Schnellnachschlag</h1>" +
      '<p class="bw-unterzeile">Tarif- und Urlaubstabellen, Fristen, Arbeitszeit und die Eigenheiten der Fachrichtungen — kompakt für die Beratung</p>';
    h += '<ul class="chipzeile" aria-label="Direkt zu einer Karte springen">' +
      N.karten.map(function (k) { return '<li><a class="chip" href="#/nachschlag?karte=' + k.id + '">' + esc(k.titel.split(" (")[0].split(":")[0]) + "</a></li>"; }).join("") + "</ul>";

    N.karten.forEach(function (k) {
      h += '<section class="nachschlag-karte bw-card" id="n-' + esc(k.id) + '" aria-labelledby="nt-' + esc(k.id) + '" tabindex="-1">';
      h += '<div class="karten-kopf"><h2 id="nt-' + esc(k.id) + '">' + esc(k.titel) + "</h2>" +
        merkKnopf("#/nachschlag?karte=" + k.id, k.titel.split(" — ")[0], "Nachschlag") +
        '<button type="button" class="bw-iconbtn druck-knopf" data-druck-karte="' + esc(k.id) +
        '" title="Karte drucken (A4-Handout)" aria-label="Karte drucken">' + ICON.drucker + "</button></div>";
      if (k.kurz) h += '<p class="bw-klein">' + fmtInline(k.kurz) + "</p>";
      if (k.rechner) h += rechnerHtml(k.rechner);
      if (k.jahreskreis) h += jahreskreisHtml(k.jahreskreis);
      if (k.tabelle) {
        h += '<div class="tabellen-rahmen"><table class="bw-table"><thead><tr>' +
          k.tabelle.spalten.map(function (s) { return "<th scope=\"col\">" + esc(s) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          k.tabelle.zeilen.map(function (z, i) {
            return '<tr' + (k.tabelle.markiereZeile === i ? ' class="zeile--aktuell"' : "") + ">" +
              z.map(function (zelle, s) { return s === 0 ? '<th scope="row">' + esc(zelle) + "</th>" : "<td>" + fmtInline(zelle) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>";
      }
      if (k.liste) {
        h += '<div class="fach-raster">' + k.liste.map(function (e) {
          var link = "";
          if (e.quelle && window.QUELLEN) {
            var q = null;
            window.QUELLEN.eintraege.forEach(function (x) { if (x.id === e.quelle) q = x; });
            if (q) {
              var z = quelleZiel(q);
              link = '<a class="chip" href="' + esc(z.href) + '"' + (z.download ? ' download="' + esc(z.download) + '"' : ' target="_blank" rel="noopener"') + ">Ausbildungsplan" + (z.extern ? " ↗" : "") + "</a>";
            }
          }
          return '<div class="fach-karte"><h3>' + esc(e.t) + "</h3><p>" + esc(e.text) + "</p>" + link + "</div>";
        }).join("") + "</div>";
      }
      if (k.fussnote) h += '<p class="bw-klein bw-leise">' + fmtInline(k.fussnote) + "</p>";
      var chips = "";
      if (k.recht) chips += '<span class="etikett etikett--recht">' + normVerlinken(esc(k.recht)) + "</span>";
      (k.artikel || []).forEach(function (id) {
        var a = artikelVon(id);
        if (a) chips += '<a class="chip chip--frage" href="#/artikel/' + esc(id) + '">' + esc(a.titel) + "</a>";
      });
      (k.quellen || []).forEach(function (id) {
        var q = null;
        if (window.QUELLEN) window.QUELLEN.eintraege.forEach(function (x) { if (x.id === id) q = x; });
        if (q) {
          var z2 = quelleZiel(q);
          chips += '<a class="chip" href="' + esc(z2.href) + '"' + (z2.download ? ' download="' + esc(z2.download) + '"' : ' target="_blank" rel="noopener"') + ">" + esc(q.titel) + (z2.extern ? " ↗" : "") + "</a>";
        }
      });
      if (chips) h += '<div class="chipzeile-frei">' + chips + "</div>";
      h += "</section>";
    });
    h += '<p class="stand-hinweis">' + esc(N.hinweis) + " Stand: " + esc(N.stand) + ".</p>";
    return h;
  }

  /* ---- Rechner (R4): Formulare + Live-Berechnung ------------------ */
  var MIAV = {
    2024: [649.00, 765.82, 876.15, 908.60],
    2025: [682.00, 804.76, 920.70, 954.80],
    2026: [724.00, 854.32, 977.40, 1013.60]
  };
  function euro(n) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }
  function rechnerHtml(art) {
    var jahr = new Date().getFullYear();
    var h = '<div class="rechner-form" data-rechner="' + esc(art) + '">';
    if (art === "urlaub") {
      h += '<div class="bw-field"><label for="ru-geb">Geburtsdatum</label><input type="date" id="ru-geb"></div>' +
        '<div class="bw-field"><label for="ru-jahr">Urlaubsjahr</label><select id="ru-jahr">' +
        [jahr - 1, jahr, jahr + 1].map(function (j) { return '<option' + (j === jahr ? " selected" : "") + ">" + j + "</option>"; }).join("") +
        "</select></div>";
    } else if (art === "verguetung") {
      h += '<div class="bw-field"><label for="rv-beginn">Jahr des Ausbildungsbeginns</label><select id="rv-beginn">' +
        Object.keys(MIAV).map(function (j) { return '<option' + (String(jahr) === j ? " selected" : "") + ">" + j + "</option>"; }).join("") +
        "</select></div>" +
        '<div class="bw-field"><label for="rv-jahr">Ausbildungsjahr</label><select id="rv-jahr">' +
        [1, 2, 3, 4].map(function (n) { return "<option value=\"" + n + "\">" + n + ". Jahr</option>"; }).join("") +
        "</select></div>";
    } else if (art === "fristen") {
      h += '<div class="bw-field"><label for="rf-beginn">Ausbildungsbeginn</label><input type="date" id="rf-beginn" value="' + jahr + '-09-01"></div>' +
        '<div class="bw-field"><label for="rf-monate">Probezeit</label><select id="rf-monate">' +
        [1, 2, 3, 4].map(function (n) { return '<option value="' + n + '"' + (n === 4 ? " selected" : "") + ">" + n + " Monat" + (n > 1 ? "e" : "") + "</option>"; }).join("") +
        "</select></div>" +
        '<div class="bw-field"><label for="rf-pruefung">Nicht bestandene Abschlussprüfung am (optional)</label><input type="date" id="rf-pruefung"></div>';
    } else if (art === "teilzeit") {
      h += '<div class="bw-field"><label for="rt-dauer">Reguläre Ausbildungsdauer</label><select id="rt-dauer">' +
        [[24, "24 Monate (verkürzt)"], [36, "36 Monate (Regelfall)"], [42, "42 Monate"]].map(function (o) {
          return '<option value="' + o[0] + '"' + (o[0] === 36 ? " selected" : "") + ">" + o[1] + "</option>";
        }).join("") + "</select></div>" +
        '<div class="bw-field"><label for="rt-prozent">Teilzeitanteil</label><select id="rt-prozent">' +
        [50, 60, 70, 75, 80].map(function (p) { return '<option value="' + p + '"' + (p === 75 ? " selected" : "") + ">" + p + " % der Vollzeit</option>"; }).join("") +
        "</select></div>";
    } else if (art === "fahrplan") {
      h += '<div class="bw-field"><label for="rp-beginn">Ausbildungsbeginn</label><input type="date" id="rp-beginn" value="' + jahr + '-09-01"></div>' +
        '<div class="bw-field"><label for="rp-dauer">Dauer</label><select id="rp-dauer">' +
        [[24, "24 Monate (verkürzt)"], [30, "30 Monate"], [36, "36 Monate (Regelfall)"], [42, "42 Monate"]].map(function (o) {
          return '<option value="' + o[0] + '"' + (o[0] === 36 ? " selected" : "") + ">" + o[1] + "</option>";
        }).join("") + "</select></div>" +
        '<div class="bw-field"><label for="rp-probezeit">Probezeit</label><select id="rp-probezeit">' +
        [1, 2, 3, 4].map(function (n) { return '<option value="' + n + '"' + (n === 4 ? " selected" : "") + ">" + n + " Monat" + (n > 1 ? "e" : "") + "</option>"; }).join("") +
        "</select></div>" +
        '<div class="bw-field"><label for="rp-geb">Geburtsdatum (optional, für Jugendschutz-Fristen)</label><input type="date" id="rp-geb"></div>';
    } else if (art === "noten") {
      // Gewichtungs-Schaubild (Grau-Basis, Outline, keine Deko) + 9 Notenfelder
      h = '<div class="noten-schaubild" aria-hidden="true"><svg viewBox="0 0 600 92" class="noten-svg">' +
        '<rect x="1" y="8" width="358" height="34" rx="4" fill="var(--bw-cat-1)" stroke="var(--bw-chart-outline)" stroke-width="1"></rect>' +
        [1, 2, 3, 4].map(function (i) { return '<line x1="' + (1 + i * 71.6) + '" y1="9" x2="' + (1 + i * 71.6) + '" y2="41" stroke="var(--bw-chart-outline)" stroke-width="1"></line>'; }).join("") +
        '<rect x="363" y="8" width="236" height="34" rx="4" fill="var(--bw-cat-2)" stroke="var(--bw-chart-outline)" stroke-width="1"></rect>' +
        [1, 2, 3].map(function (i) { return '<line x1="' + (363 + i * 59) + '" y1="9" x2="' + (363 + i * 59) + '" y2="41" stroke="var(--bw-chart-outline)" stroke-width="1"></line>'; }).join("") +
        '<text x="180" y="30" text-anchor="middle" class="noten-svg-label">Praktische Prüfung — 60 %</text>' +
        '<text x="481" y="30" text-anchor="middle" class="noten-svg-label">Prüfungsfächer — 40 %</text>' +
        '<text x="180" y="62" text-anchor="middle" class="noten-svg-klein">5 Aufgaben mit Prüfungsgespräch · je 12 % vom Gesamt</text>' +
        '<text x="481" y="62" text-anchor="middle" class="noten-svg-klein">1 mündliches + 3 schriftliche Fächer · je 10 %</text>' +
        '<text x="300" y="84" text-anchor="middle" class="noten-svg-klein">Bestanden: Gesamt, Praxis und Fächer mindestens ausreichend — keine Sechs, höchstens eine Fünf</text>' +
        "</svg></div>" + h;
      function notenFeld(id, label) {
        return '<div class="bw-field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' +
          [1, 2, 3, 4, 5, 6].map(function (n) { return '<option value="' + n + '"' + (n === 3 ? " selected" : "") + ">" + n + "</option>"; }).join("") +
          "</select></div>";
      }
      h += '<p class="bw-klein"><strong>Praktische Prüfung</strong> — Noten der fünf Aufgaben:</p>';
      for (var na = 1; na <= 5; na++) h += notenFeld("no-a" + na, "Aufgabe " + na);
      h += '<p class="bw-klein"><strong>Prüfungsfächer</strong> — Fachbezeichnungen je Fachrichtung (§§ 9–15 GärtnAusbV):</p>' +
        notenFeld("no-f1", "Mündliches Fach (z. B. Kulturführung)") +
        notenFeld("no-f2", "Pflanzenkenntnisse (schriftlich)") +
        notenFeld("no-f3", "Betriebliche Zusammenhänge (schriftlich)") +
        notenFeld("no-f4", "Wirtschafts- und Sozialkunde (schriftlich)");
    }
    if (art === "noten") {
      h += "</div>" + '<div class="rechner-ergebnis rechner-ergebnis--plan" id="re-noten" role="status" aria-live="polite"></div>';
    } else if (art === "fahrplan") {
      h += "</div>" + '<div class="rechner-ergebnis rechner-ergebnis--plan" id="re-fahrplan" role="status" aria-live="polite"></div>';
    } else {
      h += "</div>" + '<p class="rechner-ergebnis" id="re-' + esc(art) + '" role="status" aria-live="polite"></p>';
    }
    return h;
  }

  function rechnerRechnen(root, art) {
    var ziel = $("#re-" + art, root);
    if (!ziel) return;
    function wert(id) { var f = $(id, root); return f ? f.value : ""; }
    if (art === "urlaub") {
      var geb = wert("#ru-geb"), jahrU = parseInt(wert("#ru-jahr"), 10);
      if (!geb) { ziel.textContent = "Geburtsdatum eingeben — der Anspruch erscheint sofort."; return; }
      var stichtag = new Date(jahrU, 0, 1);
      var g = new Date(geb);
      var alter = stichtag.getFullYear() - g.getFullYear();
      if (new Date(stichtag.getFullYear(), g.getMonth(), g.getDate()) > stichtag) alter--;
      var werktage, grundlage;
      if (alter < 16) { werktage = 30; grundlage = "§ 19 JArbSchG (unter 16)"; }
      else if (alter < 17) { werktage = 27; grundlage = "§ 19 JArbSchG (unter 17)"; }
      else if (alter < 18) { werktage = 25; grundlage = "§ 19 JArbSchG (unter 18)"; }
      else { werktage = 24; grundlage = "§ 3 BUrlG (volljährig)"; }
      var arbeitstage = { 30: 25, 27: 23, 25: 21, 24: 20 }[werktage];
      ziel.innerHTML = "<strong>" + werktage + " Werktage</strong> Mindesturlaub im Jahr " + jahrU +
        " (Alter am 1. Januar: " + alter + ") — entspricht " + arbeitstage +
        " Arbeitstagen in der 5-Tage-Woche (aufgerundet). Grundlage: " + esc(grundlage) + ". Tarifverträge geben oft mehr.";
    } else if (art === "verguetung") {
      var beginn = wert("#rv-beginn"), aj = parseInt(wert("#rv-jahr"), 10);
      var reihe = MIAV[beginn];
      if (!reihe) { ziel.textContent = ""; return; }
      ziel.innerHTML = "<strong>" + euro(reihe[aj - 1]) + "</strong> brutto/Monat Mindestvergütung im " + aj +
        ". Ausbildungsjahr (Beginn " + esc(beginn) + ", § 17 BBiG). Tarifgebundene Betriebe zahlen nach Tarif; " +
        "nicht tarifgebundene höchstens 20 % unter Branchentarif.";
    } else if (art === "fristen") {
      var b = wert("#rf-beginn"), monate = parseInt(wert("#rf-monate"), 10);
      var teile = [];
      if (b) {
        var start = new Date(b);
        var ende = new Date(start);
        ende.setMonth(ende.getMonth() + monate);
        ende.setDate(ende.getDate() - 1);
        teile.push("<strong>Probezeit bis " + ende.toLocaleDateString("de-DE") + "</strong> (" + monate +
          " Monate ab " + start.toLocaleDateString("de-DE") + ", § 20 BBiG)");
      }
      var pr = wert("#rf-pruefung");
      if (pr) {
        var spaet = new Date(pr);
        spaet.setFullYear(spaet.getFullYear() + 1);
        teile.push("Verlängerung nach Nichtbestehen: auf Verlangen bis zur nächsten Wiederholungsprüfung, " +
          "<strong>spätestens bis " + spaet.toLocaleDateString("de-DE") + "</strong> (+ 1 Jahr, § 21 Abs. 3 BBiG)");
      }
      ziel.innerHTML = teile.length ? teile.join("<br>") : "Ausbildungsbeginn eingeben — die Fristen erscheinen sofort.";
    } else if (art === "teilzeit") {
      var dauer = parseInt(wert("#rt-dauer"), 10), prozent = parseInt(wert("#rt-prozent"), 10);
      var rechnerisch = Math.ceil(dauer * 100 / prozent);
      var maximal = Math.floor(dauer * 1.5);
      var neu = Math.min(rechnerisch, maximal);
      var jahre = Math.floor(neu / 12), rest = neu % 12;
      var lesbar = (jahre ? jahre + " Jahr" + (jahre > 1 ? "e" : "") : "") + (jahre && rest ? " " : "") + (rest ? rest + " Monate" : "");
      ziel.innerHTML = "<strong>" + neu + " Monate</strong> Gesamtdauer (" + lesbar + ") bei " + prozent +
        " % Teilzeit — rechnerisch " + rechnerisch + " Monate, höchstens das Anderthalbfache (" + maximal +
        " Monate, § 7a BBiG). Endtermin auf den nächsten sinnvollen Prüfungstermin legen.";
    } else if (art === "fahrplan") {
      var fb = wert("#rp-beginn");
      if (!fb) { ziel.innerHTML = '<p>Ausbildungsbeginn eingeben — der Fahrplan erscheint sofort.</p>'; return; }
      var fDauer = parseInt(wert("#rp-dauer"), 10) || 36;
      var fProbe = parseInt(wert("#rp-probezeit"), 10) || 4;
      var fGeb = wert("#rp-geb");
      var fStart = new Date(fb);
      function plusMonate(d, m, minusTag) {
        var x = new Date(d);
        x.setMonth(x.getMonth() + m);
        if (minusTag) x.setDate(x.getDate() - 1);
        return x;
      }
      function de(d) { return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }); }
      var fEnde = plusMonate(fStart, fDauer, true);
      var zeilen = [];
      zeilen.push(["[[eintragung|Vertrag einreichen & Eintragung]]", "vor Beginn — unverzüglich nach Vertragsschluss", "§ 36 BBiG"]);
      var jugendlich = false;
      if (fGeb) {
        var fG = new Date(fGeb);
        var f18 = new Date(fG); f18.setFullYear(f18.getFullYear() + 18);
        jugendlich = f18 > fStart;
        if (jugendlich) {
          zeilen.push(["[[jugendliche|Ärztliche Erstuntersuchung]] (Bescheinigung höchstens 14 Monate alt)", "vor Beginn", "§ 32 JArbSchG"]);
        }
      }
      zeilen.push(["**Ausbildungsbeginn**", de(fStart), "§ 11 BBiG (Niederschrift vorher)"]);
      zeilen.push(["[[probezeit|Ende der Probezeit]] (" + fProbe + " Monate)", de(plusMonate(fStart, fProbe, true)), "§ 20 BBiG"]);
      if (jugendlich) {
        var fFrist = plusMonate(fStart, 14, true);
        var f18b = new Date(new Date(fGeb)); f18b.setFullYear(f18b.getFullYear() + 18);
        if (f18b <= fFrist) {
          zeilen.push(["[[jugendliche|Erste Nachuntersuchung]]", "entfällt — 18. Geburtstag am " + de(f18b), "§ 33 JArbSchG"]);
        } else {
          zeilen.push(["[[jugendliche|Erste Nachuntersuchung]] — Erinnerung ab", de(plusMonate(fStart, 9, false)), "§ 33 JArbSchG"]);
          zeilen.push(["[[jugendliche|Nachuntersuchung]] spätestens nachweisen (sonst Beschäftigungsverbot)", de(fFrist), "§ 33 JArbSchG"]);
        }
      }
      var fMitte = plusMonate(fStart, Math.floor(fDauer / 2), false);
      zeilen.push(["[[zwischenpruefung|Zwischenprüfung]] (etwa zur Ausbildungsmitte)", "ca. " + fMitte.toLocaleDateString("de-DE", { month: "long", year: "numeric" }), "§ 48 BBiG"]);
      zeilen.push(["[[abschlusspruefung|Anmeldung zur Abschlussprüfung]] (durch den Betrieb)", "Termine der zuständigen Stelle beachten", "§ 43 BBiG"]);
      zeilen.push(["[[freistellung|Tag vor der schriftlichen Abschlussprüfung]]: bezahlt frei", "je nach Prüfungstermin", "§ 15 BBiG · § 10 JArbSchG"]);
      zeilen.push(["[[ende-uebernahme|Ohne Übernahme: arbeitsuchend melden]]", "spätestens " + de(plusMonate(fEnde, -3, false)), "§ 38 SGB III"]);
      zeilen.push(["[[ende-uebernahme|Vertragliches Ausbildungsende]]", de(fEnde), "§ 21 BBiG"]);
      var tabelle = '<div class="tabellen-rahmen"><table class="bw-table"><thead><tr>' +
        "<th scope=\"col\">Station</th><th scope=\"col\">Termin</th><th scope=\"col\">Grundlage</th></tr></thead><tbody>" +
        zeilen.map(function (z) {
          return "<tr><td>" + fmtInline(z[0]) + "</td><td>" + fmtInline(z[1]) + "</td><td>" + fmtInline(z[2]) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
      ziel.innerHTML = tabelle +
        '<p class="bw-klein bw-leise">Mit bestandener Abschlussprüfung endet die Ausbildung schon mit Bekanntgabe des Ergebnisses (§ 21 Abs. 2 BBiG). Verkürzung, Teilzeit und Verlängerung verschieben die Termine — Änderungen laufen über die zuständige Stelle.</p>';
    } else if (art === "noten") {
      var aufgaben = [1, 2, 3, 4, 5].map(function (i) { return parseInt(wert("#no-a" + i), 10); });
      var faecher = [1, 2, 3, 4].map(function (i) { return parseInt(wert("#no-f" + i), 10); });
      var alle = aufgaben.concat(faecher);
      function schnitt(arr) { return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length; }
      function nde(x) { return x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
      var praxis = schnitt(aufgaben), block = schnitt(faecher);
      var gesamt = praxis * 0.6 + block * 0.4;
      var sechsen = alle.filter(function (n) { return n === 6; }).length;
      var fuenfen = alle.filter(function (n) { return n === 5; }).length;
      var regeln = [
        ["Gesamtergebnis mindestens ausreichend (besser als 4,5): " + nde(gesamt), gesamt < 4.5],
        ["Praxisblock mindestens ausreichend: " + nde(praxis), praxis < 4.5],
        ["Fächerblock mindestens ausreichend: " + nde(block), block < 4.5],
        ["keine ungenügende Leistung (Note 6)", sechsen === 0],
        ["höchstens eine mangelhafte Leistung (Note 5) — aktuell: " + fuenfen, fuenfen <= 1]
      ];
      var bestanden = regeln.every(function (r) { return r[1]; });
      var hx = '<p class="noten-gesamt"><strong>Gesamtergebnis: ' + nde(gesamt) + "</strong> (Praxis " + nde(praxis) +
        " × 60 % + Fächer " + nde(block) + ' × 40 %) — <strong>' + (bestanden ? "bestanden" : "nicht bestanden") + "</strong></p>";
      hx += '<ul class="noten-regeln">' + regeln.map(function (r) {
        return '<li class="' + (r[1] ? "regel--ok" : "regel--verfehlt") + '">' + (r[1] ? "✓" : "✗") + " " + r[0] + "</li>";
      }).join("") + "</ul>";
      // Mündliche Ergänzungsprüfung (§ 9 Abs. 5): nur schriftliche Fächer (f2–f4)
      var schriftlich = faecher.slice(1);
      var schrFuenfen = schriftlich.filter(function (n) { return n === 5; }).length;
      var schrRestOk = schriftlich.every(function (n) { return n === 5 || n <= 4; }) && faecher[0] <= 4;
      if (!bestanden && schrFuenfen >= 1 && schrFuenfen <= 2 && schriftlich.every(function (n) { return n !== 6; }) && schrRestOk && sechsen === 0) {
        hx += '<p class="bw-klein"><strong>Mündliche Ergänzungsprüfung prüfen (§ 9 Abs. 5 GärtnAusbV):</strong> In einem der mangelhaften schriftlichen Fächer ist auf Antrag eine etwa 15-minütige Ergänzungsprüfung möglich, wenn sie den Ausschlag für das Bestehen geben kann — das Fach wählt der Prüfling. Die neue Fachnote entsteht aus schriftlich doppelt + mündlich einfach: aus 5 und mündlich 3 wird z. B. (5 + 5 + 3) ÷ 3 = 4,33.</p>';
      }
      hx += '<p class="bw-klein bw-leise">Rechenweg nach § 9 Abs. 6–7 GärtnAusbV (alle Fachrichtungen; mündliches Fach je Fachrichtung, z. B. Kulturführung oder Landschaftsgärtnerische Arbeiten). Orientierungswert — verbindlich bewertet der Prüfungsausschuss. Details im Artikel „Noten &amp; Bestehen“.</p>';
      ziel.innerHTML = hx;
    }
  }

  // Jahreskreis (R5): 12-Monats-Timeline als eigenes SVG nach den
  // Infografik-Regeln des Landes-CD — Grau als Basis, Gelb ausschließlich
  // für den aktuellen Monat (mit dunkler Outline), Fixtermine als Rauten.
  // Die vollständigen Informationen stehen barrierefrei in der Liste darunter.
  function jahreskreisHtml(gruppen) {
    var labelW = 252, mB = 62, W = labelW + 12 * mB;
    var kopf = 30, zH = 30;
    var zeilen = 0;
    gruppen.forEach(function (g) { zeilen += 1 + g.eintraege.length; });
    var H = kopf + zeilen * zH + 10;
    var jetztM = new Date().getMonth(); // 0-basiert
    var MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    function mx(monat, anteil) { return labelW + (monat - 1 + (anteil || 0)) * mB; }
    var s = '<div class="jahreskreis"><svg class="jahreskreis-svg" viewBox="0 0 ' + W + " " + H +
      '" aria-hidden="true" focusable="false">';
    // Monatsraster
    for (var m = 0; m <= 12; m++) {
      s += '<line x1="' + (labelW + m * mB) + '" y1="' + (kopf - 8) + '" x2="' + (labelW + m * mB) + '" y2="' + (H - 6) + '" stroke="var(--bw-grau-200)" stroke-width="1"></line>';
    }
    // aktueller Monat: gelbe Spalte mit dunkler Outline (einziger Farbwert)
    s += '<rect x="' + (labelW + jetztM * mB) + '" y="' + (kopf - 8) + '" width="' + mB + '" height="' + (H - kopf + 2) + '" fill="var(--bw-gelb)" opacity="0.28"></rect>' +
      '<rect x="' + (labelW + jetztM * mB) + '" y="' + (kopf - 8) + '" width="' + mB + '" height="' + (H - kopf + 2) + '" fill="none" stroke="var(--bw-schwarz)" stroke-width="1"></rect>';
    for (m = 0; m < 12; m++) {
      s += '<text x="' + (labelW + m * mB + mB / 2) + '" y="' + (kopf - 12) + '" text-anchor="middle" class="jk-monat' + (m === jetztM ? " jk-monat--jetzt" : "") + '">' + MON[m] + "</text>";
    }
    // Zeilen
    var y = kopf;
    gruppen.forEach(function (g, gi) {
      y += zH;
      s += '<text x="2" y="' + (y - 10) + '" class="jk-gruppe">' + esc(g.g) + "</text>";
      g.eintraege.forEach(function (e) {
        y += zH;
        s += '<text x="14" y="' + (y - 10) + '" class="jk-label">' + esc(e.t) + "</text>";
        var farbe = gi % 2 ? "var(--bw-cat-2)" : "var(--bw-cat-1)";
        var bh = e.laufend ? 7 : 14;
        var by = y - 10 - bh - (e.laufend ? 2 : 0);
        if (e.von && e.bis) {
          var segmente = e.von <= e.bis ? [[e.von, e.bis]] : [[e.von, 12], [1, e.bis]];
          segmente.forEach(function (seg) {
            s += '<rect x="' + (mx(seg[0]) + 2) + '" y="' + by + '" width="' + ((seg[1] - seg[0] + 1) * mB - 4) +
              '" height="' + bh + '" rx="4" fill="' + farbe + '" stroke="var(--bw-chart-outline)" stroke-width="1"></rect>';
          });
        }
        (e.fixe || []).forEach(function (f) {
          var cx = mx(f.m, Math.min(0.88, Math.max(0.12, (f.tag || 15) / 31))), cy = y - 17;
          s += '<path d="M ' + cx + " " + (cy - 6) + " L " + (cx + 5) + " " + cy + " L " + cx + " " + (cy + 6) + " L " + (cx - 5) + " " + cy + ' Z" fill="var(--bw-schwarz)"></path>';
        });
      });
    });
    s += "</svg></div>";
    s += '<p class="bw-klein bw-leise jk-legende">Balken = Orientierungszeitraum · Raute = Fixtermin · gelbe Spalte = aktueller Monat. Verbindlich sind die jährlich veröffentlichten Termine und Einladungen der zuständigen Stelle.</p>';
    // Barrierefreie Liste mit allen Details
    gruppen.forEach(function (g) {
      s += '<h3 class="jk-listentitel">' + esc(g.g) + "</h3><ul class=\"jk-liste\">";
      g.eintraege.forEach(function (e) {
        s += "<li><strong>" + esc(e.t) + "</strong> — " + esc(e.zeit) + "<br>" + fmtInline(e.info) + "</li>";
      });
      s += "</ul>";
    });
    return s;
  }

  function nachschlagVerhalten(root, params) {
    root.querySelectorAll(".rechner-form").forEach(function (form) {
      var art = form.getAttribute("data-rechner");
      form.querySelectorAll("input, select").forEach(function (f) {
        f.addEventListener("input", function () { rechnerRechnen(root, art); });
        f.addEventListener("change", function () { rechnerRechnen(root, art); });
      });
      rechnerRechnen(root, art);
    });
    if (params.karte) {
      var ziel = $("#n-" + params.karte, root);
      if (ziel) {
        setTimeout(function () {
          ziel.scrollIntoView({ block: "start" });
          ziel.focus({ preventScroll: true });
        }, 0);
      }
    }
  }

  /* ---------------- Ansicht: Checklisten --------------------------- */
  var CINDEX = [];
  (function bauenChecklisten() {
    var C = window.CHECKLISTEN;
    if (!C) return;
    C.listen.forEach(function (l) {
      var inhalt = (l.gruppen || []).map(function (g) {
        return g.t + " " + g.punkte.map(function (p) { return p.t; }).join(" ");
      }).join(" ");
      CINDEX.push({
        liste: l,
        felder: [
          [norm(l.titel), 5],
          [norm((l.stichworte || []).join(" ")), 4],
          [norm(l.kurz || ""), 2],
          [norm(inhalt), 1]
        ]
      });
    });
  })();

  function suchenChecklisten(q, limit) {
    var tokens = norm(q).split(" ").filter(function (t) { return t && !STOP[t]; });
    if (!tokens.length) return [];
    var treffer = [];
    CINDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length; f++) {
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], rec.felder[f][0]);
            if (sc) best = Math.max(best, sc * rec.felder[f][1] * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; }
        summe += best;
      }
      if (summe > 0) treffer.push({ liste: rec.liste, score: summe });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    return treffer.slice(0, limit || 2).map(function (t) { return t.liste; });
  }

  function checklisteVon(id) {
    var C = window.CHECKLISTEN;
    if (!C) return null;
    for (var i = 0; i < C.listen.length; i++) if (C.listen[i].id === id) return C.listen[i];
    return null;
  }
  function checklistePunkte(l) {
    var n = 0;
    (l.gruppen || []).forEach(function (g) { n += g.punkte.length; });
    return n;
  }

  function viewChecklisten(params) {
    var C = window.CHECKLISTEN;
    if (!C) return platzhalter("Checklisten", "Checklisten-Modul nicht geladen.");
    if (params.id) {
      var l = checklisteVon(params.id);
      if (!l) return platzhalter("Checkliste nicht gefunden", "Zurück zur Übersicht: #/checklisten");
      return viewChecklisteDetail(l);
    }
    var h = "<h1>Checklisten</h1>" +
      '<p class="bw-unterzeile">Vorgänge strukturiert abarbeiten — Stand bleibt lokal gespeichert, Ergebnis als Ausdruck für die Akte</p>';
    h += '<ul class="karten" id="checklisten-liste">' + C.listen.map(function (l) {
      var gesamt = checklistePunkte(l);
      return '<li class="karte"><a class="karte__link" href="#/checklisten?id=' + esc(l.id) + '">' +
        '<span class="etikett">' + gesamt + " Punkte</span>" +
        '<h3 style="margin-top:var(--bw-space-1)">' + esc(l.titel) + "</h3>" +
        "<p>" + esc(l.kurz) + "</p>" +
        '<span class="meta"><span class="fortschritt" data-fortschritt="' + esc(l.id) + '"><span class="fortschritt__balken" style="width:0%"></span></span>' +
        '<span class="bw-klein bw-leise" data-fortschritt-text="' + esc(l.id) + '"></span></span></a></li>';
    }).join("") + "</ul>";
    h += '<p class="stand-hinweis">' + esc(C.hinweis) + " Stand: " + esc(C.stand) + ".</p>";
    return h;
  }

  function viewChecklisteDetail(l) {
    var h = '<nav class="crumb" aria-label="Pfad"><a href="#/checklisten">Checklisten</a></nav>';
    h += "<h1>" + esc(l.titel) + "</h1>";
    h += '<p class="artikel-lead">' + esc(l.kurz) + "</p>";
    h += '<div class="fortschritt-zeile"><span class="fortschritt fortschritt--gross"><span class="fortschritt__balken" id="cl-balken" style="width:0%"></span></span>' +
      '<span id="cl-stand" role="status" class="bw-klein"></span></div>';
    var idx = 0;
    (l.gruppen || []).forEach(function (g, gi) {
      h += '<fieldset class="cl-gruppe bw-card"><legend>' + esc(g.t) + "</legend>";
      g.punkte.forEach(function (p, pi) {
        var key = gi + "." + pi;
        h += '<div class="cl-punkt"><input type="checkbox" id="cl-' + key + '" data-punkt="' + key + '">' +
          '<label for="cl-' + key + '">' + fmtInline(p.t) +
          (p.h ? ' <span class="bw-klein bw-leise">' + fmtInline(p.h) + "</span>" : "") + "</label></div>";
        idx++;
      });
      h += "</fieldset>";
    });
    h += '<div class="bw-card"><label for="cl-notiz">Notiz zum Vorgang (bleibt lokal)</label>' +
      '<textarea id="cl-notiz" rows="3" placeholder="z. B. Betrieb, Azubi, Besonderheiten, offene Punkte …"></textarea></div>';
    h += '<div class="export-aktionen">' +
      '<button class="bw-btn bw-btn--gelb" id="cl-drucken" type="button">Drucken / als PDF sichern</button>' +
      '<button class="bw-btn bw-btn--sekundaer" id="cl-zuruecksetzen" type="button">Zurücksetzen</button>' +
      '<span class="bw-klein bw-leise" id="cl-status" role="status"></span></div>';
    if ((l.artikel || []).length) {
      h += '<h2>Fachlicher Hintergrund</h2><ul class="chipzeile">' +
        l.artikel.map(function (id) {
          var a = artikelVon(id);
          return a ? '<li><a class="chip chip--frage" href="#/artikel/' + id + '">' + esc(a.titel) + "</a></li>" : "";
        }).join("") + "</ul>";
    }
    return h;
  }

  function checklistenVerhalten(root, params) {
    if (!params.id) {
      // Übersicht: gespeicherte Stände in die Fortschrittsbalken schreiben
      if (!window.LokalDB) return;
      window.LokalDB.alle("checklisten").then(function (alle) {
        alle.forEach(function (s) {
          var l = checklisteVon(s.id);
          if (!l) return;
          var gesamt = checklistePunkte(l);
          var n = Object.keys(s.haken || {}).filter(function (k) { return s.haken[k]; }).length;
          var balken = root.querySelector('[data-fortschritt="' + s.id + '"] .fortschritt__balken');
          var text = root.querySelector('[data-fortschritt-text="' + s.id + '"]');
          if (balken) balken.style.width = Math.round((n / gesamt) * 100) + "%";
          if (text) text.textContent = n ? n + " von " + gesamt + " erledigt" : "";
        });
      });
      return;
    }
    var l = checklisteVon(params.id);
    if (!l) return;
    zuletztMerken("#/checklisten?id=" + l.id, l.titel, "Checkliste");
    var gesamt = checklistePunkte(l);
    var stand = { id: l.id, haken: {}, notiz: "", geaendert: 0 };
    var statusFeld = $("#cl-status", root), notizFeld = $("#cl-notiz", root);

    function anzeigen() {
      var n = Object.keys(stand.haken).filter(function (k) { return stand.haken[k]; }).length;
      $("#cl-balken", root).style.width = Math.round((n / gesamt) * 100) + "%";
      $("#cl-stand", root).textContent = n + " von " + gesamt + " erledigt" + (n === gesamt ? " — vollständig ✓" : "");
    }
    function speichern(meldung) {
      if (!window.LokalDB) return;
      stand.geaendert = Date.now();
      window.LokalDB.speichern("checklisten", stand).then(function () {
        if (meldung) statusFeld.textContent = meldung;
      }, function () { statusFeld.textContent = "Stand konnte nicht gespeichert werden (Speicher voll)."; });
    }

    if (window.LokalDB) {
      window.LokalDB.holen("checklisten", l.id).then(function (s) {
        if (s) {
          stand = s;
          stand.haken = stand.haken || {};
          Object.keys(stand.haken).forEach(function (k) {
            var box = root.querySelector('[data-punkt="' + k + '"]');
            if (box) box.checked = !!stand.haken[k];
          });
          if (stand.notiz) notizFeld.value = stand.notiz;
        }
        anzeigen();
      });
    } else anzeigen();

    root.querySelectorAll("[data-punkt]").forEach(function (box) {
      box.addEventListener("change", function () {
        stand.haken[box.getAttribute("data-punkt")] = box.checked;
        anzeigen();
        speichern("Stand gespeichert.");
      });
    });
    var notizTimer = null;
    notizFeld.addEventListener("input", function () {
      clearTimeout(notizTimer);
      notizTimer = setTimeout(function () { stand.notiz = notizFeld.value; speichern("Notiz gespeichert."); }, 500);
    });

    $("#cl-zuruecksetzen", root).addEventListener("click", function () {
      if (!window.confirm("Alle Haken und die Notiz dieser Checkliste zurücksetzen?")) return;
      stand = { id: l.id, haken: {}, notiz: "", geaendert: Date.now() };
      root.querySelectorAll("[data-punkt]").forEach(function (b) { b.checked = false; });
      notizFeld.value = "";
      anzeigen();
      if (window.LokalDB) window.LokalDB.loeschen("checklisten", l.id).then(function () {
        statusFeld.textContent = "Checkliste zurückgesetzt.";
      });
    });

    $("#cl-drucken", root).addEventListener("click", function () {
      var d = document.getElementById("druckbereich");
      var dh = "<h1>" + esc(l.titel) + "</h1>" +
        '<p class="bw-klein">Checkliste der Ausbildungsberatung — gedruckt am ' + new Date().toLocaleDateString("de-DE") +
        " · Stand der Vorlage: " + esc(window.CHECKLISTEN.stand) + "</p>";
      (l.gruppen || []).forEach(function (g, gi) {
        dh += "<h2>" + esc(g.t) + "</h2><ul style=\"list-style:none;padding:0\">";
        g.punkte.forEach(function (p, pi) {
          var ok = !!stand.haken[gi + "." + pi];
          dh += '<li style="margin:0 0 6px">' + (ok ? "☑" : "☐") + " " + fmtInline(p.t) + "</li>";
        });
        dh += "</ul>";
      });
      if (notizFeld.value.trim()) dh += "<h2>Notiz</h2><p>" + esc(notizFeld.value).replace(/\n/g, "<br>") + "</p>";
      d.innerHTML = '<div class="blatt">' + dh + "</div>";
      window.print();
    });
  }

  /* ---------------- Ansicht: Grüne Berufe -------------------------- */
  var BINDEX = [];
  (function bauenBerufe() {
    var B = window.BERUFE;
    if (!B) return;
    B.berufe.forEach(function (b) {
      BINDEX.push({
        beruf: b,
        felder: [
          [norm(b.titel), 5],
          [norm((b.stichworte || []).join(" ")), 4],
          [norm((b.fachrichtungen || []).join(" ")), 3],
          [norm(b.kurz), 1.5]
        ]
      });
    });
  })();

  function suchenBerufe(q, limit) {
    var tokens = norm(q).split(" ").filter(function (t) { return t && !STOP[t]; });
    if (!tokens.length) return [];
    var treffer = [];
    BINDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length; f++) {
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], rec.felder[f][0]);
            if (sc) best = Math.max(best, sc * rec.felder[f][1] * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; }
        summe += best;
      }
      if (summe > 0) treffer.push({ beruf: rec.beruf, score: summe });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    return treffer.slice(0, limit || 2).map(function (t) { return t.beruf; });
  }

  function berufVon(id) {
    var B = window.BERUFE;
    if (!B) return null;
    for (var i = 0; i < B.berufe.length; i++) if (B.berufe[i].id === id) return B.berufe[i];
    return null;
  }

  function berufKarte(b) {
    var fr = (b.fachrichtungen || []).length;
    return '<li class="karte"><a class="karte__link" href="#/berufe?b=' + esc(b.id) + '">' +
      '<span class="etikett">' + esc(b.dauer) + "</span>" +
      (fr ? ' <span class="etikett">' + fr + " Fachrichtungen</span>" : "") +
      (b.imTool ? ' <span class="etikett etikett--eigen">vertieft im Tool</span>' : "") +
      '<h3 style="margin-top:var(--bw-space-1)">' + esc(b.titel) + "</h3>" +
      "<p>" + esc(b.kurz) + "</p></a></li>";
  }

  function viewBerufe(params) {
    var B = window.BERUFE;
    if (!B) return platzhalter("Grüne Berufe", "Berufe-Modul nicht geladen.");
    var h = "<h1>Die grünen Berufe</h1>" +
      '<p class="bw-unterzeile">Alle Ausbildungsberufe der zuständigen Stelle in Baden-Württemberg — mit Fachrichtungen, Verordnungen und Ansprechseiten</p>';

    if (params.b) {
      var b = berufVon(params.b);
      if (b) {
        h += '<section class="bw-card beruf-detail" id="beruf-detail" tabindex="-1">' +
          "<h2>" + esc(b.titel) + "</h2>" +
          '<p class="bw-klein"><span class="etikett">' + esc(b.dauer) + "</span> " +
          '<span class="etikett etikett--recht">' + esc(b.verordnung) + "</span>" +
          (b.paragraf66 ? ' <span class="etikett etikett--eigen">§ 66 BBiG</span>' : "") + "</p>" +
          "<p>" + esc(b.kurz) + "</p>";
        if ((b.fachrichtungen || []).length) {
          h += "<p><strong>Fachrichtungen:</strong></p><ul class=\"chipzeile\">" +
            b.fachrichtungen.map(function (f) { return '<li><span class="chip">' + esc(f) + "</span></li>"; }).join("") + "</ul>";
        }
        // Verordnungs-Ziel: verifizierter Direktlink, lokales PDF (Gärtner)
        // oder die Regelungs-Übersicht des Bildungsservers Agrar.
        var verordnungZiel = b.verordnungUrl ||
          (b.id === "gaertner" ? "formulare/gesetze/gaertnausbv.pdf" :
           b.id === "gartenbaufachwerker" ? "https://www.landesrecht-bw.de" :
           "https://www.bildungsserveragrar.de/bildungswege/ausbildung/rechtliche-regelungen-fuer-die-ausbildung/");
        var verordnungLokal = verordnungZiel.indexOf("http") !== 0;
        h += '<div class="export-aktionen">' +
          '<a class="bw-btn" href="' + esc(b.url) + '" target="_blank" rel="noopener">' + esc(b.quelleTitel) + " ↗</a>" +
          '<a class="bw-btn bw-btn--sekundaer" href="' + esc(verordnungZiel) + '" target="_blank"' + (verordnungLokal ? "" : ' rel="noopener"') + ">Verordnung " + (verordnungLokal ? "(PDF)" : "↗") + "</a>" +
          '<a class="bw-btn bw-btn--sekundaer" href="https://web.arbeitsagentur.de/berufenet/suche?text=' + encodeURIComponent(b.titel) + '" target="_blank" rel="noopener">BERUFENET ↗</a>';
        if (berufsTitelListe().indexOf(b.titel) >= 0) {
          h += '<button class="bw-btn bw-btn--gelb" id="beruf-vorlagen" type="button" data-beruf="' + esc(b.titel) + '">E-Mail-Vorlagen für diesen Beruf</button>';
        }
        if (b.imTool && b.id === "gaertner") h += ' <a class="bw-btn bw-btn--sekundaer" href="#/wissen">Wissensdatenbank öffnen</a>';
        if (b.imTool && b.id === "gartenbaufachwerker") h += ' <a class="bw-btn bw-btn--sekundaer" href="#/wissen?thema=fachwerker">Fachwerker-Themenbereich</a>';
        h += "</div>" +
          '<p class="bw-klein bw-leise">Schnellnachschlag und Rechner (Urlaub, Vergütung, Fristen, Teilzeit) gelten berufsübergreifend für alle grünen Berufe.</p>' +
          "</section>";
      }
    }

    var normale = B.berufe.filter(function (x) { return !x.paragraf66 && !x.sonderweg; });
    var sechsundsechzig = B.berufe.filter(function (x) { return x.paragraf66; });
    var sonder = B.berufe.filter(function (x) { return x.sonderweg; });
    h += "<h2>Ausbildungsberufe nach BBiG</h2><ul class=\"karten\">" + normale.map(berufKarte).join("") + "</ul>";
    h += "<h2>§ 66-Ausbildungen (Menschen mit Behinderung)</h2><ul class=\"karten\">" + sechsundsechzig.map(berufKarte).join("") + "</ul>";
    if (sonder.length) h += "<h2>Verwandte Qualifikationen</h2><ul class=\"karten\">" + sonder.map(berufKarte).join("") + "</ul>";
    h += '<p class="stand-hinweis">' + esc(B.hinweis) + " Stand der Erhebung: " + esc(B.stand) + ".</p>";
    return h;
  }

  function berufeVerhalten(root, params) {
    if (params.b) {
      var d = $("#beruf-detail", root);
      if (d) setTimeout(function () { d.scrollIntoView({ block: "start" }); d.focus({ preventScroll: true }); }, 0);
      var b = berufVon(params.b);
      if (b) zuletztMerken("#/berufe?b=" + b.id, b.titel, "Beruf");
      // Automatik: Beruf in die Vorlagen übernehmen — Fachrichtung wird
      // verworfen, wenn sie zum neuen Beruf nicht passt.
      var knopf = $("#beruf-vorlagen", root);
      if (knopf) {
        knopf.addEventListener("click", function () {
          var werte = werteLesen();
          var titel = knopf.getAttribute("data-beruf");
          werte.BERUF = titel;
          if (fachrichtungenFuerBeruf(titel).indexOf(werte.FACHRICHTUNG) < 0) delete werte.FACHRICHTUNG;
          werteSchreiben(werte);
          location.hash = "#/vorlagen";
        });
      }
    }
  }

  /* ---------------- Ansicht: Glossar ------------------------------- */
  var GINDEX = [];
  (function bauenGlossar() {
    var G = window.GLOSSAR;
    if (!G) return;
    G.begriffe.forEach(function (b) {
      GINDEX.push({
        begriff: b,
        felder: [
          [norm(b.b), 5],
          [norm((b.stichworte || []).join(" ")), 4],
          [norm(b.k), 1.5]
        ]
      });
    });
  })();

  function suchenGlossar(q, limit) {
    var tokens = norm(q).split(" ").filter(function (t) { return t && !STOP[t]; });
    if (!tokens.length) return [];
    var treffer = [];
    GINDEX.forEach(function (rec) {
      var summe = 0;
      for (var t = 0; t < tokens.length; t++) {
        var alts = tokenAlternativen(tokens[t]);
        var best = 0;
        for (var f = 0; f < rec.felder.length; f++) {
          for (var x = 0; x < alts.length; x++) {
            var sc = tokenScore(alts[x], rec.felder[f][0]);
            if (sc) best = Math.max(best, sc * rec.felder[f][1] * (x ? 0.8 : 1));
          }
        }
        if (!best) { summe = 0; break; }
        summe += best;
      }
      if (summe > 0) treffer.push({ begriff: rec.begriff, score: summe });
    });
    treffer.sort(function (a, b) { return b.score - a.score; });
    return treffer.slice(0, limit || 2).map(function (t) { return t.begriff; });
  }

  function viewGlossar() {
    var G = window.GLOSSAR;
    if (!G) return platzhalter("Glossar", "Glossar-Modul nicht geladen.");
    var h = "<h1>Glossar</h1>" +
      '<p class="bw-unterzeile">' + G.begriffe.length + " Fachbegriffe der Ausbildung — kurz erklärt, mit Verweisen in die Wissensbasis</p>";
    h += '<div class="bw-search" style="max-width:34rem"><label for="gq" class="bw-skip-link">Begriffe filtern</label>' +
      '<input id="gq" type="search" placeholder="Begriff filtern … (tipptolerant)" aria-label="Begriffe filtern">' +
      '<button type="button" aria-label="Suchen">' + ICON.suche + "</button></div>";
    h += '<div id="glossar-liste"></div>';
    h += '<p class="stand-hinweis">Stand: ' + esc(G.stand) + ".</p>";
    return h;
  }

  function glossarListe(filterQ) {
    var G = window.GLOSSAR;
    var begriffe = G.begriffe.slice().sort(function (a, b) { return a.b.localeCompare(b.b, "de"); });
    if (filterQ) {
      var tokens = norm(filterQ).split(" ").filter(Boolean);
      begriffe = begriffe.filter(function (b) {
        var hay = norm(b.b + " " + (b.stichworte || []).join(" ") + " " + b.k);
        return tokens.every(function (tok) {
          return tokenAlternativen(tok).some(function (al) { return tokenScore(al, hay) > 0; });
        });
      });
    }
    if (!begriffe.length) return '<p class="leer">Kein Begriff passt zum Filter.</p>';
    var h = "", buchstabe = "";
    begriffe.forEach(function (b) {
      var anfang = b.b.charAt(0).toUpperCase();
      if (/\d/.test(anfang)) anfang = "0–9";
      if (anfang !== buchstabe) {
        if (buchstabe) h += "</dl>";
        buchstabe = anfang;
        h += '<h2 class="glossar-buchstabe">' + esc(buchstabe) + '</h2><dl class="glossar">';
      }
      var chips = "";
      (b.artikel || []).forEach(function (id) {
        var a = artikelVon(id);
        if (a) chips += '<a class="chip chip--frage" href="#/artikel/' + esc(id) + '">' + esc(a.titel) + "</a>";
      });
      if (b.quelle && window.QUELLEN) {
        var e = null;
        window.QUELLEN.eintraege.forEach(function (x) { if (x.id === b.quelle) e = x; });
        if (e) {
          var z = quelleZiel(e);
          chips += '<a class="chip" href="' + esc(z.href) + '"' + (z.download ? ' download="' + esc(z.download) + '"' : ' target="_blank" rel="noopener"') + ">" + esc(e.titel) + (z.extern ? " ↗" : "") + "</a>";
        }
      }
      h += '<dt id="g-' + esc(b.id) + '" tabindex="-1">' + esc(b.b) + "</dt>" +
        "<dd>" + fmtInline(b.k) + (chips ? '<span class="chipzeile-frei">' + chips + "</span>" : "") + "</dd>";
    });
    h += "</dl>";
    return h;
  }

  function glossarVerhalten(root, params) {
    var eingabe = $("#gq", root), ziel = $("#glossar-liste", root);
    function zeigen() { mitUebergang(zeigenJetzt); }
    function zeigenJetzt() { ziel.innerHTML = glossarListe(eingabe.value.trim()); }
    eingabe.addEventListener("input", zeigen);
    zeigenJetzt();
    if (params.b) {
      var dt = $("#g-" + params.b, root);
      if (dt) {
        dt.classList.add("glossar-ziel");
        setTimeout(function () { dt.scrollIntoView({ block: "center" }); dt.focus({ preventScroll: true }); }, 0);
      }
    }
  }

  /* ---------------- Ansicht: Eigene Inhalte ------------------------ */
  function eigeneNeuId(prefix) {
    return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function dateiGroesse(n) {
    if (typeof n !== "number") return "";
    if (n < 1024) return n + " B";
    if (n < 1048576) return Math.round(n / 1024) + " KB";
    return (n / 1048576).toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " MB";
  }
  function heuteDe() { return new Date().toLocaleDateString("de-DE"); }

  function viewEigene() {
    if (!window.LokalDB) return platzhalter("Eigene Inhalte", "Die lokale Datenbank ist in diesem Browser nicht verfügbar.");
    var h = "<h1>Eigene Inhalte</h1>" +
      '<p class="bw-unterzeile">Eigene Artikel, Dokumente und Verträge — direkt im Tool angelegt, gespeichert nur auf diesem Gerät</p>';
    h += '<div class="bw-hinweis"><p><strong>Lokal gespeichert:</strong> Eigene Inhalte liegen in der Browser-Datenbank dieser ' +
      "Arbeitsstation und erscheinen automatisch in Suche, Wissensdatenbank und Download-Center. " +
      "Regelmäßig eine Sicherung (JSON) ablegen — zum Beispiel auf dem Netzlaufwerk.</p></div>";

    /* Eigene Artikel */
    h += '<section aria-labelledby="ea-titel">' +
      '<div class="abschnitt-kopf"><h2 id="ea-titel">Eigene Artikel <span class="etikett">' + EIGENE.artikel.length + "</span></h2>" +
      '<button class="bw-btn" id="ea-neu" type="button">Neuen Artikel anlegen</button></div>';
    h += '<form class="bw-card eigene-form" id="ea-form" hidden aria-label="Artikel anlegen oder bearbeiten">' +
      '<h3 id="ea-form-titel">Neuer Artikel</h3>' +
      '<div class="bw-field"><label for="ea-t">Titel *</label><input id="ea-t" required maxlength="160"></div>' +
      '<div class="zeile">' +
      '<div class="bw-field"><label for="ea-thema">Themenbereich</label><select id="ea-thema">' +
      '<option value="eigene">Eigene Artikel</option>' +
      W.themen.map(function (th) { return '<option value="' + th.id + '">' + esc(th.titel) + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="bw-field"><label for="ea-stich">Stichworte (durch Komma getrennt)</label><input id="ea-stich" placeholder="z. B. Tarif, Muster, intern"></div>' +
      "</div>" +
      '<div class="bw-field"><label for="ea-kurz">Kurzbeschreibung</label><input id="ea-kurz" maxlength="240" placeholder="Ein Satz, der in Liste und Suche erscheint"></div>' +
      '<div class="bw-field"><label for="ea-text">Inhalt *</label>' +
      '<textarea id="ea-text" rows="10" required placeholder="Text des Artikels …"></textarea>' +
      '<p class="bw-klein bw-leise">Leerzeilen trennen Absätze · Zeilen mit „- " werden Aufzählungen · **fett** hebt hervor.</p></div>' +
      '<div class="export-aktionen">' +
      '<button class="bw-btn" type="submit">Artikel speichern</button>' +
      '<button class="bw-btn bw-btn--sekundaer" id="ea-abbrechen" type="button">Abbrechen</button>' +
      '<span class="bw-klein bw-leise" id="ea-status" role="status"></span></div></form>';
    if (EIGENE.artikel.length) {
      h += '<ul class="karten" id="ea-liste">' + EIGENE.artikel.map(function (a) {
        var th = themaVon(a.thema);
        return '<li class="karte"><a class="karte__link" href="#/artikel/' + esc(a.id) + '">' +
          '<span class="etikett">' + esc(th ? th.titel : "") + "</span>" +
          "<h3>" + esc(a.titel) + "</h3><p>" + esc(a.kurz) + "</p>" +
          '<span class="meta"><span class="bw-klein bw-leise">Stand ' + esc(a.stand || "") + "</span></span></a>" +
          '<span class="karte__aktionen">' +
          '<button class="chip" data-ea-bearbeiten="' + esc(a.id) + '" type="button">Bearbeiten</button>' +
          '<button class="chip" data-ea-loeschen="' + esc(a.id) + '" type="button">Löschen</button></span></li>';
      }).join("") + "</ul>";
    } else {
      h += '<p class="leer" id="ea-leer">Noch keine eigenen Artikel — über „Neuen Artikel anlegen" starten.</p>';
    }
    h += "</section>";

    /* Eigene Dokumente */
    h += '<section aria-labelledby="ed-titel">' +
      '<div class="abschnitt-kopf"><h2 id="ed-titel">Eigene Dokumente <span class="etikett">' + EIGENE.dokumente.length + "</span></h2>" +
      '<button class="bw-btn" id="ed-neu" type="button">Dokument hinzufügen</button></div>';
    h += '<form class="bw-card eigene-form" id="ed-form" hidden aria-label="Dokument hinzufügen oder bearbeiten">' +
      '<h3 id="ed-form-titel">Dokument hinzufügen</h3>' +
      '<div class="bw-field"><label for="ed-datei">Datei (PDF, Word, Bild … — max. 12 MB)</label><input id="ed-datei" type="file"></div>' +
      '<div class="zeile">' +
      '<div class="bw-field"><label for="ed-t">Titel *</label><input id="ed-t" required maxlength="160"></div>' +
      '<div class="bw-field"><label for="ed-stich">Stichworte (durch Komma getrennt)</label><input id="ed-stich" placeholder="z. B. Vertrag, Muster, 2026"></div>' +
      "</div>" +
      '<div class="bw-field"><label for="ed-beschreibung">Beschreibung</label><input id="ed-beschreibung" maxlength="240" placeholder="Wofür wird das Dokument verwendet?"></div>' +
      '<div class="export-aktionen">' +
      '<button class="bw-btn" type="submit">Dokument speichern</button>' +
      '<button class="bw-btn bw-btn--sekundaer" id="ed-abbrechen" type="button">Abbrechen</button>' +
      '<span class="bw-klein bw-leise" id="ed-status" role="status"></span></div></form>';
    if (EIGENE.dokumente.length) {
      h += '<ul class="dok-liste" id="ed-liste">' + EIGENE.dokumente.map(function (d) {
        var z = quelleZiel(d);
        return '<li><span class="dok-info"><a href="' + esc(z.href) + '" download="' + esc(z.download || "") + '">' + esc(d.titel) + "</a>" +
          '<span class="bw-klein bw-leise">' + esc(d.dateiName || "") + (d.groesse ? " · " + dateiGroesse(d.groesse) : "") +
          (d.stand ? " · Stand " + esc(d.stand) : "") + (d.beschreibung ? " — " + esc(d.beschreibung) : "") + "</span></span>" +
          '<span class="dok-aktionen">' +
          '<a class="chip" href="' + esc(z.href) + '" download="' + esc(z.download || "") + '">Herunterladen</a>' +
          '<button class="chip" data-ed-bearbeiten="' + esc(d.id) + '" type="button">Bearbeiten</button>' +
          '<button class="chip" data-ed-loeschen="' + esc(d.id) + '" type="button">Löschen</button></span></li>';
      }).join("") + "</ul>";
    } else {
      h += '<p class="leer" id="ed-leer">Noch keine eigenen Dokumente — über „Dokument hinzufügen" hochladen.</p>';
    }
    h += "</section>";

    /* Sicherung */
    h += '<section aria-labelledby="sich-titel"><h2 id="sich-titel">Sicherung</h2><div class="bw-card">' +
      "<p>Den kompletten lokalen Arbeitsstand als eine JSON-Datei sichern oder wiederherstellen: eigene Artikel und Dokumente, " +
      "Aktenvermerke, Artikel-Notizen, Checklisten-Stände sowie Merkliste und gemerkte Vorlagen-Eingaben. " +
      "Beim Einlesen werden Einträge mit gleicher Kennung überschrieben, alle übrigen bleiben erhalten — ideal für Netzlaufwerk-Ablage und Gerätewechsel.</p>" +
      '<div class="export-aktionen">' +
      '<button class="bw-btn bw-btn--sekundaer" id="sich-export" type="button">Sicherung herunterladen (JSON)</button>' +
      '<label class="bw-btn bw-btn--sekundaer" for="sich-import">Sicherung einlesen<input id="sich-import" type="file" accept=".json,application/json" hidden></label>' +
      '<span class="bw-klein bw-leise" id="sich-status" role="status"></span></div></div></section>';
    return h;
  }

  function eigeneVerhalten(root, params) {
    if (!window.LokalDB) return;
    var eaForm = $("#ea-form", root), edForm = $("#ed-form", root);
    var eaStatus = $("#ea-status", root), edStatus = $("#ed-status", root), sichStatus = $("#sich-status", root);

    function neuLaden(meldung, statusFeld) {
      return eigeneLaden().then(function () {
        return rendern();
      }).then(function () {
        if (meldung && statusFeld) {
          var f = $(statusFeld);
          if (f) f.textContent = meldung;
        }
      });
    }

    /* ---- Artikel ---- */
    function eaOeffnen(a) {
      eaForm.hidden = false;
      eaForm.setAttribute("data-id", a ? a.id : "");
      $("#ea-form-titel", root).textContent = a ? "Artikel bearbeiten" : "Neuer Artikel";
      $("#ea-t", root).value = a ? a.titel : "";
      $("#ea-thema", root).value = a ? a.thema : "eigene";
      $("#ea-stich", root).value = a ? (a.stichworte || []).join(", ") : "";
      $("#ea-kurz", root).value = a ? a.kurz : "";
      $("#ea-text", root).value = a ? ((a.abschnitte || []).map(function (x) { return x.text; }).join("\n\n")) : "";
      eaStatus.textContent = "";
      $("#ea-t", root).focus();
      eaForm.scrollIntoView({ block: "nearest" });
    }
    $("#ea-neu", root).addEventListener("click", function () { eaOeffnen(null); });
    $("#ea-abbrechen", root).addEventListener("click", function () { eaForm.hidden = true; });
    eaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var titel = $("#ea-t", root).value.trim();
      var text = $("#ea-text", root).value.trim();
      if (!titel || !text) { eaStatus.textContent = "Titel und Inhalt ausfüllen."; return; }
      var kurz = $("#ea-kurz", root).value.trim() || (text.replace(/\s+/g, " ").slice(0, 160) + (text.length > 160 ? " …" : ""));
      var vorhandeneId = eaForm.getAttribute("data-id");
      var alt = vorhandeneId ? artikelVon(vorhandeneId) : null;
      var a = {
        id: vorhandeneId || eigeneNeuId("ea"), eigen: true,
        thema: $("#ea-thema", root).value, titel: titel, kurz: kurz,
        stichworte: $("#ea-stich", root).value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
        abschnitte: [{ t: "Inhalt", d: 1, text: text }],
        stand: heuteDe(), angelegt: alt ? alt.angelegt : Date.now(), geaendert: Date.now()
      };
      eaStatus.textContent = "Speichern …";
      window.LokalDB.speichern("eigeneArtikel", a).then(function () {
        neuLaden("Artikel gespeichert.", "#ea-status");
      }, function (fehler) { eaStatus.textContent = String(fehler && fehler.message || "Speichern fehlgeschlagen."); });
    });
    root.querySelectorAll("[data-ea-bearbeiten]").forEach(function (b) {
      b.addEventListener("click", function () { eaOeffnen(artikelVon(b.getAttribute("data-ea-bearbeiten"))); });
    });
    root.querySelectorAll("[data-ea-loeschen]").forEach(function (b) {
      b.addEventListener("click", function () {
        var a = artikelVon(b.getAttribute("data-ea-loeschen"));
        if (!a || !window.confirm('Artikel „' + a.titel + '" endgültig löschen?')) return;
        window.LokalDB.loeschen("eigeneArtikel", a.id).then(function () { neuLaden("Artikel gelöscht.", "#ea-status"); });
      });
    });
    if (params.artikel) {
      var vorwahl = artikelVon(params.artikel);
      if (vorwahl && vorwahl.eigen) eaOeffnen(vorwahl);
    }
    if (params.neu === "artikel") eaOeffnen(null);

    /* ---- Dokumente ---- */
    function dokumentVon(id) {
      for (var i = 0; i < EIGENE.dokumente.length; i++) if (EIGENE.dokumente[i].id === id) return EIGENE.dokumente[i];
      return null;
    }
    function edOeffnen(d) {
      edForm.hidden = false;
      edForm.setAttribute("data-id", d ? d.id : "");
      $("#ed-form-titel", root).textContent = d ? "Dokument bearbeiten" : "Dokument hinzufügen";
      $("#ed-datei", root).value = "";
      $("#ed-t", root).value = d ? d.titel : "";
      $("#ed-stich", root).value = d ? (d.stichworte || []).join(", ") : "";
      $("#ed-beschreibung", root).value = d ? (d.beschreibung || "") : "";
      edStatus.textContent = d ? "Ohne neue Datei bleibt die vorhandene Datei erhalten." : "";
      edForm.scrollIntoView({ block: "nearest" });
      $("#ed-datei", root).focus();
    }
    $("#ed-neu", root).addEventListener("click", function () { edOeffnen(null); });
    $("#ed-abbrechen", root).addEventListener("click", function () { edForm.hidden = true; });
    $("#ed-datei", root).addEventListener("change", function () {
      var f = this.files && this.files[0];
      if (f && !$("#ed-t", root).value.trim()) {
        $("#ed-t", root).value = f.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
      }
    });
    edForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var vorhandeneId = edForm.getAttribute("data-id");
      var alt = vorhandeneId ? dokumentVon(vorhandeneId) : null;
      var titel = $("#ed-t", root).value.trim();
      var datei = $("#ed-datei", root).files && $("#ed-datei", root).files[0];
      if (!titel) { edStatus.textContent = "Titel ausfüllen."; return; }
      if (!datei && !alt) { edStatus.textContent = "Datei auswählen."; return; }
      if (datei && datei.size > 12 * 1048576) {
        edStatus.textContent = "Datei ist größer als 12 MB — bitte verkleinern (z. B. PDF komprimieren)."; return;
      }
      function speichern(dataUrl, dateiName, groesse) {
        var d = {
          id: vorhandeneId || eigeneNeuId("ed"), eigen: true, typ: "eigen",
          titel: titel, herausgeber: "Eigene Ablage", stand: heuteDe(),
          beschreibung: $("#ed-beschreibung", root).value.trim(),
          stichworte: $("#ed-stich", root).value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          dataUrl: dataUrl, dateiName: dateiName, groesse: groesse,
          datei: null, url: "", angelegt: alt ? alt.angelegt : Date.now(), geaendert: Date.now()
        };
        window.LokalDB.speichern("eigeneDokumente", d).then(function () {
          neuLaden("Dokument gespeichert.", "#ed-status");
        }, function (fehler) { edStatus.textContent = String(fehler && fehler.message || "Speichern fehlgeschlagen."); });
      }
      if (datei) {
        edStatus.textContent = "Datei wird gelesen …";
        var leser = new FileReader();
        leser.onload = function () { speichern(String(leser.result), datei.name, datei.size); };
        leser.onerror = function () { edStatus.textContent = "Datei konnte nicht gelesen werden."; };
        leser.readAsDataURL(datei);
      } else {
        speichern(alt.dataUrl, alt.dateiName, alt.groesse);
      }
    });
    root.querySelectorAll("[data-ed-bearbeiten]").forEach(function (b) {
      b.addEventListener("click", function () { edOeffnen(dokumentVon(b.getAttribute("data-ed-bearbeiten"))); });
    });
    root.querySelectorAll("[data-ed-loeschen]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = dokumentVon(b.getAttribute("data-ed-loeschen"));
        if (!d || !window.confirm('Dokument „' + d.titel + '" endgültig löschen?')) return;
        window.LokalDB.loeschen("eigeneDokumente", d.id).then(function () { neuLaden("Dokument gelöscht.", "#ed-status"); });
      });
    });
    if (params.neu === "dokument") edOeffnen(null);

    /* ---- Sicherung (Format Version 2: kompletter Arbeitsstand) ----
       Version 1 (nur Artikel + Dokumente) wird beim Einlesen weiter
       akzeptiert. Formatkennung nie umbenennen (Bestandssicherungen). */
    var SICHER_KEYS = ["aw.merkliste", "aw.zuletzt", "aw.vorlagenwerte", "aw.vorlagenhistorie", "aw.detail", "aw.rolle"];
    $("#sich-export", root).addEventListener("click", function () {
      Promise.all([
        window.LokalDB.alle("vermerke").catch(function () { return []; }),
        window.LokalDB.alle("notizen").catch(function () { return []; }),
        window.LokalDB.alle("checklisten").catch(function () { return []; })
      ]).then(function (extra) {
        var einstellungen = {};
        SICHER_KEYS.forEach(function (k) {
          try { var v = localStorage.getItem(k); if (v !== null) einstellungen[k] = v; } catch (e) {}
        });
        var daten = {
          format: "azubi-wissen-sicherung", version: 2, erstellt: new Date().toISOString(),
          artikel: EIGENE.artikel, dokumente: EIGENE.dokumente,
          vermerke: extra[0], notizen: extra[1], checklisten: extra[2],
          einstellungen: einstellungen
        };
        var blob = new Blob([JSON.stringify(daten, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "gruene-berufe-sicherung-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        sichStatus.textContent = "Komplettsicherung heruntergeladen (" + EIGENE.artikel.length + " Artikel, " +
          EIGENE.dokumente.length + " Dokumente, " + extra[0].length + " Vermerke, " + extra[1].length +
          " Notizen, " + extra[2].length + " Checklisten-Stände, Merkliste & Vorlagenwerte).";
      }, function () { sichStatus.textContent = "Sicherung fehlgeschlagen — lokale Datenbank nicht erreichbar."; });
    });
    $("#sich-import", root).addEventListener("change", function () {
      var f = this.files && this.files[0];
      if (!f) return;
      var leser = new FileReader();
      leser.onload = function () {
        var daten;
        try { daten = JSON.parse(String(leser.result)); } catch (e) { sichStatus.textContent = "Datei ist kein gültiges JSON."; return; }
        if (!daten || daten.format !== "azubi-wissen-sicherung" || !Array.isArray(daten.artikel) || !Array.isArray(daten.dokumente)) {
          sichStatus.textContent = "Datei ist keine Sicherung dieses Tools."; return;
        }
        sichStatus.textContent = "Sicherung wird eingelesen …";
        var schreibvorgaenge = [];
        daten.artikel.forEach(function (a) {
          if (a && a.id && a.titel) { a.eigen = true; schreibvorgaenge.push(window.LokalDB.speichern("eigeneArtikel", a)); }
        });
        daten.dokumente.forEach(function (d) {
          if (d && d.id && d.titel) { d.eigen = true; d.typ = "eigen"; schreibvorgaenge.push(window.LokalDB.speichern("eigeneDokumente", d)); }
        });
        var extraZahl = 0;
        [["vermerke", daten.vermerke], ["notizen", daten.notizen], ["checklisten", daten.checklisten]].forEach(function (paar) {
          (Array.isArray(paar[1]) ? paar[1] : []).forEach(function (e) {
            if (e && e.id !== undefined) { extraZahl++; schreibvorgaenge.push(window.LokalDB.speichern(paar[0], e)); }
          });
        });
        var einstellungsZahl = 0;
        if (daten.einstellungen && typeof daten.einstellungen === "object") {
          SICHER_KEYS.forEach(function (k) {
            if (typeof daten.einstellungen[k] === "string") {
              try { localStorage.setItem(k, daten.einstellungen[k]); einstellungsZahl++; } catch (e) {}
            }
          });
        }
        Promise.all(schreibvorgaenge).then(function () {
          neuLaden(daten.artikel.length + " Artikel, " + daten.dokumente.length + " Dokumente" +
            (extraZahl ? ", " + extraZahl + " Vermerke/Notizen/Checklisten-Stände" : "") +
            (einstellungsZahl ? " und Einstellungen (Merkliste, Vorlagenwerte)" : "") + " eingelesen.", "#sich-status");
        }, function (fehler) { sichStatus.textContent = String(fehler && fehler.message || "Einlesen fehlgeschlagen."); });
      };
      leser.readAsText(f);
    });
  }

  /* ---------------- Start ------------------------------------------ */
  function init() {
    document.querySelectorAll("[data-palette]").forEach(function (b) {
      b.addEventListener("click", function () { paletteOeffnen(); });
    });
    window.addEventListener("hashchange", rendern);
    // Sofort rendern — die Startseite darf nie auf die lokale Datenbank
    // warten (eine langsame/blockierte IndexedDB ließ sonst die Seite leer).
    rendern();
    // Eigene Inhalte danach nachladen; nur neu rendern, wenn es welche gibt.
    eigeneLaden().then(function () {
      if (EIGENE.artikel.length || EIGENE.dokumente.length) rendern();
    }, function () { /* ohne lokale Datenbank läuft das Tool trotzdem */ });
  }
  // Erst rendern, wenn alle Modul-Skripte (Assistent, Export) geladen sind.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // Öffentliche Mini-API für Assistent/Export
  window.AzubiApp = {
    suchen: suchen, fmt: fmt, fmtInline: fmtInline, esc: esc,
    norm: norm, tokenAlternativen: tokenAlternativen, tokenScore: tokenScore, stoppwoerter: STOP,
    artikelVon: artikelVon, themaVon: themaVon,
    paletteOeffnen: paletteOeffnen, rendern: rendern
  };
})();
