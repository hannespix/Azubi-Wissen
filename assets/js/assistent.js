// assistent.js — Lokaler KI-Assistent der Wissensdatenbank.
// Beantwortet freie Fragen ausschließlich aus der lokalen Wissensbasis
// (Retrieval + Antwortsynthese mit Quellenangaben). Es werden keinerlei
// Daten übertragen — Zero-Trust, vollständig offline.
(function () {
  "use strict";
  var W = window.WISSEN;

  var verlauf = []; // {rolle:"frage"|"antwort", html:string}
  var wurzel = null;
  var kontext = null; // Dialoggedächtnis: { artikelId, titel, stichworte, rechner }

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

  // Fakten eines Artikels nach Übereinstimmung mit der Frage sortieren;
  // die erkannte Frageart gibt passenden Sätzen einen kleinen Vorsprung
  // (Zahlen bei „wie viel/wie lange", Regelwörter bei „darf/muss").
  function faktenWaehlen(artikel, tokens, n, intent) {
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
      if (s > 0) {
        if ((intent === "hoehe" || intent === "frist") && /\d/.test(f)) s += 1.5;
        if (intent === "erlaubnis" && /(darf|durfen|muss|mussen|nicht|verboten|zulassig|pflicht|unzulassig)/.test(hay)) s += 1.5;
      }
      return { f: f, s: s };
    });
    bewertet.sort(function (a, b) { return b.s - a.s; });
    var mitTreffer = bewertet.filter(function (x) { return x.s > 0; });
    var wahl = (mitTreffer.length ? mitTreffer : bewertet).slice(0, n);
    return wahl.map(function (x) { return x.f; });
  }

  /* ---------------- Rechnende Antworten (K1) ------------------------
     Erkennt berechenbare Fragen und antwortet mit dem konkreten Wert —
     die Rechenkerne kommen aus app.js (identisch mit den Rechner-Karten). */
  function zahlAus(re, s) { var m = s.match(re); return m ? parseInt(m[1], 10) : null; }
  function rechnerAntwort(roh, nq) {
    var A = window.AzubiApp;
    // Urlaub nach Alter — "wie viel urlaub mit 16", Folgefrage "und mit 17?"
    var alter = zahlAus(/\bmit (\d{1,2})\b/, nq);
    if (alter === null) alter = zahlAus(/\b(\d{1,2}) jahre/, nq);
    if (alter === null) alter = zahlAus(/\bbin (\d{1,2})\b/, nq);
    var themaUrlaub = /(urlaub|ferien)/.test(nq) || (kontext && kontext.rechner === "urlaub");
    if (themaUrlaub && alter !== null && alter >= 13 && alter <= 70) {
      var u = A.urlaubNachAlter(alter);
      return {
        html: "<p>Mit <strong>" + alter + " Jahren</strong> (maßgeblich ist das Alter am 1. Januar des Urlaubsjahres) sind es mindestens <strong>" +
          u.werktage + " Werktage</strong> Urlaub — das entspricht " + u.arbeitstage + " Arbeitstagen in der 5-Tage-Woche. Grundlage: " +
          A.fmtInline(u.grundlage) + ". Tarifverträge geben oft mehr.</p>",
        quellen: [{ text: "Artikel: Urlaub in der Ausbildung", ziel: "#/artikel/urlaub" },
                  { text: "Urlaubsrechner öffnen", ziel: "#/nachschlag?karte=rechner-urlaub" }],
        folgefragen: ["Darf mein Betrieb Urlaub während der Berufsschulzeit anordnen?", "Was passiert mit meinem Urlaub, wenn ich im Urlaub krank werde?"],
        rechner: "urlaub", artikelId: "urlaub", titel: "Urlaub in der Ausbildung"
      };
    }
    // Mindestvergütung — "mindestvergütung 2. lehrjahr (beginn 2025)"
    var lj = zahlAus(/\b([1-4])\.? ?(?:ausbildungsjahr|lehrjahr)\b/, nq);
    if (lj === null && (kontext && kontext.rechner === "verguetung")) lj = zahlAus(/\b([1-4])\b/, nq);
    // Achtung: nq ist diakritik-normalisiert (ü→u) — Muster entsprechend.
    var themaMiav = /(mindestvergutung|vergutung|verdien|gehalt|lohn|bezahlung)/.test(nq) || (kontext && kontext.rechner === "verguetung");
    if (themaMiav && lj !== null) {
      var jahre = A.miavJahre(), beginn = null;
      jahre.forEach(function (j) { if (nq.indexOf(String(j)) >= 0) beginn = j; });
      if (beginn === null) beginn = Math.max.apply(null, jahre);
      var wert = A.miavWert(beginn, lj);
      if (wert !== null) {
        return {
          html: "<p>Die gesetzliche Mindestausbildungsvergütung im <strong>" + lj + ". Ausbildungsjahr</strong> beträgt bei Ausbildungsbeginn " +
            beginn + " <strong>" + A.euro(wert) + "</strong> brutto im Monat (" + A.fmtInline("§ 17 BBiG") + "). Tarifverträge — auch in den grünen Berufen — liegen meist darüber; ohne Tarifbindung gilt zusätzlich die 80-Prozent-Regel.</p>",
          quellen: [{ text: "Artikel: Mindestausbildungsvergütung", ziel: "#/artikel/mindestverguetung" },
                    { text: "Vergütungsrechner öffnen", ziel: "#/nachschlag?karte=rechner-verguetung" }],
          folgefragen: ["Wann muss meine Ausbildungsvergütung gezahlt werden?", "Darf mein Betrieb Kost und Wohnung vom Gehalt abziehen?"],
          rechner: "verguetung", artikelId: "mindestverguetung", titel: "Mindestausbildungsvergütung"
        };
      }
    }
    // Teilzeit-Gesamtdauer — "teilzeit 75 prozent"
    var pz = zahlAus(/\b(\d{2}) ?(?:%|prozent)\b/, nq + " " + roh.replace(/%/g, " % "));
    if (/teilzeit/.test(nq) && pz !== null && pz >= 50 && pz < 100) {
      var basis = zahlAus(/\b(24|30|36|42) ?monate/, nq) || 36;
      var t = A.teilzeitDauer(basis, pz);
      return {
        html: "<p>Bei <strong>" + pz + " % Teilzeit</strong> verlängert sich eine " + basis + "-monatige Ausbildung auf <strong>" + t.monate +
          " Monate</strong> (rechnerisch " + t.rechnerisch + " Monate, höchstens das Anderthalbfache = " + t.maximal + " Monate, " +
          A.fmtInline("§ 7a BBiG") + ").</p>",
        quellen: [{ text: "Artikel: Teilzeit, Verkürzung & Verlängerung", ziel: "#/artikel/teilzeit-verkuerzung" },
                  { text: "Teilzeitrechner öffnen", ziel: "#/nachschlag?karte=rechner-teilzeit" }],
        folgefragen: ["Wer entscheidet über Verkürzung oder Verlängerung?"],
        rechner: "teilzeit", artikelId: "teilzeit-verkuerzung", titel: "Teilzeitausbildung"
      };
    }
    // Probezeit-Ende — "probezeit ab 01.09.2026 (3 monate)"
    var dm = roh.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/);
    if (/probezeit/.test(nq) && dm) {
      var iso = dm[3] + "-" + ("0" + dm[2]).slice(-2) + "-" + ("0" + dm[1]).slice(-2);
      var monate = zahlAus(/\b([1-4]) ?monat/, nq) || 4;
      var ende = A.probezeitEnde(iso, monate);
      if (ende) {
        return {
          html: "<p>Bei Ausbildungsbeginn am " + A.esc(dm[0]) + " endet eine " + monate + "-monatige Probezeit am <strong>" +
            ende.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) + "</strong> (" +
            A.fmtInline("§ 20 BBiG") + ": mindestens 1, höchstens 4 Monate).</p>",
          quellen: [{ text: "Artikel: Die Probezeit", ziel: "#/artikel/probezeit" },
                    { text: "Fristenrechner öffnen", ziel: "#/nachschlag?karte=rechner-fristen" }],
          folgefragen: ["Kann mir in der Probezeit einfach so gekündigt werden?"],
          rechner: "probezeit", artikelId: "probezeit", titel: "Die Probezeit"
        };
      }
    }
    return null;
  }

  /* ---------------- Vergleichs-/Begriffsfragen (K1) ----------------- */
  function vergleichAntwort(nq) {
    if (!/(unterschied|vergleich)/.test(nq) || !window.GLOSSAR) return null;
    var A = window.AzubiApp;
    var treffer = [];
    window.GLOSSAR.begriffe.forEach(function (b) {
      var hay = A.norm(b.b + " " + (b.stichworte || []).join(" "));
      var s = 0;
      nq.split(" ").forEach(function (tok) {
        var stamm = tok.replace(/(en|er|e|n|s)$/, "");
        if (stamm.length > 3 && hay.indexOf(stamm) >= 0) s += stamm.length;
      });
      if (s > 3) treffer.push({ b: b, s: s });
    });
    treffer.sort(function (x, y) { return y.s - x.s; });
    if (!treffer.length) return null;
    var teile = treffer.slice(0, 2).map(function (t) {
      return "<p><strong>" + A.esc(t.b.b) + ":</strong> " + A.fmtInline(t.b.k) + "</p>";
    });
    var erster = treffer[0].b;
    return {
      html: teile.join(""),
      quellen: [{ text: "Glossar: alle Begriffe", ziel: "#/glossar" }].concat(
        (erster.artikel || []).slice(0, 1).map(function (id) {
          var a = A.artikelVon(id);
          return a ? { text: "Artikel: " + a.titel, ziel: "#/artikel/" + id } : null;
        }).filter(Boolean)),
      folgefragen: [],
      artikelId: (erster.artikel || [])[0] || null, titel: erster.b
    };
  }

  // Kurze Anschlussfragen („und mit 16?", „gilt das auch …?") beziehen
  // sich auf das vorige Thema — dann wird der Kontext mitgesucht.
  function istFolgefrage(nq) {
    if (/^(und |was ist mit |gilt das|auch |wie sieht es|davon |dann |warum)/.test(nq)) return true;
    var A = window.AzubiApp;
    var inhalt = nq.split(" ").filter(function (t) { return t && !A.stoppwoerter[t]; });
    return inhalt.length > 0 && inhalt.length < 3;
  }
  function kontextSetzen(a) {
    kontext = { artikelId: a.artikelId || null, titel: a.titel || "", stichworte: a.stichworte || "", rechner: a.rechner || null };
  }

  /* ---------------- Antwortsynthese -------------------------------- */
  function antwortBauen(frage) {
    var A = window.AzubiApp;
    var nq = A.norm(frage);

    // 1) Berechenbare Frage? Direkt rechnen (Kerne aus app.js).
    var gerechnet = rechnerAntwort(frage, nq);
    if (gerechnet) { kontextSetzen(gerechnet); return gerechnet; }

    // 2) Begriffs-/Vergleichsfrage? Glossar-Definitionen liefern.
    var verglichen = vergleichAntwort(nq);
    if (verglichen) { kontextSetzen(verglichen); return verglichen; }

    // 3) Folgefrage? Voriges Thema in die Suche einmischen.
    var folge = kontext && kontext.stichworte && istFolgefrage(nq);
    var erg = A.suchen(folge ? frage + " " + kontext.stichworte : frage);
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
    var fakten = faktenWaehlen(haupt, tokens, 3, intent);
    if (fakten.length) {
      kern = "<ul>" + fakten.map(function (x) { return "<li>" + A.fmtInline(x) + "</li>"; }).join("") + "</ul>";
    }

    // Synthese über zwei Artikel: Liegt der zweitbeste Treffer nah am
    // besten, gehört er mit zur Antwort (z. B. Freistellung + Berufsschule).
    var zweitRec = erg.artikel.filter(function (r) { return r.id !== haupt.id; })[0];
    if (!faqPasst && zweitRec && zweitRec.score >= artScore * 0.55) {
      var zwei = A.artikelVon(zweitRec.id);
      var fakten2 = faktenWaehlen(zwei, tokens, 2, intent);
      if (zwei && fakten2.length) {
        kern += "<p class=\"bw-klein\"><strong>Außerdem relevant — " + A.esc(zwei.titel) + ":</strong></p><ul>" +
          fakten2.map(function (x) { return "<li>" + A.fmtInline(x) + "</li>"; }).join("") + "</ul>";
      }
    }

    // Folgefragen-Hinweis: transparent machen, worauf sich die Antwort bezieht
    if (folge && kontext.titel) {
      einstieg = "<p class=\"bw-klein bw-leise\">Bezogen auf „" + A.esc(kontext.titel) + "“:</p>" + einstieg;
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

    kontextSetzen({ artikelId: haupt.id, titel: haupt.titel,
      stichworte: (haupt.stichworte || []).slice(0, 3).join(" ") });
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
      kontext = null;
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
