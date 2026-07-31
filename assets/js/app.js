// app.js — Anwendungskern der Wissensdatenbank „Azubi-Wissen".
// Hash-Router, Ansichten (Start / Wissen / Artikel), globale Suchpalette.
// Assistent und Export liegen in eigenen Modulen (assistent.js, export.js)
// und werden hier nur eingehängt, falls vorhanden.
(function () {
  "use strict";
  var W = window.WISSEN;
  var S = window.bwSearch;

  /* ---------------- Hilfen ---------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
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
      return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }
  }
  function themaVon(id) {
    for (var i = 0; i < W.themen.length; i++) if (W.themen[i].id === id) return W.themen[i];
    return null;
  }
  function artikelVon(id) {
    for (var i = 0; i < W.artikel.length; i++) if (W.artikel[i].id === id) return W.artikel[i];
    return null;
  }
  var ICON = {
    suche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    buch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="13" y2="17"></line></svg>'
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
  function norm(s) { return S.normalize(s).replace(/[^a-z0-9]+/g, " ").trim(); }
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

  var TYP_NAME = { formular: "Formular", merkblatt: "Merkblatt", plan: "Ausbildungsplan", gesetz: "Gesetz", link: "Link", portal: "Portal", video: "Video" };
  function quelleZiel(e) {
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
            '<a href="' + esc(z.href) + '" target="_blank" rel="noopener">' +
            '<span class="wo">' + esc(TYP_NAME[e.typ] || e.typ) + (z.extern ? " ↗" : "") + "</span>" +
            '<span class="titel">' + S.highlight(e.titel, q) + "</span>" +
            '<span class="schnipsel">' + esc(e.herausgeber + (e.stand ? " · Stand " + e.stand : "")) + "</span></a></li>";
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
      if (!erg.artikel.length && !erg.faq.length && !erg.themen.length && !qerg.length) {
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
    var r = parseHash();
    var haupt = $("#inhalt");
    var view = r.pfad[0] || "start";
    var titel = "Azubi-Wissen — RP Freiburg";

    if (view === "artikel" && r.pfad[1] && artikelVon(r.pfad[1])) {
      var a = artikelVon(r.pfad[1]);
      haupt.innerHTML = viewArtikel(a, r.params);
      artikelVerhalten(haupt, a, r.params);
      titel = a.titel + " — Azubi-Wissen";
    } else if (view === "wissen") {
      haupt.innerHTML = viewWissen(r.params);
      wissenVerhalten(haupt, r.params);
      titel = "Wissensdatenbank — Azubi-Wissen";
    } else if (view === "quellen") {
      haupt.innerHTML = viewQuellen(r.params);
      quellenVerhalten(haupt, r.params);
      titel = "Formulare & Quellen — Azubi-Wissen";
    } else if (view === "assistent") {
      if (window.AzubiAssistent) { window.AzubiAssistent.renderView(haupt, r.params); }
      else haupt.innerHTML = platzhalter("KI-Assistent", "Der lokale Assistent wird im nächsten Ausbauschritt eingebaut.");
      titel = "KI-Assistent — Azubi-Wissen";
    } else if (view === "export") {
      if (window.AzubiExport) { window.AzubiExport.renderView(haupt, r.params); }
      else haupt.innerHTML = platzhalter("Export & Aktenvermerk", "PDF-Export und Aktenvermerk-Generator folgen im nächsten Ausbauschritt.");
      titel = "Export & Vermerk — Azubi-Wissen";
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
      '<h1>Azubi-Wissen</h1>' +
      '<p class="bw-unterzeile">Rechte &amp; Pflichten in der Ausbildung — Wissensdatenbank der Ausbildungsberatung</p>' +
      '<button type="button" class="suchfeld-gross" data-palette>' + ICON.suche +
      '<span>Suchen: Urlaub, Kündigung, Vergütung …</span><kbd class="kbd">Strg K</kbd></button>' +
      '</div>' +
      '<div class="hero__stoerer"><span class="bw-stoerer">' + W.artikel.length + ' Artikel<br>' + anzahlFaq + ' FAQ</span></div></div>';

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

    h += '<div class="schnellzeile">' +
      '<a class="schnellkarte" href="#/assistent">' + ICON.chat + "<span><h3>KI-Assistent fragen</h3><p>Freie Fragen stellen — Antworten mit Quellen aus der Wissensdatenbank, komplett offline.</p></span></a>" +
      '<a class="schnellkarte" href="#/export">' + ICON.doc + "<span><h3>PDF-Export &amp; Aktenvermerk</h3><p>Themenbereiche als PDF für Beratung, Betriebe oder Azubis — und Vermerke strukturiert erstellen.</p></span></a>" +
      "</div>";

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
    var h = '<h1>Wissensdatenbank</h1>' +
      '<p class="bw-unterzeile">' + W.artikel.length + " Artikel zu Rechten und Pflichten in der Ausbildung</p>" +
      '<div class="bw-search" style="max-width:34rem"><label for="wq" class="bw-skip-link">Artikel filtern</label>' +
      '<input id="wq" type="search" placeholder="Filtern… (tipptolerant, alle Felder)" aria-label="Artikel filtern">' +
      '<button type="button" aria-label="Suchen">' + ICON.suche + "</button></div>";
    h += '<ul class="chipzeile" role="group" aria-label="Nach Themenbereich filtern">';
    h += '<li><button class="chip" data-thema="" aria-pressed="' + (!aktiv) + '">Alle</button></li>';
    W.themen.forEach(function (th) {
      h += '<li><button class="chip" data-thema="' + th.id + '" aria-pressed="' + (aktiv === th.id) + '">' + esc(th.titel) + "</button></li>";
    });
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

    function zeigen() {
      var q = eingabe.value.trim();
      var artikel;
      if (q) {
        var erg = suchen(q);
        artikel = erg.artikel.map(function (r) { return artikelVon(r.id); });
        // Bei Suche zusätzlich FAQ-only-Treffer als Artikel aufnehmen
        erg.faq.forEach(function (r) {
          var a = artikelVon(r.id);
          if (artikel.indexOf(a) < 0) artikel.push(a);
        });
      } else {
        artikel = W.artikel.slice();
      }
      if (aktiv) artikel = artikel.filter(function (a) { return a.thema === aktiv; });
      liste.innerHTML = artikel.map(function (a) {
        var th = themaVon(a.thema);
        var recht = (a.recht || []).slice(0, 2).map(function (r) { return '<span class="etikett etikett--recht">' + esc(r.n) + "</span>"; }).join("");
        return '<li class="karte"><a class="karte__link" href="#/artikel/' + a.id + '">' +
          '<span class="etikett">' + esc(th ? th.titel : "") + "</span>" +
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
    zeigen();
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
    h += '<p class="artikel-lead">' + esc(a.kurz) + "</p>";

    h += '<div class="detail-schalter" role="group" aria-label="Detailgrad">';
    DETAILSTUFEN.forEach(function (d) {
      h += '<button type="button" data-stufe="' + d.n + '" aria-pressed="' + (d.n === stufe) + '">' + d.name + "</button>";
    });
    h += "</div>";

    h += '<div class="fakten bw-hinweis"><strong>Das Wichtigste in Kürze</strong><ul>' +
      (a.fakten || []).map(function (f) { return "<li>" + fmtInline(f) + "</li>"; }).join("") + "</ul></div>";

    h += '<div class="artikel-inhalt" id="artikel-inhalt"></div>';

    if ((a.recht || []).length || a.quelle) {
      h += '<div class="recht-box bw-card">';
      if ((a.recht || []).length) {
        h += "<strong>Rechtsgrundlagen</strong><ul>" +
          a.recht.map(function (r) { return '<li><span class="norm">' + esc(r.n) + "</span> — " + esc(r.t) + "</li>"; }).join("") +
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
      "</div>";
    return h;
  }
  function fmtInline(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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
              .then(function () { notizStatus.textContent = "Notiz gespeichert."; });
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

    function zeigen() {
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
    zeigen();
  }

  /* ---------------- Start ------------------------------------------ */
  function init() {
    document.querySelectorAll("[data-palette]").forEach(function (b) {
      b.addEventListener("click", function () { paletteOeffnen(); });
    });
    window.addEventListener("hashchange", rendern);
    rendern();
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
