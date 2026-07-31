// sw.js — Service Worker für Azubi-Wissen (PWA).
// Cacht ausschließlich eigene Dateien desselben Ursprungs — keine externen
// Requests (Zero-Trust). Strategie: Kern-Dateien werden bei der Installation
// vorgeladen; danach „Cache zuerst, Netz im Hintergrund" (stale-while-
// revalidate), damit die App offline läuft und Updates beim nächsten Besuch
// ankommen. Formulare/PDFs wandern beim ersten Abruf in den Cache.
/* eslint-env serviceworker */
var CACHE = "azubi-wissen-kern";
var KERN = [
  "./",
  "./index.html",
  "./bw-theme.css",
  "./site.webmanifest",
  "./assets/css/app.css",
  "./assets/js/nav.js",
  "./assets/js/search.js",
  "./assets/js/wissen.js",
  "./assets/js/quellen.js",
  "./assets/js/vorlagen.js",
  "./assets/js/nachschlag.js",
  "./assets/js/checklisten.js",
  "./assets/js/glossar.js",
  "./assets/js/lokaldb.js",
  "./assets/js/app.js",
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
  "./assets/favicons/favicon-16x16.png",
  "./assets/favicons/favicon-32x32.png",
  "./assets/favicons/apple-touch-icon.png",
  "./assets/favicons/android-chrome-192x192.png",
  "./assets/favicons/android-chrome-512x512.png"
];

self.addEventListener("install", function (ereignis) {
  ereignis.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(KERN); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (ereignis) {
  ereignis.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen.map(function (n) {
        return n === CACHE ? Promise.resolve() : caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (ereignis) {
  var anfrage = ereignis.request;
  if (anfrage.method !== "GET") return;
  var url = new URL(anfrage.url);
  if (url.origin !== self.location.origin) return; // nie fremde Ursprünge

  ereignis.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(anfrage).then(function (imCache) {
        var vomNetz = fetch(anfrage).then(function (antwort) {
          if (antwort && antwort.ok) cache.put(anfrage, antwort.clone());
          return antwort;
        }).catch(function () {
          if (imCache) return imCache;
          if (anfrage.mode === "navigate") return cache.match("./index.html");
          return new Response("Offline — Datei ist noch nicht im Cache.", {
            status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        });
        return imCache || vomNetz;
      });
    })
  );
});
