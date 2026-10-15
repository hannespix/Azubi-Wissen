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
 * Anschrift und Strukturdaten entsprechen dem Impressum von pix-el.de.
 */
window.KONTAKT = {
  anbieter: "Hannes Pix",
  einordnung: "privat entwickeltes Fachwerkzeug — kein amtliches Angebot",
  // Anbieterangaben nach § 5 DDG — übernommen aus dem Impressum der
  // Projektseite pix-el.de (dort bereits veröffentlicht).
  anschrift: ["Eisenbahnstraße 19", "79241 Ihringen am Kaiserstuhl", "Deutschland"],
  web: "https://pix-el.de",
  webName: "pix-el.de",

  // Entwicklung und Pflege des Werkzeugs.
  entwickler: {
    name: "Hannes Pix",
    email: "azubiwissen@pix-el.de",
    rolle: "Konzeption, Entwicklung und Pflege"
  },

  // Öffentlicher Kontakt- und Rückmeldeweg (Issues im Quell-Repository).
  github: "https://github.com/hannespix/Azubi-Wissen",

  // Zugang zur passwortgeschützten Online-Fassung (S48): Das Anmeldefenster
  // (zugang.js) nennt diese Personen und diese Adresse für Zugangsanfragen.
  // Namen auf Wunsch von Hannes Pix (10/2026); eine gemeinsame Adresse statt
  // dienstlicher Postfächer.
  zugang: {
    personen: ["Hannes Pix", "Christoph Zilz"],
    email: "azubiwissen@pix-el.de"
  },

  // Betreffzeilen, damit Rückmeldungen zuordenbar ankommen.
  betreff: {
    rueckmeldung: "Azubi Wissen — Rückmeldung",
    barriere: "Azubi Wissen — Barriere melden",
    zugang: "Azubi Wissen — Zugang anfragen"
  },

  // Ziel im Werkzeug, das alle Angaben ausführlich zeigt.
  seite: "#/rechtliches",
  seitenTitel: "Rechtliches & Impressum"
};
