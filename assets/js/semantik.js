// semantik.js — Semantische Suche des Assistenten (K3), komplett lokal.
// Lädt auf Wunsch ein kleines mehrsprachiges Embedding-Modell
// (multilingual-e5-small, quantisiert) aus assets/vendor/semantik/ und
// vergleicht Fragen mit den vorberechneten Embeddings der Wissensbasis
// (assets/daten/semantik-index.json, erzeugt von tools/semantik_index_bauen.mjs).
// Zero-Trust: alle Dateien liegen im Werkzeug, es gibt keinerlei externe
// Requests (env.allowRemoteModels = false); ohne Modell arbeitet der
// Assistent unverändert mit der Stichwortsuche weiter.
(function () {
  "use strict";
  var BASIS = "assets/vendor/semantik/";
  var INDEX_URL = "assets/daten/semantik-index.json";
  var MODELL = "Xenova/multilingual-e5-small";
  // Die ONNX-Datei liegt wegen der GitHub-Dateigrenze (100 MB) in Teilen
  // im Repo und wird beim Laden im Browser wieder zusammengesetzt.
  var TEILE = ["aa", "ab", "ac"];

  var zustand = "aus"; // aus | laedt | bereit | fehler
  var einbetter = null, index = null, ladePromise = null, melden = null;

  function fortschritt(text, anteil) {
    if (melden) try { melden(text, anteil); } catch (e) { /* Anzeige ist optional */ }
  }

  // Die ONNX-Teile einmal laden und zusammensetzen; jede weitere Anfrage
  // (Existenzprüfung, eigentliches Laden) bekommt eine frische Response
  // aus demselben Blob.
  var onnxBlobPromise = null;
  function onnxZusammensetzen(url) {
    if (!onnxBlobPromise) {
      onnxBlobPromise = (function () {
        var puffer = [];
        function teil(i) {
          if (i >= TEILE.length) return Promise.resolve(new Blob(puffer, { type: "application/octet-stream" }));
          return window.fetch(url + ".teil-" + TEILE[i]).then(function (r) {
            if (!r.ok) throw new Error("Modellteil " + TEILE[i] + " fehlt (HTTP " + r.status + ")");
            return r.arrayBuffer();
          }).then(function (b) {
            puffer.push(b);
            fortschritt("Modell laden — Teil " + (i + 1) + " von " + TEILE.length + " …", 0.15 + 0.6 * (i + 1) / TEILE.length);
            return teil(i + 1);
          });
        }
        return teil(0);
      })();
      onnxBlobPromise.catch(function () { onnxBlobPromise = null; });
    }
    return onnxBlobPromise.then(function (blob) {
      return new Response(blob, { status: 200, headers: {
        "Content-Type": "application/octet-stream", "Content-Length": String(blob.size)
      } });
    });
  }

  function ladenIntern() {
    if (window.EINZELDATEI) {
      return Promise.reject(new Error("In der Einzeldatei-Version steht die semantische Suche nicht zur Verfügung — bitte die Ordner-/Serverversion nutzen."));
    }
    fortschritt("Suchindex laden …", 0.03);
    return fetch(INDEX_URL).then(function (r) {
      if (!r.ok) throw new Error("Suchindex fehlt (HTTP " + r.status + ")");
      return r.json();
    }).then(function (idx) {
      if (!idx || idx.format !== "azubi-semantik-index" || !idx.eintraege) {
        throw new Error("Suchindex hat ein unerwartetes Format.");
      }
      index = idx;
      fortschritt("KI-Bibliothek laden …", 0.08);
      // Bewusst das UNminifizierte Bundle: auditierbar (Zero-Trust) und
      // ohne die Zufallszeichenketten der Minifizierung, auf die GitHubs
      // Secret-Scanner fälschlich anschlägt.
      return import(new URL(BASIS + "transformers.js", document.baseURI).href).then(function (lib) {
        var env = lib.env;
        env.allowRemoteModels = false;
        env.allowLocalModels = true;
        // WICHTIG: relativer Pfad. Bei einem absoluten http-Verweis
        // überspringt die Existenzprüfung der Bibliothek (get_file_metadata,
        // Stand 4.2) den lokalen Zweig — der Tokenizer gälte als fehlend.
        env.localModelPath = BASIS + "modell/";
        // Der Service Worker hält die Modelldateien dauerhaft vor —
        // der bibliothekseigene Browser-Cache würde alles doppelt speichern.
        env.useBrowserCache = false;
        // env.fetch ist der Netz-Hook der Bibliothek: Anfragen nach der
        // (gesplitteten) ONNX-Datei beantworten wir zusammengesetzt, alles
        // andere läuft unverändert über den Browser.
        env.fetch = function (eingabe, init) {
          var url = typeof eingabe === "string" ? eingabe : (eingabe && eingabe.url) || String(eingabe);
          if (url.indexOf("model_quantized.onnx") >= 0 && url.indexOf(".teil-") < 0) {
            return onnxZusammensetzen(url);
          }
          return window.fetch(eingabe, init);
        };
        env.useCustomCache = true;
        env.customCache = {
          match: function (schluessel) {
            var url = String((schluessel && schluessel.url) || schluessel);
            if (url.indexOf("model_quantized.onnx") >= 0 && url.indexOf(".teil-") < 0) {
              return onnxZusammensetzen(url);
            }
            return Promise.resolve(undefined);
          },
          put: function () { return Promise.resolve(); }
        };
        env.backends.onnx.wasm.wasmPaths = new URL(BASIS + "ort/", document.baseURI).href;
        env.backends.onnx.wasm.numThreads = 1;
        return lib.pipeline("feature-extraction", MODELL, { dtype: "q8", device: "wasm" });
      });
    }).then(function (pl) {
      einbetter = pl;
      fortschritt("Modell wird vorbereitet …", 0.95);
      // Aufwärmlauf: erste Anfrage kompiliert die WASM-Pfade.
      return pl("query: Start", { pooling: "mean", normalize: true });
    }).then(function () {
      zustand = "bereit";
      fortschritt("Semantische Suche aktiv.", 1);
    });
  }

  function laden() {
    if (zustand === "bereit") return Promise.resolve(true);
    if (!ladePromise) {
      zustand = "laedt";
      ladePromise = ladenIntern().then(function () { return true; }, function (fehler) {
        zustand = "fehler";
        ladePromise = null;
        throw fehler;
      });
    }
    return ladePromise;
  }

  // Frage einbetten und gegen den vorberechneten Index ranken.
  // Liefert die besten Einträge [{typ, id, artikelId, titel, score}] —
  // score ist die Kosinus-Ähnlichkeit (Vektoren sind normalisiert).
  function rang(frage, n) {
    if (zustand !== "bereit") return Promise.resolve(null);
    return einbetter((index.praefixFrage || "query: ") + frage, { pooling: "mean", normalize: true })
      .then(function (aus) {
        var q = aus.data;
        var erg = index.eintraege.map(function (e) {
          var s = 0, v = e.v;
          for (var i = 0; i < v.length; i++) s += v[i] * q[i];
          return { typ: e.typ, id: e.id, artikelId: e.artikelId || e.id, titel: e.titel, score: s };
        });
        erg.sort(function (a, b) { return b.score - a.score; });
        return erg.slice(0, n || 8);
      });
  }

  window.AzubiSemantik = {
    zustand: function () { return zustand; },
    bereit: function () { return zustand === "bereit"; },
    verfuegbar: function () { return !window.EINZELDATEI; },
    laden: laden,
    rang: rang,
    meldung: function (f) { melden = f || null; }
  };
})();
