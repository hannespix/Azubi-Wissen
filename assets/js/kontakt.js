/* kontakt.js — Anbieter- und Kontaktangaben des Werkzeugs.
 *
 * EINZIGE Quelle für diese Daten: die Rechtliches-Seite (app.js) UND der
 * KI-Assistent (assistent.js) lesen hier — nie an zwei Stellen pflegen.
 * Ändert sich eine Adresse, genügt eine Änderung in dieser Datei.
 *
 * Pflegehinweis: Domain und Schreibweise der Adressen stammen aus dem
 * amtlichen Impressum des Regierungspräsidiums Freiburg
 * (https://rpf.baden-wuerttemberg.de/impressum/) — Schema
 * Vorname.Nachname@rpf.bwl.de. Keine privaten Adressen eintragen.
 */
window.KONTAKT = {
  behoerde: "Regierungspräsidium Freiburg",
  bereich: "Ausbildungsberatung für die grünen Berufe",
  anschrift: "79083 Freiburg im Breisgau",
  telefon: "0761 208-0",

  // Fachlicher Ansprechpartner = Entwicklung und Pflege des Werkzeugs.
  entwickler: {
    name: "Hannes Pix",
    email: "Hannes.Pix@rpf.bwl.de",
    rolle: "Konzeption, Entwicklung und Pflege"
  },
  // Amtlicher Zugang der Behörde (für förmliche Anliegen).
  poststelle: "poststelle@rpf.bwl.de",

  // Betreffzeilen, damit Rückmeldungen zuordenbar ankommen.
  betreff: {
    rueckmeldung: "Ausbildung Grüne Berufe — Rückmeldung",
    barriere: "Ausbildung Grüne Berufe — Barriere melden"
  },

  // Amtliche Seiten der Behörde (verbindlich gegenüber dieser Kurzfassung).
  links: {
    impressum: "https://rpf.baden-wuerttemberg.de/impressum/",
    datenschutz: "https://rpf.baden-wuerttemberg.de/datenschutz/",
    barrierefreiheit: "https://rpf.baden-wuerttemberg.de/erklaerung-zur-barrierefreiheit/"
  },

  // Ziel im Werkzeug, das alle Angaben ausführlich zeigt.
  seite: "#/rechtliches",
  seitenTitel: "Rechtliches & Impressum"
};
