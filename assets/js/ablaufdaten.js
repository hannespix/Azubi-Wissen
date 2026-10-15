// ablaufdaten.js — Werte und Aussagen mit Ablaufdatum.
//
// Manche Inhalte veralten zu einem bekannten Zeitpunkt: die Mindestausbildungs-
// vergütung gilt je Beginnjahr, das Infoblatt trägt eine Jahreszahl, Prüfungs-
// termine laufen ab. Jeder solche Wert steht hier mit `gueltigBis` und dem Ort,
// an dem er im Werkzeug vorkommt. Die Aktualitätsprüfung
// (tools/aktualitaet_pruefen.py) meldet ihn ABLAUF_VORLAUF_TAGE (60) Tage vor
// Ablauf als „läuft bald ab“ und danach als „abgelaufen“.
//
// Pflege: Ist ein Wert erneuert, `gueltigBis` auf das neue Ende setzen (und
// `wert` nachziehen). Neue zeitgebundene Inhalte gleich hier eintragen.
window.ABLAUFDATEN = {
  stand: "15.10.2026",
  werte: [
    { id: "miav",
      was: "Mindestausbildungsvergütung — Tabelle bis Ausbildungsbeginn 2026",
      wert: "2026: 724,00 € (1. Jahr)",
      gueltigBis: "2026-12-31",
      wo: ["Nachschlag-Karte „verguetung“", "Artikel „mindestverguetung“ (Fakten, Abschnitt, FAQ)",
           "Artikel „fw-geld“"],
      aufgabe: "Wert für Ausbildungsbeginn 2027 eintragen — er wird bis 1. November im Bundesgesetzblatt bekannt gemacht (§ 17 Abs. 2 BBiG); die Staffel +18/+35/+40 % mitrechnen.",
      quelle: "gesetz-bbig" },
    { id: "infoblatt-azubis",
      was: "Infoblatt für Auszubildende 2026",
      wert: "formulare/infoblatt-azubis-2026.pdf",
      gueltigBis: "2026-12-31",
      wo: ["Download-Center", "Vorlage „vertragsunterlagen“ (Anlage)"],
      aufgabe: "Infoblatt des Folgejahres von der Landwirtschaftsverwaltung holen und Quelle `infoblatt-azubi` (Datei, Titel, Stand) umstellen.",
      quelle: "infoblatt-azubi" },
    { id: "ap-winter-2026-2027",
      was: "Termine der gemeinsamen schriftlichen Abschlussprüfung Winter 2026/2027",
      wert: "12./13. Januar 2027, Noteneingang bis 17. Februar 2027",
      gueltigBis: "2027-02-17",
      wo: ["Artikel „abschlusspruefung“ (Abschnitt zur gemeinsamen schriftlichen Prüfung)"],
      aufgabe: "Termine des nächsten Durchgangs aus dem IBBW-Terminplan nachtragen." },
    { id: "goae-jarbsch",
      was: "Hinweis: neue Gebührenordnung für Ärzte „frühestens 2027“ (Jugendarbeitsschutzuntersuchung)",
      wert: "Entwurf 96,90 €, Übergangslösung bis zum Inkrafttreten",
      gueltigBis: "2026-12-31",
      wo: ["Artikel „jugendliche“ (Abschnitt zur Vergütung der Untersuchung)"],
      aufgabe: "Prüfen, ob die neue GOÄ in Kraft ist, und den Abschnitt entsprechend umstellen." },
    { id: "winterpruefung-2027-2028",
      was: "Ankündigung: Winterprüfung wandert ab Schuljahr 2027/2028",
      wert: "neue Lage der Prüfungen Haus- und Landwirtschaft",
      gueltigBis: "2027-07-31",
      wo: ["Artikel „abschlusspruefung“", "app.js: fristFuerTermin() (Anmeldeschluss Winter = 1. November des Vorjahres)"],
      aufgabe: "Text von der Ankündigung auf die geltende Regel umstellen und die Fristberechnung der Vorlagen prüfen." }
  ]
};
