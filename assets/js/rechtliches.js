/* rechtliches.js — Rechtliches & Impressum (S12, neu gefasst S43).
 *
 * Eigene, UNverschlüsselte Datei (seit S48): Die Online-Fassung ist
 * passwortgeschützt (assets/js/zugang.js), das Impressum muss aber ohne
 * Anmeldung erreichbar bleiben (§ 5 DDG: leicht erkennbar, unmittelbar
 * erreichbar). Das Werkzeug (app.js, Route #/rechtliches) und das
 * Anmeldefenster zeigen beide genau diese Seite — eine Quelle, kein Doppel.
 *
 * Anbieterkennzeichnung, Datenschutz, Barrierefreiheit, Lizenzen, Haftung.
 * Alle Kontaktangaben kommen aus assets/js/kontakt.js (window.KONTAKT) —
 * dieselbe Quelle nutzt der Assistent. Nie hier hart eintragen.
 * Verantwortlich ist Hannes Pix persönlich; Behörden werden nicht als
 * Anbieter genannt (kein amtliches Angebot).
 */
(function () {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mailtoLink(adresse, betreff) {
    if (!adresse) return "<em>E-Mail-Kontakt wird ergänzt</em>";
    return '<a href="mailto:' + esc(adresse) + (betreff ? "?subject=" + encodeURIComponent(betreff) : "") + '">' + esc(adresse) + "</a>";
  }
  function githubLink(K, text) {
    return '<a href="' + esc(K.github) + '" target="_blank" rel="noopener">' + esc(text || "GitHub") + ' <span aria-hidden="true">\u2197</span></a>';
  }
  function viewRechtliches() {
    var K = window.KONTAKT || {};
    var E = K.entwickler || {};
    var B = K.betreff || {};
    return "<h1>Rechtliches &amp; Impressum</h1>" +
      '<p class="bw-unterzeile">Anbieter, Datenschutz, Barrierefreiheit und Lizenzen dieses Werkzeugs</p>' +

      '<div class="bw-hinweis"><p><strong>Entwurf im Testbetrieb:</strong> Die Nachnutzungsregel für eigene ' +
      "Inhalte steht noch als Platzhalter aus und wird ergänzt.</p></div>" +

      "<h2>Anbieter</h2>" +
      "<p>Angaben gemäß § 5 DDG — verantwortlich für dieses Werkzeug:<br><strong>" + esc(K.anbieter) + "</strong><br>" +
      (K.anschrift || []).map(esc).join("<br>") + "</p>" +
      "<p>" + esc(K.einordnung) + " — ein Projekt von " +
      '<a href="' + esc(K.web) + '" target="_blank" rel="noopener">' + esc(K.webName) + ' <span aria-hidden="true">\u2197</span></a>.</p>' +
      "<p>E-Mail: " + mailtoLink(E.email) + "<br>" +
      "Quellcode und Rückmeldungen: " + githubLink(K, "github.com/hannespix/Azubi-Wissen") + "</p>" +
      "<p>Redaktionell verantwortlich (§ 18 Abs. 2 MStV): " + esc(K.anbieter) + ", Anschrift wie oben.</p>" +
      "<p><strong>Verbraucherstreitbeilegung:</strong> Ich bin nicht bereit und nicht verpflichtet, an " +
      "Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>" +

      "<h2>Entwicklung &amp; Änderungswünsche</h2>" +
      "<ul>" +
      "<li><strong>" + esc(E.rolle) + ":</strong> " + esc(E.name) + ".</li>" +
      "<li><strong>Änderungswünsche, Fehlermeldungen und Ergänzungsvorschläge</strong> gerne über " +
      githubLink(K, "GitHub-Issues") + (E.email ? " oder per E-Mail: " + mailtoLink(E.email, B.rueckmeldung) : "") + ". " +
      "Eine kurze Beschreibung genügt — bei Darstellungsfehlern hilft ein Bildschirmfoto mit Gerät und Browser.</li>" +
      "<li><strong>Updates:</strong> Die Online-Fassung aktualisiert sich beim nächsten Aufruf von selbst. Die " +
      "heruntergeladene Einzeldatei gelegentlich neu beziehen, damit Inhalte, Tabellen und Gesetzesstände aktuell " +
      "bleiben; fachliche Stände sind an den Inhalten jeweils vermerkt.</li>" +
      "</ul>" +

      "<h2>Datenschutz</h2>" +
      "<ul>" +
      "<li><strong>Das Werkzeug läuft vollständig lokal.</strong> Es überträgt keine Daten, setzt keine Cookies, " +
      "lädt nichts von Drittservern nach und enthält keine Telemetrie. Auch der KI-Assistent und die " +
      "Bedeutungssuche rechnen ausschließlich auf dem eigenen Gerät.</li>" +
      "<li><strong>Lokale Speicherung im Browser:</strong> Notizen, Aktenvermerke, Merkliste, Checklisten-Stände " +
      "und eigene Inhalte liegen nur im Browser-Speicher dieses Geräts (localStorage/IndexedDB). Löschen ist " +
      "jederzeit über die Browserdaten oder das Modul „Eigene Inhalte &amp; Sicherung“ möglich.</li>" +
      "<li><strong>Zugangsschutz:</strong> Die Online-Fassung ist mit einem Zugangspasswort geschützt; ihre " +
      "Inhalte liegen auf dem Server nur verschlüsselt. Nach der Anmeldung merkt sich der Browser einen aus dem " +
      "Passwort abgeleiteten Schlüssel im Speicher dieses Geräts (localStorage), damit das Passwort nur einmal " +
      "nötig ist. Übertragen wird dabei nichts; „Abmelden“ im Menü löscht den Schlüssel.</li>" +
      "<li><strong>Aufruf über das Internet:</strong> Wird das Werkzeug online aufgerufen (derzeit GitHub Pages), " +
      "verarbeitet der Hoster (GitHub Inc., USA) technisch bedingt Server-Protokolle mit " +
      "IP-Adressen; darauf hat das Werkzeug keinen Einfluss. Bei der Nutzung als heruntergeladene Einzeldatei " +
      "oder im internen Netz entfällt das vollständig.</li>" +
      "</ul>" +

      "<h2>Barrierefreiheit</h2>" +
      "<p>Das Werkzeug ist auf Barrierefreiheit nach WCAG 2.1 AA ausgelegt: semantisches HTML, vollständige " +
      "Tastaturbedienung mit sichtbarem Fokus, Sprungmarke zum Inhalt, ausreichende Kontraste und Respekt vor " +
      "reduzierter Bewegung (prefers-reduced-motion).</p>" +
      "<p><strong>Bekannte Einschränkungen:</strong> Einzelne ältere PDF-Dokumente im Download-Center " +
      "(eingescannte Vorschriften) sind nicht voll barrierefrei; die amtlichen Online-Fassungen sind " +
      "jeweils verlinkt.</p>" +
      "<p>Barrieren bitte melden: über " + githubLink(K, "GitHub-Issues") +
      (E.email ? " oder an " + mailtoLink(E.email, B.barriere) : "") + ".</p>" +

      "<h2>Urheberrecht &amp; Lizenzen</h2>" +
      "<ul>" +
      "<li><strong>Gesetzestexte</strong> sind amtliche Werke und gemeinfrei (§ 5 UrhG); Quelle: " +
      "gesetze-im-internet.de. Maßgeblich ist die jeweilige Verkündungsfassung.</li>" +
      "<li><strong>Inhalte dieses Werkzeugs</strong> (Artikel, Checklisten, Vorlagen): © " + esc(K.anbieter) + ". " +
      "Nachnutzung [Lizenz bzw. Freigaberegel ergänzen].</li>" +
      "<li><strong>Schriften:</strong> Source Sans 3 und Source Serif 4 (© Adobe, SIL Open Font License 1.1 — " +
      "frei nutzbar; Lizenztexte unter assets/fonts/). Das <strong>Keimling-Zeichen</strong> ist eine eigene " +
      "Schöpfung dieses Werkzeugs. Landeswappen und Behördenlogos werden hier bewusst nicht verwendet — sie sind " +
      "geschützt und nicht zur Weiterverwendung bestimmt.</li>" +
      "<li><strong>Open-Source-Komponenten</strong> (lokal gebündelt, keine Cloud): transformers.js " +
      "(Apache License 2.0), Sprachmodell multilingual-e5-small (MIT License).</li>" +
      "<li><strong>Dokumente Dritter</strong> im Download-Center (amtliche Vordrucke, BIBB, MLR, Bundesagentur " +
      "für Arbeit u. a.): Rechte bei den jeweiligen Herausgebern, Herkunft je Eintrag vermerkt.</li>" +
      "</ul>" +

      "<h2>Haftung</h2>" +
      "<p>Dieses Werkzeug ist eine privat gepflegte Fachinformation — <strong>keine Rechtsberatung im " +
      "Einzelfall und kein amtliches Angebot</strong>. Alle Angaben sind sorgfältig geprüft und mit Stand " +
      "versehen; verbindlich sind allein die amtlichen Fassungen der Gesetze, Verordnungen und Vorschriften " +
      "sowie die Auskünfte der jeweils zuständigen Stellen. Für externe Links gilt: Inhalte " +
      "fremder Seiten verantworten deren Anbieter.</p>" +
      '<p class="stand-hinweis">Stand dieser Seite: 15.10.2026</p>';
  }

  window.RECHTLICHES = { html: viewRechtliches };
})();
