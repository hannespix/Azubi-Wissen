// nachschlag.js — Schnellnachschlag: kompakte Tabellen und Karten für den
// Beratungsalltag (Vergütung, Urlaub, Fristen, Arbeitszeit, Fachrichtungen).
// Werte gepflegt aus der Wissensbasis (wissen.js) — bei Änderungen dort
// auch hier nachziehen. Stand-Datum unten.
(function () {
  "use strict";

  window.NACHSCHLAG = {
    stand: "31.07.2026",
    hinweis: "Schnellnachschlag für die Beratung — Details und Rechtsgrundlagen stehen im verlinkten Artikel.",
    karten: [

      { id: "verguetung", titel: "Mindestausbildungsvergütung (brutto/Monat)",
        kurz: "Maßgeblich ist das Jahr des Ausbildungsbeginns; Aufschläge +18/+35/+40 % auf den Startwert. Tarifverträge (z. B. Gartenbau/GaLaBau) liegen meist darüber.",
        stichworte: ["mindestverguetung", "verguetung", "tarif", "tariftabelle", "gehalt", "lohn", "miav", "ausbildungsverguetung"],
        tabelle: {
          spalten: ["Ausbildungsbeginn", "1. Jahr", "2. Jahr (+18 %)", "3. Jahr (+35 %)", "4. Jahr (+40 %)"],
          zeilen: [
            ["2024", "649,00 €", "765,82 €", "876,15 €", "908,60 €"],
            ["2025", "682,00 €", "804,76 €", "920,70 €", "954,80 €"],
            ["2026", "724,00 €", "854,32 €", "977,40 €", "1.013,60 €"]
          ],
          markiereZeile: 2
        },
        fussnote: "Jährliche Fortschreibung im Bundesanzeiger (§ 17 BBiG). Tarifgebundene Betriebe: Tariftabelle anwenden; nicht tarifgebundene dürfen höchstens 20 % unter Branchentarif bleiben, nie unter der Mindestvergütung.",
        recht: "§ 17 BBiG", artikel: ["mindestverguetung"], quellen: ["verguetung-tabelle"] },

      { id: "urlaub", titel: "Urlaubsanspruch nach Alter",
        kurz: "Es zählt das Alter am 1. Januar des Kalenderjahres. Gesetz rechnet in Werktagen (Mo–Sa): 24 Werktage = 4 Wochen = 20 Arbeitstage bei 5-Tage-Woche.",
        stichworte: ["urlaub", "urlaubstabelle", "urlaubsanspruch", "werktage", "arbeitstage", "ferien", "jarbschg", "burlg"],
        tabelle: {
          spalten: ["Alter am 1. Januar", "Mindestanspruch", "entspricht (5-Tage-Woche)", "Grundlage"],
          zeilen: [
            ["unter 16", "30 Werktage", "25 Arbeitstage", "§ 19 JArbSchG"],
            ["unter 17", "27 Werktage", "22,5 → 23 Arbeitstage", "§ 19 JArbSchG"],
            ["unter 18", "25 Werktage", "21 Arbeitstage", "§ 19 JArbSchG"],
            ["18 und älter", "24 Werktage", "20 Arbeitstage", "§ 3 BUrlG"]
          ]
        },
        fussnote: "Tarifverträge geben häufig mehr und rechnen direkt in Arbeitstagen. Urlaub möglichst in die Berufsschulferien legen; für Berufsschultage im Urlaub gibt es Ersatz.",
        recht: "§ 19 JArbSchG · § 3 BUrlG", artikel: ["urlaub"], quellen: ["urlaub-erwerbsgartenbau", "urlaub-galabau"] },

      { id: "fristen", titel: "Probezeit, Kündigung & wichtige Fristen",
        kurz: "Die wichtigsten Fristen im Ausbildungsverhältnis auf einen Blick.",
        stichworte: ["probezeit", "kuendigung", "fristen", "verlaengerung", "eintragung", "aufhebung", "frist"],
        tabelle: {
          spalten: ["Was", "Frist/Regel", "Grundlage"],
          zeilen: [
            ["Probezeit", "mindestens 1, höchstens 4 Monate", "§ 20 BBiG"],
            ["Kündigung in der Probezeit", "jederzeit, fristlos, ohne Grund — schriftlich", "§ 22 Abs. 1 BBiG"],
            ["Kündigung danach (Betrieb)", "nur fristlos aus wichtigem Grund, binnen 2 Wochen ab Kenntnis", "§ 22 Abs. 2 Nr. 1 BBiG"],
            ["Kündigung danach (Azubi)", "fristlos aus wichtigem Grund oder mit 4 Wochen bei Berufsaufgabe/-wechsel", "§ 22 Abs. 2 BBiG"],
            ["Vertrag & Eintragung", "vor Beginn schriftlich niederlegen, unverzüglich Eintragung beantragen", "§§ 10, 11, 36 BBiG"],
            ["Nicht bestandene Abschlussprüfung", "auf Verlangen Verlängerung bis zur nächsten Wiederholungsprüfung, max. 1 Jahr", "§ 21 Abs. 3 BBiG"],
            ["Wiederholung der Abschlussprüfung", "zweimal möglich", "§ 37 Abs. 1 BBiG"]
          ]
        },
        fussnote: "Aufhebungsvertrag ist jederzeit einvernehmlich möglich — vor Unterschrift zur Beratung raten (Folgen für ALG/Förderung).",
        recht: "§§ 20–23, 37 BBiG", artikel: ["probezeit", "kuendigung", "nichtbestehen"], quellen: [] },

      { id: "arbeitszeit", titel: "Arbeitszeit: Jugendliche vs. Erwachsene",
        kurz: "Unter 18 gilt das Jugendarbeitsschutzgesetz, ab 18 das Arbeitszeitgesetz — mit Ausnahmen für die Landwirtschaft (einschließlich Gartenbau).",
        stichworte: ["arbeitszeit", "pausen", "ruhezeit", "ueberstunden", "nachtruhe", "wochenende", "jugendliche", "samstag"],
        tabelle: {
          spalten: ["", "Jugendliche (unter 18)", "Erwachsene (ab 18)"],
          zeilen: [
            ["Höchstarbeitszeit", "8 h/Tag · 40 h/Woche · 5-Tage-Woche", "8 h werktäglich, bis 10 h mit Ausgleich"],
            ["Landwirtschafts-Ausnahme", "Erntezeit, über 16: bis 9 h/Tag, 85 h/Doppelwoche", "Saisonspitzen über Ausgleichszeitraum"],
            ["Pausen", "30 min ab 4,5 h · 60 min ab 6 h", "30 min ab 6 h · 45 min ab 9 h"],
            ["Ruhezeit", "mindestens 12 h", "mindestens 11 h"],
            ["Nachtruhe", "20–6 Uhr; Landwirtschaft über 16: ab 5 oder bis 21 Uhr", "keine generelle Nachtruhe"],
            ["Berufsschultag", "vor Unterricht ab 9 Uhr keine Beschäftigung; Anrechnung mit Wegezeit", "Freistellung + Anrechnung (§ 15 BBiG)"]
          ]
        },
        fussnote: "Überstunden sind für Azubis die Ausnahme, gesondert zu vergüten oder in Freizeit auszugleichen; für Jugendliche gilt zwingend der Ausgleich.",
        recht: "§§ 8–16 JArbSchG · §§ 3–5 ArbZG · § 15 BBiG", artikel: ["arbeitszeit-jugendliche", "arbeitszeit-erwachsene", "ueberstunden"], quellen: [] },

      /* ---- Interaktive Rechner (R4) — Logik in app.js ---- */
      { id: "rechner-urlaub", rechner: "urlaub", titel: "Urlaubsrechner — Anspruch nach Alter",
        kurz: "Geburtsdatum eingeben, Anspruch ablesen: Werktage nach JArbSchG/BUrlG und Arbeitstage bei 5-Tage-Woche. Es zählt das Alter am 1. Januar des Urlaubsjahres.",
        stichworte: ["urlaubsrechner", "rechner", "urlaub berechnen", "urlaubstage", "alter"],
        recht: "§ 19 JArbSchG · § 3 BUrlG", artikel: ["urlaub"], quellen: [] },
      { id: "rechner-verguetung", rechner: "verguetung", titel: "Vergütungsrechner — Mindestvergütung",
        kurz: "Beginnjahr und Ausbildungsjahr wählen — die gesetzliche Mindestvergütung erscheint sofort. Tarifverträge liegen meist darüber.",
        stichworte: ["vergütungsrechner", "rechner", "verguetung berechnen", "mindestverguetung", "gehalt"],
        recht: "§ 17 BBiG", artikel: ["mindestverguetung"], quellen: [] },
      { id: "rechner-fristen", rechner: "fristen", titel: "Fristenrechner — Probezeit & Verlängerung",
        kurz: "Ausbildungsbeginn und Probezeitlänge eingeben — Probezeit-Ende ablesen. Zusätzlich: spätestes Vertragsende nach nicht bestandener Abschlussprüfung (§ 21 Abs. 3 BBiG).",
        stichworte: ["fristenrechner", "rechner", "probezeit berechnen", "probezeitende", "verlaengerung"],
        recht: "§ 20 BBiG · § 21 Abs. 3 BBiG", artikel: ["probezeit", "nichtbestehen"], quellen: [] },
      { id: "rechner-teilzeit", rechner: "teilzeit", titel: "Teilzeitrechner — Gesamtdauer",
        kurz: "Reguläre Dauer und Teilzeitanteil wählen — die verlängerte Gesamtdauer nach § 7a BBiG erscheint sofort (Verlängerung höchstens auf das Anderthalbfache).",
        stichworte: ["teilzeitrechner", "rechner", "teilzeit berechnen", "dauer", "verlaengerung teilzeit"],
        recht: "§ 7a BBiG", artikel: ["teilzeit-verkuerzung"], quellen: [] },

      { id: "fachrichtungen", titel: "Die 7 Fachrichtungen im Gartenbau — Eigenheiten",
        kurz: "Gärtner/in wird in sieben Fachrichtungen ausgebildet (GärtnAusbV); die Fachwerker-Ausbildung (§ 66 BBiG) gibt es in denselben Bereichen. Betrieblicher Ausbildungsplan je Fachrichtung im Download-Center.",
        stichworte: ["fachrichtung", "fachrichtungen", "baumschule", "friedhofsgaertnerei", "galabau", "garten- und landschaftsbau", "gemuesebau", "obstbau", "staudengaertnerei", "zierpflanzenbau", "eigenheiten"],
        liste: [
          { t: "Baumschule", text: "Anzucht und Kultur von Gehölzen (Bäume, Sträucher, Rosen, Obstgehölze) im Freiland und Container; Veredeln, Schnitt, Verkauf und Beratung. Saisonspitzen im Frühjahr/Herbst.", quelle: "plan-gaertner-baumschule" },
          { t: "Friedhofsgärtnerei", text: "Grabgestaltung, -bepflanzung und -pflege im Jahreslauf, Trauerbinderei, viel direkter Kundenkontakt mit Einfühlungsvermögen; Wechselflor zu festen Terminen.", quelle: "plan-gaertner-friedhofsgaertnerei" },
          { t: "Garten- und Landschaftsbau", text: "„Bauen mit Grün“: Wege, Mauern, Teiche, Pflanzungen, Rasen; Baustellenorganisation, Maschinen- und Geräteeinsatz, körperlich fordernd; beschäftigungsstärkste Fachrichtung mit eigenem Tarifwerk.", quelle: "plan-gaertner-galabau" },
          { t: "Gemüsebau", text: "Anbau von Gemüsekulturen in Freiland und Gewächshaus: Aussaat bis Ernte, Kulturführung, Pflanzenschutz, Aufbereitung und Vermarktung (Direktvermarktung oder Handel).", quelle: "plan-gaertner-gemuesebau" },
          { t: "Obstbau", text: "Obstanlagen mit Kern-, Stein- und Beerenobst: Pflanzung, Schnitt, Behang- und Qualitätsregulierung, Ernte, Lagerung (CA-Lager) und Vermarktung; stark saisongeprägt.", quelle: "plan-gaertner-obstbau" },
          { t: "Staudengärtnerei", text: "Vermehrung und Kultur winterharter Stauden; großes Sortiment und Artenkenntnis, Verwendung nach Lebensbereichen, Beratung für Handel und Endkunden.", quelle: "plan-gaertner-staudengaertnerei" },
          { t: "Zierpflanzenbau", text: "Topf-, Beet- und Balkonpflanzen sowie Schnittblumen unter Glas: Klimasteuerung, Bewässerung/Düngung, Kulturplanung auf Termin (z. B. Feiertage), Verkauf.", quelle: "plan-gaertner-zierpflanzenbau" }
        ],
        fussnote: "Zwischen- und Abschlussprüfung enthalten fachrichtungsspezifische Aufgaben; Pflanzenkenntnisse (Pflanzenlisten) unterscheiden sich je Fachrichtung.",
        recht: "GärtnAusbV · § 66 BBiG", artikel: ["fw-grundlagen"], quellen: ["gesetz-gaertnausbv", "pflanzenlisten"] }
    ]
  };
})();
