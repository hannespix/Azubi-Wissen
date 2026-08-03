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

  /* ---------------- Werkzeug-Wissen (K2) -----------------------------
     Der Assistent kennt alle Module, Rechner, Vorlagen, Checklisten und
     Dokumente dieses Werkzeugs und beantwortet „Wo finde ich …?"-Fragen
     mit direkten Verweisen. Der Katalog wird beim ersten Zugriff aus den
     Datenmodulen aufgebaut — neue Inhalte erscheinen automatisch. */
  var TYPWORT = { formular: "Formular", merkblatt: "Merkblatt", gesetz: "Gesetz", vwv: "Verwaltungsvorschrift", empfehlung: "BIBB-Empfehlung", plan: "Ausbildungsplan", link: "Angebot", portal: "Portal", video: "Video" };
  var katalogCache = null;
  function katalog() {
    if (katalogCache) return katalogCache;
    var A = window.AzubiApp, K = [];
    function auf(art, titel, ziel, info, extra) {
      K.push({ art: art, titel: titel, ziel: ziel, info: info || "",
        hay: A.norm(titel + " " + (info || "") + " " + (extra || "")) });
    }
    // Feste Module/Funktionen aus dem geteilten Katalog (module.js) —
    // derselbe speist den semantischen Index der Bedeutungssuche.
    (window.MODULE || []).forEach(function (m) {
      auf(m.art, m.titel, m.ziel, m.info, m.extra);
    });
    ((window.NACHSCHLAG || {}).karten || []).forEach(function (k) {
      auf(k.rechner ? "Rechner" : "Nachschlag", k.titel, "#/nachschlag?karte=" + k.id, "",
        (k.stichworte || []).join(" ") + (k.rechner ? " rechner berechnen ausrechnen" : " tabelle"));
    });
    ((window.VORLAGEN || {}).vorlagen || []).forEach(function (v) {
      auf("Vorlage", v.titel, "#/vorlagen?id=" + v.id, "",
        (v.stichworte || []).join(" ") + " " + (v.betreff || "") + " vorlage anschreiben");
    });
    ((window.CHECKLISTEN || {}).listen || []).forEach(function (c) {
      auf("Checkliste", c.titel, "#/checklisten?id=" + c.id, c.kurz || "", (c.stichworte || []).join(" "));
    });
    (W.themen || []).forEach(function (t) {
      auf("Themenbereich", t.titel, "#/wissen?thema=" + t.id, "", "thema themenbereich " + (t.kurz || ""));
    });
    ((window.QUELLEN || {}).eintraege || []).forEach(function (e) {
      var z = A.quelleZiel(e);
      K.push({ art: TYPWORT[e.typ] || "Datei", titel: e.titel, ziel: z.href,
        extern: !!z.extern, download: z.download || null,
        info: (e.herausgeber || "") + (e.stand ? ", Stand " + e.stand : ""),
        hay: A.norm(e.titel + " " + (e.stichworte || []).join(" ") + " " + (e.beschreibung || "") + " " + (TYPWORT[e.typ] || "")) });
    });
    katalogCache = K;
    return K;
  }

  // Ein Katalog-/Dokumentlink als HTML (Downloads mit download-Attribut,
  // externe Angebote in neuem Tab und mit ↗ gekennzeichnet).
  function zielLink(e, text) {
    var A = window.AzubiApp;
    var attr = e.download ? ' download="' + A.esc(e.download) + '"'
      : e.extern ? ' target="_blank" rel="noopener"' : "";
    return '<a href="' + A.esc(e.ziel) + '"' + attr + ">" + text + (e.extern ? ' <span class="bw-leise">↗</span>' : "") + "</a>";
  }

  function uebersichtAntwort() {
    var A = window.AzubiApp;
    var module = katalog().filter(function (e) { return e.art === "Modul" || e.art === "Funktion"; });
    var html = "<p>Ich beantworte freie Fragen zu Rechten und Pflichten in der Ausbildung — direkt aus der Wissensdatenbank, immer mit Quellen. Außerdem kann ich:</p><ul>" +
      "<li><strong>Rechnen:</strong> Urlaub nach Alter, Mindestvergütung, Teilzeit-Dauer, Probezeit-Ende — z. B. „Wie viel Urlaub mit 17?“</li>" +
      "<li><strong>Begriffe klären:</strong> z. B. „Was ist der Unterschied zwischen Werktagen und Arbeitstagen?“</li>" +
      "<li><strong>Dokumente anbieten:</strong> passende Vorlagen, Checklisten und Formulare direkt verlinken.</li>" +
      "<li><strong>Durch das Werkzeug führen:</strong> Frag „Wo finde ich …?“ — ich kenne alle Bereiche.</li></ul>" +
      "<p><strong>Die Bereiche dieses Werkzeugs:</strong></p><ul>" +
      module.map(function (m) {
        return "<li><a href=\"" + m.ziel + "\">" + A.esc(m.titel) + "</a> — " + A.esc(m.info) + "</li>";
      }).join("") + "</ul>";
    return { html: html, quellen: [],
      folgefragen: ["Wo finde ich die E-Mail-Vorlagen?", "Gibt es einen Urlaubsrechner?", "Wie sichere ich meine Daten?"],
      titel: "Überblick über das Werkzeug", stichworte: "" };
  }

  // Begrüßung, Dank, Selbstauskunft: kurze Eingaben wie „Hallo", „ok" oder
  // „Wer bist du?" haben keine Entsprechung in der Wissensbasis. Ohne eigenen
  // Zweig zog die Fuzzy-Suche daraus Fehltreffer („Hi" → ausbildungsfremde
  // Arbeiten, „ok" → Berichtsheft). Läuft deshalb als Erstes und lässt den
  // Gesprächskontext unangetastet — nach „Danke" geht das Thema weiter.
  function sozialAntwort(nq) {
    var nqt = " " + nq + " ";
    // Nur kurze Eingaben; „Hallo, wie viel Urlaub steht mir zu?" ist eine Frage.
    var woerter = nq.split(" ").filter(Boolean);
    if (woerter.length > 5) return null;

    var gruss = /^(hallo|hallo zusammen|hi|hey|halli hallo|servus|moin|moin moin|gruezi|gruess gott|guten morgen|guten tag|guten abend|schonen guten tag|na)$/.test(nq);
    var dank = /^(danke|danke schon|dankeschon|vielen dank|besten dank|danke dir|danke sehr|merci|super|prima|perfekt|top|klasse|sehr gut|hilfreich)$/.test(nq);
    var tschuess = /^(tschuss|ciao|servus tschuss|auf wiedersehen|wiedersehen|bis dann|bis spater|bye|schonen feierabend|schones wochenende|gute nacht)$/.test(nq);
    var werbist = /\b(wer bist du|was bist du|wer bin ich mit dir|bist du (eine |ein )?(ki|ai|mensch|bot|roboter|chatgpt|chat gpt)|wie heisst du|wie funktionierst du|woher (hast|nimmst) du (die |deine )?(daten|informationen|antworten))\b/.test(nqt);
    var befinden = /^(wie geht es dir|wie gehts|wie geht s dir|alles gut bei dir|wie laufts)$/.test(nq);
    var quittung = /^(ok|okay|okey|alles klar|verstanden|gut|passt|na gut|aha|ach so|jo|ja|nein|hm|mhm|so|und|weiter)$/.test(nq);
    if (!(gruss || dank || tschuess || werbist || befinden || quittung)) return null;

    var beispiele = ["Wie viele Urlaubstage habe ich als Azubi?", "Wie hoch ist die Mindestvergütung?", "Was kannst du alles?"];
    var html, titel;
    if (werbist) {
      titel = "Über diesen Assistenten";
      html = "<p>Ich bin der <strong>lokale Assistent dieses Werkzeugs</strong> — keine Cloud-KI. Ich laufe " +
        "vollständig auf diesem Gerät und antworte ausschließlich aus der geprüften Wissensbasis der " +
        "Ausbildungsberatung: Artikel, FAQ, Gesetzestexte, Vorlagen und Formulare. Jede Antwort nennt ihre Quelle.</p>" +
        "<p>Was ich <em>nicht</em> bin: eine allgemeine Chat-KI. Ich erfinde nichts dazu — was nicht in der " +
        "Wissensbasis steht, sage ich offen. Und ich ersetze keine Rechtsberatung im Einzelfall.</p>" +
        "<p>Frag mich zu Urlaub, Vergütung, Arbeitszeit, Probezeit, Berichtsheft, Prüfung, Kündigung — oder lass " +
        "mich rechnen und die passenden Vorlagen heraussuchen.</p>";
    } else if (dank) {
      titel = "Gern";
      html = "<p>Gern — melde dich, wenn noch etwas offen ist.</p>";
      beispiele = ["Was kannst du alles?", "Welche Vorlagen gibt es?", "Wie hoch ist die Mindestvergütung?"];
    } else if (tschuess) {
      titel = "Bis bald";
      html = "<p>Bis bald — viel Erfolg bei der Ausbildungsberatung.</p>";
    } else if (befinden) {
      titel = "Bereit";
      html = "<p>Alles bereit — ich habe die komplette Wissensbasis geladen. Womit kann ich helfen?</p>";
    } else if (quittung) {
      titel = "Weiter";
      html = "<p>Wie geht es weiter? Stell einfach die nächste Frage — oder nutze eine der Anregungen unten.</p>";
    } else {
      titel = "Hallo";
      html = "<p>Hallo! Ich beantworte Fragen rund um die Ausbildung in den grünen Berufen — aus der geprüften " +
        "Wissensbasis, immer mit Quelle. Ich kann außerdem <strong>rechnen</strong> (Urlaub, Vergütung, Probezeit, " +
        "Teilzeit, Noten), <strong>Gesetzestexte</strong> im Wortlaut zeigen und <strong>passende Vorlagen und " +
        "Formulare</strong> heraussuchen.</p>" +
        "<p>Womit fangen wir an?</p>";
    }
    return { html: html, quellen: [], folgefragen: beispiele, titel: titel, stichworte: "", sozial: true };
  }

  // Fragen zum Werkzeug selbst: Impressum, Kontakt, Entwicklung, Rückmeldungen,
  // Datenschutz, Barrierefreiheit, Lizenz. Diese Angaben stehen nicht in der
  // Wissensbasis, sondern in window.KONTAKT — ohne eigenen Zweig lieferte die
  // Stichwortsuche hier Fehltreffer („Fehler melden" → Abschlussprüfung).
  // Läuft deshalb VOR der Wissenssuche.
  function kontaktAntwort(nq) {
    var A = window.AzubiApp, K = window.KONTAKT;
    if (!K) return null;
    var nqt = " " + nq + " ";
    // Fachliche Meldewege (Ausbildungsvertrag anmelden, Prüfung anmelden …)
    // sind ausdrücklich KEINE Werkzeug-Rückmeldung.
    if (/\b(vertrag|ausbildungsvertrag|prufung|abschlusspr|zwischenpr|azubi|auszubildende|betrieb|kammer|berufsschule)\b/.test(nqt)) return null;

    var istImpressum = /\b(impressum|anbieter|anbieterkennzeichnung|wer (betreibt|verantwortet|steckt hinter)|verantwortlich fur (das tool|dieses tool|die seite|diese seite))\b/.test(nqt);
    var istEntwickler = /\b(entwickler|entwicklerin|programmierer|wer hat (das|dieses|die app|es) (tool |werkzeug |app )?(entwickelt|gebaut|gemacht|programmiert)|wer (entwickelt|pflegt|betreut) (das|dieses|die))\b/.test(nqt)
      || /\b(hannes|pix)\b/.test(nqt);
    var istRueckmeldung = /\b(anderungswunsch|anderungswunsche|verbesserungsvorschlag|verbesserungsvorschlage|verbesserung vorschlagen|vorschlag machen|feedback|ruckmeldung|ansprechpartner fur (das tool|anderungen|updates)|an wen (wende|richte|schicke)|wen (kann|muss) ich (fragen|ansprechen|kontaktieren))\b/.test(nqt)
      || /\b(fehler|bug|problem|schreibfehler|tippfehler|funktioniert nicht|geht nicht|falsche zahl|veraltet)\b.*\b(melden|mitteilen|schreiben|weitergeben|berichten)\b/.test(nqt)
      || /\b(melden|mitteilen)\b.*\b(fehler|bug|problem|schreibfehler|tippfehler)\b/.test(nqt);
    var istDatenschutz = /\b(datenschutz|datenschutzerklarung|dsgvo|werden (meine )?daten (gespeichert|ubertragen|weitergegeben)|wo werden (die |meine )?daten gespeichert|cookies|tracking|telemetrie)\b/.test(nqt);
    var istBarriere = /\b(barrierefrei|barrierefreiheit|barriere|screenreader|vorlesefunktion|wcag)\b/.test(nqt);
    var istLizenz = /\b(lizenz|lizenzen|urheberrecht|copyright|nachnutzung|weiterverwenden|weitergeben durfen)\b/.test(nqt);
    var istKontakt = /\b(kontakt|kontaktdaten|e ?mail adresse|emailadresse|erreiche ich|erreichbar|telefonnummer)\b/.test(nqt);
    if (!(istImpressum || istEntwickler || istRueckmeldung || istDatenschutz || istBarriere || istLizenz || istKontakt)) return null;

    var E = K.entwickler || {}, B = K.betreff || {}, L = K.links || {};
    function mail(betreff) {
      return '<a href="mailto:' + A.esc(E.email) + (betreff ? "?subject=" + encodeURIComponent(betreff) : "") + '">' + A.esc(E.email) + "</a>";
    }
    var html, titel;
    if (istDatenschutz && !istRueckmeldung) {
      titel = "Datenschutz";
      html = "<p><strong>Das Werkzeug überträgt keine Daten.</strong> Es läuft vollständig lokal: keine Cookies, " +
        "kein Tracking, keine Telemetrie — auch der Assistent und die Bedeutungssuche rechnen nur auf diesem Gerät.</p>" +
        "<p>Notizen, Aktenvermerke, Merkliste und Checklisten-Stände liegen ausschließlich im Browser-Speicher dieses " +
        "Geräts und lassen sich jederzeit löschen. Beim Online-Aufruf fallen beim Hoster technisch bedingt " +
        "Server-Protokolle an; als heruntergeladene Einzeldatei entfällt auch das.</p>" +
        '<p>Einzelheiten: <a href="' + K.seite + '">' + A.esc(K.seitenTitel) + "</a> im Werkzeug · " +
        '<a href="' + A.esc(L.datenschutz) + '" target="_blank" rel="noopener">Datenschutz beim ' + A.esc(K.behoerde) + " ↗</a></p>";
    } else if (istBarriere && !istRueckmeldung) {
      titel = "Barrierefreiheit";
      html = "<p>Das Werkzeug ist auf <strong>WCAG 2.1 AA</strong> ausgelegt: semantisches HTML, volle " +
        "Tastaturbedienung mit sichtbarem Fokus, Sprungmarke zum Inhalt, ausreichende Kontraste. Bekannte " +
        "Einschränkung: einzelne eingescannte PDF im Download-Center.</p>" +
        "<p><strong>Barriere melden:</strong> " + mail(B.barriere) + " (" + A.esc(E.name) + ").</p>" +
        '<p>Mehr dazu: <a href="' + K.seite + '">' + A.esc(K.seitenTitel) + "</a> · " +
        '<a href="' + A.esc(L.barrierefreiheit) + '" target="_blank" rel="noopener">Erklärung zur Barrierefreiheit ↗</a></p>';
    } else if (istLizenz && !istRueckmeldung && !istEntwickler) {
      titel = "Urheberrecht & Lizenzen";
      html = "<p>Gesetzestexte sind amtliche Werke und gemeinfrei (§ 5 UrhG). Die Inhalte dieses Werkzeugs stammen " +
        "von der Ausbildungsberatung des " + A.esc(K.behoerde) + "; Schriften und Logo sind lizenziert und nicht zur " +
        "Weiterverwendung außerhalb dieses Angebots bestimmt.</p>" +
        '<p>Vollständige Angaben: <a href="' + K.seite + '">' + A.esc(K.seitenTitel) + "</a>.</p>";
    } else {
      titel = istRueckmeldung ? "Änderungswünsche & Fehlermeldungen" : "Kontakt & Impressum";
      html = "<p>Dieses Werkzeug entwickelt und pflegt <strong>" + A.esc(E.name) + "</strong> (" + A.esc(K.bereich) +
        ", " + A.esc(K.behoerde) + ").</p><ul>" +
        "<li><strong>Änderungswünsche, Fehler und Vorschläge:</strong> " + mail(B.rueckmeldung) + " — kurze " +
        "Beschreibung genügt; bei Darstellungsfehlern hilft ein Bildschirmfoto mit Gerät und Browser.</li>" +
        "<li><strong>Barriere melden:</strong> " + mail(B.barriere) + "</li>" +
        "<li><strong>Amtlicher Zugang:</strong> " + A.esc(K.poststelle) + " · Telefon (Zentrale) " + A.esc(K.telefon) + "</li>" +
        "</ul>" +
        '<p>Alle Angaben (Anbieter, Datenschutz, Barrierefreiheit, Lizenzen): <a href="' + K.seite + '">' +
        A.esc(K.seitenTitel) + "</a> · " +
        '<a href="' + A.esc(L.impressum) + '" target="_blank" rel="noopener">Impressum des ' + A.esc(K.behoerde) + " ↗</a></p>";
    }
    return { html: html, quellen: [{ text: K.seitenTitel, ziel: K.seite }],
      folgefragen: ["Werden meine Daten gespeichert?", "Wie melde ich eine Barriere?", "Wer hat das Tool entwickelt?"],
      titel: titel, stichworte: "" };
  }

  // Betriebssuche: „Wer bildet Gärtner aus?", „Ich suche einen
  // Ausbildungsplatz als Landwirt". Beantwortet die Datenbank der anerkannten
  // Ausbildungsbetriebe (berufe.js: betriebeCode/-Codes) — wenn möglich schon
  // auf den genannten Beruf und seine Fachrichtung vorgefiltert.
  function betriebeAntwort(nq) {
    var A = window.AzubiApp, B = window.BERUFE;
    if (!B) return null;
    var nqt = " " + nq + " ";
    // Die Anerkennung eines Betriebs ist eine Fachfrage (Eignung, § 27 BBiG)
    // und keine Betriebssuche.
    // Ebenso wenig sind Fragen nach Rechten, Pflichten oder Kosten des
    // Betriebs eine Betriebssuche — dafür gibt es Wissensartikel.
    if (/\b(anerkennung|anerkannt werden|anerkennen lassen|eignung|geeignet|voraussetzung\w*|wie wird|ausbilden durfen|ausbilder\w* sein)\b/.test(nqt)) return null;
    if (/\b(pflicht\w*|aufgabe\w*|rechte|verantwort\w*|haftung|kosten|zahlt|zahlen|muss der betrieb|darf der betrieb|verboten|erlaubt)\b/.test(nqt)) return null;

    var suchWort = /\b(ausbildungsbetrieb\w*|ausbildungsplatz\w*|ausbildungsstelle\w*|lehrstelle\w*|praktikumsplatz\w*|praktikumsbetrieb\w*|betriebsliste|ausbildungsborse)\b/.test(nqt);
    var suchVerb = /\b(such\w*|finde\w*|finden|liste|ubersicht|wo|welche|welcher|wer|gibt es|verzeichnis|in meiner nahe|in der nahe)\b/.test(nqt);
    var bildetAus = /\b(bildet|bilden)\b[^.]*\baus\b/.test(nqt);
    if (!((suchWort && suchVerb) || (bildetAus && suchVerb) || (suchWort && bildetAus))) return null;

    // Genannten Beruf erkennen (Titelstamm vor dem „/" und Stichworte).
    var treffer = null;
    B.berufe.forEach(function (b) {
      if (treffer) return;
      var stamm = A.norm(b.titel.split("/")[0].split(" ")[0]);
      if (stamm.length > 3 && nqt.indexOf(stamm) >= 0) { treffer = b; return; }
      (b.stichworte || []).forEach(function (s) {
        if (!treffer && A.norm(s).length > 4 && nqt.indexOf(A.norm(s)) >= 0) treffer = b;
      });
    });
    // Fachrichtung erkennen, wenn der Beruf welche mit eigenem Code hat.
    var frName = null, frCode = null;
    if (treffer && treffer.betriebeCodes) {
      Object.keys(treffer.betriebeCodes).forEach(function (fr) {
        if (frName) return;
        var kern = A.norm(fr.split(" ")[0]);
        if (kern.length > 4 && nqt.indexOf(kern) >= 0) { frName = fr; frCode = treffer.betriebeCodes[fr]; }
      });
    }
    var basis = window.BETRIEBE_DB || "https://lel.lgl-bw.de/azubi/index.xhtml";
    function db(code, text) {
      return '<a href="' + basis + (code ? "?beruf=" + encodeURIComponent(code) : "") +
        '" target="_blank" rel="noopener">' + text + " ↗</a>";
    }
    var html = "", titel = "Ausbildungsbetriebe finden";
    if (treffer && (frCode || treffer.betriebeCode || treffer.betriebeCodes)) {
      titel = "Ausbildungsbetriebe: " + treffer.titel;
      html = "<p>Die anerkannten Ausbildungsbetriebe führt die <strong>Betriebsdatenbank des Landes</strong> " +
        "(LEL im Auftrag des MLR) — suchbar nach Landkreis, Betriebszweig und konventionell/ökologisch.</p><ul>";
      if (frCode) {
        html += "<li>" + db(frCode, A.esc(treffer.titel) + " — " + A.esc(frName)) + " (direkt gefiltert)</li>";
      } else if (treffer.betriebeCode) {
        html += "<li>" + db(treffer.betriebeCode, "Betriebe für " + A.esc(treffer.titel)) + " (direkt gefiltert)</li>";
      }
      if (treffer.betriebeCodes && !frCode) {
        html += "<li>Nach Fachrichtung: " + Object.keys(treffer.betriebeCodes).map(function (fr) {
          return db(treffer.betriebeCodes[fr], A.esc(fr));
        }).join(" · ") + "</li>";
      }
      html += "</ul>";
    } else {
      html = "<p>Die anerkannten Ausbildungsbetriebe aller grünen Berufe führt die <strong>Betriebsdatenbank des " +
        "Landes</strong> (LEL im Auftrag des MLR) — filterbar nach Beruf und Fachrichtung, Landkreis, Betriebszweig " +
        "sowie konventionell oder ökologisch.</p><ul><li>" + db(null, "Zur Betriebsdatenbank") + "</li></ul>";
    }
    // Freie Plätze und Praktika: Ausbildungsbörse der Landjugend.
    var fuerBoerse = !treffer || treffer.id === "landwirt" || treffer.id === "winzer";
    html += "<p>" + (fuerBoerse
      ? 'Für <strong>freie Plätze und Praktika</strong> in Landwirtschaft und Weinbau lohnt zusätzlich die Ausbildungsbörse <a href="https://www.ausbildung.farm" target="_blank" rel="noopener">ausbildung.farm ↗</a> der Landjugendverbände (mit den Regierungspräsidien abgestimmt).'
      : "Die Datenbank zeigt anerkannte Betriebe, nicht zwingend freie Plätze — im Zweifel direkt beim Betrieb nachfragen.") +
      "</p>" +
      '<p class="bw-klein bw-leise">Im Werkzeug führt außerdem jede <a href="#/berufe">Berufsseite</a> direkt in die ' +
      "passende Liste.</p>";
    var quellen = [{ text: "Grüne Berufe im Werkzeug", ziel: "#/berufe" }];
    if (treffer) quellen.unshift({ text: treffer.titel, ziel: "#/berufe?b=" + treffer.id });
    return { html: html, quellen: quellen, titel: titel,
      folgefragen: ["Wie wird ein Betrieb als Ausbildungsbetrieb anerkannt?", "Wie läuft die Eintragung des Vertrags?", "Was kannst du alles?"],
      stichworte: treffer ? treffer.titel : "Ausbildungsbetrieb" };
  }

  // „Wo finde ich …?" / „Gibt es ein …?" — Antworten aus dem Katalog.
  // `sem` (optional): Rangliste der Bedeutungssuche; ihre werkzeug-Einträge
  // retten Navigationsfragen, die an der Stichwortsuche vorbeiformuliert sind.
  function werkzeugAntwort(nq, sem) {
    var A = window.AzubiApp;
    var semWerk = sem ? sem.filter(function (s) { return s.typ === "werkzeug" && s.ziel; }) : null;
    var nqt = " " + nq + " ";
    if (/(was kannst du|was kann (das|dieses|der) (tool|werkzeug|assistent)|welche (funktionen|module|bereiche)|wie funktioniert (das tool|dieses werkzeug|die app)|was alles kannst du)/.test(nq) || nq === "hilfe") {
      return uebersichtAntwort();
    }
    // Navigationsfragen wollen einen Ort im Werkzeug; Existenzfragen
    // („gibt es …?") sind oft Wissensfragen und werden vorsichtiger behandelt.
    var nav = /\b(wo (finde|findet|gibt|kann|steht|stehen|sind|ist|liegt|liegen|trage|sehe)|welche (vorlagen?|checklisten?|empfehlung(en)?|richtlinien?|verwaltungsvorschrift(en)?|vorschrift(en)?)\b|welches formular|welchen rechner|was fur (vorlagen|formulare|checklisten|rechner)|wie (sichere|ubertrage|exportiere|importiere|drucke|merke))\b/.test(nqt)
      || /(^|\s)(oeffne|offne|zeig|zeige)\s/.test(nqt);
    var existenz = /\b(gibt es (hier |im tool |in dem tool )?(ein|eine|einen|dafur)|hast du (ein|eine|einen))\b/.test(nqt);
    if (!nav && !existenz) return null;

    // Nomen der Frage bestimmen, welche Art von Eintrag gemeint ist.
    var artFilter = null;
    if (/\b(vorlage|vorlagen|anschreiben|mustertext|muster)\b/.test(nq)) artFilter = ["Vorlage"];
    else if (/\b(checkliste|checklisten)\b/.test(nq)) artFilter = ["Checkliste"];
    else if (/\b(formular|formulare|vordruck|vordrucke)\b/.test(nq)) artFilter = ["Formular", "Ausbildungsplan", "Merkblatt"];
    else if (/\b(rechner)\b/.test(nq)) artFilter = ["Rechner"];
    else if (/\b(verwaltungsvorschrift|verwaltungsvorschriften|vwv|empfehlung|empfehlungen|richtlinie|richtlinien|hauptausschuss)\b/.test(nq)) artFilter = ["Verwaltungsvorschrift", "BIBB-Empfehlung"];
    else if (/\b(gesetz|gesetze|verordnung|verordnungen)\b/.test(nq)) artFilter = ["Gesetz", "Verwaltungsvorschrift"];
    else if (/\b(download|downloads|datei|dateien|dokument|dokumente|pdf)\b/.test(nq)) artFilter = ["Formular", "Merkblatt", "Gesetz", "Ausbildungsplan"];

    var IGNORIER = {};
    ("wo finde findet gibt offne oeffne zeig zeige hast du welche welches welchen vorlage vorlagen formular formulare vordruck vordrucke checkliste checklisten rechner download downloads datei dateien dokument dokumente tool werkzeug hier brauche brauchen passende passenden passt anschreiben mustertext muster gesetz gesetze verordnung verordnungen pdf").split(" ").forEach(function (w) { IGNORIER[w] = 1; });
    // Wortfragmente (z. B. „e" aus „E-Mail") verrauschen nur das Ranking.
    var tokens = nq.split(" ").filter(function (t) { return t.length > 1 && !A.stoppwoerter[t] && !IGNORIER[t]; });

    function suchenIn(filter) {
      // Das passende Modul selbst darf mit antreten („die E-Mail-Vorlagen").
      var erlaubt = filter ? filter.concat(["Modul", "Funktion"]) : null;
      var treffer = [];
      katalog().forEach(function (e) {
        if (erlaubt && erlaubt.indexOf(e.art) < 0) return;
        var s = 0, getroffen = 0;
        tokens.forEach(function (tok) {
          var best = 0;
          A.tokenAlternativen(tok).forEach(function (al) { best = Math.max(best, A.tokenScore(al, e.hay)); });
          if (best > 0) getroffen++;
          s += best;
        });
        // Mindestens die Hälfte der Inhaltswörter muss treffen.
        if (tokens.length && getroffen >= Math.ceil(tokens.length / 2)) treffer.push({ e: e, s: s, getroffen: getroffen });
      });
      treffer.sort(function (a, b) { return b.s - a.s; });
      return treffer;
    }

    var top;
    if (!tokens.length) {
      // „Welche Checklisten gibt es?" — die Art komplett auflisten.
      if (!artFilter) return uebersichtAntwort();
      top = katalog().filter(function (e) { return artFilter.indexOf(e.art) >= 0; })
        .slice(0, 6).map(function (e) { return { e: e, s: 1 }; });
    } else {
      var treffer = suchenIn(artFilter);
      if (!treffer.length && artFilter) treffer = suchenIn(null);
      // Bedeutungs-Rettung für Navigationsfragen: Stichwörter greifen nicht,
      // aber die Semantik sieht klar passende Werkzeug-Einträge.
      if (!treffer.length && semWerk && semWerk[0] && semWerk[0].score >= 0.82) {
        top = semWerk.filter(function (s) { return s.score >= 0.82; }).slice(0, 3)
          .map(function (s) { return { e: { art: s.art || "Modul", titel: s.titel, ziel: s.ziel, info: "", extern: false, download: null }, s: s.score }; });
        var htmlS = "<p>Das findest du hier im Werkzeug:</p><ul>" + top.map(function (t) {
          return "<li>" + zielLink(t.e, "<strong>" + A.esc(t.e.art) + ":</strong> " + A.esc(t.e.titel)) + "</li>";
        }).join("") + "</ul><p class=\"bw-klein bw-leise\">Über die Bedeutungssuche zugeordnet.</p>";
        return { html: htmlS, quellen: [], folgefragen: ["Was kannst du alles?"],
          titel: top[0].e.titel, stichworte: tokens.slice(0, 3).join(" ") };
      }
      if (!treffer.length) return null;
      // Existenzfragen ohne Dokument-Nomen („Gibt es eine Probezeit?") sind
      // meist Wissensfragen: nur übernehmen, wenn ein Eintrag ALLE Wörter
      // trifft und die Wissensdatenbank nicht besser antwortet.
      if (existenz && !nav && !artFilter) {
        treffer = treffer.filter(function (t) { return t.getroffen === tokens.length; });
        if (!treffer.length) return null;
        var wiss = A.suchen(tokens.join(" "));
        if (wiss.artikel[0] && wiss.artikel[0].score >= treffer[0].s) return null;
      }
      top = treffer.slice(0, 3);
    }
    if (!top.length) return null;

    var html = "<p>Das findest du hier im Werkzeug:</p><ul>" + top.map(function (t) {
      var e = t.e;
      return "<li>" + zielLink(e, "<strong>" + A.esc(e.art) + ":</strong> " + A.esc(e.titel)) +
        (e.info ? ' <span class="bw-klein bw-leise">— ' + A.esc(e.info) + "</span>" : "") + "</li>";
    }).join("") + "</ul>";

    var quellen = [];
    var MODUL_ZIEL = { Vorlage: ["Alle E-Mail-Vorlagen", "#/vorlagen"], Checkliste: ["Alle Checklisten", "#/checklisten"],
      Rechner: ["Schnellnachschlag mit allen Rechnern", "#/nachschlag"], Nachschlag: ["Schnellnachschlag", "#/nachschlag"],
      Formular: ["Download-Center", "#/downloads"], Merkblatt: ["Download-Center", "#/downloads"],
      Gesetz: ["Quellen & Gesetze", "#/quellen"], Ausbildungsplan: ["Download-Center", "#/downloads"],
      Themenbereich: ["Wissensdatenbank", "#/wissen"] };
    var mz = MODUL_ZIEL[top[0].e.art];
    if (mz) quellen.push({ text: mz[0], ziel: mz[1] });
    // Passenden Wissensartikel als Einstieg anbieten, wenn es einen gibt.
    if (tokens.length) {
      var erg = A.suchen(tokens.join(" "));
      if (erg.artikel[0]) {
        var art = A.artikelVon(erg.artikel[0].id);
        if (art) quellen.push({ text: "Artikel: " + art.titel, ziel: "#/artikel/" + art.id });
      }
    }
    return { html: html, quellen: quellen,
      folgefragen: ["Was kannst du alles?"],
      titel: top[0].e.titel, stichworte: tokens.slice(0, 3).join(" ") };
  }

  /* ---------------- Passende Dokumente zum Artikel (K2) -------------
     Vorlagen und Checklisten verweisen über ihr artikel-Feld auf die
     Wissensartikel; die Anhänge passender Vorlagen liefern zusätzlich
     die richtigen Formulare aus dem Download-Center. */
  function dokumenteZu(artikelId) {
    if (!artikelId) return [];
    var A = window.AzubiApp, aus = [], anhaenge = {}, vz = 0, cz = 0;
    ((window.VORLAGEN || {}).vorlagen || []).forEach(function (v) {
      if ((v.artikel || []).indexOf(artikelId) < 0 || vz >= 2) return;
      vz++;
      aus.push({ text: "Vorlage: " + v.titel, ziel: "#/vorlagen?id=" + v.id });
      (v.anhaenge || []).forEach(function (id) { anhaenge[id] = 1; });
    });
    ((window.CHECKLISTEN || {}).listen || []).forEach(function (c) {
      if ((c.artikel || []).indexOf(artikelId) < 0 || cz >= 2) return;
      cz++;
      aus.push({ text: "Checkliste: " + c.titel, ziel: "#/checklisten?id=" + c.id });
    });
    var dateien = 0;
    ((window.QUELLEN || {}).eintraege || []).forEach(function (e) {
      if (!anhaenge[e.id] || dateien >= 3) return;
      dateien++;
      var z = A.quelleZiel(e);
      aus.push({ text: (TYPWORT[e.typ] || "Datei") + ": " + e.titel, ziel: z.href, extern: !!z.extern, download: z.download || null });
    });
    return aus.slice(0, 6);
  }

  /* ---------------- Paragraf-Nachschlag (S7/S9) --------------------- */
  // „Was steht in § 19 JArbSchG?" / „§ 20 BBiG" → Wortlaut aus dem lokalen
  // Volltext, mit Sprung zur Norm und den behandelnden Artikeln.
  // Reihenfolge wichtig: jarbschg VOR arbschg (Teilwort!).
  var WERK_NORM = { bbig: "bbig", jarbschg: "jarbschg", arbschg: "arbschg",
    burlg: "burlg", arbzg: "arbzg", entgfg: "entgfg", efzg: "entgfg",
    kschg: "kschg", tzbfg: "tzbfg", aevo: "aevo" };
  function paragrafAntwort(nq) {
    var GT = window.GESETZESTEXTE;
    if (!GT) return null;
    // nq ist normalisiert (ohne §-Zeichen/Punkte): „was steht in 19 abs 2 jarbschg"
    var m = nq.match(/(?:^|\s)(\d{1,3}[a-z]?)\s(?:abs\w*\s(\d{1,2})\s)?(jarbschg|arbschg|bbig|burlg|arbzg|entgfg|efzg|kschg|tzbfg|aevo)\b/);
    if (!m) return null;
    var schl = WERK_NORM[m[3]];
    var werk = GT[schl];
    if (!werk) return null;
    var p = null;
    werk.paragrafen.forEach(function (x) { if (x.nr === m[1]) p = x; });
    if (!p) return null;
    var A = window.AzubiApp;
    var absNr = m[2] ? parseInt(m[2], 10) : 0;
    var texte = (absNr && absNr <= p.absaetze.length) ? [p.absaetze[absNr - 1]] : p.absaetze;
    var auszug = texte.join("\n\n");
    var gekuerzt = auszug.length > 900;
    if (gekuerzt) auszug = auszug.slice(0, 900) + " …";
    var html = "<p><strong>§ " + A.esc(p.nr) + " " + A.esc(werk.kurz) + " — " + A.esc(p.titel) +
      (absNr ? ", Absatz " + absNr : "") + ":</strong></p>" +
      '<p class="gesetz-zitat">' + A.esc(auszug).replace(/\n/g, "<br>") + "</p>" +
      (gekuerzt ? '<p class="bw-klein bw-leise">Gekürzt — der vollständige Wortlaut steht im Volltext.</p>' : "");
    var quellen = [{ text: "§ " + p.nr + " " + werk.kurz + " im Volltext", ziel: "#/gesetz/" + schl + "-" + p.nr }];
    (A.gesetzArtikel ? A.gesetzArtikel(schl, p.nr) : []).slice(0, 2).forEach(function (id) {
      var art = A.artikelVon(id);
      if (art) quellen.push({ text: "Artikel: " + art.titel, ziel: "#/artikel/" + id });
    });
    return { html: html, quellen: quellen, folgefragen: [],
      titel: "§ " + p.nr + " " + werk.kurz, stichworte: p.titel };
  }

  // Kurze Anschlussfragen („und mit 16?", „gilt das auch …?") beziehen
  // sich auf das vorige Thema — dann wird der Kontext mitgesucht.
  function istFolgefrage(nq, roh) {
    if (/^(und |was ist mit |gilt das|auch |wie sieht es|davon |dann |warum)/.test(nq)) return true;
    var A = window.AzubiApp;
    var inhalt = nq.split(" ").filter(function (t) { return t && !A.stoppwoerter[t]; });
    if (!(inhalt.length > 0 && inhalt.length < 3)) return false;
    // Kurze Eingaben ohne Fragezeichen und Fragewort sind eigenständige
    // Stichwort-Nachschläge („Kündigung"), keine Anschlussfragen.
    return String(roh || "").indexOf("?") >= 0 ||
      /(^|\s)(wie|was|wer|wann|wo|warum|darf|durfen|muss|mussen|kann|konnen|gilt|ist|sind|mit|bei|beim|fur|ohne|auch)(\s|$)/.test(nq);
  }
  function kontextSetzen(a) {
    kontext = { artikelId: a.artikelId || null, titel: a.titel || "", stichworte: a.stichworte || "", rechner: a.rechner || null };
  }

  /* ---------------- Antwortsynthese -------------------------------- */
  // Liefert ein Promise (die Bedeutungssuche arbeitet asynchron); ohne
  // geladenes Modell wird sofort aufgelöst — Verhalten wie bisher.
  function antwortBauen(frage) {
    var A = window.AzubiApp;
    var nq = A.norm(frage);

    // 0) Begrüßung, Dank, Selbstauskunft? Kurz antworten, Thema behalten
    //    (kein kontextSetzen — „Danke" darf das laufende Thema nicht löschen).
    var sozial = sozialAntwort(nq);
    if (sozial) return Promise.resolve(sozial);

    // 1) Berechenbare Frage? Direkt rechnen (Kerne aus app.js).
    var gerechnet = rechnerAntwort(frage, nq);
    if (gerechnet) { kontextSetzen(gerechnet); return Promise.resolve(gerechnet); }

    // 2) Begriffs-/Vergleichsfrage? Glossar-Definitionen liefern.
    var verglichen = vergleichAntwort(nq);
    if (verglichen) { kontextSetzen(verglichen); return Promise.resolve(verglichen); }

    // 2a) Konkreter Paragraf gefragt? Wortlaut aus dem lokalen Volltext.
    var paragraf = paragrafAntwort(nq);
    if (paragraf) { kontextSetzen(paragraf); return Promise.resolve(paragraf); }

    // 2b) Frage zum Werkzeug selbst (Impressum, Kontakt, Rückmeldung,
    //     Datenschutz, Barrierefreiheit)? Angaben aus window.KONTAKT.
    var kontakt = kontaktAntwort(nq);
    if (kontakt) { kontextSetzen(kontakt); return Promise.resolve(kontakt); }

    // 2c) Suche nach Ausbildungsbetrieben/-plätzen? Betriebsdatenbank des
    //     Landes, wenn möglich auf Beruf und Fachrichtung vorgefiltert.
    var betriebe = betriebeAntwort(nq);
    if (betriebe) { kontextSetzen(betriebe); return Promise.resolve(betriebe); }

    // 3) Folgefrage? Voriges Thema in die Suche einmischen. Findet die
    //    angereicherte Suche nichts (die Frage war doch ein Themenwechsel),
    //    zählt wieder die reine Frage.
    var folge = kontext && kontext.stichworte && istFolgefrage(nq, frage);
    var erg = A.suchen(folge ? frage + " " + kontext.stichworte : frage);
    if (folge && !erg.artikel.length && !erg.faq.length) {
      folge = false;
      erg = A.suchen(frage);
    }

    // 3b) Bedeutungssuche (K3), falls aktiviert: Frage einbetten — die
    //     Rangliste stützt Werkzeug-Navigation UND Wissensantwort.
    var semP = (window.AzubiSemantik && window.AzubiSemantik.bereit())
      ? window.AzubiSemantik.rang(frage, 16).catch(function () { return null; })
      : Promise.resolve(null);
    return semP.then(function (sem) {
      // Werkzeugfrage? („Wo finde ich …?", „Was kannst du?") — aus dem
      // Katalog der Module, Vorlagen, Checklisten und Downloads antworten.
      var werkzeug = werkzeugAntwort(nq, sem);
      if (werkzeug) { kontextSetzen(werkzeug); return werkzeug; }
      return wissensAntwort(frage, nq, erg, folge, sem);
    });
  }

  function wissensAntwort(frage, nq, erg, folge, sem) {
    var A = window.AzubiApp;
    var semantischGefunden = false;
    var SCHWELLE = 0.8; // darunter ist e5-Kosinus-Ähnlichkeit Rauschen
    // Nur die Artikel-Einträge des semantischen Index sind trennscharf —
    // die kurzen FAQ-Passagen ähneln als Fragen einander zu stark (dichtes
    // Rauschband) und bleiben deshalb außen vor.
    var semArt = sem ? sem.filter(function (s) { return s.typ === "artikel" && A.artikelVon(s.artikelId); }) : null;
    if (semArt && semArt.length) {
      var K = 60, fus = {}, wScore = {}, platz = 0;
      erg.artikel.forEach(function (r, i) { fus[r.id] = (fus[r.id] || 0) + 1 / (K + i); wScore[r.id] = r.score; });
      semArt.forEach(function (s) {
        // Bekannte Kandidaten stärken; NEUE Artikel bringt die Semantik nur
        // oberhalb der Schwelle ein — sonst kippt Rauschen den Fallback.
        if (fus[s.artikelId] === undefined && s.score < SCHWELLE) return;
        fus[s.artikelId] = (fus[s.artikelId] || 0) + 1 / (K + platz);
        platz++;
      });
      erg = { artikel: Object.keys(fus).map(function (id) { return { id: id, score: wScore[id] || 0, fusion: fus[id] }; })
          .sort(function (a, b) { return b.fusion - a.fusion; }),
        faq: erg.faq, themen: erg.themen, tokens: erg.tokens };
    }
    var tokens = erg.tokens || [];
    var intent = intentErkennen(" " + nq + " ");
    // Reines Stichwort („BAV", „Kündigung") ist keine Frage: dann führt der
    // Artikel mit seiner Definition — nicht die Ja/Nein-Antwort einer
    // zufällig passenden FAQ (Beispiel: „Bav" → verwirrendes „Nein. …").
    var nachschlag = tokens.length <= 2 && frage.indexOf("?") < 0 && !intent &&
      !/(^|\s)(wie|was|wer|wann|wo|warum|wieso|weshalb|darf|durfen|muss|mussen|kann|konnen|soll|sollen|gibt|ist|sind|hat|haben|gilt|zahlt)(\s|$)/.test(nq);

    var topFaq = erg.faq[0];
    var topArt = erg.artikel[0] ? A.artikelVon(erg.artikel[0].id) : null;
    var faqScore = topFaq ? topFaq.score : 0;
    var artScore = erg.artikel[0] ? erg.artikel[0].score : 0;

    // Bedeutungs-Rettung/-Umlenkung: kaum Stichwort-Substanz, aber ein
    // semantisch klarer Artikel → der führt („Chef zahlt zu spät" →
    // Vergütung).
    if (semArt && semArt[0] && semArt[0].score >= SCHWELLE && Math.max(faqScore, artScore) < 4) {
      semantischGefunden = true;
      topArt = A.artikelVon(semArt[0].artikelId) || topArt;
      topFaq = null;
    }

    // Nichts Brauchbares gefunden -> ehrlicher Fallback. Er bleibt ehrlich,
    // hilft aber konkret weiter: knapp verfehlte Treffer als „Meintest du?",
    // sonst die Themenbereiche zum Anklicken statt bloßer Ratschläge.
    if (!topFaq && !topArt) {
      var html = "<p>Dazu habe ich in der Wissensdatenbank <strong>keinen gesicherten Eintrag</strong> gefunden — " +
        "ich rate lieber nicht.</p>";
      // Knapp unter der Schwelle gelandete Kandidaten anbieten (Stichwort- und
      // Bedeutungssuche gemeinsam, ohne Dubletten).
      var nahe = [], gesehen = {};
      (erg.artikel || []).slice(0, 3).forEach(function (t) {
        var a = A.artikelVon(t.id);
        if (a && !gesehen[a.id]) { gesehen[a.id] = 1; nahe.push({ id: a.id, titel: a.titel }); }
      });
      (semArt || []).slice(0, 3).forEach(function (s) {
        var a = A.artikelVon(s.artikelId);
        if (a && !gesehen[a.id]) { gesehen[a.id] = 1; nahe.push({ id: a.id, titel: a.titel }); }
      });
      if (nahe.length) {
        html += "<p><strong>Meintest du eines dieser Themen?</strong></p><ul>" +
          nahe.slice(0, 3).map(function (n) {
            return '<li><a href="#/artikel/' + A.esc(n.id) + '">' + A.esc(n.titel) + "</a></li>";
          }).join("") + "</ul>";
      } else {
        var themen = ((window.WISSEN || {}).themen || []).slice(0, 9);
        if (themen.length) {
          html += "<p><strong>Diese Themenbereiche kann ich beantworten:</strong></p><ul>" +
            themen.map(function (t) {
              return '<li><a href="#/wissen?thema=' + A.esc(t.id) + '">' + A.esc(t.titel) + "</a></li>";
            }).join("") + "</ul>";
        }
      }
      html += "<p>Ich kann außerdem rechnen (Urlaub, Vergütung, Probezeit, Teilzeit, Noten), " +
        '<a href="#/gesetz">Gesetzestexte</a> im Wortlaut zeigen und passende ' +
        '<a href="#/vorlagen">Vorlagen</a> oder <a href="#/downloads">Formulare</a> heraussuchen. ' +
        'Im Einzelfall hilft die <a href="#/artikel/zustaendige-stelle">Ausbildungsberatung</a> persönlich weiter.</p>';
      // Ohne aktive Bedeutungssuche lohnt der Hinweis: sie versteht freie Sätze.
      if (window.AzubiSemantik && window.AzubiSemantik.verfuegbar && window.AzubiSemantik.verfuegbar() &&
          !window.AzubiSemantik.bereit()) {
        html += "<p class=\"bw-klein bw-leise\">Tipp: Mit der <strong>Bedeutungssuche</strong> (Schalter oben) " +
          "verstehe ich auch frei formulierte Fragen besser.</p>";
      }
      return { html: html, quellen: [], folgefragen: standardFolgefragen() };
    }

    var haupt = null, einstieg = "", kern = "";
    // Starker FAQ-Treffer: die FAQ-Antwort ist bereits die direkte Antwort.
    // Gehört die FAQ zu einem anderen Artikel als dem Top-Treffer, muss sie
    // deutlich dominieren — sonst führt der Artikel.
    var faqPasst = !nachschlag && topFaq && (!topArt || topFaq.id === topArt.id
      ? faqScore >= artScore * 0.6
      : faqScore >= artScore * 1.1);
    // Semantische Schützenhilfe für die FAQ-Wahl: Sieht die Bedeutungssuche
    // den Artikel der Top-FAQ vor dem (womöglich fuzzy-verrauschten)
    // Artikel-Top, genügt die niedrige Dominanzschwelle („rauswerfen" →
    // FAQ der Kündigung statt Lernpflicht-Streutreffer).
    if (!faqPasst && !nachschlag && topFaq && topArt && topFaq.id !== topArt.id && semArt && semArt.length) {
      var artRang = {};
      semArt.forEach(function (s, i) { if (artRang[s.artikelId] === undefined) artRang[s.artikelId] = i; });
      var rf = artRang[topFaq.id], ra = artRang[topArt.id];
      if (rf !== undefined && (ra === undefined || rf < ra) && faqScore >= artScore * 0.6) faqPasst = true;
    }
    if (faqPasst) {
      haupt = A.artikelVon(topFaq.id);
      var f = haupt.faq[topFaq.faqIndex];
      einstieg = "<p>" + A.fmtInline(f.a) + "</p>";
    } else if (topArt || topFaq) {
      haupt = topArt || A.artikelVon(topFaq.id);
      // Beim Stichwort-Nachschlag gibt der Titel den Rahmen vor.
      einstieg = "<p>" + (nachschlag ? "<strong>" + A.esc(haupt.titel) + ":</strong> " : "") +
        A.fmtInline(haupt.kurz) + "</p>";
    }

    // Ergänzende Fakten aus dem Hauptartikel (passend zur Frage gewählt)
    var fakten = faktenWaehlen(haupt, tokens, 3, intent);
    if (fakten.length) {
      kern = "<ul>" + fakten.map(function (x) { return "<li>" + A.fmtInline(x) + "</li>"; }).join("") + "</ul>";
    }

    // Synthese über zwei Artikel: Liegt der zweitbeste Treffer nah am
    // besten, gehört er mit zur Antwort (z. B. Freistellung + Berufsschule).
    // Seine Dokumente (Vorlagen/Checklisten/Formulare) zählen dann auch mit.
    var zweitRec = semantischGefunden ? null : erg.artikel.filter(function (r) { return r.id !== haupt.id; })[0];
    var dokumente = dokumenteZu(haupt.id);
    if (zweitRec && zweitRec.score >= artScore * 0.55) {
      dokumenteZu(zweitRec.id).forEach(function (d) {
        if (dokumente.length < 6 && !dokumente.some(function (x) { return x.ziel === d.ziel; })) dokumente.push(d);
      });
    }
    // Semantisch klar passende Werkzeug-Einträge (Vorlagen, Checklisten,
    // Rechner) ergänzen das Dokumente-Angebot — Module sind zu allgemein.
    if (sem) {
      sem.filter(function (s) {
        return s.typ === "werkzeug" && s.ziel && s.score >= 0.84 &&
          /^(Vorlage|Checkliste|Rechner|Nachschlag)$/.test(s.art || "");
      }).slice(0, 2).forEach(function (s) {
        if (dokumente.length < 6 && !dokumente.some(function (d) { return d.ziel === s.ziel; })) {
          dokumente.push({ text: s.art + ": " + s.titel, ziel: s.ziel });
        }
      });
    }
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
    var unsicher = semantischGefunden
      ? "<p class=\"bw-klein bw-leise\">Über die Bedeutungssuche zugeordnet — die Quellen unten führen zum vollständigen Artikel.</p>"
      : Math.max(faqScore, artScore) < 6
        ? "<p class=\"bw-klein bw-leise\">Ich bin nicht sicher, ob das deine Frage genau trifft — die Quellen unten führen zum vollständigen Artikel.</p>"
        : "";

    var quellen = [];
    (haupt.recht || []).slice(0, 3).forEach(function (r) { quellen.push({ text: r.n, ziel: "#/artikel/" + haupt.id }); });
    quellen.push({ text: "Artikel: " + haupt.titel, ziel: "#/artikel/" + haupt.id });
    var zweit = !semantischGefunden && erg.artikel[1] && erg.artikel[1].id !== haupt.id ? A.artikelVon(erg.artikel[1].id) : null;
    if (zweit) quellen.push({ text: "Siehe auch: " + zweit.titel, ziel: "#/artikel/" + zweit.id });

    kontextSetzen({ artikelId: haupt.id, titel: haupt.titel,
      stichworte: (haupt.stichworte || []).slice(0, 3).join(" ") });
    return { html: einstieg + kern + zusatz + unsicher, quellen: quellen,
      dokumente: dokumente, folgefragen: folgefragenZu(haupt) };
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
      "Was kannst du alles?",
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
      "Er kennt alle Module des Werkzeugs, verlinkt passende Vorlagen, Checklisten und Formulare und ersetzt keine Rechtsberatung im Einzelfall.</p></div>" +
      "<p class=\"bw-klein\" id=\"semantik-zeile\" aria-live=\"polite\"></p>" +
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
    semantikUi(container);

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

  // Statuszeile & Aktivierung der Bedeutungssuche (K3). Das Sprachmodell
  // (≈ 150 MB) wird erst auf Klick geladen und bleibt dann lokal im Cache;
  // einmal aktiviert, lädt es bei künftigen Besuchen automatisch.
  function semantikUi(container) {
    var zeile = container.querySelector("#semantik-zeile");
    if (!zeile) return;
    var S = window.AzubiSemantik;
    if (!S || !S.verfuegbar()) { zeile.parentNode.removeChild(zeile); return; }
    function zeigen() {
      var z = S.zustand();
      if (z === "bereit") {
        zeile.innerHTML = "<strong>Bedeutungssuche aktiv</strong> — der Assistent versteht auch frei formulierte Fragen.";
      } else if (z === "laedt") {
        if (!zeile.textContent) zeile.textContent = "Bedeutungssuche wird geladen …";
      } else if (z === "fehler") {
        zeile.innerHTML = "<span class=\"bw-leise\">Bedeutungssuche momentan nicht verfügbar — die Stichwortsuche arbeitet normal weiter.</span>";
      } else {
        zeile.innerHTML = "<button type=\"button\" class=\"chip\" id=\"semantik-an\">Bedeutungssuche aktivieren</button> " +
          "<span class=\"bw-leise\">lädt einmalig ein Sprachmodell (≈ 150 MB) auf dieses Gerät — bleibt lokal, keine Cloud.</span>";
        zeile.querySelector("#semantik-an").addEventListener("click", starten);
      }
    }
    function starten() {
      S.meldung(function (text) { zeile.textContent = text; });
      S.laden().then(function () {
        // Nach erfolgreicher Aktivierung dauerhaft merken (Autostart).
        try { localStorage.setItem("aw.semantik", "an"); } catch (e) { /* optional */ }
        zeigen();
      }, zeigen);
      zeigen();
    }
    var an = false;
    try { an = localStorage.getItem("aw.semantik") === "an"; } catch (e) { /* ohne Speicher kein Autostart */ }
    if (S.zustand() === "laedt") { S.meldung(function (text) { zeile.textContent = text; }); zeigen(); }
    else if (an && S.zustand() === "aus") starten();
    else zeigen();
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
      Promise.resolve(antwortBauen(frage)).then(function (a) {
        var A = window.AzubiApp;
        var dokHtml = (a.dokumente && a.dokumente.length)
          ? "<div class=\"quellen\"><span class=\"qtitel\">Passende Dokumente</span>" +
            a.dokumente.map(function (d) { return zielLink(d, A.esc(d.text)); }).join("") + "</div>"
          : "";
        var quellenHtml = a.quellen.length
          ? "<div class=\"quellen\"><span class=\"qtitel\">Quellen</span>" +
            a.quellen.map(function (q) { return "<a href=\"" + q.ziel + "\">" + A.esc(q.text) + "</a>"; }).join("") + "</div>"
          : "";
        verlauf.push({ rolle: "antwort", html: a.html + dokHtml + quellenHtml });
        merken();
        verlaufZeigen();
        vorschlaegeZeigen(a.folgefragen);
      }).catch(function (fehler) {
        verlauf.push({ rolle: "antwort", html: "<p>Die Antwort konnte nicht erstellt werden (" +
          window.AzubiApp.esc(String((fehler && fehler.message) || fehler)) + "). Bitte stelle die Frage erneut.</p>" });
        merken();
        verlaufZeigen();
      });
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
