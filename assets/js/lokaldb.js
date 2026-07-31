// lokaldb.js — Lokale Datenbank im Browser (IndexedDB, Fallback localStorage).
// Speichert Nutzerdaten des Werkzeugs: Aktenvermerke, Notizen sowie eigene
// Artikel und Dokumente. Alles bleibt auf diesem Gerät — keine Übertragung,
// funktioniert offline und auch in der Single-File-Auslieferung (file://).
(function () {
  "use strict";
  var DB_NAME = "azubi-wissen";
  var VERSION = 3;
  var STORES = ["vermerke", "notizen", "eigeneArtikel", "eigeneDokumente", "checklisten"];
  var db = null, bereit = null, fallback = false;

  function oeffnen() {
    if (bereit) return bereit;
    bereit = new Promise(function (aufloesen) {
      if (!window.indexedDB) { fallback = true; aufloesen(null); return; }
      var antrag;
      try { antrag = indexedDB.open(DB_NAME, VERSION); }
      catch (e) { fallback = true; aufloesen(null); return; }
      antrag.onupgradeneeded = function () {
        var d = antrag.result;
        STORES.forEach(function (s) {
          if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: "id" });
        });
      };
      antrag.onsuccess = function () { db = antrag.result; aufloesen(db); };
      antrag.onerror = function () { fallback = true; aufloesen(null); };
      antrag.onblocked = function () { fallback = true; aufloesen(null); };
    });
    return bereit;
  }

  // ---- Fallback über localStorage (ein Schlüssel je Store) ----------
  function lsLesen(store) {
    try { return JSON.parse(localStorage.getItem("aw.db." + store) || "{}"); }
    catch (e) { return {}; }
  }
  function lsSchreiben(store, obj) {
    try { localStorage.setItem("aw.db." + store, JSON.stringify(obj)); return true; }
    catch (e) { return false; }
  }

  function speichern(store, wert) {
    return oeffnen().then(function () {
      if (fallback) {
        var alle = lsLesen(store); alle[wert.id] = wert;
        if (!lsSchreiben(store, alle)) {
          return Promise.reject(new Error("Speichern fehlgeschlagen — lokaler Speicher voll (localStorage-Modus). Kleinere Datei wählen oder Sicherung exportieren und Einträge löschen."));
        }
        return wert;
      }
      return new Promise(function (aufloesen, ablehnen) {
        var tx = db.transaction(store, "readwrite");
        tx.objectStore(store).put(wert);
        tx.oncomplete = function () { aufloesen(wert); };
        tx.onerror = function () { ablehnen(tx.error); };
      });
    });
  }

  function holen(store, id) {
    return oeffnen().then(function () {
      if (fallback) return lsLesen(store)[id] || null;
      return new Promise(function (aufloesen) {
        var antrag = db.transaction(store).objectStore(store).get(id);
        antrag.onsuccess = function () { aufloesen(antrag.result || null); };
        antrag.onerror = function () { aufloesen(null); };
      });
    });
  }

  function alle(store) {
    return oeffnen().then(function () {
      if (fallback) {
        var o = lsLesen(store);
        return Object.keys(o).map(function (k) { return o[k]; });
      }
      return new Promise(function (aufloesen) {
        var antrag = db.transaction(store).objectStore(store).getAll();
        antrag.onsuccess = function () { aufloesen(antrag.result || []); };
        antrag.onerror = function () { aufloesen([]); };
      });
    });
  }

  function loeschen(store, id) {
    return oeffnen().then(function () {
      if (fallback) {
        var alle_ = lsLesen(store); delete alle_[id]; lsSchreiben(store, alle_);
        return;
      }
      return new Promise(function (aufloesen) {
        var tx = db.transaction(store, "readwrite");
        tx.objectStore(store).delete(id);
        tx.oncomplete = function () { aufloesen(); };
        tx.onerror = function () { aufloesen(); };
      });
    });
  }

  window.LokalDB = { speichern: speichern, holen: holen, alle: alle, loeschen: loeschen };
})();
