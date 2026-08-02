// sw.js — Service Worker für Azubi-Wissen (PWA).
// Cacht ausschließlich eigene Dateien desselben Ursprungs — keine externen
// Requests (Zero-Trust).
//
// Update-Modell (App-Shell): Der Kern (HTML, CSS, JS, Fonts, Logos) liegt
// vollständig in EINEM versionierten Cache. Jede Auslieferung erhält beim
// Pages-Deploy eine neue VERSION → neuer Service Worker → Installation lädt
// den kompletten neuen Stand, Aktivierung löscht den alten. So ist jeder
// Seitenaufbau in sich konsistent — nie mehr altes HTML mit neuen Skripten
// (das ließ die Startseite sporadisch leer erscheinen).
// Formulare/PDFs wandern beim ersten Abruf in einen dauerhaften Datei-Cache.
/* eslint-env serviceworker */
var VERSION = "dev-lokal"; // wird beim Pages-Deploy durch den Commit-Stand ersetzt
var KERN_CACHE = "azubi-wissen-kern-" + VERSION;
var DATEI_CACHE = "azubi-wissen-dateien";
var KERN = [
  "./",
  "./index.html",
  "./bw-theme.css",
  "./site.webmanifest",
  "./assets/css/app.css",
  "./assets/js/nav.js",
  "./assets/js/search.js",
  "./assets/js/wissen.js",
  "./assets/js/berufe.js",
  "./assets/js/quellen.js",
  "./assets/js/vorlagen.js",
  "./assets/js/nachschlag.js",
  "./assets/js/checklisten.js",
  "./assets/js/glossar.js",
  "./assets/js/lokaldb.js",
  "./assets/js/app.js",
  "./assets/js/module.js",
  "./assets/js/semantik.js",
  "./assets/js/assistent.js",
  "./assets/js/export.js",
  "./assets/fonts/BaWueSansWeb-Regular.woff2",
  "./assets/fonts/BaWueSansWeb-RegularItalic.woff2",
  "./assets/fonts/BaWueSansWeb-SemiBold.woff2",
  "./assets/fonts/BaWueSansWeb-Bold.woff2",
  "./assets/fonts/BaWueSerifWeb-Regular.woff2",
  "./assets/fonts/BaWueSerifWeb-Bold.woff2",
  "./assets/logo/rpf-logo.png",
  "./assets/logo/rpf-logo-negativ.png",
  "./assets/favicons/favicon.ico",
  "./assets/favicons/icon.svg",
  "./assets/favicons/favicon-16x16.png",
  "./assets/favicons/favicon-32x32.png",
  "./assets/favicons/apple-touch-icon.png",
  "./assets/favicons/android-chrome-192x192.png",
  "./assets/favicons/android-chrome-512x512.png"
];

self.addEventListener("install", function (ereignis) {
  ereignis.waitUntil(
    caches.open(KERN_CACHE).then(function (cache) { return cache.addAll(KERN); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (ereignis) {
  ereignis.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen.map(function (n) {
        return (n === KERN_CACHE || n === DATEI_CACHE) ? Promise.resolve() : caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function offlineAntwort() {
  return new Response("Offline — Datei ist noch nicht im Cache.", {
    status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

self.addEventListener("fetch", function (ereignis) {
  var anfrage = ereignis.request;
  if (anfrage.method !== "GET") return;
  var url = new URL(anfrage.url);
  if (url.origin !== self.location.origin) return; // nie fremde Ursprünge

  // Formulare/PDFs und die großen Dateien der semantischen Suche (Modell,
  // WASM — zusammen ≈ 150 MB): dauerhafter Datei-Cache, beim ersten Abruf
  // befüllt. Bewusst NICHT im versionierten Kern-Cache — sie sind stabil
  // und sollen ein App-Update ohne erneuten Download überstehen.
  if (url.pathname.indexOf("/formulare/") !== -1 ||
      url.pathname.indexOf("/assets/vendor/semantik/") !== -1) {
    ereignis.respondWith(
      caches.open(DATEI_CACHE).then(function (cache) {
        return cache.match(anfrage).then(function (imCache) {
          if (imCache) return imCache;
          return fetch(anfrage).then(function (antwort) {
            if (antwort && antwort.ok) cache.put(anfrage, antwort.clone());
            return antwort;
          }).catch(offlineAntwort);
        });
      })
    );
    return;
  }

  // Kern (App-Shell): konsistent aus dem versionierten Cache; Navigationen
  // fallen offline auf die gecachte index.html zurück.
  ereignis.respondWith(
    caches.open(KERN_CACHE).then(function (cache) {
      return cache.match(anfrage, { ignoreSearch: anfrage.mode === "navigate" }).then(function (imCache) {
        if (imCache) return imCache;
        return fetch(anfrage).then(function (antwort) {
          if (antwort && antwort.ok) cache.put(anfrage, antwort.clone());
          return antwort;
        }).catch(function () {
          if (anfrage.mode === "navigate") return cache.match("./index.html");
          return offlineAntwort();
        });
      });
    })
  );
});
