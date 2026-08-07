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
        fussnote: "Gilt für alle grünen Berufe (Beginnjahr zählt). Jährliche Fortschreibung im Bundesanzeiger (§ 17 BBiG). Tarifgebundene Betriebe wenden die Tariftabelle ihrer Sparte an (GaLaBau, Erwerbsgartenbau, Landwirtschaft, Weinbau …); nicht tarifgebundene dürfen höchstens 20 % unter dem Branchentarif bleiben, nie unter der Mindestvergütung.",
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
        fussnote: "Gilt für alle grünen Berufe. Tarifverträge der jeweiligen Sparte geben häufig mehr und rechnen direkt in Arbeitstagen. Urlaub möglichst in die Berufsschulferien legen; für Berufsschultage im Urlaub gibt es Ersatz.",
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
            ["Wiederholung der Abschlussprüfung", "zweimal möglich", "§ 37 Abs. 1 BBiG"],
            ["Klage gegen eine Kündigung", "3 Wochen ab Zugang — vorher ggf. Schlichtungsausschuss", "§ 4 KSchG · § 111 Abs. 2 ArbGG"],
            ["Schadensersatz nach vorzeitiger Beendigung", "innerhalb von 3 Monaten geltend machen", "§ 23 Abs. 2 BBiG"]
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
      { id: "fahrplan", rechner: "fahrplan", titel: "Ausbildungsfahrplan — alle Termine auf einen Blick",
        kurz: "Beginn, Dauer und Probezeit eingeben (Geburtsdatum optional) — der Rechner erstellt die chronologische Terminliste der Ausbildung: Probezeit-Ende, Untersuchungsfristen für Minderjährige, Zwischenprüfung, Meldungen und Vertragsende. Jede Station verlinkt Artikel und Rechtsgrundlage.",
        stichworte: ["fahrplan", "terminplan", "zeitplan", "fristen berechnen", "ausbildungsverlauf", "termine", "kalender"],
        recht: "§§ 20, 21, 43, 48 BBiG · §§ 32, 33 JArbSchG", artikel: ["probezeit", "jugendliche", "abschlusspruefung"], quellen: [] },

      { id: "rechner-noten", rechner: "noten", titel: "Notenrechner — Bestehe ich die Abschlussprüfung?",
        kurz: "Die neun Teilnoten eingeben — der Rechner gewichtet nach der GärtnAusbV (Praxis 60 %, Fächer 40 %), prüft alle Bestehensregeln und zeigt, wann die mündliche Ergänzungsprüfung möglich ist. Orientierung für Beratung und Abschlussklassen; verbindlich wertet der Prüfungsausschuss.",
        stichworte: ["notenrechner", "rechner", "noten berechnen", "bestehen", "durchgefallen", "gewichtung", "ergänzungsprüfung", "schnitt"],
        recht: "§ 9 Abs. 5–7 GärtnAusbV", artikel: ["ap-noten", "abschlusspruefung"], quellen: [] },

      /* ---- Jahreskreis der Ausbildungsberatung (R5) —
             wiederkehrende Orientierungszeiträume; verbindlich sind die
             jährlich veröffentlichten Termine der zuständigen Stelle. ---- */
      { id: "jahreskreis", titel: "Jahreskreis der Ausbildungsberatung — das wiederkehrende Jahr",
        kurz: "Die Fixpunkte und Arbeitsschwerpunkte der Ausbildungsberatung und der zuständigen Stelle im Jahresverlauf: Prüfungsrunden, Schulbesuche, Anerkennungstermine, Gremien und Jahreswechsel-Aufgaben. Zeiträume ohne festes Datum sind als grobe Orientierung markiert — verbindlich sind die jährlich veröffentlichten Termine und Einladungen.",
        stichworte: ["jahreskreis", "jahresplan", "timeline", "jahrestermine", "wiederkehrend", "planung", "aufgabenausschuss", "prueferschulung", "schulbesuch"],
        recht: "§§ 37 ff., 43, 48, 76, 79 BBiG", artikel: ["ausbildungsberatung", "zustaendige-stelle", "abschlusspruefung"], quellen: [],
        jahreskreis: [
          { g: "Prüfungswesen", eintraege: [
            { t: "Anmeldung Sommer-Abschlussprüfung — Schluss 1. April", von: 2, bis: 4, zeit: "Februar–1. April (Fixtermin)",
              info: "**Anmeldeschluss 1. April.** Die Betriebe melden an; die [[abschlusspruefung|Zulassungsvoraussetzungen]] früh gegenchecken (Berichtsheft! Zwischenprüfung! Eintragung!)." },
            { t: "Zwischenprüfungen", von: 2, bis: 4, zeit: "Februar–April",
              info: "[[zwischenpruefung|Zwischenprüfungen]] etwa zur Ausbildungsmitte — Einladung durch die zuständige Stelle; schwache Ergebnisse nachfassen." },
            { t: "Zulassung & Berichtsheftkontrolle", von: 3, bis: 4, zeit: "März–April",
              info: "Zulassungsentscheidung nach § 43 BBiG: [[berichtsheft|Ausbildungsnachweise]], Fehlzeiten und Verträge prüfen; Wackelkandidaten früh ansprechen ([[teilzeit-verkuerzung|Verlängerung]] statt Nichtzulassung)." },
            { t: "Prüferschulungen", von: 3, bis: 5, zeit: "Frühjahr (vor den Prüfungsrunden)",
              info: "Schulung und Berufung der Prüferinnen und Prüfer (§§ 39–40 BBiG) — Neubesetzungen rechtzeitig anstoßen." },
            { t: "Sommer-Abschlussprüfung", von: 6, bis: 8, zeit: "Juni–August",
              info: "Hauptprüfungszeitraum (schriftlich + praktisch). Der Arbeitstag vor der schriftlichen Prüfung ist bezahlt frei ([[freistellung|§ 15 BBiG]])." },
            { t: "Freisprechung & Zeugnisse", von: 7, bis: 9, zeit: "Juli–September",
              info: "Prüfungszeugnisse, Freisprechungsfeiern, [[ende-uebernahme|Übernahmegespräche]] — und Nachvermittlung für Unversorgte." },
            { t: "Anmeldung Winter-Abschlussprüfung — Schluss 1. November", von: 9, bis: 11, zeit: "September–1. November (Fixtermin)",
              info: "**Anmeldeschluss 1. November** für die Winterprüfung — auch für Wiederholende und externe Prüfungsteilnehmende (§ 45 Abs. 2 BBiG)." },
            { t: "Wiederholungs-/Winterprüfungen", von: 11, bis: 1, zeit: "November–Januar (wo angeboten)",
              info: "Wiederholungstermine für [[nichtbestehen|nicht bestandene Prüfungen]] — Verlängerungsverlangen und Anmeldung sicherstellen." },
            { t: "Aufgabenausschüsse", von: 10, bis: 1, zeit: "Oktober–Januar",
              info: "Erstellung und Beschluss der Prüfungsaufgaben für die kommenden Runden — Fachleute aus Betrieben und Schulen wirken mit." }
          ] },
          { g: "Schulen & Klassen", eintraege: [
            { t: "Besuch der Eingangsklassen", von: 9, bis: 11, zeit: "September–November",
              info: "Die Ausbildungsberatung stellt sich in den ersten Klassen vor: Rechte & Pflichten, [[berichtsheft|Berichtsheftführung]], Ansprechwege — der wichtigste Frühkontakt zu den neuen Azubis." },
            { t: "Besuch der Abschlussklassen", von: 1, bis: 3, zeit: "Januar–März",
              info: "In den Abschlussklassen wird die [[abschlusspruefung|Abschlussprüfung]] erklärt: Ablauf, Hilfsmittel, Bewertung, Nachteilsausgleich — rechtzeitig vor der Anmeldefrist." },
            { t: "Schulkooperation & Klassenbildung", von: 7, bis: 10, zeit: "Juli–Oktober",
              info: "Abstimmung mit den [[berufsschulpflicht|Berufsschulen]]: Klassenbildung, Blockpläne, Fahrtwege, Meldung der neuen Ausbildungsverhältnisse." }
          ] },
          { g: "Verträge & Betriebe", eintraege: [
            { t: "Anerkennung neuer Ausbildungsbetriebe", fixe: [{ m: 4, tag: 20 }, { m: 9, tag: 20 }], zeit: "Anträge bis 20. April bzw. 20. September",
              info: "Fixtermine für [[ausbilder|Anerkennungsanträge]]: bis **20. April** (Frühsommertermin) bzw. **20. September** (Herbsttermin) — mit Betriebsbesichtigung einplanen." },
            { t: "Vertrags- & Eintragungswelle", von: 5, bis: 9, zeit: "Mai–September",
              info: "Hauptwelle der neuen Verträge vor Ausbildungsbeginn: [[eintragung|Eintragung]], Vollständigkeit, [[jugendliche|Erstuntersuchungen]], Vergütungs-Check." },
            { t: "Betriebsbesuche & Beratung", von: 10, bis: 2, laufend: true, zeit: "ganzjährig, Schwerpunkt Winterhalbjahr",
              info: "[[ausbildungsberatung|Überwachen & Beraten]] läuft das ganze Jahr — Besuchsschwerpunkte liegen außerhalb der Saisonspitzen." }
          ] },
          { g: "Jahreswechsel", eintraege: [
            { t: "Neue MiAV-Werte & Vergütungscheck", von: 10, bis: 12, fixe: [{ m: 1, tag: 1 }], zeit: "Oktober–Dezember, Anpassung zum 1. Januar",
              info: "Bekanntmachung der neuen [[mindestverguetung|Mindestausbildungsvergütung]] im Bundesanzeiger prüfen; Staffeln und Musterverträge zum Jahreswechsel anpassen." },
            { t: "Berufsbildungsstatistik", von: 1, bis: 3, fixe: [{ m: 12, tag: 31 }], zeit: "Stichtag 31. Dezember, Meldung Januar–März",
              info: "Erhebung zur Berufsbildungsstatistik (§§ 87 ff. BBiG) — Datenbestand der [[zustaendige-stelle|zuständigen Stelle]] zum Stichtag aufbereiten und melden." }
          ] }
        ] },

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
