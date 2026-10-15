/* zugang.js — Zugangsschutz der Online-Fassung (S48).
 *
 * Die veröffentlichte Fassung enthält die Inhalte nur verschlüsselt:
 * tools/zugang_bauen.py verschlüsselt beim Pages-Deploy alle Inhalts- und
 * Programmskripte (als ein Paket), den Suchindex, die Dateien im
 * Download-Center und die Offline-Datei mit AES-GCM (256 Bit). Den Schlüssel
 * leitet PBKDF2-SHA-256 aus dem Zugangspasswort ab (GitHub-Secret
 * ZUGANG_PASSWORT) — das Passwort selbst steht nirgends.
 *
 * Diese Datei zeigt das Anmeldefenster, prüft das Passwort lokal (eine
 * Probe entschlüsseln), merkt sich den abgeleiteten Schlüssel im
 * localStorage dieses Geräts — das Passwort ist also je Gerät nur einmal
 * nötig — und startet danach das Werkzeug. Kein Server, keine externe
 * Anfrage (Zero-Trust).
 *
 * Ohne window.ZUGANG_KONFIG (Repo, lokale Entwicklung, Tests) ist der
 * Schutz aus; dann stellt die Datei nur window.ZUGANG.laden() bereit, das
 * Dateien unverändert lädt.
 *
 * Modi (ZUGANG_KONFIG.modus):
 *   "seite" — index.html der Online-Fassung: Skriptpaket entschlüsseln und
 *             der Reihe nach ausführen.
 *   "datei" — Hülle der Offline-Datei: das ganze Dokument entschlüsseln und
 *             an seine Stelle schreiben.
 */
(function () {
  "use strict";
  var KONFIG = window.ZUGANG_KONFIG || null;
  var MAGIE = [0x41, 0x57, 0x5a, 0x31];          // "AWZ1" — Kennung verschlüsselter Dateien
  var PROBE_TEXT = "azubi-wissen";
  var SPEICHER = "azubi-wissen-zugang";
  var schluessel = null;
  var geaendert = false;                          // gemerkter Schlüssel passt nicht mehr

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function b64zuBytes(s) {
    var bin = atob(s), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  function bytesZuB64(buf) {
    var u = new Uint8Array(buf), s = "";
    for (var i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function verschluesselt(u) {
    return u.length > 16 && MAGIE.every(function (b, i) { return u[i] === b; });
  }
  // Aufbau: "AWZ1" · 12 Byte IV · Geheimtext mit 16 Byte GCM-Prüfsumme.
  function entschluesseln(key, daten) {
    var u = daten instanceof Uint8Array ? daten : new Uint8Array(daten);
    if (!verschluesselt(u)) return Promise.reject(new Error("Unbekanntes Dateiformat"));
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.subarray(4, 16) }, key, u.subarray(16));
  }

  // Lädt eine Datei des Werkzeugs; Verschlüsseltes kommt entschlüsselt
  // zurück, alles andere unverändert (auch ältere, noch unverschlüsselt
  // zwischengespeicherte Dateien).
  function laden(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " (HTTP " + r.status + ")");
      return r.arrayBuffer();
    }).then(function (buf) {
      var u = new Uint8Array(buf);
      if (!verschluesselt(u)) return buf;
      if (!schluessel) throw new Error("Nicht angemeldet");
      return entschluesseln(schluessel, u);
    });
  }

  window.ZUGANG = { aktiv: !!KONFIG, laedt: !!KONFIG && KONFIG.modus === "seite", laden: laden };
  if (!KONFIG) return;

  /* ---------------- Schlüssel ---------------------------------------- */
  function ableiten(passwort) {
    return crypto.subtle.importKey("raw", new TextEncoder().encode(passwort), "PBKDF2", false, ["deriveKey"])
      .then(function (basis) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", hash: "SHA-256", salt: b64zuBytes(KONFIG.salz), iterations: KONFIG.iterationen },
          basis, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);
      });
  }
  function passt(key) {
    return entschluesseln(key, b64zuBytes(KONFIG.probe)).then(function (buf) {
      return new TextDecoder().decode(buf) === PROBE_TEXT;
    }, function () { return false; });
  }
  function merken(key) {
    return crypto.subtle.exportKey("raw", key).then(function (roh) {
      try { localStorage.setItem(SPEICHER, bytesZuB64(roh)); } catch (e) { /* ohne Speicher: nächstes Mal erneut anmelden */ }
    });
  }
  function vergessen() {
    try { localStorage.removeItem(SPEICHER); } catch (e) { /* nichts gespeichert */ }
  }
  function gemerkterSchluessel() {
    var roh = null;
    try { roh = localStorage.getItem(SPEICHER); } catch (e) { /* Speicher gesperrt */ }
    if (!roh) return Promise.resolve(null);
    return crypto.subtle.importKey("raw", b64zuBytes(roh), "AES-GCM", true, ["decrypt"]).then(function (key) {
      return passt(key).then(function (ok) {
        if (ok) return key;
        vergessen();
        geaendert = true;
        return null;
      });
    }).catch(function () { vergessen(); return null; });
  }

  /* ---------------- Anmeldefenster ----------------------------------- */
  var haupt = document.getElementById("inhalt");
  document.documentElement.classList.add("zugang-gesperrt");

  function anfrageHinweis() {
    var K = window.KONTAKT || {}, Z = K.zugang || {}, B = K.betreff || {};
    var personen = (Z.personen || []).map(esc);
    var wer = personen.length > 1 ? personen.slice(0, -1).join(", ") + " oder " + personen[personen.length - 1] : personen.join("");
    var mail = Z.email ? '<a href="mailto:' + esc(Z.email) + (B.zugang ? "?subject=" + encodeURIComponent(B.zugang) : "") + '">' + esc(Z.email) + "</a>" : "";
    return '<div class="bw-hinweis"><p><strong>Noch keinen Zugang?</strong> ' +
      (wer ? "Den Zugang schalten " + wer + " frei" : "Zugang anfragen") +
      (mail ? " — Anfrage per E-Mail an " + mail : "") + ".</p></div>";
  }
  function anmeldenZeigen(fokus) {
    document.title = "Anmelden — Azubi Wissen";
    haupt.innerHTML =
      '<section class="zugang" aria-labelledby="zugang-titel">' +
      '<h1 id="zugang-titel">Anmelden</h1>' +
      '<p class="bw-unterzeile">Azubi Wissen ist nur für freigeschaltete Nutzerinnen und Nutzer zugänglich.</p>' +
      (geaendert ? '<div class="bw-hinweis"><p>Das Zugangspasswort wurde geändert. Bitte das neue Passwort eingeben.</p></div>' : "") +
      '<form class="bw-card zugang__formular" novalidate>' +
      '<div class="bw-field"><label for="zugang-passwort">Zugangspasswort</label>' +
      '<input id="zugang-passwort" name="passwort" type="password" autocomplete="current-password" required ' +
      'aria-describedby="zugang-fehler zugang-info"></div>' +
      '<p class="zugang__fehler" id="zugang-fehler" role="alert"></p>' +
      '<button class="bw-btn" type="submit">Anmelden</button>' +
      '<p class="bw-klein bw-leise zugang__info" id="zugang-info">Die Anmeldung bleibt auf diesem Gerät gespeichert — ' +
      "das Passwort ist nur einmal nötig. Abmelden jederzeit über das Menü.</p>" +
      "</form>" +
      anfrageHinweis() +
      "</section>";
    var formular = haupt.querySelector("form");
    var feld = formular.querySelector("input");
    var knopf = formular.querySelector("button");
    var fehler = formular.querySelector(".zugang__fehler");
    formular.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!feld.value) { fehler.textContent = "Bitte das Zugangspasswort eingeben."; feld.focus(); return; }
      knopf.disabled = true;
      knopf.textContent = "Prüfe …";
      fehler.textContent = "";
      ableiten(feld.value).then(function (key) {
        return passt(key).then(function (ok) {
          if (!ok) {
            knopf.disabled = false;
            knopf.textContent = "Anmelden";
            fehler.textContent = "Das Passwort stimmt nicht. Bitte erneut eingeben.";
            feld.select();
            feld.focus();
            return;
          }
          return merken(key).then(function () { return starten(key); });
        });
      }).catch(function () {
        knopf.disabled = false;
        knopf.textContent = "Anmelden";
        fehler.textContent = "Die Anmeldung hat nicht geklappt. Bitte die Seite neu laden und erneut versuchen.";
      });
    });
    if (fokus) feld.focus();
  }
  function rechtlichesZeigen() {
    var K = window.KONTAKT || {};
    document.title = (K.seitenTitel || "Rechtliches & Impressum") + " — Azubi Wissen";
    haupt.innerHTML = '<p class="bw-klein"><a href="#/">← Zur Anmeldung</a></p>' +
      (window.RECHTLICHES ? window.RECHTLICHES.html() : "");
    window.scrollTo(0, 0);
  }
  // Solange gesperrt, gibt es nur zwei Ansichten: Impressum und Anmeldung.
  // Sprungmarken wie #inhalt sind keine Route und lassen alles stehen.
  function gesperrtRendern() {
    var h = location.hash;
    if (h && h.indexOf("#/") !== 0) return;
    if (h === "#/rechtliches") rechtlichesZeigen();
    else if (!haupt.querySelector(".zugang")) anmeldenZeigen(false);
  }
  function ladenZeigen(text) {
    haupt.innerHTML = '<p class="zugang__laden" role="status">' + esc(text) + "</p>";
  }
  function startFehler(e) {
    haupt.innerHTML = '<h1>Anmelden</h1><div class="bw-hinweis bw-hinweis--fehler"><p>Die Inhalte ließen sich nicht laden' +
      (e && e.message ? " (" + esc(e.message) + ")" : "") +
      ". Bitte die Seite neu laden; hilft das nicht, die Verbindung prüfen.</p></div>";
  }

  /* ---------------- Entsperren --------------------------------------- */
  function starten(key) {
    schluessel = key;
    return KONFIG.modus === "datei" ? dokumentStarten(key) : seiteStarten(key);
  }

  // Online-Fassung: Paket laden, entschlüsseln, Skripte in Originalreihenfolge
  // ausführen. app.js wartet auf „zugang:bereit“, damit es erst rendert, wenn
  // auch Assistent und Export geladen sind.
  function seiteStarten(key) {
    ladenZeigen("Inhalte werden entschlüsselt …");
    return fetch(KONFIG.inhalt).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.arrayBuffer();
    }).then(function (buf) {
      return entschluesseln(key, buf);
    }).then(function (buf) {
      var paket = JSON.parse(new TextDecoder().decode(buf));
      window.removeEventListener("hashchange", gesperrtRendern);
      document.documentElement.classList.remove("zugang-gesperrt");
      abmeldenEinbauen();
      haupt.innerHTML = "";
      paket.forEach(function (teil) {
        var s = document.createElement("script");
        s.textContent = teil.code + "\n//# sourceURL=" + teil.datei;
        document.body.appendChild(s);
      });
      window.ZUGANG.laedt = false;
      window.dispatchEvent(new Event("zugang:bereit"));
    }).catch(startFehler);
  }

  // Offline-Datei: das entschlüsselte Dokument ersetzt die Hülle. Die
  // Konfiguration vorher entfernen — sonst hielte sich das Dokument selbst
  // wieder für eine Hülle.
  function dokumentStarten(key) {
    ladenZeigen("Werkzeug wird entschlüsselt …");
    return entschluesseln(key, b64zuBytes(KONFIG.nutzlast)).then(function (buf) {
      var html = new TextDecoder().decode(buf);
      try { delete window.ZUGANG_KONFIG; } catch (e) { window.ZUGANG_KONFIG = undefined; }
      document.open();
      document.write(html);
      document.close();
    }).catch(startFehler);
  }

  function abmeldenEinbauen() {
    var liste = document.querySelector(".bw-nav__links");
    if (!liste || liste.querySelector("[data-abmelden]")) return;
    var li = document.createElement("li");
    li.innerHTML = '<a href="#/" data-abmelden>Abmelden</a>';
    li.firstChild.addEventListener("click", function (ev) {
      ev.preventDefault();
      vergessen();
      location.hash = "#/";
      location.reload();
    });
    liste.appendChild(li);
  }

  /* ---------------- Dateien im Download-Center ------------------------ */
  // Die Dateien unter formulare/ liegen verschlüsselt auf dem Server. Ein
  // Klick lädt sie, entschlüsselt sie und öffnet sie (neuer Tab) bzw. lädt
  // sie mit Originalnamen herunter (Links mit download-Attribut).
  var MIME = { pdf: "application/pdf", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", md: "text/plain;charset=utf-8",
    txt: "text/plain;charset=utf-8" };
  if (KONFIG.modus === "seite") {
    document.addEventListener("click", function (ev) {
      if (!schluessel || ev.defaultPrevented || ev.button !== 0) return;
      var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
      if (!a) return;
      var url = new URL(a.getAttribute("href"), location.href);
      if (url.origin !== location.origin || url.pathname.indexOf("/formulare/") === -1) return;
      ev.preventDefault();
      var name = decodeURIComponent(url.pathname.split("/").pop());
      var typ = MIME[(name.split(".").pop() || "").toLowerCase()] || "application/octet-stream";
      var fenster = a.hasAttribute("download") ? null : window.open("", "_blank");
      laden(url.href).then(function (buf) {
        var adresse = URL.createObjectURL(new Blob([buf], { type: typ }));
        if (fenster) {
          fenster.location.href = adresse;
        } else {
          var x = document.createElement("a");
          x.href = adresse;
          x.download = name;
          document.body.appendChild(x);
          x.click();
          x.remove();
        }
        setTimeout(function () { URL.revokeObjectURL(adresse); }, 60000);
      }).catch(function () {
        if (fenster) fenster.document.body.textContent = "Die Datei ließ sich nicht laden. Bitte erneut versuchen.";
      });
    }, true);
  }

  /* ---------------- Start -------------------------------------------- */
  window.addEventListener("hashchange", gesperrtRendern);
  gemerkterSchluessel().then(function (key) {
    if (key) return starten(key);
    if (location.hash === "#/rechtliches") rechtlichesZeigen();
    else anmeldenZeigen(true);
  });
})();
