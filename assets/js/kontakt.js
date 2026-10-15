/* kontakt.js — Anbieter- und Kontaktangaben des Werkzeugs.
 *
 * EINZIGE Quelle für diese Daten: die Rechtliches-Seite (app.js) UND der
 * KI-Assistent (assistent.js) lesen hier — nie an zwei Stellen pflegen.
 * Ändert sich eine Angabe, genügt eine Änderung in dieser Datei.
 *
 * WICHTIG (seit 10/2026): Verantwortlich für das Werkzeug ist Hannes Pix
 * persönlich. Behörden (Regierungspräsidium, Verwaltung) werden hier NICHT
 * als Anbieter genannt — das Werkzeug ist kein amtliches Angebot. Deshalb
 * auch keine dienstlichen E-Mail-Adressen oder Behörden-Links eintragen.
 */
window.KONTAKT = {
  anbieter: "Hannes Pix",
  einordnung: "privat entwickeltes Fachwerkzeug — kein amtliches Angebot",

  // Entwicklung und Pflege des Werkzeugs.
  entwickler: {
    name: "Hannes Pix",
    // E-Mail bewusst leer: Welche Adresse öffentlich im Impressum stehen
    // soll, entscheidet der Anbieter. Bis dahin läuft Kontakt über GitHub.
    email: "",
    rolle: "Konzeption, Entwicklung und Pflege"
  },

  // Öffentlicher Kontakt- und Rückmeldeweg (Issues im Quell-Repository).
  github: "https://github.com/hannespix/Azubi-Wissen",

  // Betreffzeilen, damit Rückmeldungen zuordenbar ankommen.
  betreff: {
    rueckmeldung: "Azubi Wissen — Rückmeldung",
    barriere: "Azubi Wissen — Barriere melden"
  },

  // Ziel im Werkzeug, das alle Angaben ausführlich zeigt.
  seite: "#/rechtliches",
  seitenTitel: "Rechtliches & Impressum"
};
