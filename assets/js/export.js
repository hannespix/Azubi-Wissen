// export.js — PDF-Export (über den Druckdialog) und Aktenvermerk-Generator.
// Dokumente werden als Druckansicht aufgebaut (#druckbereich, A4-Styles in
// app.css); „Als PDF speichern" übernimmt der Browser-Druckdialog — ohne
// externe Bibliotheken, vollständig offline. Vermerk-Entwürfe und abgelegte
// Vermerke liegen in der lokalen Datenbank (lokaldb.js, IndexedDB).
(function () {
  "use strict";
  var W = window.WISSEN;

  var ROLLEN = {
    beratung: { name: "Ausbildungsberatung", untertitel: "Fachdossier für die Ausbildungsberatung", hinweisRolle: "beratung" },
    betrieb:  { name: "Ausbildungsbetriebe", untertitel: "Leitfaden für Ausbildungsbetriebe", hinweisRolle: "betrieb" },
    azubi:    { name: "Auszubildende", untertitel: "Deine Rechte und Pflichten in der Ausbildung", hinweisRolle: "azubi" }
  };
  var STUFEN = { 1: "Kurzübersicht", 2: "Standard", 3: "Ausführlich" };

  function A() { return window.AzubiApp; }
  function datumHeute() {
    return new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  /* =========== Dokumentaufbau (Handout je Rolle) ==================== */
  function artikelHtml(a, opts) {
    var h = '<section class="artikel">';
    h += "<h3>" + A().esc(a.titel) + "</h3>";
    h += "<p><em>" + A().fmtInline(a.kurz) + "</em></p>";
    if ((a.fakten || []).length) {
      h += "<ul>" + a.fakten.map(function (f) { return "<li>" + A().fmtInline(f) + "</li>"; }).join("") + "</ul>";
    }
    (a.abschnitte || []).forEach(function (x) {
      if ((x.d || 2) <= opts.stufe) h += "<h4>" + A().esc(x.t) + "</h4>" + A().fmt(x.text);
    });
    if (opts.rollenhinweise && a.rollen && a.rollen[opts.rolle.hinweisRolle]) {
      h += '<div class="rolle-box"><strong>Praxishinweis (' + A().esc(opts.rolle.name) + "):</strong> " +
        A().fmtInline(a.rollen[opts.rolle.hinweisRolle]) + "</div>";
    }
    if (opts.faq && (a.faq || []).length) {
      h += "<h4>Häufige Fragen</h4>";
      a.faq.forEach(function (f) {
        h += "<p><strong>" + A().esc(f.f) + "</strong><br>" + A().fmtInline(f.a) + "</p>";
      });
    }
    if (opts.rechtsgrundlagen && (a.recht || []).length) {
      h += '<p class="recht-liste">Rechtsgrundlagen: ' +
        a.recht.map(function (r) { return A().esc(r.n + " (" + r.t + ")"); }).join(" · ") + "</p>";
    }
    if (a.quelle) {
      h += '<p class="recht-liste">Quelle: ' + A().esc(a.quelle) + "</p>";
    }
    h += "</section>";
    return h;
  }

  function dokumentBauen(auswahl, opts) {
    // auswahl: Liste von Artikel-Objekten, gruppiert nach Themenreihenfolge
    var themenMap = {};
    auswahl.forEach(function (a) { (themenMap[a.thema] = themenMap[a.thema] || []).push(a); });
    var themen = W.themen.filter(function (t) { return themenMap[t.id]; });

    // Logo aus dem Kopf übernehmen — funktioniert auch in der
    // Single-File-Fassung, in der Assets als data:-URIs eingebettet sind.
    var kopfLogo = document.querySelector(".bw-nav__brand img");
    var logoSrc = kopfLogo ? kopfLogo.getAttribute("src") : "assets/logo/rpf-logo.png";
    var h = '<div class="doku">';
    if (opts.deckblatt) {
      h += '<div class="deckblatt">' +
        '<img src="' + logoSrc + '" alt="Regierungspräsidium Freiburg">' +
        "<h1>Azubi-Wissen<br>Rechte &amp; Pflichten in der Ausbildung</h1>" +
        '<p class="untertitel">' + A().esc(opts.rolle.untertitel) + "</p>" +
        '<p class="metadaten">Detailgrad: ' + STUFEN[opts.stufe] + "<br>" +
        "Erstellt am " + datumHeute() + " · Stand der Inhalte: " + A().esc(W.stand) + "<br>" +
        A().esc(auswahl.length) + " Artikel in " + themen.length + " Themenbereichen</p>" +
        "</div>";
    }
    if (opts.ivz && themen.length > 1) {
      h += '<div class="ivz"><h2>Inhalt</h2><ol>' +
        themen.map(function (t) { return "<li>" + A().esc(t.titel) + "</li>"; }).join("") + "</ol></div>";
    }
    themen.forEach(function (t) {
      h += '<section class="themenblock"><h2>' + A().esc(t.titel) + "</h2>" +
        "<p><em>" + A().esc(t.kurz) + "</em></p>" +
        themenMap[t.id].map(function (a) { return artikelHtml(a, opts); }).join("") +
        "</section>";
    });
    h += '<p class="fussnote">' + A().esc(W.hinweis) + " — Erstellt mit dem Werkzeug „Azubi-Wissen“ des Regierungspräsidiums Freiburg, " + datumHeute() + ".</p>";
    h += "</div>";
    return h;
  }

  /* =========== Aktenvermerk ========================================= */
  function vermerkHtml(v) {
    function zeile(k, w) {
      return w ? "<tr><th>" + A().esc(k) + "</th><td>" + A().esc(w) + "</td></tr>" : "";
    }
    var h = '<div class="doku">';
    h += "<p><strong>Regierungspräsidium Freiburg</strong><br>Ausbildungsberatung — grüne Berufe</p>";
    h += "<h1>Aktenvermerk</h1>";
    h += "<table>" +
      zeile("Aktenzeichen", v.az) +
      zeile("Datum", v.datum ? new Date(v.datum + "T12:00:00").toLocaleDateString("de-DE") : "") +
      zeile("Verfasser/in", v.verfasser) +
      zeile("Art des Vorgangs", v.art) +
      zeile("Beteiligte", v.beteiligte) +
      zeile("Ausbildungsbetrieb", v.betrieb) +
      zeile("Auszubildende/r", v.azubi) +
      "</table>";
    if (v.anlass) h += "<h2>Anlass</h2>" + A().fmt(v.anlass);
    if (v.sachverhalt) h += "<h2>Sachverhalt</h2>" + A().fmt(v.sachverhalt);
    if ((v.themen || []).length || v.wuerdigung) {
      h += "<h2>Rechtliche Einordnung</h2>";
      (v.themen || []).forEach(function (id) {
        var a = A().artikelVon(id);
        if (!a) return;
        h += "<p><strong>" + A().esc(a.titel) + ":</strong> " + A().fmtInline(a.kurz) + "<br>" +
          '<span class="recht-liste">' + (a.recht || []).map(function (r) { return A().esc(r.n); }).join(" · ") + "</span></p>";
      });
      if (v.wuerdigung) h += A().fmt(v.wuerdigung);
    }
    if (v.ergebnis) h += "<h2>Ergebnis / Vereinbarung</h2>" + A().fmt(v.ergebnis);
    if (v.vorgehen) h += "<h2>Weiteres Vorgehen / Wiedervorlage</h2>" + A().fmt(v.vorgehen);
    if (v.verteiler) h += "<h2>Verteiler</h2><p>" + A().esc(v.verteiler) + "</p>";
    h += '<p style="margin-top:3em">________________________________<br>' + A().esc(v.verfasser || "Unterschrift") + "</p>";
    h += '<p class="fussnote">Aktenvermerk, erstellt mit dem Werkzeug „Azubi-Wissen“ am ' + datumHeute() + ". Enthält ggf. personenbezogene Daten — Aufbewahrung nach Aktenordnung, keine ungesicherte Weitergabe.</p>";
    h += "</div>";
    return h;
  }

  /* =========== Ansicht ============================================= */
  var zustand = null; // {typ:"handout"|"vermerk"}

  function renderView(container, params) {
    params = params || {};
    var typ = params.typ === "vermerk" ? "vermerk" : "handout";
    var h = "<h1>Export &amp; Aktenvermerk</h1>" +
      '<p class="bw-unterzeile">Themen als PDF ausgeben oder Vermerke strukturiert erstellen</p>' +
      '<div class="chipzeile" role="group" aria-label="Dokumenttyp">' +
      '<button class="chip" data-typ="handout" aria-pressed="' + (typ === "handout") + '">PDF-Handout</button>' +
      '<button class="chip" data-typ="vermerk" aria-pressed="' + (typ === "vermerk") + '">Aktenvermerk</button>' +
      "</div>" +
      '<div id="export-bereich"></div>';
    container.innerHTML = h;
    container.querySelectorAll("[data-typ]").forEach(function (b) {
      b.addEventListener("click", function () {
        container.querySelectorAll("[data-typ]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        if (b.getAttribute("data-typ") === "vermerk") vermerkForm(container.querySelector("#export-bereich"));
        else handoutForm(container.querySelector("#export-bereich"), {});
      });
    });
    if (typ === "vermerk") vermerkForm(container.querySelector("#export-bereich"));
    else handoutForm(container.querySelector("#export-bereich"), params);
  }

  /* ---------- Handout-Formular ------------------------------------- */
  function handoutForm(wurzel, params) {
    var artikelVorwahl = params.artikel && A().artikelVon(params.artikel) ? params.artikel : "";
    var h = '<form class="export-form" id="handout-form">';
    h += '<fieldset><legend>Zielgruppe</legend><div class="wahlkarten">';
    [["beratung", "Für die Ausbildungsberatung", "mit allen Details und Beratungshinweisen"],
     ["betrieb", "Für Betriebe", "Leitfaden mit Praxishinweisen für Ausbildende"],
     ["azubi", "Für Azubis", "verständlich, mit Tipps für Auszubildende"]].forEach(function (r, i) {
      h += '<label class="wahlkarte"><input type="radio" name="rolle" value="' + r[0] + '"' + (i === 0 ? " checked" : "") + ">" +
        '<span class="wk-titel">' + r[1] + '</span><span class="wk-sub">' + r[2] + "</span></label>";
    });
    h += "</div></fieldset>";

    h += '<fieldset><legend>Themenbereiche</legend>';
    if (artikelVorwahl) {
      var art = A().artikelVon(artikelVorwahl);
      h += '<div class="bw-hinweis" style="margin-bottom:var(--bw-space-2)"><p>Vorauswahl aus dem Artikel <strong>' +
        A().esc(art.titel) + '</strong>. <button type="button" class="chip" id="vorwahl-aufheben">Ganze Themenbereiche wählen</button></p></div>';
    }
    h += '<div class="wahlkarten" id="themen-wahl"' + (artikelVorwahl ? " hidden" : "") + ">";
    W.themen.forEach(function (t) {
      var n = W.artikel.filter(function (a) { return a.thema === t.id; }).length;
      h += '<label class="wahlkarte"><input type="checkbox" name="thema" value="' + t.id + '"' +
        (artikelVorwahl ? "" : " checked") + ">" +
        '<span class="wk-titel">' + A().esc(t.titel) + '</span><span class="wk-sub">' + n + " Artikel</span></label>";
    });
    h += '</div><p class="bw-klein" id="themen-schnell"' + (artikelVorwahl ? " hidden" : "") + ">" +
      '<button type="button" class="chip" data-alle="1">Alle auswählen</button> ' +
      '<button type="button" class="chip" data-alle="0">Alle abwählen</button></p></fieldset>';

    h += '<fieldset><legend>Detailgrad</legend><div class="wahlkarten">';
    [[1, "Kurzübersicht", "nur Kurzfassung und Faktenliste"],
     [2, "Standard", "plus Erläuterungen (empfohlen)"],
     [3, "Ausführlich", "alle Abschnitte und Sonderfälle"]].forEach(function (s) {
      h += '<label class="wahlkarte"><input type="radio" name="stufe" value="' + s[0] + '"' + (s[0] === 2 ? " checked" : "") + ">" +
        '<span class="wk-titel">' + s[1] + '</span><span class="wk-sub">' + s[2] + "</span></label>";
    });
    h += "</div></fieldset>";

    h += '<fieldset><legend>Optionen</legend><div class="opt-zeile">' +
      '<label><input type="checkbox" name="deckblatt" checked> Deckblatt</label>' +
      '<label><input type="checkbox" name="ivz" checked> Inhaltsverzeichnis</label>' +
      '<label><input type="checkbox" name="rechtsgrundlagen" checked> Rechtsgrundlagen (§§)</label>' +
      '<label><input type="checkbox" name="rollenhinweise" checked> Praxishinweise</label>' +
      '<label><input type="checkbox" name="faq"> FAQ einbeziehen</label>' +
      "</div></fieldset>";

    h += '<div class="export-aktionen">' +
      '<button class="bw-btn" type="button" id="pdf-drucken">Als PDF drucken</button>' +
      '<button class="bw-btn bw-btn--sekundaer" type="button" id="vorschau-zeigen">Vorschau anzeigen</button>' +
      '<span class="bw-klein bw-leise" id="export-info" role="status"></span>' +
      "</div></form>" +
      '<div class="vorschau" id="handout-vorschau" hidden><div class="blatt"></div></div>';

    wurzel.innerHTML = h;

    var form = wurzel.querySelector("#handout-form");
    function optionen() {
      var fd = new FormData(form);
      var themen = fd.getAll("thema");
      var auswahl;
      if (artikelVorwahl) auswahl = [A().artikelVon(artikelVorwahl)];
      else auswahl = W.artikel.filter(function (a) { return themen.indexOf(a.thema) >= 0; });
      return {
        auswahl: auswahl,
        opts: {
          rolle: ROLLEN[fd.get("rolle") || "beratung"],
          stufe: parseInt(fd.get("stufe") || "2", 10),
          deckblatt: !!fd.get("deckblatt"), ivz: !!fd.get("ivz"),
          rechtsgrundlagen: !!fd.get("rechtsgrundlagen"),
          rollenhinweise: !!fd.get("rollenhinweise"), faq: !!fd.get("faq")
        }
      };
    }
    function info() {
      var o = optionen();
      wurzel.querySelector("#export-info").textContent =
        o.auswahl.length ? o.auswahl.length + " Artikel im Dokument" : "Kein Themenbereich gewählt";
    }
    form.addEventListener("change", function () {
      info();
      var v = wurzel.querySelector("#handout-vorschau");
      if (!v.hidden) vorschau();
    });
    var aufheben = wurzel.querySelector("#vorwahl-aufheben");
    if (aufheben) aufheben.addEventListener("click", function () {
      artikelVorwahl = "";
      wurzel.querySelector("#themen-wahl").hidden = false;
      wurzel.querySelector("#themen-schnell").hidden = false;
      history.replaceState(null, "", "#/export");
      info();
    });
    wurzel.querySelectorAll("[data-alle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var an = b.getAttribute("data-alle") === "1";
        wurzel.querySelectorAll('input[name="thema"]').forEach(function (c) { c.checked = an; });
        info();
        var v = wurzel.querySelector("#handout-vorschau");
        if (!v.hidden) vorschau();
      });
    });

    function vorschau() {
      var o = optionen();
      var v = wurzel.querySelector("#handout-vorschau");
      v.hidden = false;
      v.querySelector(".blatt").innerHTML = o.auswahl.length
        ? dokumentBauen(o.auswahl, o.opts)
        : '<p class="leer">Bitte mindestens einen Themenbereich wählen.</p>';
    }
    wurzel.querySelector("#vorschau-zeigen").addEventListener("click", vorschau);
    wurzel.querySelector("#pdf-drucken").addEventListener("click", function () {
      var o = optionen();
      if (!o.auswahl.length) { info(); return; }
      drucken(dokumentBauen(o.auswahl, o.opts));
    });
    info();
  }

  function drucken(html) {
    var d = document.getElementById("druckbereich");
    d.innerHTML = '<div class="blatt">' + html + "</div>";
    window.print();
  }

  /* ---------- Aktenvermerk-Formular -------------------------------- */
  var ENTWURF_ID = "entwurf-aktuell";

  function vermerkLesen(wurzel) {
    var fd = new FormData(wurzel.querySelector("#vermerk-form"));
    var themen = [];
    wurzel.querySelectorAll("#vermerk-themen option:checked").forEach(function (o) { themen.push(o.value); });
    return {
      id: ENTWURF_ID,
      az: fd.get("az") || "", datum: fd.get("datum") || "", verfasser: fd.get("verfasser") || "",
      art: fd.get("art") || "", beteiligte: fd.get("beteiligte") || "", betrieb: fd.get("betrieb") || "",
      azubi: fd.get("azubi") || "", anlass: fd.get("anlass") || "", sachverhalt: fd.get("sachverhalt") || "",
      themen: themen, wuerdigung: fd.get("wuerdigung") || "", ergebnis: fd.get("ergebnis") || "",
      vorgehen: fd.get("vorgehen") || "", verteiler: fd.get("verteiler") || "",
      geaendert: Date.now()
    };
  }

  function vermerkForm(wurzel) {
    var heute = new Date();
    var datumWert = heute.getFullYear() + "-" + String(heute.getMonth() + 1).padStart(2, "0") + "-" + String(heute.getDate()).padStart(2, "0");
    var h = '<div class="bw-hinweis"><p><strong>Lokal gespeichert:</strong> Entwurf und abgelegte Vermerke bleiben in der ' +
      "Datenbank dieses Browsers (IndexedDB) auf diesem Gerät. Für die Akte das fertige PDF ablegen; " +
      "personenbezogene Daten sparsam erfassen.</p></div>";
    h += '<form class="export-form" id="vermerk-form">';
    h += '<fieldset><legend>Vorgang</legend><div class="bw-flaechen bw-drittel">' +
      '<div class="bw-field"><label for="v-az">Aktenzeichen</label><input id="v-az" name="az"></div>' +
      '<div class="bw-field"><label for="v-datum">Datum</label><input id="v-datum" name="datum" type="date" value="' + datumWert + '"></div>' +
      '<div class="bw-field"><label for="v-verfasser">Verfasser/in</label><input id="v-verfasser" name="verfasser"></div>' +
      "</div>" +
      '<div class="bw-flaechen bw-drittel">' +
      '<div class="bw-field"><label for="v-art">Art des Vorgangs</label><select id="v-art" name="art">' +
      ["Telefonat", "Betriebsbesuch", "Besprechung", "Schriftverkehr", "Sonstiges"].map(function (o) { return "<option>" + o + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="bw-field"><label for="v-betrieb">Ausbildungsbetrieb</label><input id="v-betrieb" name="betrieb"></div>' +
      '<div class="bw-field"><label for="v-azubi">Auszubildende/r</label><input id="v-azubi" name="azubi"></div>' +
      "</div>" +
      '<div class="bw-field"><label for="v-beteiligte">Beteiligte (Name, Funktion)</label><input id="v-beteiligte" name="beteiligte" placeholder="z. B. Herr M., Ausbilder; Frau K., Auszubildende"></div>' +
      "</fieldset>";

    h += '<fieldset><legend>Inhalt</legend>' +
      '<div class="bw-field"><label for="v-anlass">Anlass</label><input id="v-anlass" name="anlass" placeholder="z. B. Anruf der Auszubildenden wegen Überstunden"></div>' +
      '<div class="bw-field"><label for="v-sachverhalt">Sachverhalt</label><textarea id="v-sachverhalt" name="sachverhalt" rows="6" placeholder="Chronologisch, konkret, mit Daten. Fremdaussagen im Konjunktiv."></textarea></div>' +
      '<div class="bw-field"><label for="vermerk-themen">Themenbezug (Rechtsgrundlagen-Bausteine, Mehrfachauswahl mit Strg)</label>' +
      '<select id="vermerk-themen" multiple size="8">' +
      W.themen.map(function (t) {
        return '<optgroup label="' + A().esc(t.titel) + '">' +
          W.artikel.filter(function (a) { return a.thema === t.id; })
            .map(function (a) { return '<option value="' + a.id + '">' + A().esc(a.titel) + "</option>"; }).join("") +
          "</optgroup>";
      }).join("") +
      "</select></div>" +
      '<div class="bw-field"><label for="v-wuerdigung">Eigene rechtliche Würdigung (optional)</label><textarea id="v-wuerdigung" name="wuerdigung" rows="3"></textarea></div>' +
      '<div class="bw-field"><label for="v-ergebnis">Ergebnis / Vereinbarung</label><textarea id="v-ergebnis" name="ergebnis" rows="3" placeholder="Was wurde zugesagt, mit welcher Frist?"></textarea></div>' +
      '<div class="bw-field"><label for="v-vorgehen">Weiteres Vorgehen / Wiedervorlage</label><textarea id="v-vorgehen" name="vorgehen" rows="2"></textarea></div>' +
      '<div class="bw-field"><label for="v-verteiler">Verteiler</label><input id="v-verteiler" name="verteiler" placeholder="z. B. Akte, Referatsleitung"></div>' +
      "</fieldset>";

    h += '<div class="export-aktionen">' +
      '<button class="bw-btn" type="button" id="vermerk-drucken">Als PDF drucken</button>' +
      '<button class="bw-btn bw-btn--sekundaer" type="button" id="vermerk-vorschau-btn">Vorschau anzeigen</button>' +
      '<button class="bw-btn bw-btn--sekundaer" type="button" id="vermerk-ablegen">In Datenbank ablegen</button>' +
      '<button class="bw-btn bw-btn--sekundaer" type="button" id="vermerk-leeren">Entwurf verwerfen</button>' +
      '<span class="bw-klein bw-leise" id="vermerk-status" role="status"></span>' +
      "</div></form>";

    h += '<div class="vorschau" id="vermerk-vorschau" hidden><div class="blatt"></div></div>';
    h += '<h2>Abgelegte Vermerke</h2><ul class="karten" id="vermerk-liste"></ul>' +
      '<p class="leer" id="vermerk-liste-leer" hidden>Noch keine Vermerke abgelegt.</p>';

    wurzel.innerHTML = h;
    var form = wurzel.querySelector("#vermerk-form");
    var status = wurzel.querySelector("#vermerk-status");

    function inFormular(v) {
      ["az", "datum", "verfasser", "art", "beteiligte", "betrieb", "azubi", "anlass",
       "sachverhalt", "wuerdigung", "ergebnis", "vorgehen", "verteiler"].forEach(function (k) {
        var f = form.elements[k];
        if (f && v[k] !== undefined) f.value = v[k];
      });
      wurzel.querySelectorAll("#vermerk-themen option").forEach(function (o) {
        o.selected = (v.themen || []).indexOf(o.value) >= 0;
      });
    }

    // Entwurf laden und bei jeder Eingabe automatisch sichern
    if (window.LokalDB) {
      window.LokalDB.holen("vermerke", ENTWURF_ID).then(function (v) {
        if (v) { inFormular(v); status.textContent = "Entwurf wiederhergestellt."; }
      });
      var timer = null;
      form.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          window.LokalDB.speichern("vermerke", vermerkLesen(wurzel)).then(function () {
            status.textContent = "Entwurf automatisch gespeichert.";
          }, function () {
            status.textContent = "Entwurf konnte nicht gespeichert werden (Speicher voll).";
          });
        }, 400);
      });
    }

    function vorschau() {
      var v = wurzel.querySelector("#vermerk-vorschau");
      v.hidden = false;
      v.querySelector(".blatt").innerHTML = vermerkHtml(vermerkLesen(wurzel));
    }
    wurzel.querySelector("#vermerk-vorschau-btn").addEventListener("click", vorschau);
    form.addEventListener("change", function () {
      var v = wurzel.querySelector("#vermerk-vorschau");
      if (!v.hidden) vorschau();
    });
    wurzel.querySelector("#vermerk-drucken").addEventListener("click", function () {
      drucken(vermerkHtml(vermerkLesen(wurzel)));
    });
    wurzel.querySelector("#vermerk-leeren").addEventListener("click", function () {
      form.reset();
      form.elements.datum.value = datumWert;
      wurzel.querySelectorAll("#vermerk-themen option").forEach(function (o) { o.selected = false; });
      if (window.LokalDB) window.LokalDB.loeschen("vermerke", ENTWURF_ID);
      status.textContent = "Entwurf verworfen.";
    });
    wurzel.querySelector("#vermerk-ablegen").addEventListener("click", function () {
      if (!window.LokalDB) return;
      var v = vermerkLesen(wurzel);
      v.id = "vermerk-" + Date.now();
      window.LokalDB.speichern("vermerke", v).then(function () {
        status.textContent = "Vermerk abgelegt.";
        listeZeigen();
      }, function () {
        status.textContent = "Vermerk konnte nicht gespeichert werden (Speicher voll).";
      });
    });

    function listeZeigen() {
      if (!window.LokalDB) return;
      window.LokalDB.alle("vermerke").then(function (alle) {
        var abgelegt = alle.filter(function (v) { return v.id !== ENTWURF_ID; })
          .sort(function (a, b) { return (b.geaendert || 0) - (a.geaendert || 0); });
        var ul = wurzel.querySelector("#vermerk-liste");
        wurzel.querySelector("#vermerk-liste-leer").hidden = abgelegt.length > 0;
        ul.innerHTML = abgelegt.map(function (v) {
          var d = v.datum ? new Date(v.datum + "T12:00:00").toLocaleDateString("de-DE") : "";
          return '<li class="karte"><h3>' + A().esc(v.anlass || "(ohne Anlass)") + "</h3>" +
            "<p>" + A().esc([d, v.betrieb, v.az].filter(Boolean).join(" · ")) + "</p>" +
            '<span class="meta">' +
            '<button class="chip" data-laden="' + v.id + '">Laden</button>' +
            '<button class="chip" data-entfernen="' + v.id + '">Löschen</button>' +
            "</span></li>";
        }).join("");
        ul.querySelectorAll("[data-laden]").forEach(function (b) {
          b.addEventListener("click", function () {
            window.LokalDB.holen("vermerke", b.getAttribute("data-laden")).then(function (v) {
              if (v) { inFormular(v); status.textContent = "Vermerk in das Formular geladen."; window.scrollTo(0, 0); }
            });
          });
        });
        ul.querySelectorAll("[data-entfernen]").forEach(function (b) {
          b.addEventListener("click", function () {
            window.LokalDB.loeschen("vermerke", b.getAttribute("data-entfernen")).then(listeZeigen);
          });
        });
      });
    }
    listeZeigen();
  }

  window.AzubiExport = { renderView: renderView, dokumentBauen: dokumentBauen, vermerkHtml: vermerkHtml };
})();
