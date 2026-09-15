// checklisten.js — Interaktive Checklisten für den Beratungsalltag.
// Fachliche Grundlage: Handreichung „Fachwerkerausbildung im Gartenbau“
// (RP Freiburg, Netzwerkfassung 1.2, Stand 31.07.2026) sowie die
// Wissensbasis (wissen.js). Der Abhak-Stand wird lokal gespeichert
// (IndexedDB) — eine Checkliste je Vorgang abarbeiten, drucken/ablegen,
// dann zurücksetzen.
(function () {
  "use strict";

  window.CHECKLISTEN = {
    stand: "15.09.2026",
    hinweis: "Checklisten sind Arbeitshilfen der Ausbildungsberatung — sie ersetzen keine Einzelfallprüfung.",
    listen: [

      { id: "erstberatung-fachwerker",
        titel: "Erstberatung Fachwerkerausbildung",
        kurz: "Vom Anlass bis zur Startkonferenz — die zwölf Schritte mit den vier Stopppunkten aus der Handreichung.",
        stichworte: ["fachwerker", "erstberatung", "eignung", "reha", "stopppunkte", "66"],
        artikel: ["fw-weg", "fw-grundlagen", "fw-modelle"],
        gruppen: [
          { t: "Klärung vor der Modellwahl", punkte: [
            { t: "Anlass geklärt — keine vorschnelle Festlegung auf § 66", h: "Erst prüfen, ob der Regelberuf erreichbar ist." },
            { t: "Regelberuf geprüft ([[foerderung|Nachteilsausgleich, Teilzeit, Assistierte Ausbildung]])" },
            { t: "Reha-Zugang hergestellt (Berufsberatung/Reha-Beratung, Teilhabeantrag)" },
            { t: "Eignung diagnostisch geklärt (Praktika, Erprobungen, Stellungnahmen)" },
            { t: "Schriftliches Eignungsergebnis liegt vor — möglichst mit Fachrichtung", h: "Stopppunkt: ohne schriftliches Ergebnis keine Eintragung (§ 3 GBFWVO)." }
          ] },
          { t: "Modell, Lernorte, Finanzierung", punkte: [
            { t: "Ausbildungsmodell gewählt ([[fw-modelle|betrieblich, begleitet, kooperativ, integrativ, BBW]])" },
            { t: "Ausbildungsplatz gesichert und Berufsschule geklärt (Kapazität, Fahrt/Internat)", h: "Stopppunkt: kein gesicherter Ausbildungsplatz." },
            { t: "Betriebliche Eignung geprüft (Anerkennung, Ausbilderqualifikation, ReZA/Kooperation)", h: "Stopppunkt: ReZA/Unterstützung ungeklärt." },
            { t: "Finanzierung verbindlich geklärt (Vergütung, Zuschüsse, Ausbildungsgeld, Fahrt, Lernmittel)", h: "Stopppunkt: Finanzierung nur „in Aussicht“." }
          ] },
          { t: "Vertrag & Start", punkte: [
            { t: "Vertrag korrekt erstellt (Berufsbezeichnung, Fachrichtung, ggf. Teilzeit)" },
            { t: "Vertrag vor Ausbildungsbeginn eingereicht, Eintragung erfolgt" },
            { t: "Startkonferenz terminiert (Ansprechpersonen, Förderplan, Krisenwege, Prüfungsvorbereitung)" }
          ] }
        ] },

      { id: "eintragung",
        titel: "Vertragsprüfung & Eintragung (BAV)",
        kurz: "Eingehenden Berufsausbildungsvertrag vollständig prüfen und eintragen — Unterlagen, Inhalt, Abschluss.",
        stichworte: ["vertrag", "eintragung", "bav", "pruefung vertrag", "verzeichnis"],
        artikel: ["ausbildungsvertrag", "eintragung", "mindestverguetung", "urlaub"],
        gruppen: [
          { t: "Unterlagen vollständig", punkte: [
            { t: "BAV von allen Parteien unterschrieben (bei Minderjährigen: gesetzliche Vertretung)" },
            { t: "Betrieblicher Ausbildungsplan beigefügt (richtige Fachrichtung)" },
            { t: "Eignung von Ausbildungsstätte und Ausbilder/in liegt vor bzw. ist anerkannt" },
            { t: "Ärztliche Erstuntersuchung bei Jugendlichen (§ 32 JArbSchG) nachgewiesen" },
            { t: "Bei § 66: schriftliches Eignungsergebnis des Reha-Trägers beigefügt" }
          ] },
          { t: "Inhalt geprüft", punkte: [
            { t: "Berufsbezeichnung und Fachrichtung korrekt (inkl. Teilzeit-Angaben)" },
            { t: "Ausbildungsdauer, Anrechnung oder Verkürzung plausibel und belegt" },
            { t: "Probezeit zwischen 1 und 4 Monaten (§ 20 BBiG)" },
            { t: "Vergütung mindestens Mindestvergütung bzw. Tarif (80-%-Regel beachten)", h: "Werte: Schnellnachschlag → Mindestausbildungsvergütung." },
            { t: "Urlaub mindestens gesetzlich nach Alter (JArbSchG/BUrlG)", h: "Werte: Schnellnachschlag → Urlaubsanspruch nach Alter." },
            { t: "Arbeitszeitregelung zulässig (JArbSchG bzw. ArbZG)" }
          ] },
          { t: "Abschluss", punkte: [
            { t: "Vertrag ins Verzeichnis eingetragen" },
            { t: "Berufsschulanmeldung angestoßen bzw. nachgewiesen" },
            { t: "Eintragungsbestätigung an Betrieb (und ggf. gesetzliche Vertretung) versandt" }
          ] }
        ] },

      { id: "einstiegsqualifizierung",
        titel: "Einstiegsqualifizierung prüfen (§ 54a SGB III)",
        kurz: "Für Anzeige, Registrierung und die Einschätzung, die die Agentur für Arbeit im Zweifelsfall anfordert — der Maßstab ist die Durchführbarkeit, nicht die Anerkennung.",
        stichworte: ["eq", "einstiegsqualifizierung", "54a", "praktikum", "anzeige", "einschätzung"],
        artikel: ["einstiegsqualifizierung", "ausbildungsvertrag", "foerderung"],
        gruppen: [
          { t: "Was für eine Maßnahme ist es?", punkte: [
            { t: "Geförderte EQ nach § 54a SGB III — oder nur ein Praktikum?", h: "Entscheidet alles Weitere: Bei nicht geförderter Berufsausbildungsvorbereitung gelten §§ 27–33 BBiG über § 68 Abs. 2 BBiG entsprechend." },
            { t: "Agentur für Arbeit bzw. Leistungsträger eingebunden", h: "Über die Förderung und den förderfähigen Personenkreis entscheidet die Agentur, nicht die zuständige Stelle." },
            { t: "Zielberuf und Fachrichtung festgelegt (Gärtner/in — welche Fachrichtung?)" },
            { t: "Bei Menschen mit Behinderungen: Vorbereitung auf [[fw-grundlagen|§ 66 BBiG]] geprüft", h: "§ 54a Abs. 2 SGB III lässt das ausdrücklich zu." }
          ] },
          { t: "Formale Voraussetzungen", punkte: [
            { t: "EQ-Vertrag vollständig und 3-fach vorgelegt" },
            { t: "Dauer 4 bis 12 Monate" },
            { t: "Vollzeit oder mindestens 20 Wochenstunden" },
            { t: "Mindestens 70 % der Gesamtzeit im Betrieb" },
            { t: "Verantwortliche Praktikumsleitung namentlich benannt" },
            { t: "Mindestens drei Qualifizierungsbausteine angekreuzt", h: "Je Fachrichtung eigenes Formular (GaLaBau, Obstbau, Zierpflanzenbau)." },
            { t: "Vertrag im Verzeichnis der Praktikantenverhältnisse eingetragen", h: "Die Registrierung ist keine Anerkennung als Ausbildungsstätte." }
          ] },
          { t: "Fachliche Einschätzung — Durchführbarkeit", punkte: [
            { t: "NICHT zu prüfen: Anerkennung der Ausbildungsstätte und Ausbildereignung", h: "Die Eignung nach §§ 27–33 BBiG ist keine Fördervoraussetzung (Fachliche Weisungen der BA, 54a.11)." },
            { t: "Kann der Betrieb die angekreuzten Bausteine tatsächlich vermitteln?" },
            { t: "Passen die betrieblichen Tätigkeiten fachlich zum Zielberuf?" },
            { t: "Wer leitet im Alltag an — Qualifikation oder Berufserfahrung geklärt?" },
            { t: "Keine Substitution: Hat der Betrieb Ausbildungsplätze durch EQ-Plätze ersetzt?", h: "Bei Anhaltspunkten festhalten — die Agentur lehnt den Antrag dann ab." }
          ] },
          { t: "Schule, Schutz und Abschluss", punkte: [
            { t: "Berufsschulpflicht geklärt, Fachklassenbesuch angestrebt", h: "Erleichtert den Übergang und eine spätere Verkürzung." },
            { t: "Bei Minderjährigen: [[arbeitszeit-jugendliche|Jugendarbeitsschutz]] beachtet" },
            { t: "Betriebliches Zeugnis am Ende vereinbart" },
            { t: "Auf die Antragstellung für das Zertifikat hingewiesen", h: "Die zuständige Stelle stellt es nur auf Antrag aus — gegen Vorlage des Zeugnisses." },
            { t: "Anschluss geplant: Anerkennung des Betriebs und Ausbildereignung rechtzeitig klären" },
            { t: "Verkürzung gewünscht? Antrag nach [[teilzeit-verkuerzung|§ 8 Abs. 1 BBiG]] vorbereiten", h: "Keine automatische Anrechnung der EQ-Zeit." }
          ] }
        ] },

      { id: "fehlzeiten",
        titel: "Fehlzeiten & Prüfungszulassung prüfen",
        kurz: "Für die Einzelfallprüfung bei hohen Fehlzeiten — erst die Zählweise, dann der Ausbildungsstand, dann die Entscheidung über Zulassung oder Verlängerung.",
        stichworte: ["fehlzeiten", "fehltage", "zulassung", "krank", "verlängerung", "ausbildungsstand"],
        artikel: ["fehlzeiten-zulassung", "abschlusspruefung", "krankmeldung"],
        gruppen: [
          { t: "Zählweise prüfen — vor jeder Bewertung", punkte: [
            { t: "Tatsächlich ausgefallene Ausbildungstage erfasst, nicht Kalendertage der Krankschreibung", h: "Häufigster Fehler: Eine Woche Attest wird als sieben Fehltage gemeldet." },
            { t: "Wochenenden und Feiertage nicht mitgezählt" },
            { t: "Jeder Ausfall dem Lernort zugeordnet (Betrieb / Berufsschule / Lehrgang)" },
            { t: "Berufsschul- und Lehrgangstage NICHT als Fehlzeit gewertet", h: "Sie sind nach § 15 BBiG selbst Ausbildungszeit — nur versäumte Tage zählen." },
            { t: "Doppelzählungen bereinigt (Schultag nicht zusätzlich als Betriebstag)" },
            { t: "Urlaub nicht als Fehlzeit geführt" },
            { t: "Teilweise versäumte Tage in Stunden dokumentiert, Umrechnung abgestimmt" },
            { t: "Elternzeit gesondert ausgewiesen", h: "§ 46 Abs. 2 BBiG: Aus Elternzeit darf bei der Zulassung kein Nachteil erwachsen." }
          ] },
          { t: "Bezugsgröße und Richtwert", punkte: [
            { t: "Maßgebliche Ausbildungszeit bestimmt (Verkürzung, Teilzeit, angerechnete Zeiten?)" },
            { t: "Bewertungsstichtag geklärt" },
            { t: "Anteil der Fehlzeiten berechnet — Richtwert etwa 10 %", h: "Kein Anspruch auf Fehltage und keine automatische Ablehnungsgrenze; bezieht sich auf die gesamte Ausbildungszeit, nicht nur aufs letzte Jahr." },
            { t: "Örtliche Staffel bewusst als Praxis behandelt, nicht als Norm", h: "66/75 Tage sind Praxisangabe des RP Freiburg; § 46 Abs. 1 BBiG kann den Prüfungsausschuss auch darunter erfordern." }
          ] },
          { t: "Ausbildungsstand belegen", punkte: [
            { t: "Betroffene Ausbildungsabschnitte und Tätigkeiten benannt" },
            { t: "Betriebliche Stellungnahme liegt vor — konkret, nicht „zu viele Fehltage“", h: "Was gelingt selbstständig, was wurde nachgeholt, wo fehlt Übung?" },
            { t: "Ergebnis der Zwischenprüfung herangezogen", h: "Mit der Entwicklung seither lesen; keine Anrechnung auf die Abschlussnote." },
            { t: "Aktuelles Berufsschulzeugnis vorhanden, ggf. Stellungnahme der Schule" },
            { t: "[[berichtsheft|Ausbildungsnachweis]] und Lehrgangsnachweise ausgewertet" },
            { t: "Nachholplan vereinbart — Aufgabe, Anleitung, Zeitraum, Nachweis", h: "Im Gartenbau die Jahreszeit berücksichtigen: Nicht jede Arbeit lässt sich jederzeit nachholen." },
            { t: "Keine Diagnosen angefordert", h: "Erkrankungen werden weder angezweifelt noch medizinisch bewertet." }
          ] },
          { t: "Entscheidung und Weg", punkte: [
            { t: "Zuständigkeit klar: zuständige Stelle entscheidet, bei Zweifeln der Prüfungsausschuss (§ 46 Abs. 1 BBiG)" },
            { t: "Reicht die verbleibende Zeit für die fehlenden Inhalte?" },
            { t: "Falls nein: Verlängerung nach § 8 Abs. 2 BBiG besprochen", h: "Antrag stellt die auszubildende Person; der Betrieb wird angehört, stimmt aber nicht zu." },
            { t: "Antrag rechtzeitig vor Vertragsende gestellt, nächster Prüfungstermin einbezogen" },
            { t: "Nichtzulassung und Nichtbestehen auseinandergehalten", h: "§ 21 Abs. 3 BBiG greift nur nach einer abgelegten, nicht bestandenen Prüfung." },
            { t: "Bei Ablehnung: Begründung und Rechtsbehelfsbelehrung beachtet" },
            { t: "Nachteilsausgleich getrennt geprüft (§ 65 BBiG)", h: "Betrifft die Prüfungsbedingungen, nicht die fehlende Ausbildung." }
          ] }
        ] },

      { id: "betriebsbesuch",
        titel: "Betriebsbesuch der Ausbildungsberatung",
        kurz: "Besuch vorbereiten, vor Ort strukturiert prüfen, sauber nachbereiten — inklusive Aktenvermerk.",
        stichworte: ["betriebsbesuch", "besuch", "aufsicht", "beratung vor ort"],
        artikel: ["ausbildungsberatung", "berichtsheft", "arbeitszeit-jugendliche", "aktenvermerk"],
        gruppen: [
          { t: "Vorbereitung", punkte: [
            { t: "Termin angekündigt und bestätigt (Vorlage: Betriebsbesuch ankündigen)" },
            { t: "Akte gesichtet: letzte Vermerke, offene Punkte, Fristen" },
            { t: "Gesprächspunkte notiert (Anlass, Auffälligkeiten, Prüfungsstand)" }
          ] },
          { t: "Vor Ort", punkte: [
            { t: "Berichtsheft geführt, regelmäßig gegengezeichnet" },
            { t: "Ausbildungsstand entspricht dem betrieblichen Ausbildungsplan" },
            { t: "Arbeitszeiten, Pausen und Freistellungen eingehalten (JArbSchG/ArbZG)" },
            { t: "Unterweisungen und Arbeitsschutz dokumentiert (SVLFG-Unterlagen)" },
            { t: "Gespräch mit Auszubildender/m geführt — auch unter vier Augen" },
            { t: "Gespräch mit Ausbilder/in geführt (Stand, Konflikte, Unterstützungsbedarf)" }
          ] },
          { t: "Nachbereitung", punkte: [
            { t: "Ergebnis und Vereinbarungen mit Beteiligten festgehalten" },
            { t: "Aktenvermerk erstellt (Export & Vermerk)" },
            { t: "Wiedervorlage bzw. Folgetermin gesetzt" }
          ] }
        ] },

      { id: "ap-anmeldung",
        titel: "Anmeldung zur Abschlussprüfung",
        kurz: "Zulassung prüfen, fristgerecht anmelden, Besonderheiten (Nachteilsausgleich, Fachrichtung) klären.",
        stichworte: ["abschlusspruefung", "anmeldung", "zulassung", "pruefung", "nachteilsausgleich"],
        artikel: ["abschlusspruefung", "zwischenpruefung", "nichtbestehen"],
        gruppen: [
          { t: "Zulassung", punkte: [
            { t: "Ausbildungszeit zurückgelegt bzw. endet nicht später als vier Monate nach der Prüfung" },
            { t: "An der Zwischenprüfung teilgenommen" },
            { t: "Berichtsheft geführt und von Betrieb/Azubi unterschrieben" },
            { t: "Ausbildungsverhältnis ist eingetragen" }
          ] },
          { t: "Anmeldung", punkte: [
            { t: "Anmeldung durch den Betrieb fristgerecht eingegangen (Vorlage: AP-Anmeldung)" },
            { t: "Fachrichtung und Prüfungsbereiche korrekt angegeben" },
            { t: "Nachteilsausgleich rechtzeitig beantragt — mit aktuellem Nachweis (§ 65 BBiG)", h: "Frühzeitig klären, nicht erst zur Einladung." },
            { t: "Pflanzenlisten/fachrichtungsspezifische Anforderungen kommuniziert" }
          ] },
          { t: "Nach der Anmeldung", punkte: [
            { t: "Einladung und Termine an Azubi und Betrieb weitergegeben" },
            { t: "Bei Nichtbestehen: Verlängerungsanspruch erklärt (§ 21 Abs. 3 BBiG)" }
          ] }
        ] }
    ]
  };
})();
