// assistent.js — Lokaler KI-Assistent der Wissensdatenbank.
// Beantwortet freie Fragen ausschließlich aus der lokalen Wissensbasis
// (Retrieval + Antwortsynthese mit Quellenangaben). Es werden keinerlei
// Daten übertragen — Zero-Trust, vollständig offline.
(function () {
  "use strict";
  var W = window.WISSEN;

  var verlauf = []; // {rolle:"frage"|"antwort", html:string}
  var wurzel = null;

  /* ---------------- Fragenanalyse ---------------------------------- */
  var INTENTS = [
    { id: "hoehe", re: /(wie viel|wieviel|wie hoch|hohe|betrag|steht mir zu)/ },
    { id: "frist", re: /(wie lange|bis wann|ab wann|wann |frist|dauer|wie oft)/ },
    { id: "erlaubnis", re: /(darf|durfen|erlaubt|verboten|zulassig|muss|mussen|pflicht|zwingen)/ },
    { id: "zustaendig", re: /(wer |an wen|zustandig|wohin|anlaufstelle)/ },
    { id: "folgen", re: /(was passiert|folgen|konsequenz|was tun|was kann ich)/ }
  ];
  function intentErkennen(nq) {
    for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i].re.test(nq)) return INTENTS[i].id;
    return "";
  }

  // Fakten eines Artikels nach Übereinstimmung mit der Frage sortieren.
  function faktenWaehlen(artikel, tokens, n) {
    var A = window.AzubiApp;
    var bewertet = (artikel.fakten || []).map(function (f) {
      var hay = A.norm(f);
      var s = 0;
      tokens.forEach(function (tok) {
        var best = 0;
        A.tokenAlternativen(tok).forEach(function (al) {
          best = Math.max(best, A.tokenScore(al, hay));
        });
        s += best;
      });
      return { f: f, s: s };
    });
    bewertet.sort(function (a, b) { return b.s - a.s; });
    var mitTreffer = bewertet.filter(function (x) { return x.s > 0; });
    var wahl = (mitTreffer.length ? mitTreffer : bewertet).slice(0, n);
    return wahl.map(function (x) { return x.f; });
  }

  /* ---------------- Antwortsynthese -------------------------------- */
  function antwortBauen(frage) {
    var A = window.AzubiApp;
    var nq = A.norm(frage);
    var erg = A.suchen(frage);
    var tokens = erg.tokens || [];
    var intent = intentErkennen(" " + nq + " ");

    var topFaq = erg.faq[0];
    var topArt = erg.artikel[0] ? A.artikelVon(erg.artikel[0].id) : null;
    var faqScore = topFaq ? topFaq.score : 0;
    var artScore = erg.artikel[0] ? erg.artikel[0].score : 0;

    // Nichts Brauchbares gefunden -> ehrlicher Fallback
    if (!topFaq && !topArt) {
      return {
        html: "<p>Dazu habe ich in der Wissensdatenbank <strong>keinen gesicherten Eintrag</strong> gefunden.</p>" +
          "<ul><li>Formuliere die Frage anders oder nutze ein Stichwort (z. B. „Urlaub“, „Kündigung“, „Berichtsheft“).</li>" +
          "<li>Stöbere in der <a href=\"#/wissen\">Wissensdatenbank</a> nach dem passenden Themenbereich.</li>" +
          "<li>Im Einzelfall hilft die <a href=\"#/artikel/zustaendige-stelle\">Ausbildungsberatung der zuständigen Stelle</a> persönlich weiter.</li></ul>",
        quellen: [], folgefragen: standardFolgefragen()
      };
    }

    var haupt = null, einstieg = "", kern = "";
    // Starker FAQ-Treffer: die FAQ-Antwort ist bereits die direkte Antwort.
    // Gehört die FAQ zu einem anderen Artikel als dem Top-Treffer, muss sie
    // deutlich dominieren — sonst führt der Artikel.
    var faqPasst = topFaq && (!topArt || topFaq.id === topArt.id
      ? faqScore >= artScore * 0.6
      : faqScore >= artScore * 1.1);
    if (faqPasst) {
      haupt = A.artikelVon(topFaq.id);
      var f = haupt.faq[topFaq.faqIndex];
      einstieg = "<p>" + A.fmtInline(f.a) + "</p>";
    } else if (topArt) {
      haupt = topArt;
      einstieg = "<p>" + A.fmtInline(haupt.kurz) + "</p>";
    }

    // Ergänzende Fakten aus dem Hauptartikel (passend zur Frage gewählt)
    var fakten = faktenWaehlen(haupt, tokens, 3);
    if (fakten.length) {
      kern = "<ul>" + fakten.map(function (x) { return "<li>" + A.fmtInline(x) + "</li>"; }).join("") + "</ul>";
    }

    // Hinweis je nach erkannter Frageart
    var zusatz = "";
    if (intent === "zustaendig") {
      zusatz = "<p class=\"bw-klein bw-leise\">Anlaufstelle: die Ausbildungsberatung der zuständigen Stelle — für die grünen Berufe in BW das Regierungspräsidium.</p>";
    } else if (intent === "folgen" && haupt.id !== "konflikte") {
      zusatz = "<p class=\"bw-klein bw-leise\">Bei Konflikten gilt: erst das Gespräch, dann die <a href=\"#/artikel/konflikte\">Ausbildungsberatung</a>.</p>";
    }

    // Konfidenz: schwache Treffer transparent machen
    var unsicher = Math.max(faqScore, artScore) < 6
      ? "<p class=\"bw-klein bw-leise\">Ich bin nicht sicher, ob das deine Frage genau trifft — die Quellen unten führen zum vollständigen Artikel.</p>"
      : "";

    var quellen = [];
    (haupt.recht || []).slice(0, 3).forEach(function (r) { quellen.push({ text: r.n, ziel: "#/artikel/" + haupt.id }); });
    quellen.push({ text: "Artikel: " + haupt.titel, ziel: "#/artikel/" + haupt.id });
    var zweit = erg.artikel[1] && erg.artikel[1].id !== haupt.id ? A.artikelVon(erg.artikel[1].id) : null;
    if (zweit) quellen.push({ text: "Siehe auch: " + zweit.titel, ziel: "#/artikel/" + zweit.id });

    return { html: einstieg + kern + zusatz + unsicher, quellen: quellen, folgefragen: folgefragenZu(haupt) };
  }

  function folgefragenZu(artikel) {
    var A = window.AzubiApp, aus = [];
    (artikel.faq || []).slice(0, 2).forEach(function (f) { aus.push(f.f); });
    (artikel.verwandt || []).forEach(function (id) {
      var v = A.artikelVon(id);
      if (v && v.faq && v.faq.length && aus.length < 4) aus.push(v.faq[0].f);
    });
    return aus.slice(0, 3);
  }
  function standardFolgefragen() {
    return [
      "Wie viele Urlaubstage habe ich als Azubi?",
      "Wie hoch ist die Mindestvergütung?",
      "Kann mir nach der Probezeit gekündigt werden?"
    ];
  }

  /* ---------------- Oberfläche ------------------------------------- */
  function renderView(container, params) {
    var A = window.AzubiApp;
    var h = "<h1>KI-Assistent</h1>" +
      "<p class=\"bw-unterzeile\">Fragen stellen — Antworten mit Quellen aus der Wissensdatenbank</p>" +
      "<div class=\"bw-hinweis\"><p><strong>Lokal &amp; vertraulich:</strong> Der Assistent antwortet ausschließlich aus der " +
      "Wissensdatenbank dieses Werkzeugs (Stand " + A.esc(W.stand) + ") und läuft komplett offline — keine Eingabe verlässt dieses Gerät. " +
      "Er ersetzt keine Rechtsberatung im Einzelfall.</p></div>" +
      "<div class=\"chat\">" +
      "  <ul class=\"chat__verlauf\" id=\"chat-verlauf\" aria-live=\"polite\"></ul>" +
      "  <ul class=\"chipzeile\" id=\"chat-vorschlaege\" aria-label=\"Vorschläge\"></ul>" +
      "  <form class=\"chat__eingabe\" id=\"chat-form\">" +
      "    <label for=\"chat-frage\" class=\"bw-skip-link\">Frage</label>" +
      "    <textarea id=\"chat-frage\" rows=\"2\" placeholder=\"Frage eingeben … z. B. Muss ich Überstunden machen?\" required></textarea>" +
      "    <button class=\"bw-btn\" type=\"submit\">Fragen</button>" +
      "  </form>" +
      "  <p class=\"bw-klein\"><button class=\"chip\" type=\"button\" id=\"chat-leeren\">Verlauf löschen</button></p>" +
      "</div>";
    container.innerHTML = h;
    wurzel = container;

    verlaufZeigen();
    vorschlaegeZeigen(verlauf.length ? [] : standardFolgefragen());

    var form = container.querySelector("#chat-form");
    var feld = container.querySelector("#chat-frage");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var frage = feld.value.trim();
      if (!frage) return;
      feld.value = "";
      fragen(frage);
    });
    feld.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });
    container.querySelector("#chat-leeren").addEventListener("click", function () {
      verlauf = [];
      try { sessionStorage.removeItem("aw.chat"); } catch (x) {}
      verlaufZeigen();
      vorschlaegeZeigen(standardFolgefragen());
      feld.focus();
    });

    // Frage aus Deep-Link (#/assistent?frage=…) direkt beantworten
    if (params && params.frage) {
      var f = params.frage;
      history.replaceState(null, "", "#/assistent");
      fragen(f);
    }
  }

  function verlaufZeigen() {
    var ul = wurzel && wurzel.querySelector("#chat-verlauf");
    if (!ul) return;
    ul.innerHTML = verlauf.map(function (e) {
      return "<li class=\"blase blase--" + e.rolle + "\">" + e.html + "</li>";
    }).join("");
    ul.scrollTop = ul.scrollHeight;
    var letzte = ul.lastElementChild;
    if (letzte) letzte.scrollIntoView({ block: "nearest" });
  }

  function vorschlaegeZeigen(fragen) {
    var ul = wurzel && wurzel.querySelector("#chat-vorschlaege");
    if (!ul) return;
    var A = window.AzubiApp;
    ul.innerHTML = (fragen || []).map(function (f) {
      return "<li><button type=\"button\" class=\"chip chip--frage\" data-frage=\"" + A.esc(f) + "\">" + A.esc(f) + "</button></li>";
    }).join("");
    ul.querySelectorAll("[data-frage]").forEach(function (b) {
      b.addEventListener("click", function () { fragenStellen(b.getAttribute("data-frage")); });
    });
  }
  function fragenStellen(f) { fragen(f); }

  function fragen(frage) {
    var A = window.AzubiApp;
    verlauf.push({ rolle: "frage", html: "<p>" + A.esc(frage) + "</p>" });
    verlaufZeigen();
    vorschlaegeZeigen([]);

    var ul = wurzel.querySelector("#chat-verlauf");
    var denkt = document.createElement("li");
    denkt.className = "blase blase--antwort";
    denkt.innerHTML = "<span class=\"tippt\" aria-label=\"Assistent sucht in der Wissensdatenbank\"><span></span><span></span><span></span></span>";
    ul.appendChild(denkt);
    denkt.scrollIntoView({ block: "nearest" });

    var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      var a = antwortBauen(frage);
      var quellenHtml = a.quellen.length
        ? "<div class=\"quellen\"><span class=\"qtitel\">Quellen</span>" +
          a.quellen.map(function (q) { return "<a href=\"" + q.ziel + "\">" + window.AzubiApp.esc(q.text) + "</a>"; }).join("") + "</div>"
        : "";
      verlauf.push({ rolle: "antwort", html: a.html + quellenHtml });
      merken();
      verlaufZeigen();
      vorschlaegeZeigen(a.folgefragen);
    }, reduziert ? 0 : 350);
  }

  function merken() {
    try { sessionStorage.setItem("aw.chat", JSON.stringify(verlauf.slice(-20))); } catch (x) {}
  }
  (function laden() {
    try {
      var v = JSON.parse(sessionStorage.getItem("aw.chat") || "[]");
      if (Array.isArray(v)) verlauf = v;
    } catch (x) { verlauf = []; }
  })();

  window.AzubiAssistent = { renderView: renderView, antwortBauen: antwortBauen };
})();
