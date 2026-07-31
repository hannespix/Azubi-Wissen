// checklisten.js — Interaktive Checklisten für den Beratungsalltag.
// Fachliche Grundlage: Handreichung „Fachwerkerausbildung im Gartenbau“
// (RP Freiburg, Netzwerkfassung 1.2, Stand 31.07.2026) sowie die
// Wissensbasis (wissen.js). Der Abhak-Stand wird lokal gespeichert
// (IndexedDB) — eine Checkliste je Vorgang abarbeiten, drucken/ablegen,
// dann zurücksetzen.
(function () {
  "use strict";

  window.CHECKLISTEN = {
    stand: "31.07.2026",
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
