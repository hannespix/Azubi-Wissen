// wissen.js — Wissensbasis „Rechte & Pflichten in der Berufsausbildung“.
// Fachlich gepflegte, statische Datenbasis (keine personenbezogenen Daten).
//
// PFLEGEHINWEISE
//  - Stand-Datum unten aktualisieren, wenn Inhalte geprüft/geändert werden.
//  - Mindestausbildungsvergütung (Artikel "mindestverguetung"): Werte werden
//    jährlich im Bundesanzeiger bekannt gegeben -> Tabelle ergänzen.
//  - Textformat in `text`-Feldern: Absätze durch Leerzeile, Aufzählungen mit
//    "- " am Zeilenanfang, **fett** für Hervorhebungen. Kein HTML.
//  - Detailstufen: kurz+fakten = Stufe 1 (Kurzübersicht); Abschnitte mit d:2
//    ab Stufe "Standard"; d:3 nur in Stufe "Ausführlich".
window.WISSEN = {
  stand: "Juli 2026",
  hinweis: "Fachinformation der Ausbildungsberatung — sorgfältig geprüft, aber keine Rechtsberatung im Einzelfall. Maßgeblich sind Gesetz, Ausbildungsordnung und Tarifvertrag in der jeweils geltenden Fassung.",

  themen: [
    { id: "vertrag",         titel: "Vertrag & Ausbildungsstart",      kurz: "Vom Ausbildungsvertrag über die Eintragung bis zur Probezeit — so beginnt die Ausbildung rechtssicher." },
    { id: "pflichten-azubi", titel: "Pflichten der Auszubildenden",    kurz: "Lernpflicht, Berichtsheft, Berufsschule, Krankmeldung — was Azubis leisten müssen." },
    { id: "pflichten-betrieb", titel: "Pflichten der Ausbildenden",    kurz: "Planmäßig ausbilden, freistellen, kostenlose Ausbildungsmittel, Zeugnis — die Pflichten des Betriebs." },
    { id: "verguetung",      titel: "Vergütung & Geld",                kurz: "Mindestausbildungsvergütung, Überstunden, Fortzahlung, Sachbezüge und Sozialversicherung." },
    { id: "arbeitszeit",     titel: "Arbeitszeit, Pausen & Urlaub",    kurz: "Arbeitszeitgesetz und Jugendarbeitsschutz, Pausen, freie Tage und Urlaubsansprüche." },
    { id: "schule-pruefung", titel: "Berufsschule & Prüfungen",        kurz: "Zwischen- und Abschlussprüfung, Zulassung, Wiederholung und Verlängerung der Ausbildung." },
    { id: "konflikt-ende",   titel: "Konflikte, Kündigung & Ende",     kurz: "Konflikte lösen, Kündigungsregeln, Aufhebung, Betriebswechsel und das Ende der Ausbildung." },
    { id: "beratung",        titel: "Ausbildungsberatung & Aufsicht",  kurz: "Zuständige Stelle, Aufgaben der Ausbildungsberatung, Aktenvermerke und Förderwege." },
    { id: "fachwerker",      titel: "Fachwerker-Ausbildung Gartenbau", kurz: "Die § 66-Ausbildung für Menschen mit Behinderung: Voraussetzungen, Verfahren, Modelle, Prüfungen und Förderung." }
  ],

  artikel: [

  /* =================== Vertrag & Ausbildungsstart =================== */
  {
    id: "ausbildungsvertrag",
    thema: "vertrag",
    titel: "Der Berufsausbildungsvertrag",
    kurz: "Vor Beginn der Ausbildung schließen Ausbildende und Azubi einen Berufsausbildungsvertrag. Sein wesentlicher Inhalt muss spätestens vor Ausbildungsbeginn niedergelegt werden — seit 2025 auch digital in Textform.",
    stichworte: ["Vertrag", "Ausbildungsvertrag", "Niederschrift", "Vertragsinhalt", "unterschreiben", "Textform", "digital", "Vertragsstrafe", "Eltern", "minderjährig"],
    recht: [
      { n: "§ 10 BBiG", t: "Vertrag" },
      { n: "§ 11 BBiG", t: "Vertragsniederschrift" },
      { n: "§ 12 BBiG", t: "Nichtige Vereinbarungen" }
    ],
    fakten: [
      "Der Vertrag kommt formfrei zustande — die **Niederschrift des wesentlichen Inhalts** ist aber Pflicht, spätestens vor Beginn der Ausbildung (§ 11 BBiG).",
      "Seit 2025 genügt statt Papier auch die **Textform** (z. B. PDF), wenn das Dokument für die Azubis zugänglich, speicher- und ausdruckbar ist.",
      "Bei **Minderjährigen** müssen die gesetzlichen Vertreter (i. d. R. beide Elternteile) den Vertrag mit abschließen.",
      "**Vertragsstrafen sind nichtig** — ebenso Abreden, die Schadensersatz ausschließen oder Azubis nach dem Ende binden (§ 12 BBiG).",
      "Azubis (und gesetzliche Vertreter) erhalten eine **Ausfertigung der Niederschrift**."
    ],
    abschnitte: [
      { t: "Was in den Vertrag gehört", d: 2, text: "Die Niederschrift muss mindestens enthalten (§ 11 Abs. 1 BBiG):\n\n- Art, sachliche und zeitliche Gliederung sowie **Ziel** der Ausbildung (Berufsbezeichnung)\n- **Beginn und Dauer** der Ausbildung\n- Ausbildungsmaßnahmen **außerhalb der Ausbildungsstätte** (z. B. überbetriebliche Lehrgänge)\n- **tägliche Ausbildungszeit**\n- Dauer der **Probezeit**\n- **Zahlung und Höhe der Vergütung** sowie deren Zusammensetzung, auch die Vergütung oder der Ausgleich von Überstunden\n- Dauer des **Urlaubs**\n- Voraussetzungen einer **Kündigung**\n- Hinweis auf anwendbare **Tarifverträge, Betriebs- oder Dienstvereinbarungen**\n- **Form des Ausbildungsnachweises** (schriftlich oder elektronisch)" },
      { t: "Formulare der zuständigen Stelle", d: 2, text: "Für die grünen Berufe stellt die zuständige Stelle (in Baden-Württemberg das Regierungspräsidium) Musterverträge bereit. Sie enthalten alle Pflichtangaben und den betrieblichen Ausbildungsplan als Anlage. Wer die Muster nutzt, vermeidet Rückfragen bei der Eintragung." },
      { t: "Nichtige Vereinbarungen (§ 12 BBiG)", d: 3, text: "Nichtig sind insbesondere:\n\n- Vereinbarungen, die Azubis **für die Zeit nach dem Ende** der Ausbildung in ihrer beruflichen Tätigkeit beschränken. Ausnahme: Innerhalb der **letzten sechs Monate** darf vereinbart werden, dass im Anschluss ein Arbeitsverhältnis eingegangen wird.\n- **Vertragsstrafen** jeder Art\n- der **Ausschluss oder die Beschränkung von Schadensersatzansprüchen**\n- **Pauschalierungen** von Schadensersatz\n\nSolche Klauseln sind unwirksam, auch wenn sie unterschrieben wurden — der übrige Vertrag bleibt bestehen." },
      { t: "Digitaler Vertragsschluss seit 2025", d: 3, text: "Mit dem Vierten Bürokratieentlastungsgesetz genügt seit 1. Januar 2025 die **Textform** für die Vertragsniederschrift: Der Vertrag kann z. B. als PDF übermittelt werden. Voraussetzung ist, dass das Dokument den Azubis zugänglich ist, gespeichert und gedruckt werden kann und der Empfang nachweisbar ist. Die klassische Papierform mit Unterschrift bleibt zulässig und ist in der Praxis weiterhin verbreitet." }
    ],
    rollen: {
      azubi: "Unterschreibe nichts, was du nicht verstanden hast — die Ausbildungsberatung erklärt dir den Vertrag kostenlos. Prüfe besonders Beginn, Dauer, Vergütung und Urlaub. Du bekommst eine eigene Ausfertigung: gut aufbewahren.",
      betrieb: "Verwenden Sie den Mustervertrag der zuständigen Stelle und reichen Sie ihn **vor Ausbildungsbeginn** mit Ausbildungsplan zur Eintragung ein. Bei Minderjährigen: Unterschriften beider Elternteile und ärztliche Erstuntersuchung nicht vergessen.",
      beratung: "Typische Mängel bei der Vertragsprüfung: fehlende Überstundenregelung, Vergütung unter Mindestniveau, unzulässige Kostenklauseln (z. B. Lehrgangskosten bei Abbruch), fehlende Unterschrift eines Elternteils. Vor Eintragung beanstanden und Korrektur anfordern."
    },
    faq: [
      { f: "Muss der Ausbildungsvertrag schriftlich sein?", a: "Der Vertrag selbst kommt formfrei zustande, aber der wesentliche Inhalt muss spätestens vor Ausbildungsbeginn niedergelegt werden — klassisch auf Papier mit Unterschrift oder seit 2025 in Textform (z. B. als PDF). Ohne Niederschrift verstößt der Betrieb gegen § 11 BBiG; der Vertrag bleibt trotzdem gültig." },
      { f: "Wer muss bei Minderjährigen unterschreiben?", a: "Der Vertrag mit einer/einem minderjährigen Auszubildenden braucht die Zustimmung der gesetzlichen Vertreter — in der Regel unterschreiben beide Elternteile." },
      { f: "Sind Vertragsstrafen im Ausbildungsvertrag erlaubt?", a: "Nein. Vertragsstrafen sind nach § 12 Abs. 2 BBiG nichtig — ebenso Klauseln, die Schadensersatz ausschließen oder pauschalieren." }
    ],
    verwandt: ["eintragung", "probezeit", "mindestverguetung"]
  },

  {
    id: "eintragung",
    thema: "vertrag",
    titel: "Eintragung & zuständige Stelle",
    kurz: "Jedes Ausbildungsverhältnis wird in das Verzeichnis der Berufsausbildungsverhältnisse eingetragen. Für die grünen Berufe ist in Baden-Württemberg das Regierungspräsidium die zuständige Stelle.",
    stichworte: ["Eintragung", "Verzeichnis", "Lehrlingsrolle", "anmelden", "Registrierung", "zuständige Stelle", "Regierungspräsidium", "Unterlagen"],
    recht: [
      { n: "§§ 34–36 BBiG", t: "Verzeichnis der Berufsausbildungsverhältnisse" },
      { n: "§ 32 JArbSchG", t: "Ärztliche Erstuntersuchung" },
      { n: "§§ 27–30 BBiG", t: "Eignung von Ausbildungsstätte und Personal" }
    ],
    fakten: [
      "Der Ausbildende beantragt **unverzüglich nach Vertragsschluss** die Eintragung (§ 36 BBiG).",
      "Eingetragen wird nur, wenn der Vertrag dem BBiG entspricht und **Ausbildungsstätte und Ausbildungspersonal geeignet** sind.",
      "Bei Minderjährigen muss die Bescheinigung über die **ärztliche Erstuntersuchung** vorliegen.",
      "Die **Eintragung ist für Azubis gebührenfrei** (§ 36 Abs. 2 BBiG).",
      "**Änderungen** (Ausbilderwechsel, Verkürzung, vorzeitige Lösung …) sind der zuständigen Stelle unverzüglich mitzuteilen."
    ],
    abschnitte: [
      { t: "Benötigte Unterlagen", d: 2, text: "Zur Eintragung gehören üblicherweise:\n\n- der unterschriebene **Berufsausbildungsvertrag** (alle Ausfertigungen)\n- der **betriebliche Ausbildungsplan** (sachliche und zeitliche Gliederung)\n- bei Minderjährigen die **ärztliche Erstuntersuchung** (§ 32 JArbSchG)\n- Angaben zur **Ausbildereignung**, falls noch nicht bekannt\n- ggf. Nachweise zu **Verkürzung** oder Teilzeitausbildung" },
      { t: "Zuständige Stelle für die grünen Berufe", d: 2, text: "Für die Berufsbildung in der Landwirtschaft einschließlich **Gartenbau** ist in Baden-Württemberg das **Regierungspräsidium** zuständige Stelle nach dem BBiG. Es führt das Verzeichnis, überwacht und berät die Ausbildungsbetriebe (§ 76 BBiG), organisiert die Prüfungen und registriert die Ausbildungsverträge. Für Industrie-, Handels- und Handwerksberufe sind dagegen IHK bzw. Handwerkskammer zuständig." },
      { t: "Prüfung vor Eintragung", d: 3, text: "Vor der Eintragung prüft die zuständige Stelle insbesondere:\n\n- Entspricht der Vertrag dem **BBiG und der Ausbildungsordnung** (Berufsbezeichnung, Dauer, Vergütung, Urlaub)?\n- Ist die **Ausbildungsstätte geeignet** (§ 27 BBiG) — nach Art und Einrichtung, und steht die Zahl der Azubis in angemessenem Verhältnis zur Zahl der Fachkräfte?\n- Sind Ausbildende und Ausbilder **persönlich und fachlich geeignet** (§§ 28–30 BBiG)?\n\nWird ein Mangel festgestellt, fordert die zuständige Stelle zur Nachbesserung auf; die Eintragung kann bis dahin zurückgestellt werden." }
    ],
    rollen: {
      azubi: "Frag nach, ob dein Vertrag eingetragen ist — die Eintragung ist Voraussetzung für die Zulassung zur Abschlussprüfung. Deine Ansprechstelle bei Fragen ist die Ausbildungsberatung des Regierungspräsidiums.",
      betrieb: "Reichen Sie den Vertrag unmittelbar nach Abschluss ein — nicht erst nach Ausbildungsbeginn. Melden Sie jede Änderung (Ausbilderwechsel, Adresse, vorzeitige Lösung) unverzüglich, sonst stimmen Verzeichnis und Prüfungsunterlagen nicht.",
      beratung: "Bei der Eintragungsprüfung auf das Fachkräfte-Azubi-Verhältnis, aktuelle Ausbildereignung und Vollständigkeit des Ausbildungsplans achten. Rückfragen dokumentieren — sie sind oft der erste Kontaktpunkt für spätere Beratungsfälle."
    },
    faq: [
      { f: "Wo wird der Ausbildungsvertrag im Gartenbau angemeldet?", a: "Bei der zuständigen Stelle für die grünen Berufe — in Baden-Württemberg beim Regierungspräsidium. Es trägt den Vertrag in das Verzeichnis der Berufsausbildungsverhältnisse ein." },
      { f: "Kostet die Eintragung etwas?", a: "Für die Auszubildenden ist die Eintragung gebührenfrei (§ 36 Abs. 2 BBiG)." }
    ],
    verwandt: ["ausbildungsvertrag", "zustaendige-stelle", "ausbilder"]
  },

  {
    id: "probezeit",
    thema: "vertrag",
    titel: "Die Probezeit",
    kurz: "Jede Ausbildung beginnt mit einer Probezeit von mindestens einem und höchstens vier Monaten. In dieser Zeit können beide Seiten jederzeit ohne Frist und ohne Angabe von Gründen schriftlich kündigen.",
    stichworte: ["Probezeit", "Probemonate", "kündigen Probezeit", "Anfang", "testen", "Verlängerung Probezeit"],
    recht: [
      { n: "§ 20 BBiG", t: "Probezeit" },
      { n: "§ 22 Abs. 1 BBiG", t: "Kündigung während der Probezeit" }
    ],
    fakten: [
      "Dauer: **mindestens 1, höchstens 4 Monate** — die genaue Länge steht im Vertrag.",
      "Kündigung in der Probezeit: **jederzeit, ohne Frist, ohne Gründe** — aber zwingend **schriftlich**.",
      "Die Probezeit dient beiden Seiten: Eignung für den Beruf und Zusammenarbeit prüfen.",
      "Wird die Ausbildung während der Probezeit **um mehr als ein Drittel unterbrochen** (z. B. Krankheit), kann eine vertragliche Verlängerung um den Unterbrechungszeitraum vereinbart sein."
    ],
    abschnitte: [
      { t: "Kündigung in der Probezeit", d: 2, text: "Die Kündigung muss **schriftlich** erfolgen (Papier mit Unterschrift — E-Mail genügt nicht). Bei minderjährigen Azubis muss die Kündigung des Betriebs den **gesetzlichen Vertretern** zugehen; kündigen die Azubis selbst, brauchen sie deren Zustimmung. Ein Grund muss nicht angegeben werden. Besonderer Kündigungsschutz (z. B. Mutterschutz, Schwerbehinderung) gilt aber auch in der Probezeit." },
      { t: "Probezeit sinnvoll nutzen", d: 3, text: "Die Probezeit ist kein Wartezeitraum, sondern Arbeitsphase:\n\n- **Betrieb:** früh Rückmeldung geben, Ausbildungsplan von Anfang an umsetzen, bei Zweifeln das Gespräch suchen — nicht bis zur letzten Woche warten.\n- **Azubi:** Fragen stellen, Berichtsheft von Beginn an führen, bei Problemen früh die Ausbildungsberatung einschalten.\n\nEine Kündigung „auf den letzten Drücker“ kurz vor Ablauf ist zulässig, sorgt aber regelmäßig für Konflikte — die Ausbildungsberatung kann vorher vermitteln." },
      { t: "Verlängerung bei langer Unterbrechung", d: 3, text: "Das BBiG sieht keine automatische Verlängerung vor. Die Rechtsprechung erlaubt aber Vertragsklauseln, nach denen sich die Probezeit **um den Zeitraum einer Unterbrechung verlängert**, wenn die Ausbildung um mehr als ein Drittel der Probezeit unterbrochen war (z. B. längere Krankheit). Maßgeblich ist die konkrete Vertragsklausel." }
    ],
    rollen: {
      azubi: "Eine Kündigung in der Probezeit trifft dich ohne Vorwarnung? Lass Datum des Zugangs und Schriftform prüfen — und sprich mit der Ausbildungsberatung über einen schnellen Wechselbetrieb, damit keine Lücke entsteht.",
      betrieb: "Führen Sie in der Probezeit mindestens ein dokumentiertes Zwischengespräch. Wenn Sie kündigen: schriftlich, nachweisbarer Zugang, bei Minderjährigen an die Eltern. Melden Sie die Lösung der zuständigen Stelle.",
      beratung: "Probezeitkündigungen kurz vor Ablauf sind ein häufiger Beratungsanlass. Prüfpunkte: Schriftform, Zugang (bei Minderjährigen an gesetzliche Vertreter), Datum, besonderer Kündigungsschutz. Bei Vermittlungswunsch schnell handeln — Wechsel in einen anderen Betrieb mit Anrechnung der Zeit ist oft die beste Lösung."
    },
    faq: [
      { f: "Wie lange darf die Probezeit in der Ausbildung dauern?", a: "Mindestens einen Monat, höchstens vier Monate (§ 20 BBiG). Üblich sind drei bis vier Monate." },
      { f: "Kann mir in der Probezeit einfach so gekündigt werden?", a: "Ja — in der Probezeit können beide Seiten jederzeit ohne Frist und ohne Begründung kündigen. Die Kündigung muss aber schriftlich erfolgen, und besonderer Kündigungsschutz (z. B. bei Schwangerschaft oder Schwerbehinderung) bleibt bestehen." }
    ],
    verwandt: ["kuendigung", "ausbildungsvertrag", "konflikte"]
  },

  {
    id: "jugendliche",
    thema: "vertrag",
    titel: "Minderjährige Azubis: ärztliche Untersuchung & Schutz",
    kurz: "Wer unter 18 ist, darf die Ausbildung nur mit ärztlicher Erstuntersuchung beginnen. Nach dem ersten Jahr ist eine Nachuntersuchung Pflicht — sonst gilt ein Beschäftigungsverbot.",
    stichworte: ["minderjährig", "unter 18", "Jugendliche", "ärztliche Untersuchung", "Erstuntersuchung", "Nachuntersuchung", "Jugendarbeitsschutz", "U18"],
    recht: [
      { n: "§ 32 JArbSchG", t: "Ärztliche Erstuntersuchung" },
      { n: "§ 33 JArbSchG", t: "Erste Nachuntersuchung" },
      { n: "JArbSchG", t: "Besondere Schutzvorschriften für Jugendliche" }
    ],
    fakten: [
      "**Erstuntersuchung:** vor Beginn der Ausbildung, Bescheinigung darf bei Aufnahme **nicht älter als 14 Monate** sein.",
      "**Nachuntersuchung:** vor Ablauf des ersten Beschäftigungsjahres; liegt die Bescheinigung 14 Monate nach Beginn nicht vor, gilt ein **Beschäftigungsverbot**.",
      "Die Untersuchungen sind für Jugendliche **kostenfrei** (Kostenträger ist das Land).",
      "Für unter 18-Jährige gelten zusätzlich die **besonderen Arbeitszeit- und Schutzregeln** des JArbSchG."
    ],
    abschnitte: [
      { t: "Ablauf in der Praxis", d: 2, text: "Die Untersuchung führt eine Ärztin/ein Arzt eigener Wahl durch (Berechtigungsschein über die Gemeinde). Der Betrieb erhält nur die **Bescheinigung**, nicht die medizinischen Details. Der Betrieb muss die Bescheinigung aufbewahren und bei der Eintragung des Vertrags vorlegen." },
      { t: "Fristen im Blick behalten", d: 3, text: "- Erstuntersuchung: Bescheinigung bei **Ausbildungsbeginn nicht älter als 14 Monate**.\n- Nachuntersuchung: **im letzten Monat des ersten Beschäftigungsjahres** vorlegen lassen; spätestens **14 Monate nach Beginn** muss sie vorliegen, sonst darf der/die Jugendliche nicht weiterbeschäftigt werden.\n- Der Betrieb soll rechtzeitig (etwa 9 Monate nach Beginn) schriftlich an die Nachuntersuchung erinnern.\n\nWird der/die Azubi während der Ausbildung 18, entfallen künftige Nachuntersuchungen." }
    ],
    rollen: {
      azubi: "Die Untersuchung kostet dich nichts — den Berechtigungsschein bekommst du bei deiner Gemeinde. Ohne Nachuntersuchung darfst du nach 14 Monaten nicht mehr beschäftigt werden, also kümmere dich rechtzeitig um den Termin.",
      betrieb: "Ohne Erstuntersuchung dürfen Sie Jugendliche gar nicht erst beschäftigen; ohne Nachuntersuchung endet die Beschäftigungserlaubnis 14 Monate nach Beginn. Erinnerungsfristen ins Fristenbuch aufnehmen.",
      beratung: "Bei Betriebsbesuchen Bescheinigungen zeigen lassen. Fehlende Nachuntersuchung ist ein klassischer, schnell behebbarer Mangel — schriftlich mit Frist anfordern und Wiedervorlage setzen."
    },
    faq: [
      { f: "Braucht jeder Azubi eine ärztliche Untersuchung?", a: "Nur Jugendliche unter 18 Jahren: vor Ausbildungsbeginn die Erstuntersuchung (§ 32 JArbSchG) und vor Ablauf des ersten Jahres die Nachuntersuchung (§ 33 JArbSchG). Volljährige brauchen keine Untersuchung nach dem JArbSchG." },
      { f: "Was passiert, wenn die Nachuntersuchung fehlt?", a: "14 Monate nach Ausbildungsbeginn gilt ohne Nachweis ein Beschäftigungsverbot — der Betrieb darf die/den Jugendlichen nicht weiterbeschäftigen, bis die Bescheinigung vorliegt." }
    ],
    verwandt: ["arbeitszeit-jugendliche", "eintragung", "ausbildungsvertrag"]
  },

  {
    id: "teilzeit-verkuerzung",
    thema: "vertrag",
    titel: "Teilzeit, Verkürzung & Verlängerung der Ausbildung",
    kurz: "Die Ausbildungsdauer ist flexibel: Sie kann in Teilzeit absolviert, bei guter Vorbildung oder Leistung verkürzt und in besonderen Fällen verlängert werden.",
    stichworte: ["Teilzeit", "Teilzeitausbildung", "verkürzen", "Verkürzung", "Verlängerung", "Abitur", "Vorbildung", "vorzeitige Prüfung", "Dauer"],
    recht: [
      { n: "§ 7a BBiG", t: "Teilzeitberufsausbildung" },
      { n: "§ 8 BBiG", t: "Abkürzung und Verlängerung der Ausbildungszeit" },
      { n: "§ 45 Abs. 1 BBiG", t: "Vorzeitige Zulassung zur Abschlussprüfung" }
    ],
    fakten: [
      "**Teilzeit** steht seit 2020 allen offen: Kürzung der täglichen/wöchentlichen Zeit um bis zu **50 %**; die Gesamtdauer verlängert sich entsprechend, höchstens auf das **1,5-Fache**.",
      "**Verkürzung** (§ 8 Abs. 1): auf gemeinsamen Antrag von Betrieb und Azubi, wenn das Ausbildungsziel in kürzerer Zeit erreichbar ist (z. B. wegen Schulabschluss oder Vorkenntnissen).",
      "**Vorzeitige Zulassung** zur Abschlussprüfung (§ 45 Abs. 1): bei überdurchschnittlichen Leistungen, nach Anhörung von Betrieb und Berufsschule.",
      "**Verlängerung** (§ 8 Abs. 2): auf Antrag der Azubis, wenn sie erforderlich ist, um das Ausbildungsziel zu erreichen.",
      "Alle Änderungen laufen über die **zuständige Stelle** und werden im Verzeichnis vermerkt."
    ],
    abschnitte: [
      { t: "Teilzeitausbildung praktisch", d: 2, text: "Teilzeit wird im Vertrag oder durch Änderungsvertrag vereinbart und der zuständigen Stelle gemeldet. Die **Vergütung darf entsprechend der Kürzung angepasst** werden (§ 17 Abs. 5 BBiG), die Mindestvergütung gilt anteilig mindestens im Verhältnis der Zeit. Klassische Anlässe: Kindererziehung, Pflege von Angehörigen, gesundheitliche Gründe, Leistungssport — ein besonderer Grund ist aber **nicht mehr erforderlich**." },
      { t: "Übliche Verkürzungsgrößen", d: 3, text: "Orientierungswerte der Praxis (Entscheidung im Einzelfall durch die zuständige Stelle):\n\n- **Fachhochschulreife/Abitur:** bis zu 12 Monate\n- **Mittlerer Bildungsabschluss:** bis zu 6 Monate\n- **einschlägige Berufsausbildung oder Berufserfahrung:** je nach Umfang\n- **Alter über 21:** Verkürzung möglich\n\nMehrere Gründe können kombiniert werden; eine Mindestausbildungszeit muss erhalten bleiben. Der Antrag sollte möglichst früh gestellt werden — am besten schon mit dem Ausbildungsvertrag." },
      { t: "Verlängerung in besonderen Fällen", d: 3, text: "Eine Verlängerung nach § 8 Abs. 2 BBiG kommt in Betracht bei längerer Krankheit, erheblichen Fehlzeiten oder wenn Förderbedarf besteht. Antragsberechtigt sind die **Auszubildenden** (bei Minderjährigen die gesetzlichen Vertreter); der Betrieb ist zu hören. Daneben verlängert sich die Ausbildung auf Verlangen automatisch **nach nicht bestandener Abschlussprüfung** (§ 21 Abs. 3 BBiG, siehe eigener Artikel)." }
    ],
    rollen: {
      azubi: "Mit Abitur oder Vorerfahrung kannst du oft verkürzen — stell den Antrag zusammen mit deinem Betrieb bei der zuständigen Stelle. Bei sehr guten Noten geht auch die vorzeitige Prüfung. Umgekehrt gilt: Eine Verlängerung ist keine Strafe, sondern sichert dir das Erreichen des Abschlusses.",
      betrieb: "Prüfen Sie Verkürzungsmöglichkeiten schon beim Vertragsschluss, dann stimmen Vergütungsstaffel und Prüfungstermin von Anfang an. Teilzeitmodelle können helfen, motivierte Bewerber/innen mit familiären Pflichten zu gewinnen.",
      beratung: "Bei Verkürzungsanträgen auf realistische Zielerreichung achten (Leistungsstand Berufsschule einbeziehen). Teilzeitfälle: Vergütungsanpassung und Ende der Ausbildungszeit sauber berechnen und im Verzeichnis nachführen."
    },
    faq: [
      { f: "Kann ich meine Ausbildung verkürzen?", a: "Ja — auf gemeinsamen Antrag von dir und deinem Betrieb bei der zuständigen Stelle, wenn das Ausbildungsziel in kürzerer Zeit erreichbar ist (§ 8 BBiG). Übliche Gründe: höherer Schulabschluss, einschlägige Vorbildung, gute Leistungen. Bei überdurchschnittlichen Leistungen ist zusätzlich die vorzeitige Zulassung zur Abschlussprüfung möglich (§ 45 BBiG)." },
      { f: "Geht eine Ausbildung auch in Teilzeit?", a: "Ja, seit 2020 für alle: Die tägliche oder wöchentliche Ausbildungszeit kann um bis zu 50 % gekürzt werden; die Gesamtdauer verlängert sich entsprechend, höchstens auf das Anderthalbfache (§ 7a BBiG)." }
    ],
    verwandt: ["abschlusspruefung", "nichtbestehen", "mindestverguetung"]
  },

  /* =================== Pflichten der Auszubildenden ================= */
  {
    id: "lernpflicht",
    thema: "pflichten-azubi",
    titel: "Lernpflicht, Sorgfalt & Weisungen",
    kurz: "Kernpflicht der Azubis ist das Lernen: sich ernsthaft bemühen, die berufliche Handlungsfähigkeit zu erwerben, Aufgaben sorgfältig ausführen und Weisungen der Ausbilder folgen.",
    stichworte: ["Pflichten Azubi", "lernen", "Lernpflicht", "Weisung", "Anweisung", "Sorgfalt", "Betriebsordnung", "Verschwiegenheit", "Geheimnis", "Werkzeug", "Verhalten"],
    recht: [
      { n: "§ 13 BBiG", t: "Verhalten während der Berufsausbildung" }
    ],
    fakten: [
      "Azubis müssen sich **bemühen, das Ausbildungsziel zu erreichen** — geschuldet ist ernsthaftes Lernen, kein Prüfungserfolg.",
      "**Weisungen** von Ausbildenden, Ausbildern und anderen weisungsberechtigten Personen sind zu befolgen, soweit sie der Ausbildung dienen.",
      "Aufgaben sind **sorgfältig** auszuführen; Werkzeuge, Maschinen und sonstige Einrichtungen sind **pfleglich zu behandeln**.",
      "Die **Betriebsordnung** ist einzuhalten; über **Betriebs- und Geschäftsgeheimnisse** ist Stillschweigen zu wahren.",
      "An Berufsschule und Prüfungen ist **teilzunehmen**, der **Ausbildungsnachweis** ist zu führen."
    ],
    abschnitte: [
      { t: "Die Pflichten im Einzelnen (§ 13 BBiG)", d: 2, text: "Auszubildende haben:\n\n- die ihnen übertragenen **Aufgaben sorgfältig** auszuführen\n- an Maßnahmen teilzunehmen, für die sie **freigestellt** werden (Berufsschule, Prüfungen, überbetriebliche Ausbildung)\n- den **Weisungen** weisungsberechtigter Personen zu folgen\n- die **Ordnung der Ausbildungsstätte** zu beachten (Arbeitszeiten, Sicherheitsregeln, Rauch-/Handyregeln)\n- Werkzeug, Maschinen und Einrichtungen **pfleglich zu behandeln**\n- über Betriebs- und Geschäftsgeheimnisse **Stillschweigen** zu wahren\n- einen **schriftlichen oder elektronischen Ausbildungsnachweis** zu führen" },
      { t: "Grenzen der Weisungspflicht", d: 3, text: "Weisungen müssen der Ausbildung dienen und zumutbar sein. **Nicht gedeckt** sind:\n\n- dauerhaft **ausbildungsfremde Tätigkeiten** (z. B. wochenlang nur Hof kehren, privates Auto des Chefs waschen)\n- Aufgaben, die die **körperlichen Kräfte übersteigen** oder gegen Arbeitsschutzvorschriften verstoßen\n- Weisungen, die gegen Gesetze verstoßen\n\nWer eine Weisung für unzulässig hält, sollte das Gespräch suchen und sich an die Ausbildungsberatung wenden — eigenmächtige Arbeitsverweigerung eskaliert den Konflikt und kann selbst zur Pflichtverletzung werden." },
      { t: "Folgen von Pflichtverletzungen", d: 3, text: "Bei Pflichtverletzungen kommen — abgestuft — in Betracht: Ermahnung, **Abmahnung** und bei schweren oder wiederholten Verstößen die **Kündigung aus wichtigem Grund** (§ 22 Abs. 2 Nr. 1 BBiG). Eine Kündigung wegen Verhaltens setzt in aller Regel eine vorherige, einschlägige Abmahnung voraus. Schadensersatz richtet sich nach den Grundsätzen des innerbetrieblichen Schadensausgleichs — bei leichter Fahrlässigkeit haften Azubis regelmäßig nicht oder nur anteilig." }
    ],
    rollen: {
      azubi: "Du schuldest ernsthaftes Bemühen, keine Bestnoten. Wenn dir Aufgaben dauerhaft sinnlos für deine Ausbildung erscheinen, sprich es an — erst im Betrieb, dann bei der Ausbildungsberatung. Sicherheitsanweisungen gelten immer.",
      betrieb: "Weisungsberechtigte Personen klar benennen (wer darf dem Azubi Anweisungen geben?). Abmahnungen konkret formulieren: Datum, Verhalten, verletzte Pflicht, Hinweis auf Konsequenzen — pauschale Rügen tragen im Streitfall nicht.",
      beratung: "Bei Beschwerden über Weisungen zuerst den Ausbildungsplan heranziehen: Dient die Tätigkeit dem Berufsbild? Einzelne Hilfstätigkeiten sind zulässig, prägende ausbildungsfremde Beschäftigung nicht. Gesprächsergebnisse im Vermerk festhalten."
    },
    faq: [
      { f: "Muss ich als Azubi alles machen, was mir gesagt wird?", a: "Du musst Weisungen folgen, die der Ausbildung dienen und zumutbar sind (§ 13 BBiG). Dauerhaft ausbildungsfremde Arbeiten, gefährliche oder rechtswidrige Aufgaben sind nicht gedeckt — sprich sie an und hole dir notfalls Unterstützung bei der Ausbildungsberatung." },
      { f: "Hafte ich, wenn ich im Betrieb etwas kaputt mache?", a: "Bei leichter Fahrlässigkeit in der Regel nicht oder nur anteilig — es gelten die Grundsätze des innerbetrieblichen Schadensausgleichs. Volle Haftung droht nur bei Vorsatz oder grober Fahrlässigkeit. Ein pauschaler Haftungsausschluss zulasten des Azubis im Vertrag wäre ohnehin nichtig (§ 12 BBiG)." }
    ],
    verwandt: ["ausbildungspflicht", "berichtsheft", "kuendigung"]
  },

  {
    id: "berichtsheft",
    thema: "pflichten-azubi",
    titel: "Ausbildungsnachweis (Berichtsheft)",
    kurz: "Der Ausbildungsnachweis dokumentiert den Ausbildungsverlauf. Er kann schriftlich oder elektronisch geführt werden, gehört in die Ausbildungszeit — und ist Zulassungsvoraussetzung für die Abschlussprüfung.",
    stichworte: ["Berichtsheft", "Ausbildungsnachweis", "Wochenbericht", "dokumentieren", "Heft", "elektronisch führen", "Zulassung"],
    recht: [
      { n: "§ 13 Nr. 7 BBiG", t: "Pflicht zum Führen des Ausbildungsnachweises" },
      { n: "§ 14 Abs. 2 BBiG", t: "Führen während der Ausbildungszeit" },
      { n: "§ 43 Abs. 1 Nr. 2 BBiG", t: "Zulassungsvoraussetzung zur Abschlussprüfung" }
    ],
    fakten: [
      "Form: **schriftlich oder elektronisch** — die Form wird im Ausbildungsvertrag festgelegt.",
      "Azubis erhalten **Gelegenheit, den Nachweis während der Ausbildungszeit zu führen** (§ 14 Abs. 2 BBiG) — nicht am Feierabend.",
      "Ausbilder/innen müssen den Nachweis **regelmäßig durchsehen** und abzeichnen.",
      "Ohne ordnungsgemäß geführten Nachweis **keine Zulassung** zur Abschlussprüfung (§ 43 BBiG).",
      "Der Nachweis ist **kostenfrei** bereitzustellen (Vordrucke/Software zählen zu den Ausbildungsmitteln)."
    ],
    abschnitte: [
      { t: "So wird richtig geführt", d: 2, text: "Bewährt hat sich:\n\n- **mindestens wöchentlich** eintragen (Tätigkeiten, Unterweisungen, Berufsschulthemen), stichwortartig genügt\n- vom Azubi **datieren und unterzeichnen**, von der Ausbilderin/dem Ausbilder **regelmäßig gegenzeichnen** lassen\n- Vorlagen der zuständigen Stelle nutzen (Papier oder digital)\n\nDie zuständige Stelle kann Vorgaben zur Führung machen — im Zweifel dort nachfragen." },
      { t: "Häufige Probleme", d: 3, text: "- **Monatelang nichts eingetragen:** Nacharbeiten ist mühsam und fällt bei der Zulassungsprüfung auf. Ausbilder sollten Rückstände früh ansprechen — das regelmäßige Durchsehen ist ihre Pflicht.\n- **Führen nur in der Freizeit verlangt:** unzulässig. Das Führen gehört seit 2020 ausdrücklich in die Ausbildungszeit (§ 14 Abs. 2 BBiG).\n- **Streit über die Form:** Maßgeblich ist die im Vertrag festgelegte Form; eine Umstellung (z. B. auf digital) sollte schriftlich vereinbart und der zuständigen Stelle mitgeteilt werden." }
    ],
    rollen: {
      azubi: "Trag wöchentlich ein — fünf Minuten reichen. Das Berichtsheft ist deine Eintrittskarte zur Abschlussprüfung und dein Beweis, was dir beigebracht wurde (oder was nicht).",
      betrieb: "Planen Sie feste Zeiten für das Berichtsheft ein und zeichnen Sie regelmäßig gegen. Lücken im Nachweis fallen auf den Betrieb zurück, wenn die Zulassung wackelt.",
      beratung: "Das Berichtsheft ist in Konfliktfällen die wichtigste Erkenntnisquelle: Es zeigt, welche Ausbildungsinhalte tatsächlich vermittelt wurden. Bei Betriebsbesuchen vorlegen lassen; fehlende Gegenzeichnung als Mangel ansprechen."
    },
    faq: [
      { f: "Muss ich das Berichtsheft zu Hause schreiben?", a: "Nein. Du bekommst Gelegenheit, den Ausbildungsnachweis während der Ausbildungszeit zu führen (§ 14 Abs. 2 BBiG). Der Betrieb darf das Schreiben nicht in deine Freizeit verlagern." },
      { f: "Was passiert, wenn das Berichtsheft fehlt oder unvollständig ist?", a: "Ohne ordnungsgemäß geführten Ausbildungsnachweis wirst du nicht zur Abschlussprüfung zugelassen (§ 43 Abs. 1 Nr. 2 BBiG). Lücken solltest du deshalb früh nacharbeiten — und der Betrieb muss dich dabei unterstützen." }
    ],
    verwandt: ["abschlusspruefung", "lernpflicht", "ausbildungsmittel"]
  },

  {
    id: "berufsschulpflicht",
    thema: "pflichten-azubi",
    titel: "Berufsschule: Teilnahmepflicht",
    kurz: "Der Besuch der Berufsschule ist Pflicht — sie ist gleichberechtigter Lernort neben dem Betrieb. In Baden-Württemberg gilt die Berufsschulpflicht für Azubis grundsätzlich bis zum Ende der Ausbildung, auch über 18.",
    stichworte: ["Berufsschule", "Schulpflicht", "schwänzen", "Blockunterricht", "Fehlzeiten Schule", "Teilnahmepflicht", "Schule"],
    recht: [
      { n: "§ 13 Nr. 2 BBiG", t: "Teilnahmepflicht am Berufsschulunterricht" },
      { n: "§ 15 BBiG", t: "Freistellung durch den Betrieb" },
      { n: "SchG BW", t: "Berufsschulpflicht in Baden-Württemberg" }
    ],
    fakten: [
      "Azubis müssen am **Berufsschulunterricht teilnehmen** — auch wenn sie volljährig sind.",
      "Der Betrieb muss für die Schule **freistellen** und darf die Zeit nicht mit Arbeit „verrechnen“ — die Anrechnung regelt § 15 BBiG.",
      "**Fehlzeiten** in der Schule sind zu entschuldigen; der Betrieb ist zu informieren.",
      "Unentschuldigtes Fehlen ist eine **Pflichtverletzung** gegenüber Schule und Betrieb — und gefährdet Wissen, Noten und im Extremfall die Ausbildung."
    ],
    abschnitte: [
      { t: "Zusammenspiel Betrieb — Schule", d: 2, text: "Die duale Ausbildung lebt vom Zusammenspiel: Der Betrieb vermittelt die Praxis, die Berufsschule die Theorie (im Gartenbau z. B. Pflanzenkunde, Bodenkunde, Wirtschaft und Gemeinschaftskunde). Beide Seiten informieren sich gegenseitig — viele Schulen melden auffällige Fehlzeiten aktiv an die Betriebe. Das Berufsschulzeugnis fließt nicht in die Abschlussprüfung ein, ist aber Leistungsindikator, etwa für die vorzeitige Zulassung." },
      { t: "Wenn der Betrieb vom Schulbesuch abhält", d: 3, text: "Immer wieder verlangen Betriebe, bei Personalengpässen statt der Schule zu arbeiten. Das ist **unzulässig**: Die Freistellungspflicht des § 15 BBiG ist zwingend; Verstöße sind eine Ordnungswidrigkeit (§ 102 BBiG) und ein klassischer Fall für die Ausbildungsberatung. Azubis geraten dabei in eine Zwickmühle — sie sollten den Konflikt nicht selbst austragen, sondern die Beratung einschalten." }
    ],
    rollen: {
      azubi: "Schule ist Ausbildungszeit, kein Urlaub und kein Bonus. Wenn dein Betrieb dich zum Arbeiten statt zur Schule schicken will, muss er das nicht dürfen — melde dich bei der Ausbildungsberatung, das klären wir mit dem Betrieb.",
      betrieb: "Planen Sie Schultage und Blockwochen fest in die Personalplanung ein. Vom Unterricht „freikaufen“ geht nicht — auch nicht in der Saison. Bei Zweifeln an der Beschulung (Fahrtwege, Klassenzuweisung) hilft die zuständige Stelle.",
      beratung: "Meldungen der Schulen über Fehlzeiten ernst nehmen und früh mit Betrieb und Azubi klären — hohe Fehlzeiten sind der stärkste Frühindikator für Vertragslösungen und gefährden die Prüfungszulassung."
    },
    faq: [
      { f: "Muss ich als volljähriger Azubi noch in die Berufsschule?", a: "Ja. Die Teilnahmepflicht aus § 13 BBiG gilt unabhängig vom Alter, und in Baden-Württemberg besteht die Berufsschulpflicht für Auszubildende grundsätzlich bis zum Ende der Ausbildung." },
      { f: "Darf mein Chef mich statt zur Schule in den Betrieb holen?", a: "Nein. Der Betrieb muss dich für den Berufsschulunterricht freistellen (§ 15 BBiG). Ein Verstoß ist eine Ordnungswidrigkeit — wende dich an die Ausbildungsberatung." }
    ],
    verwandt: ["freistellung", "krankmeldung", "abschlusspruefung"]
  },

  {
    id: "krankmeldung",
    thema: "pflichten-azubi",
    titel: "Krankheit & Fehlzeiten richtig melden",
    kurz: "Wer krank ist, meldet sich unverzüglich im Betrieb — an Schultagen auch in der Berufsschule. Die Vergütung läuft bei Arbeitsunfähigkeit bis zu sechs Wochen weiter.",
    stichworte: ["krank", "Krankmeldung", "Krankschreibung", "AU", "eAU", "Attest", "Arzt", "Fehlzeiten", "Entgeltfortzahlung", "arbeitsunfähig"],
    recht: [
      { n: "§ 5 EFZG", t: "Anzeige- und Nachweispflicht" },
      { n: "§ 3 EFZG", t: "Entgeltfortzahlung im Krankheitsfall" },
      { n: "§ 19 Abs. 1 Nr. 2 BBiG", t: "Fortzahlung der Vergütung" }
    ],
    fakten: [
      "**Unverzüglich melden:** vor Arbeitsbeginn im Betrieb Bescheid geben (Anruf/vereinbarter Weg) — an Berufsschultagen auch der Schule.",
      "**Nachweis:** spätestens ab dem 4. Kalendertag ist eine ärztliche AU-Feststellung nötig; der Betrieb kann sie **schon ab dem 1. Tag** verlangen.",
      "Gesetzlich Versicherte: Der Betrieb ruft die **elektronische AU (eAU)** bei der Krankenkasse ab — die Pflicht, sich zu melden und untersuchen zu lassen, bleibt.",
      "**Entgeltfortzahlung:** bis zu **6 Wochen** volle Vergütung (nach 4 Wochen Betriebszugehörigkeit), danach Krankengeld der Kasse.",
      "Hohe Fehlzeiten können die **Zulassung zur Abschlussprüfung** gefährden — Verlängerung rechtzeitig prüfen."
    ],
    abschnitte: [
      { t: "Der richtige Ablauf", d: 2, text: "1. **Sofort melden** — telefonisch oder auf dem im Betrieb vereinbarten Weg, mit voraussichtlicher Dauer.\n2. **Ärztin/Arzt aufsuchen**, wenn die Krankheit länger dauert oder der Betrieb einen Nachweis verlangt.\n3. **Folgebescheinigung** nicht vergessen, wenn die Krankheit länger dauert als bescheinigt.\n4. An **Berufsschultagen zusätzlich die Schule** informieren und die Entschuldigung nach deren Regeln nachreichen.\n\nMinderjährige: Eltern kümmern sich mit — die Meldepflicht trifft aber den Azubi selbst." },
      { t: "Fehlzeiten und Prüfungszulassung", d: 3, text: "Für die Zulassung zur Abschlussprüfung muss die Ausbildungszeit „zurückgelegt“ sein (§ 43 BBiG). Als Faustregel der Praxis gelten Fehlzeiten von **mehr als etwa 10 %** der Ausbildungszeit als kritisch — entscheidend ist der Einzelfall (Lage, Gründe, Leistungsstand). Bei absehbar hohen Fehlzeiten (lange Krankheit, Reha): früh mit der zuständigen Stelle sprechen; eine **Verlängerung nach § 8 Abs. 2 BBiG** sichert den Abschluss.", },
      { t: "Krank in der Probezeit / im Urlaub", d: 3, text: "- **Probezeit:** Entgeltfortzahlung gibt es erst nach vier Wochen Betriebszugehörigkeit (§ 3 Abs. 3 EFZG); die Krankmeldungspflichten gelten ab dem ersten Tag.\n- **Im Urlaub:** ärztlich bescheinigte Krankheitstage werden **nicht auf den Urlaub angerechnet** (§ 9 BUrlG) — Attest ab dem ersten Tag besorgen.\n- **Arzttermine:** möglichst außerhalb der Ausbildungszeit legen; unaufschiebbare Termine sind Freistellungsfälle (§ 616 BGB)." }
    ],
    rollen: {
      azubi: "Melde dich **vor** Arbeitsbeginn, nicht erst mittags — Zuspätmelden ist der häufigste vermeidbare Ärger. Denk an Schule **und** Betrieb, und bei längerer Krankheit an die Folgebescheinigung.",
      betrieb: "Legen Sie den Meldeweg schriftlich fest (wer, bis wann, wie). Die eAU rufen Sie bei der Kasse ab; verlangen Sie den Nachweis ab dem ersten Tag nur mit klarer Regelung. Fehlzeiten dokumentieren und bei Häufung das Gespräch suchen, nicht die Abmahnungskaskade.",
      beratung: "Bei drohender Nichtzulassung wegen Fehlzeiten: Fehltage, Gründe und Leistungsstand zusammentragen, Verlängerungsantrag nach § 8 Abs. 2 BBiG anregen. Wiederholtes „Blaumachen“ ist dagegen ein Verhaltensproblem — Stufenplan mit Betrieb und ggf. Schule vereinbaren."
    },
    faq: [
      { f: "Ab wann brauche ich eine Krankschreibung?", a: "Spätestens, wenn du länger als drei Kalendertage krank bist — dann muss die ärztliche Feststellung am vierten Tag vorliegen. Dein Betrieb darf den Nachweis aber auch schon ab dem ersten Tag verlangen (§ 5 EFZG). Melden musst du dich in jedem Fall sofort." },
      { f: "Bekomme ich als Azubi Geld, wenn ich krank bin?", a: "Ja — deine Ausbildungsvergütung läuft bei Arbeitsunfähigkeit bis zu sechs Wochen weiter (§ 3 EFZG, § 19 BBiG), wenn dein Ausbildungsverhältnis schon mindestens vier Wochen besteht. Danach zahlt die Krankenkasse Krankengeld." },
      { f: "Was ist, wenn ich am Berufsschultag krank bin?", a: "Betrieb und Berufsschule informieren — beide. Die Entschuldigung reichst du nach den Regeln der Schule nach; der Betrieb bekommt Meldung und ggf. AU-Nachweis wie an jedem anderen Tag." }
    ],
    verwandt: ["fortzahlung", "urlaub", "nichtbestehen"]
  },

  /* =================== Pflichten der Ausbildenden =================== */
  {
    id: "ausbildungspflicht",
    thema: "pflichten-betrieb",
    titel: "Planmäßig ausbilden — keine ausbildungsfremden Arbeiten",
    kurz: "Der Betrieb muss die berufliche Handlungsfähigkeit planmäßig, sachlich und zeitlich gegliedert vermitteln. Azubis dürfen nur Aufgaben erhalten, die dem Ausbildungszweck dienen und ihren Kräften angemessen sind.",
    stichworte: ["Ausbildungspflicht", "Ausbildungsplan", "ausbildungsfremd", "Hilfsarbeiter", "kehren", "putzen", "Ausbildungsordnung", "planmäßig", "Ausbildungsziel"],
    recht: [
      { n: "§ 14 Abs. 1 Nr. 1 BBiG", t: "Pflicht zur planmäßigen Ausbildung" },
      { n: "§ 14 Abs. 3 BBiG", t: "Nur dem Ausbildungszweck dienende Aufgaben" },
      { n: "§ 14 Abs. 1 Nr. 5 BBiG", t: "Charakterliche Förderung, Schutz vor Gefährdung" }
    ],
    fakten: [
      "Grundlage ist die **Ausbildungsordnung** des Berufs und der **betriebliche Ausbildungsplan** — er ist Vertragsbestandteil.",
      "Aufgaben müssen dem **Ausbildungszweck dienen** und den **körperlichen Kräften angemessen** sein (§ 14 Abs. 3 BBiG).",
      "Gelegentliche Hilfstätigkeiten (Aufräumen, Reinigen des eigenen Arbeitsplatzes) sind zulässig — **prägend** dürfen sie nicht werden.",
      "Der Betrieb muss Azubis **charakterlich fördern** und vor sittlicher und körperlicher **Gefährdung schützen** (§ 14 Abs. 1 Nr. 5).",
      "Dauerhafte ausbildungsfremde Beschäftigung ist ein **Kündigungsgrund für die Azubis** und kann zu Aufsichtsmaßnahmen führen."
    ],
    abschnitte: [
      { t: "Was heißt „planmäßig“?", d: 2, text: "Die Ausbildung folgt der sachlichen und zeitlichen Gliederung: Alle Inhalte der Ausbildungsordnung müssen im vorgesehenen Zeitraum tatsächlich vermittelt werden — im Gartenbau z. B. Kulturführung, Pflanzenschutz, Bodenbearbeitung, Maschinenkunde, betriebliche Abläufe. Kann der Betrieb einzelne Inhalte nicht selbst vermitteln (z. B. bestimmte Kulturen oder Technik), sind **Verbundausbildung oder überbetriebliche Lehrgänge** der richtige Weg." },
      { t: "Abgrenzung: zulässige Mitarbeit vs. ausbildungsfremd", d: 3, text: "**Zulässig:** produktive Mitarbeit im Rahmen der Ausbildung (Azubis lernen durch Arbeiten), saisonale Schwerpunkte, gelegentliche Hilfstätigkeiten, die zum Betriebsalltag gehören.\n\n**Nicht zulässig:**\n\n- über Wochen nur ungelernte Tätigkeiten (nur Unkraut jäten, nur Spülen/Kehren, reine Fahrertätigkeit)\n- regelmäßige **private Erledigungen** für Inhaber oder Führungskräfte\n- Einsatz als **billige Vollzeitkraft** ohne Anleitung, insbesondere in der Saison\n- Aufgaben, die gegen **Jugendarbeitsschutz** oder Arbeitsschutz verstoßen\n\nMaßstab ist immer: Bringt die Tätigkeit die Ausbildung voran und bleibt das Ausbildungsziel erreichbar?" },
      { t: "Konsequenzen bei Verstößen", d: 3, text: "Wird planwidrig oder ausbildungsfremd „ausgebildet“, kann die zuständige Stelle beraten, **Auflagen** machen und Fristen setzen (§ 76 BBiG); bei fortgesetzten schweren Mängeln kommt die **Untersagung des Einstellens und Ausbildens** durch die zuständige Behörde in Betracht (§ 33 BBiG). Azubis können aus wichtigem Grund **kündigen** (§ 22 Abs. 2 Nr. 1 BBiG) und haben dann ggf. einen **Schadensersatzanspruch** (§ 23 BBiG)." }
    ],
    rollen: {
      azubi: "Führ dein Berichtsheft ehrlich — es zeigt schwarz auf weiß, wenn du monatelang nur Hilfsarbeiten machst. Sprich das Problem an und hol dir die Ausbildungsberatung dazu, bevor du hinschmeißt.",
      betrieb: "Hängen Sie den Ausbildungsplan nicht in den Ordner, sondern in den Arbeitsalltag: Wer vermittelt wann welche Inhalte? Saisonspitzen sind erlaubt, dürfen die Ausbildung aber nicht ersetzen. Fehlende Inhalte über Lehrgänge oder Partnerbetriebe abdecken.",
      beratung: "Beschwerden über ausbildungsfremde Beschäftigung mit Berichtsheft und Ausbildungsplan abgleichen, Betrieb anhören, konkrete schriftliche Vereinbarung mit Frist treffen (welche Inhalte bis wann). Wiedervorlage setzen und Verlauf im Vermerk dokumentieren."
    },
    faq: [
      { f: "Darf ich als Azubi zum Putzen und Kehren eingeteilt werden?", a: "Gelegentlich ja — das gehört zum Betriebsalltag. Unzulässig wird es, wenn solche ausbildungsfremden Tätigkeiten deine Ausbildung prägen und du die eigentlichen Inhalte nicht lernst (§ 14 BBiG). Dann hilft die Ausbildungsberatung." },
      { f: "Mein Betrieb kann bestimmte Inhalte gar nicht vermitteln — was nun?", a: "Der Betrieb muss die Lücke schließen, z. B. über überbetriebliche Lehrgänge, Verbundausbildung oder Praxisphasen in einem Partnerbetrieb. Die zuständige Stelle berät dazu — notfalls ist die Eignung der Ausbildungsstätte zu überprüfen." }
    ],
    verwandt: ["lernpflicht", "ausbilder", "ausbildungsberatung"]
  },

  {
    id: "ausbilder",
    thema: "pflichten-betrieb",
    titel: "Ausbilder/in & Eignung des Betriebs",
    kurz: "Ausbilden darf nur, wer persönlich und fachlich geeignet ist. Der Betrieb muss geeignet sein, eine verantwortliche Ausbilderin oder einen Ausbilder bestellen und Wechsel der zuständigen Stelle melden.",
    stichworte: ["Ausbilder", "Ausbildereignung", "Meister", "AEVO", "Eignung", "Fachkraft", "Betreuungsschlüssel", "Ausbilderwechsel", "Anerkennung", "Ausbildungsbetrieb werden"],
    recht: [
      { n: "§§ 27–30 BBiG", t: "Eignung von Ausbildungsstätte und Personal" },
      { n: "§ 76 BBiG", t: "Überwachung durch die zuständige Stelle" }
    ],
    fakten: [
      "**Persönlich geeignet** ist nicht, wer Kinder und Jugendliche nicht beschäftigen darf oder wiederholt schwer gegen das BBiG verstoßen hat (§ 29 BBiG).",
      "**Fachlich geeignet** ist, wer die beruflichen Fertigkeiten und die **berufs- und arbeitspädagogische Eignung** besitzt — im Gartenbau klassisch über die **Meisterprüfung**.",
      "Das Verhältnis von **Fachkräften zu Azubis** muss angemessen sein (§ 27 BBiG).",
      "Die Ausbilderin/der Ausbilder muss die Ausbildung **unmittelbar, verantwortlich und in wesentlichem Umfang** selbst durchführen oder überwachen.",
      "**Ausbilderwechsel und längere Abwesenheit** (Ausscheiden, Elternzeit, Krankheit) sind der zuständigen Stelle unverzüglich zu melden.",
      "**Anerkennung des Betriebs:** Anträge bis **20. April** (Frühsommertermin) bzw. **20. September** (Herbsttermin) beim Regierungspräsidium — vor der amtlichen Anerkennung darf **kein Ausbildungsverhältnis** begonnen werden."
    ],
    abschnitte: [
      { t: "Wer darf im Gartenbau ausbilden?", d: 2, text: "Regelfall ist die **Gärtnermeisterin/der Gärtnermeister** der jeweiligen Fachrichtung — die Meisterprüfung schließt die berufs- und arbeitspädagogische Qualifikation ein. Auch Absolventinnen und Absolventen einschlägiger **Techniker-, Fachagrarwirt- oder Hochschulabschlüsse** können fachlich geeignet sein; die pädagogische Eignung ist dann gesondert nachzuweisen. Über Anerkennung und Ausnahmen entscheidet die **zuständige Stelle** — vor der ersten Eintragung dort klären.", },
      { t: "Anerkennung als Ausbildungsbetrieb", d: 2, text: "Erstmalige Ausbildungsbetriebe stellen einen **Anerkennungsantrag** beim Regierungspräsidium. Geprüft werden die **Eignung der Ausbildungsstätte** nach der Eignungsverordnung (GartAusbStEignV — Anforderungen je Fachrichtung: Kulturen, Flächen, Technik) und die **Ausbildereignung**. Antragstermine: bis **20. April** für den Frühsommer, bis **20. September** für den Herbst; später eingehende Anträge rutschen ins nächste Halbjahr. Wichtig: Erst nach der Anerkennung darf ein Ausbildungsverhältnis beginnen. Bereits anerkannte Ausbilder/innen brauchen bei einem Betriebswechsel keine erneute persönliche Anerkennung." },
      { t: "Wenn die Ausbilderin/der Ausbilder ausfällt", d: 3, text: "Scheidet die Ausbilderin/der Ausbilder aus oder fällt länger aus, muss der Betrieb **unverzüglich** eine geeignete Nachfolge benennen und der zuständigen Stelle melden. Gelingt das nicht in angemessener Zeit, ist die ordnungsgemäße Ausbildung nicht mehr gesichert — die zuständige Stelle berät zu Lösungen (externe Ausbilder, Verbund, Betriebswechsel der Azubis) und muss notfalls die Eignung der Ausbildungsstätte neu bewerten." }
    ],
    rollen: {
      azubi: "Du hast Anspruch auf eine benannte, erreichbare Ausbilderin oder einen Ausbilder. Wenn niemand mehr für deine Ausbildung verantwortlich ist (z. B. nach Kündigung des Meisters), informiere die Ausbildungsberatung.",
      betrieb: "Melden Sie Ausbilderwechsel sofort — nicht erst bei der nächsten Eintragung. Prüfen Sie den Betreuungsschlüssel, bevor Sie zusätzliche Azubis einstellen, und halten Sie die pädagogische Qualifikation aktuell.",
      beratung: "Bei Eignungszweifeln strukturiert prüfen: Qualifikationsnachweise, Fachkräftezahl, tatsächliche Anleitung im Alltag (Betriebsbesuch). Übergangslösungen befristen und schriftlich festhalten; Fristablauf aktiv nachverfolgen."
    },
    faq: [
      { f: "Wer darf Azubis im Gartenbau ausbilden?", a: "Persönlich und fachlich Geeignete — im Regelfall Gärtnermeister/innen der Fachrichtung. Andere Qualifikationen (Techniker, Studium) können anerkannt werden; das entscheidet die zuständige Stelle, in Baden-Württemberg das Regierungspräsidium." },
      { f: "Unser Ausbilder hat gekündigt — dürfen wir weiter ausbilden?", a: "Nur, wenn unverzüglich eine geeignete neue Ausbilderin oder ein Ausbilder bestellt und der zuständigen Stelle gemeldet wird. Ohne verantwortliche Ausbilderperson ist die Ausbildung nicht mehr ordnungsgemäß — sprechen Sie sofort mit der Ausbildungsberatung." },
      { f: "Wie wird unser Betrieb anerkannter Ausbildungsbetrieb?", a: "Anerkennungsantrag beim Regierungspräsidium stellen — bis 20. April für den Frühsommer- oder bis 20. September für den Herbsttermin. Geprüft werden Ausbildungsstätte (Eignungsverordnung GartAusbStEignV, je Fachrichtung) und Ausbildereignung, meist mit Betriebsbesichtigung. Erst nach der Anerkennung darf ein Ausbildungsverhältnis beginnen." }
    ],
    verwandt: ["eintragung", "ausbildungspflicht", "zustaendige-stelle"]
  },

  {
    id: "ausbildungsmittel",
    thema: "pflichten-betrieb",
    titel: "Kostenlose Ausbildungsmittel",
    kurz: "Werkzeuge, Werkstoffe und Fachliteratur, die für die Ausbildung und für Prüfungen nötig sind, stellt der Betrieb kostenlos — auch die Materialien für die Prüfungsstücke.",
    stichworte: ["Ausbildungsmittel", "Werkzeug", "Kosten", "Fachliteratur", "Bücher", "Arbeitskleidung", "Schutzkleidung", "PSA", "bezahlen", "Prüfungsmaterial"],
    recht: [
      { n: "§ 14 Abs. 1 Nr. 3 BBiG", t: "Kostenlose Ausbildungsmittel" },
      { n: "§ 3 Abs. 3 ArbSchG", t: "Kosten des Arbeitsschutzes trägt der Arbeitgeber" }
    ],
    fakten: [
      "Kostenlos bereitzustellen sind die **Ausbildungsmittel**: Werkzeuge, Maschinen, Werkstoffe und **Fachliteratur**, die für Ausbildung sowie **Zwischen- und Abschlussprüfung** erforderlich sind.",
      "**Persönliche Schutzausrüstung** (Schnittschutz, Gehörschutz, Sicherheitsschuhe bei Gefährdung) zahlt der Arbeitgeber — Kosten dürfen nicht auf Azubis umgelegt werden.",
      "**Normale Arbeitskleidung** ohne Schutzfunktion können Azubis selbst zu tragen haben, sofern nichts anderes vereinbart oder tariflich geregelt ist.",
      "Kostenklauseln, die Azubis Ausbildungsmittel oder Lehrgänge in Rechnung stellen, sind regelmäßig **unwirksam**."
    ],
    abschnitte: [
      { t: "Typische Streitfälle", d: 2, text: "- **Berufsschulbücher/Lernmittel:** Materialien für den Schulunterricht sind keine betrieblichen Ausbildungsmittel; hier gelten die schulischen Lernmittelregeln. Fachliteratur, die der **Betrieb** für die Ausbildung voraussetzt, zahlt der Betrieb.\n- **Prüfungsmaterial:** Werkstoffe und Pflanzen für Prüfungsstücke sind seit der BBiG-Reform 2020 ausdrücklich erfasst — der Betrieb stellt sie kostenlos.\n- **Werkzeugverlust:** Bei leicht fahrlässigem Verlust haften Azubis nicht oder nur anteilig (innerbetrieblicher Schadensausgleich).\n- **Fahrtkosten** zur Berufsschule oder zu Lehrgängen: keine Ausbildungsmittel; ggf. Tarifvertrag, Förderprogramme oder Zuschüsse prüfen." }
    ],
    rollen: {
      azubi: "Du musst weder Schere noch Fachbuch fürs Prüfungsstück selbst kaufen, wenn der Betrieb sie für die Ausbildung verlangt. Lass dir Anschaffungen nicht vom Lohn abziehen — solche Abreden sind meist unwirksam.",
      betrieb: "Stellen Sie eine Grundausstattung je Azubi zusammen (Werkzeug, PSA, Fachbuch) und dokumentieren Sie die Übergabe. Das vermeidet Streit und zeigt der zuständigen Stelle geordnete Verhältnisse.",
      beratung: "Kostenabreden im Vertrag (Lehrgangskosten, „Ausbildungsgebühren“, Kaution) bei der Eintragung beanstanden. Bei PSA-Verstößen auf Arbeitsschutzrecht verweisen — hier ist die Rechtslage eindeutig."
    },
    faq: [
      { f: "Muss ich meine Arbeitskleidung selbst bezahlen?", a: "Normale Arbeitskleidung ohne Schutzfunktion in der Regel ja (sofern kein Tarifvertrag anderes sagt). Persönliche Schutzausrüstung — etwa Sicherheitsschuhe oder Schnittschutz — muss dagegen der Betrieb stellen und bezahlen." },
      { f: "Wer zahlt das Material für mein Prüfungsstück?", a: "Der Ausbildungsbetrieb. Ausbildungsmittel, die für die Zwischen- und Abschlussprüfung erforderlich sind, sind kostenlos bereitzustellen (§ 14 Abs. 1 Nr. 3 BBiG)." }
    ],
    verwandt: ["ausbildungspflicht", "berichtsheft", "abschlusspruefung"]
  },

  {
    id: "freistellung",
    thema: "pflichten-betrieb",
    titel: "Freistellung & Anrechnung: Berufsschule, Prüfungen",
    kurz: "Der Betrieb muss für Berufsschule, Prüfungen und den Arbeitstag vor der schriftlichen Abschlussprüfung freistellen. Seit 2020 gelten die Anrechnungsregeln für alle Azubis — nicht nur für Jugendliche.",
    stichworte: ["Freistellung", "Anrechnung", "Berufsschultag", "Blockunterricht", "nach der Schule arbeiten", "Prüfungstag", "Tag vor der Prüfung", "9 Uhr"],
    recht: [
      { n: "§ 15 BBiG", t: "Freistellung, Anrechnung" },
      { n: "§§ 9, 10 JArbSchG", t: "Berufsschule und Prüfungen bei Jugendlichen" },
      { n: "§ 19 Abs. 1 Nr. 1 BBiG", t: "Vergütungsfortzahlung bei Freistellung" }
    ],
    fakten: [
      "Freizustellen ist für **Berufsschulunterricht**, **Prüfungen** und Ausbildungsmaßnahmen **außerhalb der Ausbildungsstätte**.",
      "**Vor 9 Uhr beginnender Unterricht:** vorher keine Beschäftigung — gilt für Jugendliche **und** volljährige Berufsschulpflichtige (§ 9 JArbSchG).",
      "**Ein Berufsschultag mit mehr als 5 Unterrichtsstunden** (à 45 min) wird **einmal pro Woche** mit der durchschnittlichen täglichen Ausbildungszeit angerechnet — danach kein Rückruf in den Betrieb.",
      "**Blockunterricht** (planmäßig mind. 25 Stunden an mind. 5 Tagen) zählt mit der durchschnittlichen **wöchentlichen** Ausbildungszeit; zusätzliche betriebliche Ausbildung max. 2 Stunden/Woche.",
      "**Der Arbeitstag unmittelbar vor der schriftlichen Abschlussprüfung** ist frei — bei voller Vergütung.",
      "Die Vergütung wird für alle Freistellungszeiten **weitergezahlt** (§ 19 BBiG)."
    ],
    abschnitte: [
      { t: "Rechenbeispiele", d: 2, text: "- **Ein Schultag, 6 Unterrichtsstunden, Betrieb mit 8-Stunden-Tag:** Der Tag zählt als 8 Stunden — der Azubi muss danach nicht mehr in den Betrieb (einmal pro Woche; ein zweiter langer Schultag in derselben Woche wird nur mit Unterrichtszeit inkl. Pausen und Wegezeiten angerechnet).\n- **Schultag mit 4 Unterrichtsstunden:** Angerechnet werden Unterrichtszeit und Wege — für den Rest des Tages kann der Betrieb die Rückkehr verlangen, wenn sich der Einsatz noch lohnt und Wegezeiten das zulassen.\n- **Blockwoche:** Die Woche gilt als volle Ausbildungswoche. Der Betrieb darf zusätzlich höchstens 2 Stunden betriebliche Ausbildung ansetzen — in der Praxis selten sinnvoll.", },
      { t: "Jugendliche: strengere Regeln", d: 3, text: "Für unter 18-Jährige gilt § 9 JArbSchG: Ein Berufsschultag mit mehr als 5 Unterrichtsstunden wird generell mit 8 Stunden angerechnet (einmal pro Woche), Blockwochen mit 40 Stunden. Nach dem Unterricht dürfen Jugendliche an solchen Tagen **nicht mehr beschäftigt** werden. Für Prüfungen gilt § 10 JArbSchG: Freistellung auch **am Arbeitstag unmittelbar vor der schriftlichen Abschlussprüfung**." },
      { t: "Häufige Verstöße", d: 3, text: "- Rückruf in den Betrieb nach dem vollen Schultag („kommst du noch für zwei Stunden?“)\n- Beschäftigung **vor** frühem Unterricht\n- Arbeit am Tag vor der schriftlichen Abschlussprüfung\n- „Nacharbeiten“ von Schulzeiten am Wochenende\n\nAlle vier Konstellationen verstoßen gegen § 15 BBiG bzw. §§ 9, 10 JArbSchG und sind bußgeldbewehrt (§ 102 BBiG, § 58 JArbSchG)." }
    ],
    rollen: {
      azubi: "Merk dir zwei Regeln: Nach einem vollen Schultag (mehr als 5 Stunden Unterricht, einmal pro Woche) ist Feierabend, und der Arbeitstag vor deiner schriftlichen Abschlussprüfung ist zum Lernen frei. „Nacharbeiten“ musst du Schulzeit nie.",
      betrieb: "Rechnen Sie Schulzeiten korrekt an — die Anrechnungsregeln gelten seit 2020 für alle Azubis. Faustregel: langer Schultag = ganzer Ausbildungstag (1× pro Woche). Planen Sie den Tag vor der schriftlichen Abschlussprüfung von vornherein frei.",
      beratung: "Freistellungsverstöße sind häufig Unwissen, nicht böser Wille — § 15 BBiG in der Fassung seit 2020 erläutern (viele kennen nur die alte JArbSchG-Logik). Bei Wiederholung schriftlich beanstanden; Ordnungswidrigkeit ansprechen."
    },
    faq: [
      { f: "Muss ich nach der Berufsschule noch in den Betrieb?", a: "An einem Schultag mit mehr als fünf Unterrichtsstunden (einmal pro Woche): nein — der Tag ist mit der vollen Ausbildungszeit angerechnet. An kürzeren Schultagen kann der Betrieb die Rückkehr verlangen; angerechnet werden Unterricht, Pausen und Wegezeiten." },
      { f: "Habe ich vor der Abschlussprüfung frei?", a: "Ja — der Arbeitstag, der der schriftlichen Abschlussprüfung unmittelbar vorausgeht, ist bezahlt frei (§ 15 Abs. 1 Nr. 4 BBiG; für Jugendliche § 10 JArbSchG). Die Prüfungstage selbst sind ebenfalls freigestellt." },
      { f: "Mein Unterricht beginnt um 8 Uhr — darf ich vorher arbeiten?", a: "Nein. Vor einem vor 9 Uhr beginnenden Unterricht dürfen Azubis nicht beschäftigt werden — das gilt auch für volljährige Berufsschulpflichtige (§ 9 Abs. 1 JArbSchG)." }
    ],
    verwandt: ["berufsschulpflicht", "arbeitszeit-jugendliche", "abschlusspruefung"]
  },

  {
    id: "zeugnis",
    thema: "pflichten-betrieb",
    titel: "Das Ausbildungszeugnis",
    kurz: "Am Ende der Ausbildung haben Azubis Anspruch auf ein schriftliches Zeugnis — auf Verlangen mit Angaben zu Verhalten und Leistung (qualifiziertes Zeugnis).",
    stichworte: ["Zeugnis", "Arbeitszeugnis", "Ausbildungszeugnis", "qualifiziert", "Beurteilung", "Ende", "Bewerbung"],
    recht: [
      { n: "§ 16 BBiG", t: "Zeugnis" }
    ],
    fakten: [
      "Das Zeugnis ist **bei Beendigung** des Ausbildungsverhältnisses auszustellen — unaufgefordert.",
      "**Schriftform ist Pflicht**, die elektronische Form ist ausgeschlossen (§ 16 Abs. 1 BBiG).",
      "Inhalt des einfachen Zeugnisses: Art, Dauer und **Ziel der Ausbildung**, erworbene Fertigkeiten und Kenntnisse.",
      "**Auf Verlangen** sind Angaben zu **Verhalten und Leistung** aufzunehmen (qualifiziertes Zeugnis).",
      "Das Zeugnis muss **wahr und wohlwollend** formuliert sein — versteckte Negativcodes sind unzulässig."
    ],
    abschnitte: [
      { t: "Einfaches oder qualifiziertes Zeugnis?", d: 2, text: "Für Bewerbungen ist das **qualifizierte Zeugnis** Standard — Azubis sollten es aktiv verlangen. Es bewertet Leistung, Arbeitsweise und Sozialverhalten in der bekannten Zeugnissprache. Wer mit der Bewertung nicht einverstanden ist, kann Korrektur verlangen; Maßstab ist eine durchschnittliche („befriedigende“) Leistung — für Schlechteres trägt der Betrieb, für Besseres der/die Azubi die Beweislast." },
      { t: "Abgrenzung: Zeugnisse und Bescheinigungen", d: 3, text: "- **Ausbildungszeugnis des Betriebs** (§ 16 BBiG) — hier behandelt\n- **Prüfungszeugnis der zuständigen Stelle** (§ 37 Abs. 2 BBiG) — dokumentiert das Prüfungsergebnis\n- **Berufsschulzeugnis** der Schule\n\nAlle drei sind eigenständig. Endet die Ausbildung vorzeitig, besteht der Anspruch auf das betriebliche Zeugnis ebenso — ohne negative Hinweise auf den Beendigungsgrund." }
    ],
    rollen: {
      azubi: "Verlange ausdrücklich ein **qualifiziertes** Zeugnis und prüfe es: vollständige Ausbildungsinhalte, keine Auslassungen, keine doppeldeutigen Formulierungen. Für Bewerbungen zählt es mehr, als viele denken.",
      betrieb: "Stellen Sie das Zeugnis mit dem letzten Ausbildungstag aus — auf Firmenpapier, unterschrieben, ohne Flüchtigkeitsfehler. Ein faires, konkretes Zeugnis ist auch Werbung für Ihren Betrieb als Ausbildungsadresse.",
      beratung: "Bei Zeugnisstreit zunächst auf Korrekturanspruch und Zeugnissprache hinweisen; Musterformulierungen bereithalten. Durchsetzung ist Sache der Arbeitsgerichte — vorher ggf. Schlichtungsausschuss."
    },
    faq: [
      { f: "Bekomme ich auch ein Zeugnis, wenn ich vorzeitig aufhöre?", a: "Ja — der Zeugnisanspruch besteht bei jeder Beendigung des Ausbildungsverhältnisses, auch nach Kündigung oder Aufhebungsvertrag. Der Beendigungsgrund darf nicht negativ hervorgehoben werden." },
      { f: "Was ist der Unterschied zwischen einfachem und qualifiziertem Zeugnis?", a: "Das einfache Zeugnis nennt Art, Dauer und Ziel der Ausbildung sowie die erworbenen Fertigkeiten. Das qualifizierte Zeugnis enthält zusätzlich Angaben zu Verhalten und Leistung — du bekommst es auf Verlangen (§ 16 BBiG) und solltest es für Bewerbungen immer anfordern." }
    ],
    verwandt: ["ende-uebernahme", "abschlusspruefung", "kuendigung"]
  },

  /* =================== Vergütung & Geld ============================= */
  {
    id: "mindestverguetung",
    thema: "verguetung",
    titel: "Angemessene Vergütung & Mindestausbildungsvergütung",
    kurz: "Azubis haben Anspruch auf eine angemessene Vergütung, die jährlich steigt. Absolute Untergrenze ist die gesetzliche Mindestausbildungsvergütung; Tarifverträge — auch im Gartenbau — liegen meist darüber.",
    stichworte: ["Vergütung", "Gehalt", "Lohn", "Geld", "Mindestvergütung", "Mindestausbildungsvergütung", "Azubi-Mindestlohn", "Tarif", "Bezahlung", "verdienen", "Ausbildungsvergütung"],
    recht: [
      { n: "§ 17 BBiG", t: "Vergütungsanspruch und Mindestvergütung" },
      { n: "§ 18 BBiG", t: "Fälligkeit" }
    ],
    fakten: [
      "Die Vergütung muss **angemessen** sein und **mit fortschreitender Ausbildung steigen** — mindestens jährlich (§ 17 Abs. 1 BBiG).",
      "**Mindestausbildungsvergütung (1. Ausbildungsjahr):** Ausbildungsbeginn 2024: 649,00 € · 2025: 682,00 € · 2026: 724,00 € monatlich.",
      "Aufschläge auf den Startwert des **Beginnjahres**: 2. Jahr **+18 %**, 3. Jahr **+35 %**, 4. Jahr **+40 %**.",
      "**Tarifgebundene Betriebe** wenden ihren Tarifvertrag an; ohne Tarifbindung gilt: nicht mehr als **20 % unter** der einschlägigen tariflichen Vergütung — und nie unter der Mindestvergütung.",
      "Die Vergütung ist **spätestens am letzten Arbeitstag des Monats** zu zahlen (§ 18 BBiG)."
    ],
    abschnitte: [
      { t: "Mindestvergütung nach Beginnjahr (Tabelle)", d: 2, text: "Maßgeblich ist das Jahr des **Ausbildungsbeginns**; die Prozentaufschläge beziehen sich auf den Startwert dieses Jahres:\n\n- **Beginn 2024:** 649,00 € / 765,82 € / 876,15 € / 908,60 €\n- **Beginn 2025:** 682,00 € / 804,76 € / 920,70 € / 954,80 €\n- **Beginn 2026:** 724,00 € / 854,32 € / 977,40 € / 1.013,60 €\n\n(je 1.–4. Ausbildungsjahr, brutto pro Monat. Die Werte werden jährlich im Bundesanzeiger bekannt gegeben — **Stand: Juli 2026**, vor Auskünften aktuelle Bekanntmachung prüfen.)" },
      { t: "Tarifvergütung im Gartenbau", d: 2, text: "Für den Gartenbau bestehen Tarifverträge mit eigenen Ausbildungsvergütungen, die regelmäßig **über** der gesetzlichen Mindestvergütung liegen. Tarifgebundene Betriebe müssen sie anwenden; nicht tarifgebundene Betriebe dürfen die einschlägige tarifliche Vergütung um höchstens 20 % unterschreiten (§ 17 Abs. 4 BBiG). Aktuelle Tarifwerte bei der Ausbildungsberatung oder den Tarifpartnern erfragen." },
      { t: "Was zählt zur Vergütung?", d: 3, text: "- Die Vergütung ist **brutto** vereinbart; Sozialversicherungsbeiträge werden abgezogen.\n- **Sachleistungen** (z. B. Kost und Wohnung) können angerechnet werden — höchstens bis 75 % der Bruttovergütung und nur zu den amtlichen Sachbezugswerten (§ 17 Abs. 6 BBiG).\n- **Zulagen und Prämien** können on top kommen (Tarif/Vertrag).\n- Bei **Teilzeitausbildung** darf die Vergütung anteilig gekürzt werden (§ 17 Abs. 5 BBiG).\n- Zu niedrig vereinbarte Vergütung? Der Anspruch auf die angemessene Höhe besteht kraft Gesetzes — Differenzen können (rückwirkend, Verjährung beachten) nachgefordert werden." }
    ],
    rollen: {
      azubi: "Vergleiche deine Abrechnung mit der Tabelle: Beginnjahr suchen, Ausbildungsjahr ablesen. Liegt dein Betrieb im Tarif, gilt der (höhere) Tarifwert. Zu wenig gezahlt? Erst nachfragen, dann hilft die Ausbildungsberatung beim Nachfordern.",
      betrieb: "Prüfen Sie jährlich zum Jahreswechsel und zum Ausbildungsjahresbeginn Ihre Vergütungen gegen Mindestvergütung und Tarif. Anpassungen nicht vergessen — Unterschreitungen fallen bei der Eintragung und bei Prüfungen auf und können nachgefordert werden.",
      beratung: "Bei der Vertragsprüfung: Beginnjahr, Staffel und Tarifbindung abgleichen; die 80-%-Grenze nur bei einschlägigem, räumlich-fachlich passendem Tarif anwenden. Nachforderungsfälle dokumentieren und auf Ausschluss-/Verjährungsfristen hinweisen."
    },
    faq: [
      { f: "Wie hoch ist die Mindestvergütung für Azubis?", a: "Für Ausbildungsbeginn 2026: 724,00 € brutto im ersten Ausbildungsjahr, dann +18 % (854,32 €), +35 % (977,40 €) und +40 % (1.013,60 €) — bezogen auf den Startwert des Beginnjahres. Bei Beginn 2025 sind es 682,00 € im ersten Jahr, bei Beginn 2024 649,00 €. Tarifverträge (z. B. Gartenbau) liegen meist darüber. (Stand: Juli 2026)" },
      { f: "Wann muss meine Ausbildungsvergütung gezahlt werden?", a: "Spätestens am letzten Arbeitstag des laufenden Monats (§ 18 BBiG). Verspätete Zahlung ist ein Vertragsverstoß — bei wiederholtem Zahlungsverzug kann sogar ein wichtiger Kündigungsgrund vorliegen." },
      { f: "Darf mein Betrieb Kost und Wohnung vom Gehalt abziehen?", a: "Anrechnen ja — aber nur zu den amtlichen Sachbezugswerten und höchstens bis 75 % der Bruttovergütung (§ 17 Abs. 6 BBiG). Ein Rest von mindestens 25 % ist immer auszuzahlen." }
    ],
    verwandt: ["ueberstunden", "fortzahlung", "sachbezuege-sozialvers"]
  },

  {
    id: "ueberstunden",
    thema: "verguetung",
    titel: "Überstunden & Mehrarbeit",
    kurz: "Überstunden sind in der Ausbildung die Ausnahme: Sie müssen besonders vergütet oder durch Freizeit ausgeglichen werden. Für Jugendliche ist Mehrarbeit grundsätzlich unzulässig.",
    stichworte: ["Überstunden", "Mehrarbeit", "länger arbeiten", "Freizeitausgleich", "Saison", "Ernte", "ausgleichen", "umsonst arbeiten"],
    recht: [
      { n: "§ 17 Abs. 7 BBiG", t: "Vergütung oder Freizeitausgleich für Überstunden" },
      { n: "§ 8 JArbSchG", t: "Arbeitszeitgrenzen für Jugendliche" },
      { n: "§ 21 JArbSchG", t: "Ausnahmen und Ausgleich" }
    ],
    fakten: [
      "Jede Beschäftigung **über die vereinbarte Ausbildungszeit hinaus** ist besonders zu vergüten **oder** durch entsprechende Freizeit auszugleichen (§ 17 Abs. 7 BBiG).",
      "Überstunden dürfen den **Ausbildungszweck nicht gefährden** — Azubis sind zum Lernen im Betrieb, nicht als Personalreserve.",
      "**Jugendliche:** höchstens 8 Stunden täglich, 40 pro Woche; Ausnahmen nur eng begrenzt (z. B. Landwirtschaft zur Erntezeit, ab 16: bis 9 Stunden/85 Stunden in der Doppelwoche) — stets mit **Ausgleich**.",
      "Überstunden **anordnen** darf der Betrieb bei Azubis nur in engen Grenzen; verlangt werden kann Mehrarbeit regelmäßig nicht.",
      "**Aufzeichnen:** Betriebe müssen über die werktägliche Arbeitszeit hinausgehende Zeiten dokumentieren."
    ],
    abschnitte: [
      { t: "Saisonspitzen im Gartenbau", d: 2, text: "Frühjahr und Ernte bringen lange Tage — trotzdem gilt: Bei **volljährigen** Azubis sind gelegentliche Überstunden nur mit Ausgleich (Geld oder Freizeit) zulässig und sollten die Ausnahme bleiben. Bei **Jugendlichen** erlaubt § 8 Abs. 2 JArbSchG in der Landwirtschaft zur Erntezeit für über 16-Jährige bis zu 9 Stunden täglich und 85 Stunden in der Doppelwoche — der Ausgleich auf durchschnittlich 40 Wochenstunden ist zwingend. Dauerhafte Überstunden sind ein Warnsignal für die Ausbildungsqualität." },
      { t: "Ausgleich richtig handhaben", d: 3, text: "- **Freizeitausgleich** bedeutet echte Freistellung in der Ausbildungszeit — nicht das Streichen von Berufsschulzeiten.\n- **Vergütung:** angemessener Zuschlag ist die Regel, mindestens aber die anteilige Vergütung je Stunde; Tarifverträge enthalten oft konkrete Zuschlagssätze.\n- **Pauschalklauseln** („Überstunden sind mit der Vergütung abgegolten“) sind bei Azubis unwirksam.\n- Ohne zeitnahe Dokumentation lassen sich Ansprüche schwer durchsetzen: Azubis sollten Zeiten selbst notieren (Datum, Beginn, Ende, Anlass)." }
    ],
    rollen: {
      azubi: "Schreib deine Überstunden auf (Datum, von–bis, was du gemacht hast) und kläre zeitnah, ob es Freizeit oder Geld gibt. „Gehört halt dazu“ gilt nicht — schon gar nicht, wenn du unter 18 bist.",
      betrieb: "Planen Sie die Saison mit Fachkräften, nicht mit Azubi-Überstunden. Wenn es doch länger wird: dokumentieren, zeitnah ausgleichen, Jugendliche strikt in den JArbSchG-Grenzen halten — Verstöße sind bußgeldbewehrt.",
      beratung: "Bei Beschwerden Stundenaufzeichnungen beider Seiten anfordern. Häufiges Muster: unbezahlte „Einspringdienste“ am Wochenende. Auf § 17 Abs. 7 BBiG und JArbSchG-Grenzen hinweisen; bei Jugendlichen zusätzlich Gewerbeaufsicht einbeziehen, wenn keine Abhilfe erfolgt."
    },
    faq: [
      { f: "Müssen Überstunden in der Ausbildung bezahlt werden?", a: "Ja — Beschäftigung über die vereinbarte Ausbildungszeit hinaus ist besonders zu vergüten oder durch Freizeit auszugleichen (§ 17 Abs. 7 BBiG). Eine Klausel, die Überstunden pauschal mit dem Gehalt abgilt, ist bei Azubis unwirksam." },
      { f: "Darf ich als 17-Jährige/r Überstunden machen?", a: "Grundsätzlich nein: Für Jugendliche gelten 8 Stunden am Tag und 40 Stunden pro Woche als Obergrenze. In der Landwirtschaft sind zur Erntezeit für über 16-Jährige bis zu 9 Stunden/85 Stunden in der Doppelwoche zulässig — mit zwingendem Freizeitausgleich (§ 8 JArbSchG)." }
    ],
    verwandt: ["arbeitszeit-jugendliche", "arbeitszeit-erwachsene", "mindestverguetung"]
  },

  {
    id: "fortzahlung",
    thema: "verguetung",
    titel: "Fortzahlung der Vergütung",
    kurz: "Die Vergütung läuft weiter, wenn Azubis freigestellt sind (Berufsschule, Prüfungen), bei Krankheit bis zu sechs Wochen und bei kurzer persönlicher Verhinderung wie unaufschiebbaren Terminen.",
    stichworte: ["Fortzahlung", "Entgeltfortzahlung", "Lohnfortzahlung", "krank Geld", "Feiertag", "Arzttermin", "frei bezahlt", "Ausfall"],
    recht: [
      { n: "§ 19 BBiG", t: "Fortzahlung der Vergütung" },
      { n: "§ 3 EFZG", t: "Entgeltfortzahlung im Krankheitsfall" },
      { n: "§ 616 BGB", t: "Vorübergehende Verhinderung" },
      { n: "§ 2 EFZG", t: "Feiertagsvergütung" }
    ],
    fakten: [
      "**Freistellungen** (Berufsschule, Prüfungen, Tag vor der schriftlichen Abschlussprüfung): Vergütung läuft weiter (§ 19 Abs. 1 Nr. 1 BBiG).",
      "**Krankheit:** bis zu **6 Wochen** volle Vergütung (§ 3 EFZG), danach Krankengeld.",
      "**Ausbildungsausfall ohne eigenes Verschulden** (z. B. Betriebsstörung, Auftragsmangel, Wetter): Vergütung bis zu **6 Wochen** weiterzahlen (§ 19 Abs. 1 Nr. 2 BBiG) — „Frostfrei ohne Geld“ gibt es für Azubis nicht.",
      "**Gesetzliche Feiertage:** bezahlt frei (§ 2 EFZG).",
      "**Persönliche Verhinderung** (§ 616 BGB): kurze, unvermeidbare Anlässe wie unaufschiebbare Arztbesuche, Behördentermine, Todesfall in der Familie — bezahlt freizustellen."
    ],
    abschnitte: [
      { t: "Der Sonderfall Schlechtwetter", d: 2, text: "Im Gartenbau relevant: Fällt die Ausbildung wegen Frost, Dauerregen oder Auftragslage aus, tragen **nicht die Azubis** das Risiko. Der Betrieb muss die Vergütung bis zu sechs Wochen fortzahlen (§ 19 Abs. 1 Nr. 2 BBiG) — unbezahlte „Zwangspausen“ oder das Abbummeln von Ausfallzeiten zulasten des Urlaubs sind unzulässig. Sinnvoll: Ausfallzeiten für Theorie, Maschinenpflege, Berichtsheft und Prüfungsvorbereitung nutzen." },
      { t: "Arzttermine richtig legen", d: 3, text: "Grundsatz: Termine **außerhalb der Ausbildungszeit** vereinbaren, wo möglich. Unaufschiebbare Termine (akute Beschwerden, nur zu Praxiszeiten möglich, Facharzt mit langem Vorlauf) sind Fälle des § 616 BGB — bezahlte Freistellung für die erforderliche Zeit. Der Betrieb kann einen Nachweis über die Erforderlichkeit verlangen. Für Jugendliche gilt zusätzlich: ärztliche **Untersuchungen nach dem JArbSchG** sind immer bezahlte Freistellung (§ 43 JArbSchG)." }
    ],
    rollen: {
      azubi: "Merke: Berufsschule, Prüfungen, Krankheit (6 Wochen), Feiertage und echte Notfalltermine — dein Geld läuft weiter. Lass dir Ausfalltage nicht als Urlaub abziehen.",
      betrieb: "Kalkulieren Sie die Fortzahlungspflichten ein — auch für witterungsbedingte Ausfälle. Wer Ausfallzeiten mit sinnvoller Ausbildung füllt (Theorie, Technik, Berichtsheft), verliert nichts.",
      beratung: "Häufige Beschwerde im Winterhalbjahr: unbezahlte Freistellung wegen Wetterlage. § 19 Abs. 1 Nr. 2 BBiG zitieren und Nachzahlung anregen; bei Weigerung auf Schlichtung/Klageweg und ggf. Aufsichtsmaßnahmen hinweisen."
    },
    faq: [
      { f: "Bekomme ich Geld, wenn der Betrieb wegen Frost nichts zu tun hat?", a: "Ja. Fällt die Ausbildung aus Gründen aus, die in der Sphäre des Betriebs liegen (auch Witterung oder Auftragsmangel), läuft deine Vergütung bis zu sechs Wochen weiter (§ 19 Abs. 1 Nr. 2 BBiG). Unbezahlt nach Hause schicken ist nicht zulässig." },
      { f: "Muss der Betrieb mich für einen Arzttermin bezahlt freistellen?", a: "Wenn der Termin unaufschiebbar ist und sich nicht außerhalb der Ausbildungszeit legen lässt: ja, für die erforderliche Zeit (§ 616 BGB). Planbare Termine gehören aber grundsätzlich in die Freizeit." }
    ],
    verwandt: ["krankmeldung", "mindestverguetung", "urlaub"]
  },

  {
    id: "sachbezuege-sozialvers",
    thema: "verguetung",
    titel: "Abrechnung, Sachbezüge & Sozialversicherung",
    kurz: "Azubis sind ab dem ersten Tag voll sozialversichert. Die Abrechnung zeigt Brutto, Abzüge und angerechnete Sachbezüge — Kost und Logis dürfen nur begrenzt angerechnet werden.",
    stichworte: ["Abrechnung", "Lohnabrechnung", "brutto netto", "Sozialversicherung", "Krankenkasse", "Rente", "Sachbezug", "Kost und Logis", "Unterkunft", "Kindergeld"],
    recht: [
      { n: "§ 17 Abs. 6 BBiG", t: "Anrechnung von Sachleistungen" },
      { n: "SGB IV/V/VI/XI", t: "Sozialversicherungspflicht" },
      { n: "SvEV", t: "Amtliche Sachbezugswerte" }
    ],
    fakten: [
      "Azubis sind **kranken-, pflege-, renten-, arbeitslosen- und unfallversichert** — die Beiträge teilen sich Betrieb und Azubi (Unfallversicherung zahlt der Betrieb allein).",
      "Bei sehr niedriger Vergütung (bis zur **Geringverdienergrenze von 325 €**) trägt der Betrieb die Sozialbeiträge allein.",
      "**Sachbezüge** (Kost, Wohnung) werden zu den **amtlichen Werten** angerechnet — höchstens bis 75 % der Bruttovergütung.",
      "Azubis erhalten eine **schriftliche Abrechnung**; Fehler sollten sofort reklamiert werden.",
      "**Kindergeld** läuft während der ersten Ausbildung grundsätzlich bis zum 25. Lebensjahr weiter."
    ],
    abschnitte: [
      { t: "Die Abrechnung lesen", d: 2, text: "Auf der Abrechnung stehen: Bruttovergütung, angerechnete Sachbezüge, Steuerabzüge (bei Azubi-Vergütungen oft 0 €), Sozialversicherungsbeiträge und der Auszahlungsbetrag. Wohnt der/die Azubi im Betrieb (im Gartenbau nicht selten), erscheint die Unterkunft als Sachbezug: Sie erhöht das sozialversicherungspflichtige Brutto und mindert die Auszahlung — aber nur zu den amtlichen Sachbezugswerten und in den Grenzen des § 17 Abs. 6 BBiG." },
      { t: "Weitere Leistungen und Förderungen", d: 3, text: "- **Vermögenswirksame Leistungen**: je nach Tarifvertrag\n- **Berufsausbildungsbeihilfe (BAB)** der Agentur für Arbeit: bei auswärtiger Unterbringung und geringem Einkommen — früh beantragen\n- **Wohn-/Fahrtkostenzuschüsse**: regionale Programme und ggf. tarifliche Regelungen prüfen\n- **Deutschlandticket/Jugendtickets**: Landes-/Verbundangebote für Azubis nutzen\n\nDie Ausbildungsberatung kennt die üblichen Anlaufstellen und verweist weiter." }
    ],
    rollen: {
      azubi: "Heb deine Abrechnungen auf (Rente!), prüfe Sachbezugsabzüge gegen die amtlichen Werte und stelle bei auswärtiger Unterbringung früh einen BAB-Antrag — das Geld gibt es nicht rückwirkend für verpasste Monate.",
      betrieb: "Melden Sie Azubis ab dem ersten Tag zur Sozialversicherung an und rechnen Sie Sachbezüge korrekt ab. Bei Unterbringung im Betrieb: Standards und Werte transparent in den Vertrag aufnehmen.",
      beratung: "Bei Beschwerden über hohe Abzüge zunächst Sachbezugsanrechnung prüfen (75-%-Grenze, amtliche Werte). Für Härtefälle BAB und regionale Förderwege parat haben."
    },
    faq: [
      { f: "Bin ich als Azubi krankenversichert?", a: "Ja — mit Ausbildungsbeginn wirst du eigenständiges Mitglied der gesetzlichen Kranken- und Pflegeversicherung; dazu kommen Renten-, Arbeitslosen- und Unfallversicherung. Die Beiträge teilen sich Betrieb und Azubi; bis 325 € Vergütung zahlt der Betrieb allein." },
      { f: "Wie viel darf der Betrieb für Zimmer und Verpflegung abziehen?", a: "Nur die amtlichen Sachbezugswerte, und insgesamt dürfen Sachleistungen höchstens 75 % deiner Bruttovergütung ausmachen (§ 17 Abs. 6 BBiG) — mindestens 25 % müssen ausgezahlt werden." }
    ],
    verwandt: ["mindestverguetung", "fortzahlung", "foerderung"]
  },

  /* =================== Arbeitszeit, Pausen & Urlaub ================= */
  {
    id: "arbeitszeit-erwachsene",
    thema: "arbeitszeit",
    titel: "Arbeitszeit & Pausen ab 18 (ArbZG)",
    kurz: "Für volljährige Azubis gilt das Arbeitszeitgesetz: grundsätzlich 8 Stunden am Werktag, feste Ruhepausen und 11 Stunden Ruhezeit. Sonn- und Feiertagsarbeit ist nur in Ausnahmebranchen wie der Landwirtschaft zulässig.",
    stichworte: ["Arbeitszeit", "8 Stunden", "10 Stunden", "Pause", "Ruhezeit", "Sonntagsarbeit", "Feiertag", "volljährig", "ArbZG", "Wochenende"],
    recht: [
      { n: "§ 3 ArbZG", t: "Werktägliche Arbeitszeit" },
      { n: "§ 4 ArbZG", t: "Ruhepausen" },
      { n: "§ 5 ArbZG", t: "Ruhezeit" },
      { n: "§§ 9–11 ArbZG", t: "Sonn- und Feiertagsruhe" }
    ],
    fakten: [
      "**8 Stunden** werktäglich sind der Standard; bis **10 Stunden** sind zulässig, wenn im Schnitt von 6 Monaten 8 Stunden eingehalten werden.",
      "**Pausen:** mindestens 30 Minuten bei mehr als 6 Stunden, 45 Minuten bei mehr als 9 Stunden — spätestens nach 6 Stunden; Pausen sind keine Arbeitszeit.",
      "**Ruhezeit:** mindestens **11 Stunden** ununterbrochen zwischen Feierabend und Beginn.",
      "**Sonn- und Feiertage** sind grundsätzlich frei; Ausnahmen gelten u. a. für die **Landwirtschaft** (Versorgung von Tieren und Pflanzen) — mit Ersatzruhetagen.",
      "Mindestens **15 Sonntage im Jahr** müssen beschäftigungsfrei bleiben.",
      "Die Ausbildungszeit selbst steht im **Vertrag** — meist unter den gesetzlichen Höchstgrenzen (z. B. 39 oder 40 Stunden nach Tarif)."
    ],
    abschnitte: [
      { t: "Vertragliche vs. gesetzliche Arbeitszeit", d: 2, text: "Das ArbZG setzt nur die **Obergrenzen**. Wie lange tatsächlich ausgebildet wird, bestimmen Vertrag und Tarif — Mehrzeit darüber hinaus ist Überstundenthema (§ 17 Abs. 7 BBiG). Wichtig für die Praxis: Auch in der Saison bleiben die 10-Stunden-Grenze, die Pausen und die 11-Stunden-Ruhezeit hart — sie schützen vor Übermüdung und Unfällen, gerade beim Maschineneinsatz." },
      { t: "Sonn- und Feiertagsarbeit in grünen Betrieben", d: 3, text: "In der Landwirtschaft und bei der Versorgung lebender Pflanzen und Tiere erlaubt § 10 ArbZG Sonn- und Feiertagsarbeit, soweit die Arbeiten nicht an Werktagen vorgenommen werden können (Gießen, Lüften, Tierversorgung, Frostschutz). Dann gilt: **Ersatzruhetag** innerhalb von zwei Wochen und mindestens 15 freie Sonntage pro Jahr. Verkaufsoffene Sonntage im Einzelhandel (Gärtnereien mit Laden) richten sich nach Landesrecht und bleiben die Ausnahme." }
    ],
    rollen: {
      azubi: "Deine Grenzen: 10 Stunden absolutes Tagesmaximum, Pausen nach spätestens 6 Stunden, 11 Stunden Ruhe bis zum nächsten Start. Sonntagsdienst (Gießen, Tiere) ist im grünen Bereich möglich — aber nur mit Ersatzruhetag.",
      betrieb: "Dokumentieren Sie Arbeitszeiten sauber und achten Sie in der Saison auf die 10-Stunden-Grenze und Ruhezeiten — Verstöße sind bußgeldbewehrt und bei Unfällen ein Haftungsrisiko. Sonntagsdienste fair rotieren und Ersatzruhe einplanen.",
      beratung: "Bei Arbeitszeitbeschwerden Volljähriger: ArbZG-Grenzen mit den Aufzeichnungen abgleichen; systematische Überschreitungen an die Gewerbeaufsicht (Arbeitsschutzbehörde) abgeben, Ausbildungsqualität parallel im Blick behalten."
    },
    faq: [
      { f: "Wie lange darf ich als volljähriger Azubi täglich arbeiten?", a: "Grundsätzlich 8 Stunden am Werktag; bis zu 10 Stunden sind erlaubt, wenn innerhalb von sechs Monaten der 8-Stunden-Schnitt eingehalten wird (§ 3 ArbZG). Dazu kommen Pausen: 30 Minuten ab 6 Stunden, 45 Minuten ab 9 Stunden." },
      { f: "Muss ich am Sonntag gießen kommen?", a: "In Betrieben der Landwirtschaft/des Gartenbaus ist Sonntagsarbeit zur Versorgung der Pflanzen zulässig, wenn sie nicht auf Werktage verschoben werden kann (§ 10 ArbZG). Du bekommst dafür einen Ersatzruhetag innerhalb von zwei Wochen; mindestens 15 Sonntage im Jahr bleiben frei. Für Jugendliche gelten strengere Regeln." }
    ],
    verwandt: ["arbeitszeit-jugendliche", "ueberstunden", "urlaub"]
  },

  {
    id: "arbeitszeit-jugendliche",
    thema: "arbeitszeit",
    titel: "Arbeitszeit & Schutz unter 18 (JArbSchG)",
    kurz: "Jugendliche arbeiten höchstens 8 Stunden am Tag und 40 Stunden in der Woche — an 5 Tagen. Es gelten längere Pausen, 12 Stunden Ruhezeit, Nachtruhe und besondere Wochenendregeln, mit Ausnahmen für die Landwirtschaft.",
    stichworte: ["Jugendarbeitsschutz", "unter 18", "minderjährig Arbeitszeit", "Nachtruhe", "5-Tage-Woche", "Samstag", "Sonntag", "Pausen Jugendliche", "gefährliche Arbeiten", "Akkord"],
    recht: [
      { n: "§ 8 JArbSchG", t: "Dauer der Arbeitszeit" },
      { n: "§ 11 JArbSchG", t: "Ruhepausen" },
      { n: "§§ 13–17 JArbSchG", t: "Ruhezeit, Nachtruhe, 5-Tage-Woche, Wochenendruhe" },
      { n: "§§ 22–23 JArbSchG", t: "Gefährliche Arbeiten, Akkordverbot" }
    ],
    fakten: [
      "**Höchstens 8 Stunden täglich, 40 Stunden wöchentlich**, verteilt auf **5 Tage**. (Erntezeit, Landwirtschaft, über 16: bis 9 Stunden/85 Stunden in der Doppelwoche.)",
      "**Pausen:** 30 Minuten bei 4,5–6 Stunden, **60 Minuten** bei mehr als 6 Stunden; erste Pause spätestens nach 4,5 Stunden.",
      "**Ruhezeit:** mindestens **12 Stunden** nach Feierabend; **Nachtruhe** 20–6 Uhr (Landwirtschaft ab 16: ab 5 Uhr oder bis 21 Uhr zulässig).",
      "**Samstag und Sonntag** sind grundsätzlich frei; Ausnahmen (u. a. Landwirtschaft, Verkaufsstellen) verlangen Ersatzruhetage — mindestens **zwei Samstage und zwei Sonntage im Monat** sollen frei bleiben.",
      "**Gefährliche Arbeiten** (bestimmte Maschinen, Gefahrstoffe/Pflanzenschutzmittel) sind verboten oder nur unter Aufsicht zu Ausbildungszwecken erlaubt; **Akkordarbeit** ist untersagt."
    ],
    abschnitte: [
      { t: "Was gilt am Wochenende?", d: 2, text: "Grundmodell: 5-Tage-Woche mit zwei aufeinanderfolgenden freien Tagen, möglichst am Wochenende. In der Landwirtschaft (einschließlich Gartenbau-Produktionsbetrieben) und in Verkaufsstellen dürfen Jugendliche samstags bzw. eingeschränkt sonntags beschäftigt werden — dann ist ein **Ersatzruhetag in derselben Woche** zu geben, und mindestens zwei Samstage und zwei Sonntage im Monat bleiben frei." },
      { t: "Gefährliche Arbeiten im grünen Bereich", d: 3, text: "Verboten oder nur eingeschränkt zulässig sind für Jugendliche insbesondere:\n\n- Arbeiten mit **erhöhter Unfallgefahr** (z. B. Motorsäge, bestimmte Bodenfräsen) — zulässig nur, soweit es das Ausbildungsziel erfordert und **unter Aufsicht** einer fachkundigen Person\n- Umgang mit **Gefahrstoffen**, insbesondere Pflanzenschutzmitteln — Anwendung setzt zudem Sachkunde voraus, die Azubis erst erwerben\n- Arbeiten unter extremer **Hitze/Kälte/Nässe** ohne Schutz\n- **Akkord- und tempoabhängige Arbeiten** (§ 23 JArbSchG)\n\nGrundlage jeder Beschäftigung: die **Gefährdungsbeurteilung** vor Aufnahme der Tätigkeit und die dokumentierte Unterweisung." },
      { t: "Ausnahmen mit Augenmaß", d: 3, text: "Das JArbSchG kennt Öffnungen für die Landwirtschaft (Arbeitszeit zur Erntezeit, frühere/spätere Nachtgrenzen ab 16). Sie sind **eng auszulegen**: Sie decken saisonale Notwendigkeiten der Produktion, nicht dauerhafte Personalplanung. Der Ausgleich (Durchschnitt 40 Stunden, Ersatzruhetage) ist zwingend und sollte dokumentiert werden." }
    ],
    rollen: {
      azubi: "Unter 18 gilt: spätestens um 20 Uhr Feierabend (Ausnahme Landwirtschaft ab 16: bis 21 Uhr), eine volle Stunde Pause ab 6 Stunden Arbeit und grundsätzlich zwei freie Tage pro Woche. Motorsäge & Pflanzenschutz nur zu Ausbildungszwecken unter Aufsicht — verlang die Unterweisung.",
      betrieb: "Führen Sie für jugendliche Azubis eine eigene Einsatzplanung: Arbeitszeitgrenzen, Pausen, Nachtruhe, Wochenendrotation mit Ersatzruhetagen, Verbotskatalog nach § 22 JArbSchG samt Gefährdungsbeurteilung. Die Gewerbeaufsicht prüft genau das.",
      beratung: "JArbSchG-Verstöße konsequent aufnehmen (Datum, Zeiten, Tätigkeit) und mit dem Betrieb klären; bei Gefährdungen sofortige Abhilfe verlangen und die Arbeitsschutzbehörde einschalten. Aufklärung wirkt: Viele Betriebe kennen die Erntezeit-Ausnahmen nur ungenau."
    },
    faq: [
      { f: "Bis wann darf ich mit 16 abends arbeiten?", a: "Grundsätzlich nur bis 20 Uhr (Nachtruhe 20–6 Uhr). In der Landwirtschaft dürfen über 16-Jährige ausnahmsweise ab 5 Uhr oder bis 21 Uhr beschäftigt werden (§ 14 JArbSchG)." },
      { f: "Wie viel Pause steht mir unter 18 zu?", a: "30 Minuten bei mehr als 4,5 Stunden, 60 Minuten bei mehr als 6 Stunden Arbeitszeit — die erste Pause spätestens nach 4,5 Stunden (§ 11 JArbSchG)." },
      { f: "Darf ich als Azubi unter 18 mit Pflanzenschutzmitteln arbeiten?", a: "Nur sehr eingeschränkt: Der Umgang mit Gefahrstoffen ist Jugendlichen grundsätzlich verboten und nur zu Ausbildungszwecken unter Aufsicht einer fachkundigen Person zulässig (§ 22 JArbSchG). Die eigentliche Anwendung setzt außerdem die Pflanzenschutz-Sachkunde voraus." }
    ],
    verwandt: ["jugendliche", "ueberstunden", "freistellung"]
  },

  {
    id: "urlaub",
    thema: "arbeitszeit",
    titel: "Urlaub in der Ausbildung",
    kurz: "Volljährige Azubis haben mindestens 24 Werktage Urlaub, Jugendliche je nach Alter 25 bis 30 Werktage. Tarifverträge geben oft mehr. Der Urlaub soll möglichst in die Berufsschulferien gelegt werden.",
    stichworte: ["Urlaub", "Ferien", "Urlaubstage", "Urlaubsanspruch", "frei nehmen", "Resturlaub", "Werktage", "Arbeitstage", "Urlaubsantrag"],
    recht: [
      { n: "§ 19 JArbSchG", t: "Urlaub für Jugendliche" },
      { n: "§ 3 BUrlG", t: "Mindesturlaub" },
      { n: "§ 7 BUrlG", t: "Zeitpunkt, Übertragung, Abgeltung" },
      { n: "§ 9 BUrlG", t: "Erkrankung während des Urlaubs" }
    ],
    fakten: [
      "**Jugendliche** (Alter zu Jahresbeginn): unter 16 → **30 Werktage**, unter 17 → **27**, unter 18 → **25 Werktage**.",
      "**Volljährige:** mindestens **24 Werktage** (= 4 Wochen; Werktage = Mo–Sa). Tarifverträge im Gartenbau sehen oft mehr und Arbeitstage-Regelungen vor.",
      "Urlaub soll **in den Berufsschulferien** genommen werden (§ 19 Abs. 3 JArbSchG); außerhalb der Ferien besteht Anspruch auf einen Urlaubstag je Berufsschultag während des Urlaubs.",
      "**Volle Vergütung** während des Urlaubs; ärztlich nachgewiesene Krankheitstage werden **nicht angerechnet**.",
      "Während des Urlaubs ist **Erwerbsarbeit unzulässig** — Urlaub dient der Erholung.",
      "Im **Eintritts- und Austrittsjahr** entsteht der Anspruch anteilig (Wartezeit 6 Monate für den vollen Anspruch)."
    ],
    abschnitte: [
      { t: "Werktage vs. Arbeitstage", d: 2, text: "Gesetzlich wird in **Werktagen** (Montag–Samstag) gerechnet: 24 Werktage entsprechen 4 Wochen. Arbeitet der Betrieb in der 5-Tage-Woche, entsprechen dem **20 Arbeitstage**. Für Jugendliche entsprechen 30/27/25 Werktage also 25/22,5/21 Arbeitstagen (Bruchteile werden praktisch aufgerundet). Viele Tarifverträge rechnen direkt in Arbeitstagen — entscheidend ist, dass die Mindestdauer nicht unterschritten wird." },
      { t: "Urlaub beantragen und festlegen", d: 3, text: "Urlaub wird vom Betrieb **auf Antrag festgelegt**; die Wünsche der Azubis sind zu berücksichtigen, dringende betriebliche Belange (Saisonspitzen!) können entgegenstehen. Betriebsferien sind zulässig. Der Urlaub ist im laufenden Kalenderjahr zu nehmen; Übertragung ins Folgejahr nur bei dringenden Gründen — dann bis **31. März**. Eine **Abgeltung in Geld** ist nur zulässig, wenn Urlaub wegen Beendigung nicht mehr genommen werden kann (§ 7 Abs. 4 BUrlG)." },
      { t: "Typische Konflikte", d: 3, text: "- **„Urlaub nur im Winter“:** Saisonbetriebe dürfen lenken, aber nicht den gesamten Anspruch faktisch entwerten; die Ferienbindung für Berufsschüler bleibt zu beachten.\n- **Urlaubssperre in der Blockschulzeit:** Blockunterricht ist keine Urlaubszeit — Urlaub während der Schule ist unzulässig.\n- **Krank im Urlaub:** Attest ab dem ersten Tag sichern, Tage werden gutgeschrieben (§ 9 BUrlG).\n- **Verfall:** Der Betrieb muss auf drohenden Verfall **hinweisen** — ohne Hinweis verfällt Urlaub nach der Rechtsprechung nicht ohne Weiteres." }
    ],
    rollen: {
      azubi: "Plane Urlaub in die Schulferien und stelle Anträge früh — gerade vor der Saison. Wirst du im Urlaub krank, geh zum Arzt: Mit Attest bekommst du die Tage zurück. Resturlaub nicht verfallen lassen, rechtzeitig ansprechen.",
      betrieb: "Legen Sie eine transparente Urlaubsplanung auf (Saison, Betriebsferien, Schulferien) und weisen Sie schriftlich auf Resturlaub hin. Urlaub in der Berufsschulzeit dürfen Sie nicht anordnen.",
      beratung: "Bei Urlaubsstreit zuerst rechnen: Alter am 1.1., Werk- vs. Arbeitstage, Tarif. Häufige Mängel: pauschale Winter-Urlaubssperren-Regelungen, Urlaubsanordnung während Blockunterricht, fehlende anteilige Gewährung im Austrittsjahr."
    },
    faq: [
      { f: "Wie viele Urlaubstage habe ich als Azubi?", a: "Unter 18 (Alter am 1. Januar): 30 Werktage (unter 16), 27 (unter 17) bzw. 25 (unter 18). Ab 18: mindestens 24 Werktage = 4 Wochen. In der 5-Tage-Woche entsprechen 24 Werktage 20 Arbeitstagen. Tarifverträge geben häufig mehr." },
      { f: "Darf mein Betrieb Urlaub während der Berufsschulzeit anordnen?", a: "Nein — während des Berufsschulunterrichts (auch Blockwochen) ist Urlaub unzulässig; der Urlaub soll in die Schulferien gelegt werden (§ 19 Abs. 3 JArbSchG)." },
      { f: "Was passiert mit meinem Urlaub, wenn ich im Urlaub krank werde?", a: "Mit ärztlichem Attest nachgewiesene Krankheitstage zählen nicht als Urlaub (§ 9 BUrlG) — sie werden wieder gutgeschrieben. Wichtig: sofort zum Arzt und den Betrieb informieren." }
    ],
    verwandt: ["arbeitszeit-jugendliche", "krankmeldung", "fortzahlung"]
  },

  /* =================== Berufsschule & Prüfungen ===================== */
  {
    id: "zwischenpruefung",
    thema: "schule-pruefung",
    titel: "Zwischenprüfung",
    kurz: "Etwa zur Mitte der Ausbildung zeigt die Zwischenprüfung den Leistungsstand. Die Teilnahme ist Pflicht und Voraussetzung für die Zulassung zur Abschlussprüfung — das Ergebnis selbst zählt dort aber nicht hinein.",
    stichworte: ["Zwischenprüfung", "Leistungsstand", "Mitte der Ausbildung", "Prüfung"],
    recht: [
      { n: "§ 48 BBiG", t: "Zwischenprüfung" },
      { n: "§ 43 Abs. 1 Nr. 1 BBiG", t: "Teilnahme als Zulassungsvoraussetzung" },
      { n: "§ 15 BBiG / § 10 JArbSchG", t: "Freistellung für Prüfungen" }
    ],
    fakten: [
      "Zweck: **Leistungsstand ermitteln** — für Azubi, Betrieb und Berufsschule.",
      "**Teilnahme ist Pflicht** und Zulassungsvoraussetzung für die Abschlussprüfung; „durchfallen“ kann man nicht.",
      "Der Betrieb stellt für die Prüfung **bezahlt frei** und meldet die Azubis an.",
      "Ein schwaches Ergebnis ist ein **Warnsignal**: Förderbedarf klären (Betrieb, Schule, ggf. AsA/Verlängerung)."
    ],
    abschnitte: [
      { t: "Im Gartenbau", d: 2, text: "Die zuständige Stelle lädt zur Zwischenprüfung; geprüft werden praxisnahe Aufgaben und Grundlagenwissen der ersten Ausbildungshälfte (z. B. Pflanzenkenntnisse, Bodenbearbeitung, Arbeitssicherheit). Das Ergebnis wird mitgeteilt und sollte im Betrieb ausgewertet werden: Wo stehen wir gegenüber dem Ausbildungsplan?" },
      { t: "Nach einem schwachen Ergebnis", d: 3, text: "Kein Grund zur Panik, aber zum Handeln:\n\n- Lücken konkret benennen (welche Themen?)\n- betrieblichen Ausbildungsplan nachsteuern, Übungsphasen einbauen\n- Unterstützung nutzen: Nachhilfe über **Assistierte Ausbildung (AsA flex)**, Lerngruppen der Berufsschule\n- in schweren Fällen früh über **Verlängerung** (§ 8 Abs. 2 BBiG) sprechen\n\nDie Ausbildungsberatung unterstützt bei der Einordnung und vermittelt Fördermöglichkeiten." }
    ],
    rollen: {
      azubi: "Nimm die Zwischenprüfung ernst — sie kostet nichts und zeigt dir ohne Risiko, wo du stehst. Ein schlechtes Ergebnis hat keine direkten Folgen, wohl aber eine Botschaft: Jetzt gegensteuern, nicht erst vor der Abschlussprüfung.",
      betrieb: "Melden Sie fristgerecht an, stellen Sie bezahlt frei und werten Sie das Ergebnis gemeinsam mit dem Azubi aus. Die Zwischenprüfung ist Ihr kostenloser Ausbildungscontrolling-Termin.",
      beratung: "Schwache Zwischenprüfungsergebnisse systematisch nachfassen (Betrieb kontaktieren, Förderwege anbieten) — hier entscheidet sich oft, ob die Abschlussprüfung gelingt oder das Verhältnis vorzeitig scheitert."
    },
    faq: [
      { f: "Kann ich durch die Zwischenprüfung fallen?", a: "Nein — die Zwischenprüfung hat kein Bestehen oder Nichtbestehen und zählt nicht für die Abschlussprüfung. Aber: Ohne Teilnahme wirst du nicht zur Abschlussprüfung zugelassen (§ 43 BBiG)." }
    ],
    verwandt: ["abschlusspruefung", "freistellung", "nichtbestehen"]
  },

  {
    id: "abschlusspruefung",
    thema: "schule-pruefung",
    titel: "Abschlussprüfung: Zulassung & Ablauf",
    kurz: "Die Abschlussprüfung stellt fest, ob die berufliche Handlungsfähigkeit erworben wurde. Zugelassen wird, wer die Ausbildungszeit zurückgelegt, an der Zwischenprüfung teilgenommen und den Ausbildungsnachweis geführt hat.",
    stichworte: ["Abschlussprüfung", "Zulassung", "Prüfungstermin", "anmelden Prüfung", "praktische Prüfung", "schriftliche Prüfung", "Gesellenprüfung", "bestehen"],
    recht: [
      { n: "§§ 37–39 BBiG", t: "Abschlussprüfung, Prüfungsausschüsse" },
      { n: "§ 43 BBiG", t: "Zulassung" },
      { n: "§ 45 BBiG", t: "Zulassung in besonderen Fällen" },
      { n: "§ 21 BBiG", t: "Beendigung mit Bestehen" }
    ],
    fakten: [
      "**Zulassung** (§ 43): Ausbildungszeit zurückgelegt (oder Ende innerhalb von 2 Monaten nach dem Prüfungstermin), **Zwischenprüfung** absolviert, **Ausbildungsnachweis** geführt, Vertrag **eingetragen**.",
      "Die Prüfung ist für Azubis **gebührenfrei** (§ 37 Abs. 4 BBiG).",
      "Der Betrieb **meldet an** und stellt für Prüfungstage sowie den **Arbeitstag vor der schriftlichen Abschlussprüfung** bezahlt frei.",
      "**Bestehen beendet** das Ausbildungsverhältnis — schon vor dem vertraglichen Ende, mit Bekanntgabe des Ergebnisses (§ 21 Abs. 2 BBiG).",
      "**Vorzeitige Zulassung** bei überdurchschnittlichen Leistungen ist möglich (§ 45 Abs. 1 BBiG)."
    ],
    abschnitte: [
      { t: "Ablauf im Gartenbau", d: 2, text: "Die Prüfung besteht aus **praktischen Aufgaben** (u. a. Arbeitsaufgaben aus der Fachrichtung, Pflanzenkenntnisse) und **schriftlichen Bereichen** (fachtheoretische Aufgaben, Wirtschafts- und Sozialkunde). Prüfungssprache, Hilfsmittel und Gewichtungen ergeben sich aus Ausbildungsordnung und Prüfungsordnung der zuständigen Stelle. Die Einladung kommt von der zuständigen Stelle; Ort sind Prüfbetriebe, überbetriebliche Einrichtungen oder Schulen." },
      { t: "Wenn die Zulassung wackelt", d: 3, text: "Häufigste Stolpersteine:\n\n- **Berichtsheft unvollständig** → rechtzeitig nacharbeiten und gegenzeichnen lassen; ohne Nachweis keine Zulassung\n- **hohe Fehlzeiten** → Einzelfallentscheidung der zuständigen Stelle; ggf. Verlängerung beantragen statt Nichtzulassung riskieren\n- **fehlende Zwischenprüfung** → Nachholtermin klären\n- **Vertrag nicht eingetragen** → sofort mit der zuständigen Stelle klären\n\nGegen eine ablehnende Zulassungsentscheidung ist rechtliches Gehör und der Verwaltungsrechtsweg eröffnet — meist lässt sich vorher eine Lösung finden." },
      { t: "Rund um den Prüfungstag", d: 3, text: "- **Krank am Prüfungstag:** sofort Attest besorgen und die zuständige Stelle informieren — dann gilt die Prüfung als nicht unternommen und wird nachgeholt.\n- **Rücktritt/Abbruch** ohne wichtigen Grund: Die Prüfung gilt als nicht bestanden.\n- **Nachteilsausgleich** (§ 65 BBiG) für Menschen mit Behinderung **vorab beantragen** (z. B. Zeitzuschlag, Hilfsmittel).\n- Ergebnis und **Prüfungszeugnis** stellt die zuständige Stelle aus; das Ausbildungszeugnis des Betriebs kommt zusätzlich." }
    ],
    rollen: {
      azubi: "Checke ein halbes Jahr vorher: Berichtsheft vollständig? Zwischenprüfung erledigt? Dann bleibt Zeit zum Nacharbeiten. Der Tag vor der schriftlichen Prüfung ist bezahlt frei — nutze ihn zum Lernen, nicht für den Betrieb.",
      betrieb: "Melden Sie fristgerecht an, halten Sie Prüfungstage und den Vortag der schriftlichen Prüfung frei und stellen Sie Material für die praktischen Aufgaben (kostenlos, § 14 BBiG). Ein Prüfungs-Countdown im Betrieb (Wiederholung, Probeaufgaben) zahlt sich aus.",
      beratung: "Zulassungsprobleme früh erkennen: Bei Meldungen über Fehlzeiten oder Berichtsheftlücken proaktiv auf Betrieb und Azubi zugehen. Nachteilsausgleiche rechtzeitig mit dem Prüfungswesen koordinieren."
    },
    faq: [
      { f: "Welche Voraussetzungen brauche ich für die Zulassung zur Abschlussprüfung?", a: "Zurückgelegte Ausbildungszeit (bzw. Ende innerhalb von zwei Monaten nach dem Prüfungstermin), Teilnahme an der Zwischenprüfung, geführte Ausbildungsnachweise und ein eingetragener Ausbildungsvertrag (§ 43 BBiG)." },
      { f: "Was passiert, wenn ich am Prüfungstag krank bin?", a: "Sofort ärztliches Attest besorgen und die zuständige Stelle informieren. Mit Nachweis gilt die Prüfung als nicht unternommen und du bekommst einen Nachholtermin — ohne Nachweis gilt sie als nicht bestanden." },
      { f: "Endet meine Ausbildung mit der bestandenen Prüfung?", a: "Ja — mit Bekanntgabe des Ergebnisses endet das Ausbildungsverhältnis, auch wenn der Vertrag eigentlich länger liefe (§ 21 Abs. 2 BBiG). Arbeitest du danach einfach weiter, entsteht ein unbefristetes Arbeitsverhältnis (§ 24 BBiG)." }
    ],
    verwandt: ["zwischenpruefung", "nichtbestehen", "ende-uebernahme"]
  },

  {
    id: "nichtbestehen",
    thema: "schule-pruefung",
    titel: "Prüfung nicht bestanden — und jetzt?",
    kurz: "Die Abschlussprüfung kann zweimal wiederholt werden. Auf Verlangen verlängert sich die Ausbildung bis zur nächsten Wiederholungsprüfung — höchstens um ein Jahr, mit Vergütung.",
    stichworte: ["nicht bestanden", "durchgefallen", "Wiederholung", "Wiederholungsprüfung", "verlängern nach Prüfung", "zweiter Versuch"],
    recht: [
      { n: "§ 21 Abs. 3 BBiG", t: "Verlängerung auf Verlangen" },
      { n: "§ 37 Abs. 1 BBiG", t: "Zweimalige Wiederholung" }
    ],
    fakten: [
      "Die Abschlussprüfung kann **zweimal wiederholt** werden (§ 37 Abs. 1 BBiG).",
      "**Auf Verlangen der Azubis** verlängert sich das Ausbildungsverhältnis bis zur **nächstmöglichen Wiederholungsprüfung**, höchstens um **ein Jahr** (§ 21 Abs. 3 BBiG) — der Betrieb kann das nicht ablehnen.",
      "Während der Verlängerung besteht **Vergütungsanspruch** — mindestens in Höhe des letzten Ausbildungsjahres.",
      "Bestandene Prüfungsteile können nach Maßgabe der Prüfungsordnung **angerechnet** werden.",
      "Das Verlangen sollte **umgehend nach Bekanntgabe** des Ergebnisses erklärt werden — schriftlich, mit Kopie an die zuständige Stelle."
    ],
    abschnitte: [
      { t: "Die Weichen richtig stellen", d: 2, text: "1. Ergebnis analysieren: Welche Prüfungsbereiche fehlten? (Mitteilung der zuständigen Stelle)\n2. **Verlängerung erklären** — schriftlich gegenüber dem Betrieb; die zuständige Stelle informieren, damit Verzeichnis und Prüfungsanmeldung stimmen.\n3. **Lernplan** für die Wiederholung aufstellen (Betrieb, Berufsschule, ggf. Vorbereitungskurse, AsA flex).\n4. Anmeldung zur **Wiederholungsprüfung** über den Betrieb sicherstellen." },
      { t: "Wenn das Verhältnis schon beendet ist", d: 3, text: "Auch ohne bestehendes Ausbildungsverhältnis ist die Wiederholung möglich — die Prüfungszulassung hängt nicht vom fortbestehenden Vertrag ab. Der Weg über die Verlängerung ist aber meist besser: Ausbildungsalltag, Anleitung und Vergütung bleiben erhalten. Verweigert ein Betrieb die Fortsetzung trotz wirksamen Verlangens, sollte die Ausbildungsberatung eingeschaltet werden." }
    ],
    rollen: {
      azubi: "Nicht bestanden heißt nicht am Ende: Du hast zwei weitere Versuche und ein **Recht** auf Verlängerung bis zur nächsten Prüfung (max. 1 Jahr) — erkläre das sofort schriftlich deinem Betrieb. Hol dir Unterstützung für die Lücken.",
      betrieb: "Das Verlängerungsverlangen ist bindend — planen Sie den Azubi weiter ein und nutzen Sie die Zeit gezielt für die schwachen Prüfungsbereiche. Eine gelungene Wiederholung ist die günstigste Fachkräftesicherung.",
      beratung: "Nach Nichtbestehen aktiv beraten: Frist- und Formfragen der Verlängerung, Fördermöglichkeiten, realistische Prüfungsvorbereitung. Konfliktfälle (Betrieb will nicht fortsetzen) prioritär behandeln — hier droht sonst der endgültige Abbruch."
    },
    faq: [
      { f: "Wie oft kann ich die Abschlussprüfung wiederholen?", a: "Zweimal (§ 37 Abs. 1 BBiG). Bereits bestandene Prüfungsteile können dir nach der Prüfungsordnung angerechnet werden." },
      { f: "Verlängert sich meine Ausbildung, wenn ich durchfalle?", a: "Auf dein Verlangen ja: bis zur nächstmöglichen Wiederholungsprüfung, höchstens um ein Jahr (§ 21 Abs. 3 BBiG). Der Betrieb muss dem nicht zustimmen — dein Verlangen genügt. Erkläre es schriftlich und informiere die zuständige Stelle." }
    ],
    verwandt: ["abschlusspruefung", "teilzeit-verkuerzung", "foerderung"]
  },

  /* =================== Konflikte, Kündigung & Ende ================== */
  {
    id: "konflikte",
    thema: "konflikt-ende",
    titel: "Konflikte in der Ausbildung lösen",
    kurz: "Die meisten Ausbildungskonflikte lassen sich lösen, bevor gekündigt wird: erst das Gespräch im Betrieb, dann die Ausbildungsberatung, notfalls der Schlichtungsausschuss vor dem Arbeitsgericht.",
    stichworte: ["Konflikt", "Streit", "Probleme im Betrieb", "Mobbing", "Ärger", "Vermittlung", "Schlichtung", "Schlichtungsausschuss", "Hilfe"],
    recht: [
      { n: "§ 76 BBiG", t: "Beratung durch die zuständige Stelle" },
      { n: "§ 111 Abs. 2 ArbGG", t: "Schlichtungsausschuss" }
    ],
    fakten: [
      "**Stufe 1:** direktes Gespräch — Azubi mit Ausbilder/in, ggf. mit Eltern oder Vertrauensperson.",
      "**Stufe 2:** innerbetriebliche Stellen — Jugend- und Auszubildendenvertretung (JAV), Betriebsrat, Ausbildungsleitung.",
      "**Stufe 3:** die **Ausbildungsberatung** der zuständigen Stelle — neutral, kostenlos, für beide Seiten.",
      "**Stufe 4:** Wo ein **Schlichtungsausschuss** besteht, muss er vor einer Klage aus dem Ausbildungsverhältnis angerufen werden (§ 111 Abs. 2 ArbGG).",
      "Konfliktverlauf **dokumentieren** (Daten, Gespräche, Vereinbarungen) — das hilft in jeder Stufe."
    ],
    abschnitte: [
      { t: "Was die Ausbildungsberatung leistet", d: 2, text: "Die Ausbildungsberatung hört beide Seiten an, klärt die Rechtslage, vermittelt Lösungen (Zielvereinbarungen, Ausbildungsplan-Anpassung, Mediation) und begleitet die Umsetzung. Sie kann Betriebe auch aufsuchen. Sie entscheidet keinen Rechtsstreit — aber die meisten Fälle enden hier mit einer tragfähigen Absprache oder einem geordneten Betriebswechsel." },
      { t: "Schlichtung vor Klage", d: 3, text: "Für Streitigkeiten aus einem **bestehenden** Berufsausbildungsverhältnis (z. B. Wirksamkeit einer Kündigung, Vergütungsforderungen) gilt: Ist bei der zuständigen Stelle ein Schlichtungsausschuss eingerichtet, ist seine Anrufung **zwingende Voraussetzung** einer Klage. Der Ausschuss ist paritätisch besetzt (Arbeitgeber-/Arbeitnehmerseite), das Verfahren schnell und kostenfrei; ein angenommener Spruch wirkt wie ein Vergleich. Ob und wo ein Ausschuss besteht, teilt die zuständige Stelle mit — Fristen (insb. bei Kündigung: **3 Wochen**) unbedingt beachten." },
      { t: "Eskalation vermeiden — Warnsignale ernst nehmen", d: 3, text: "Vertragslösungen kündigen sich an: häufige Fehlzeiten, Berichtsheftlücken, Rückzug im Betrieb, Konflikte über Aufgaben. Wer früh reagiert (Gespräch, Beratung, Förderinstrumente wie AsA flex), verhindert die meisten Abbrüche. Für Betriebe gilt: Abmahnungen ersetzen keine Ausbildungsgespräche; für Azubis: Nicht einfach wegbleiben — das schafft neue Pflichtverletzungen." }
    ],
    rollen: {
      azubi: "Du musst Konflikte nicht allein austragen: JAV, Eltern, Berufsschule und die Ausbildungsberatung sind deine Anlaufstellen. Schreib dir Vorfälle mit Datum auf. Und: Nicht unentschuldigt fehlen, das schwächt deine Position.",
      betrieb: "Holen Sie die Ausbildungsberatung früh dazu — das ist keine Niederlage, sondern Standardweg. Dokumentierte Gespräche mit klaren Vereinbarungen wirken besser als formale Abmahnungsketten.",
      beratung: "Strukturiert vorgehen: beide Seiten getrennt anhören, Sachverhalt im Vermerk festhalten, Vereinbarung mit Fristen schriftlich fixieren, Wiedervorlage. Bei festgefahrenen Fällen auf den Schlichtungsausschuss und die 3-Wochen-Frist bei Kündigungen hinweisen."
    },
    faq: [
      { f: "An wen kann ich mich bei Problemen in der Ausbildung wenden?", a: "Erst an Ausbilder/in oder Ausbildungsleitung, dann an JAV/Betriebsrat — und jederzeit an die Ausbildungsberatung der zuständigen Stelle (für den Gartenbau in BW beim Regierungspräsidium). Sie berät neutral, kostenlos und auf Wunsch zunächst vertraulich." },
      { f: "Muss ich vor einer Klage zum Schlichtungsausschuss?", a: "Wenn bei der zuständigen Stelle ein Schlichtungsausschuss für Ausbildungsstreitigkeiten besteht: ja — seine Anrufung ist Voraussetzung für die Klage (§ 111 Abs. 2 ArbGG). Bei Kündigungen gilt trotzdem die 3-Wochen-Frist: sofort aktiv werden." }
    ],
    verwandt: ["kuendigung", "ausbildungsberatung", "aktenvermerk"]
  },

  {
    id: "kuendigung",
    thema: "konflikt-ende",
    titel: "Kündigung des Ausbildungsverhältnisses",
    kurz: "Nach der Probezeit ist das Ausbildungsverhältnis stark geschützt: Der Betrieb kann nur aus wichtigem Grund fristlos kündigen; Azubis zusätzlich mit vier Wochen Frist bei Berufsaufgabe oder -wechsel. Immer schriftlich.",
    stichworte: ["Kündigung", "kündigen", "fristlos", "wichtiger Grund", "Kündigungsschutz", "rauswerfen", "Abmahnung", "Kündigungsfrist", "Berufswechsel"],
    recht: [
      { n: "§ 22 BBiG", t: "Kündigung" },
      { n: "§ 102 BetrVG", t: "Anhörung des Betriebsrats" },
      { n: "§ 4 KSchG", t: "3-Wochen-Frist für die Klage" },
      { n: "§ 13 KSchG", t: "Außerordentliche Kündigung" }
    ],
    fakten: [
      "**Nach der Probezeit** kann der Betrieb nur noch **aus wichtigem Grund ohne Frist** kündigen (§ 22 Abs. 2 Nr. 1 BBiG) — eine ordentliche Kündigung durch den Betrieb gibt es nicht.",
      "**Azubis** können außerdem mit **4 Wochen Frist** kündigen, wenn sie die Ausbildung aufgeben oder den Beruf wechseln wollen (§ 22 Abs. 2 Nr. 2 BBiG).",
      "**Schriftform** ist Pflicht; nach der Probezeit müssen die **Kündigungsgründe angegeben** werden — sonst ist die Kündigung unwirksam.",
      "Die fristlose Kündigung ist **unwirksam**, wenn die Gründe dem Kündigenden **länger als zwei Wochen** bekannt sind (§ 22 Abs. 4 BBiG).",
      "Bei **Minderjährigen** läuft die Kündigung über die gesetzlichen Vertreter (Zugang bzw. Zustimmung).",
      "Gegen eine Kündigung: **Schlichtungsausschuss** (falls vorhanden) und **Klage binnen 3 Wochen**."
    ],
    abschnitte: [
      { t: "Was ist ein „wichtiger Grund“?", d: 2, text: "Ein wichtiger Grund liegt vor, wenn die Fortsetzung bis zum Ausbildungsende unzumutbar ist — nach Abwägung aller Umstände und regelmäßig erst **nach einschlägiger Abmahnung**:\n\n- Beispiele auf Betriebsseite: wiederholtes unentschuldigtes Fehlen trotz Abmahnung, Diebstahl, grobe Beleidigungen, hartnäckige Verweigerung von Berufsschule oder Berichtsheft\n- Beispiele auf Azubi-Seite: ausbleibende Vergütung trotz Mahnung, schwere Verstöße gegen Ausbildungspflichten (keine Anleitung, dauerhaft ausbildungsfremde Arbeit), Übergriffe\n\nJe kürzer die Restzeit bis zur Prüfung, desto höher die Hürde. Der bloße Verdacht oder schlechte Leistungen genügen regelmäßig nicht." },
      { t: "Formfehler — die häufigsten Unwirksamkeitsgründe", d: 3, text: "- Kündigung **per WhatsApp/E-Mail** statt unterschriebenem Papier\n- **fehlende Begründung** bei fristloser Kündigung nach der Probezeit\n- **2-Wochen-Frist** ab Kenntnis des Grundes überschritten\n- keine vorherige **Abmahnung** bei verhaltensbedingten Gründen\n- Zugang bei Minderjährigen **nicht an die Eltern**\n- **Betriebsrat/JAV nicht angehört** (§ 102 BetrVG)\n- besonderer Kündigungsschutz missachtet (Schwangerschaft, Schwerbehinderung, JAV-Mitglieder)" },
      { t: "Nach der Kündigung", d: 3, text: "- **Fristen:** Schlichtungsausschuss anrufen (falls eingerichtet), Klage beim Arbeitsgericht **innerhalb von 3 Wochen** — sonst gilt die Kündigung als wirksam.\n- **Schadensersatz** (§ 23 BBiG): Wer den Auflösungsgrund zu vertreten hat, schuldet Ersatz (z. B. Vergütungsausfall bis zum regulären Ende); Anspruch binnen **3 Monaten** geltend machen.\n- **Meldepflicht:** Bei Verlust des Ausbildungsplatzes sofort bei der Agentur für Arbeit ausbildungsuchend melden; die zuständige Stelle unterstützt beim Wechselbetrieb.\n- Der Betrieb meldet die vorzeitige Lösung der zuständigen Stelle (Verzeichnis)." }
    ],
    rollen: {
      azubi: "Nach der Probezeit kann dich der Betrieb nicht „einfach so“ loswerden — eine fristlose Kündigung braucht schwere Gründe, Schriftform und Begründung. Reagiere sofort: Beratung anrufen, Fristen (3 Wochen!) sichern, parallel nach einem Anschlussbetrieb suchen.",
      betrieb: "Prüfen Sie vor jeder Kündigung: Abmahnung vorhanden? 2-Wochen-Frist? Schriftform mit Gründen? Eltern? Betriebsrat? Ein Anruf bei der Ausbildungsberatung vor Ausspruch erspart viele unwirksame Kündigungen — oft ist der Aufhebungsvertrag oder die Vermittlung der bessere Weg.",
      beratung: "Kündigungsfälle sind eilig: Fristen klären (2 Wochen Kenntnis, 3 Wochen Klage), Formfehler prüfen, beide Seiten anhören, Schlichtungsweg aufzeigen. Jede Beratung mit Datum und Ergebnis im Vermerk dokumentieren — die Unterlagen werden im Schlichtungs-/Klageverfahren gebraucht."
    },
    faq: [
      { f: "Kann mir nach der Probezeit gekündigt werden?", a: "Nur aus wichtigem Grund und ohne Einhaltung einer Frist (§ 22 Abs. 2 BBiG) — etwa bei schweren, meist abgemahnten Pflichtverstößen. Die Kündigung muss schriftlich erfolgen und die Gründe angeben, sonst ist sie unwirksam. Schlechte Noten oder „passt nicht mehr“ reichen nicht." },
      { f: "Wie kann ich selbst kündigen, wenn ich den Beruf wechseln will?", a: "Mit einer Frist von vier Wochen, schriftlich, wenn du die Berufsausbildung aufgibst oder dich für einen anderen Beruf ausbilden lassen willst (§ 22 Abs. 2 Nr. 2 BBiG). Bist du minderjährig, müssen deine Eltern zustimmen. Sprich vorher mit der Ausbildungsberatung — oft ist ein Betriebswechsel im selben Beruf die bessere Lösung." },
      { f: "Was kann ich gegen eine Kündigung tun?", a: "Innerhalb von drei Wochen Kündigungsschutzklage erheben — und vorher den Schlichtungsausschuss anrufen, wo einer besteht (§ 111 Abs. 2 ArbGG). Lass die Kündigung sofort von der Ausbildungsberatung oder einer Rechtsberatung prüfen; viele Kündigungen scheitern an Formfehlern." }
    ],
    verwandt: ["probezeit", "konflikte", "aufhebung"]
  },

  {
    id: "aufhebung",
    thema: "konflikt-ende",
    titel: "Aufhebungsvertrag & Betriebswechsel",
    kurz: "Statt Kündigung können beide Seiten das Ausbildungsverhältnis einvernehmlich beenden — sinnvoll vor allem, wenn der Wechsel in einen anderen Betrieb schon steht. Bisherige Ausbildungszeit wird angerechnet.",
    stichworte: ["Aufhebungsvertrag", "Auflösungsvertrag", "einvernehmlich beenden", "Betrieb wechseln", "Wechsel", "neuer Betrieb", "Anrechnung"],
    recht: [
      { n: "§ 22 BBiG", t: "Beendigungsregeln (Rahmen)" },
      { n: "§ 12 BBiG", t: "Grenzen zulässiger Vereinbarungen" }
    ],
    fakten: [
      "Ein **Aufhebungsvertrag** beendet das Verhältnis einvernehmlich — jederzeit, ohne Gründe und Fristen; **Schriftform dringend empfohlen**, bei Minderjährigen mit den gesetzlichen Vertretern.",
      "**Kein Druck:** Ein unter Druck unterschriebener Aufhebungsvertrag kann anfechtbar sein; Bedenkzeit ist legitim.",
      "**Betriebswechsel:** Neuer Vertrag über die **Restzeit** — die bisherige Ausbildungszeit wird angerechnet; Eintragung bei der zuständigen Stelle nicht vergessen.",
      "Beim Wechsel gehen **Urlaubs- und Vergütungsansprüche** gegen den alten Betrieb nicht verloren — offene Punkte im Aufhebungsvertrag regeln (Resturlaub, Zeugnis, Berichtsheft-Herausgabe).",
      "**Sozialrechtlich** kann eine selbst herbeigeführte Beendigung Folgen haben (z. B. Sperrzeit beim Bürgergeld/ALG in Sonderfällen) — vor Unterschrift beraten lassen, wenn kein Anschluss gesichert ist."
    ],
    abschnitte: [
      { t: "Sauberer Wechsel in fünf Schritten", d: 2, text: "1. **Anschluss sichern:** neuen Ausbildungsbetrieb finden (Ausbildungsberatung und Agentur für Arbeit vermitteln).\n2. **Aufhebungsvertrag** mit Datum, letztem Tag, Resturlaub, Zeugnisanspruch und Herausgabe der Unterlagen schließen.\n3. **Neuen Vertrag** über die Restzeit schließen und **eintragen** lassen; Verkürzung/Verlängerung realistisch festlegen.\n4. **Berufsschule** informieren (Klassenwechsel meist unnötig).\n5. **Berichtsheft** nahtlos weiterführen — es dokumentiert beide Stationen.\n\nSo geht keine Zeit verloren und die Zulassung zur Prüfung bleibt gesichert." }
    ],
    rollen: {
      azubi: "Unterschreib einen Aufhebungsvertrag erst, wenn der neue Ausbildungsplatz fest ist — sonst stehst du ohne alles da. Lass dir Resturlaub, Zeugnis und dein Berichtsheft schriftlich zusichern. Die Ausbildungsberatung prüft den Entwurf mit dir.",
      betrieb: "Ein fairer Aufhebungsvertrag ist oft besser als eine angreifbare Kündigung. Regeln Sie die offenen Punkte vollständig und melden Sie die Beendigung der zuständigen Stelle — das schützt beide Seiten.",
      beratung: "Bei Wechselwünschen zügig vermitteln (Betriebsbörse, bekannte Ausbildungsbetriebe) und darauf achten, dass Aufhebung und neuer Vertrag zeitlich nahtlos anschließen. Druckkonstellationen („unterschreib sofort“) aktiv nachfragen und dokumentieren."
    },
    faq: [
      { f: "Kann ich meinen Ausbildungsbetrieb wechseln, ohne von vorn anzufangen?", a: "Ja — beim Wechsel wird die bereits absolvierte Ausbildungszeit angerechnet. Alter Vertrag wird aufgehoben (oder gekündigt), der neue Betrieb schließt einen Vertrag über die Restzeit und lässt ihn eintragen." },
      { f: "Muss ich einen Aufhebungsvertrag sofort unterschreiben?", a: "Nein. Nimm dir Bedenkzeit und lass den Vertrag prüfen (Ausbildungsberatung). Ohne gesicherten Anschluss kann eine sofortige Unterschrift nachteilig sein — auch sozialrechtlich." }
    ],
    verwandt: ["kuendigung", "konflikte", "eintragung"]
  },

  {
    id: "ende-uebernahme",
    thema: "konflikt-ende",
    titel: "Ende der Ausbildung & Übernahme",
    kurz: "Die Ausbildung endet mit Ablauf der Ausbildungszeit — oder früher mit bestandener Prüfung. Wer danach einfach weiterarbeitet, steht automatisch in einem unbefristeten Arbeitsverhältnis.",
    stichworte: ["Ende", "Ausbildungsende", "Übernahme", "weiterarbeiten", "unbefristet", "Anschluss", "Arbeitsvertrag danach", "fertig"],
    recht: [
      { n: "§ 21 BBiG", t: "Beendigung" },
      { n: "§ 24 BBiG", t: "Weiterarbeit" },
      { n: "§ 23 BBiG", t: "Schadensersatz bei vorzeitiger Beendigung" },
      { n: "§ 12 Abs. 1 BBiG", t: "Übernahmevereinbarungen" }
    ],
    fakten: [
      "Ende **mit Ablauf der Vertragszeit**; bei bestandener Abschlussprüfung **vorher**, mit Bekanntgabe des Ergebnisses (§ 21 BBiG).",
      "**Weiterarbeit ohne ausdrückliche Vereinbarung** → es entsteht ein **unbefristetes Arbeitsverhältnis** (§ 24 BBiG) — zu üblichen Bedingungen.",
      "**Übernahmevereinbarungen** dürfen erst in den **letzten 6 Monaten** der Ausbildung getroffen werden (§ 12 Abs. 1 BBiG); vorher sind Bindungsklauseln nichtig.",
      "Eine **Übernahmepflicht** gibt es gesetzlich nicht (tarifliche Regelungen können bestehen; JAV-Mitglieder genießen besonderen Schutz nach § 78a BetrVG).",
      "Zum Ende: **Zeugnis**, Arbeitspapiere, Resturlaub abwickeln; ohne Anschluss **frühzeitig arbeitsuchend melden** (3 Monate vor Ende)."
    ],
    abschnitte: [
      { t: "Der Klassiker: „Bleib einfach noch die Woche“", d: 2, text: "Wird nach bestandener Prüfung ohne neuen Vertrag weitergearbeitet — und sei es nur tageweise —, entsteht kraft Gesetzes ein unbefristetes Arbeitsverhältnis mit ortsüblicher Vergütung einer Fachkraft. Betriebe sollten deshalb **vor** dem Prüfungstag klären, ob und zu welchen Konditionen übernommen wird; Azubis dürfen auf einem schriftlichen Arbeitsvertrag bestehen." },
      { t: "Checkliste zum Ausbildungsende", d: 3, text: "- **Arbeitsvertrag** (Befristung nur mit sachgemäßer Vereinbarung, sonst unbefristet)\n- **qualifiziertes Ausbildungszeugnis** anfordern\n- **Prüfungszeugnis** der zuständigen Stelle abheften\n- **Resturlaub** nehmen oder abgelten lassen (nur bei Beendigung zulässig)\n- Sozialversicherung: Statuswechsel prüfen (Beiträge, Krankenkasse informieren)\n- ohne Anschluss: **Meldung bei der Agentur für Arbeit** (3 Monate vorher bzw. sofort)\n- Weiterbildung planen: Meister/in, Techniker/in, Fachagrarwirt/in, Studium — Beratung nutzen" }
    ],
    rollen: {
      azubi: "Kläre die Übernahme schriftlich, bevor du nach der Prüfung weiterarbeitest — sonst gilt zwar automatisch ein unbefristetes Arbeitsverhältnis, aber Streit über Lohn und Bedingungen ist programmiert. Denk an Zeugnis und Resturlaub.",
      betrieb: "Entscheiden Sie die Übernahme vor dem Prüfungstermin und legen Sie die Konditionen schriftlich fest. Stillschweigende Weiterbeschäftigung bindet Sie unbefristet (§ 24 BBiG).",
      beratung: "Zum Ausbildungsende häufige Fragen: automatische Weiterbeschäftigung, Befristungen, Zeugnisse. Auf Fortbildungswege im Gartenbau (Meister, Techniker) und Fördermöglichkeiten (Aufstiegs-BAföG) hinweisen."
    },
    faq: [
      { f: "Muss mein Betrieb mich nach der Ausbildung übernehmen?", a: "Eine gesetzliche Übernahmepflicht gibt es nicht — Ausnahmen können sich aus Tarifverträgen ergeben; JAV-Mitglieder sind besonders geschützt. Arbeitest du aber nach dem Ende einfach weiter, entsteht automatisch ein unbefristetes Arbeitsverhältnis (§ 24 BBiG)." },
      { f: "Wann genau endet meine Ausbildung, wenn ich die Prüfung bestehe?", a: "Mit der Bekanntgabe des Ergebnisses durch den Prüfungsausschuss — auch wenn dein Vertrag länger laufen würde (§ 21 Abs. 2 BBiG). Ab dann bist du Fachkraft, mit allen Folgen für Vergütung und Vertrag." }
    ],
    verwandt: ["abschlusspruefung", "zeugnis", "kuendigung"]
  },

  /* =================== Ausbildungsberatung & Aufsicht =============== */
  {
    id: "zustaendige-stelle",
    thema: "beratung",
    titel: "Die zuständige Stelle für die grünen Berufe",
    kurz: "Für Gartenbau und Landwirtschaft ist in Baden-Württemberg das Regierungspräsidium die zuständige Stelle nach dem BBiG: Es registriert Verträge, überwacht die Ausbildung, berät und organisiert die Prüfungen.",
    stichworte: ["zuständige Stelle", "Regierungspräsidium", "RP Freiburg", "Kammer", "grüne Berufe", "Gartenbau", "Landwirtschaft", "Aufgaben", "Ansprechpartner"],
    recht: [
      { n: "§ 71 Abs. 8 BBiG", t: "Zuständige Stellen in der Land- und Hauswirtschaft" },
      { n: "§ 76 BBiG", t: "Überwachung und Beratung" },
      { n: "§§ 34, 37 ff. BBiG", t: "Verzeichnis, Prüfungswesen" }
    ],
    fakten: [
      "Zuständige Stelle für **Gärtner/in, Werker/Fachpraktiker im Gartenbau** und weitere grüne Berufe ist in BW das **Regierungspräsidium** — nicht IHK oder Handwerkskammer.",
      "Aufgaben: **Verzeichnis** der Ausbildungsverhältnisse, **Eignungsfeststellung** der Betriebe, **Ausbildungsberatung**, **Prüfungswesen**, Anerkennung von Verkürzungen/Teilzeit.",
      "Die **Ausbildungsberaterinnen und -berater** sind gesetzlich vorgesehen (§ 76 BBiG) und für Betriebe **und** Azubis da.",
      "Regionale Zuständigkeit: das Regierungspräsidium des **Regierungsbezirks**, in dem die Ausbildungsstätte liegt."
    ],
    abschnitte: [
      { t: "Wann Sie sich melden sollten", d: 2, text: "- **vor** dem ersten Ausbildungsvertrag (Anerkennung als Ausbildungsbetrieb, Ausbildereignung)\n- bei **Vertragsabschluss und Änderungen** (Eintragung, Verkürzung, Teilzeit, Ausbilderwechsel)\n- bei **Fragen und Konflikten** in laufenden Ausbildungen\n- zur **Prüfungsorganisation** (Anmeldung, Termine, Nachteilsausgleich)\n- bei **vorzeitiger Beendigung** (Meldepflicht, Vermittlung)" }
    ],
    rollen: {
      azubi: "Merke dir: Für deine Gärtner-Ausbildung ist das Regierungspräsidium deine „Kammer“. Prüfungsfragen, Vertragsfragen, Ärger im Betrieb — die Ausbildungsberatung dort ist deine offizielle, kostenlose Anlaufstelle.",
      betrieb: "Halten Sie die Kontaktdaten Ihrer Ausbildungsberatung griffbereit und melden Sie Änderungen proaktiv. Wer früh fragt, spart Verwaltungsschleifen — von der Anerkennung bis zur Prüfungsanmeldung.",
      beratung: "Zuständigkeiten sauber abgrenzen (Regierungsbezirk der Ausbildungsstätte, Berufszugehörigkeit) und bei Fehlzuständigkeit warm an die richtige Stelle übergeben — Bürgerfreundlichkeit vor Formalie."
    },
    faq: [
      { f: "Ist für meine Gärtner-Ausbildung die IHK zuständig?", a: "Nein — für die grünen Berufe (u. a. Gärtner/in) ist in Baden-Württemberg das Regierungspräsidium die zuständige Stelle nach dem BBiG. Es übernimmt die Aufgaben, die in anderen Berufen bei IHK oder Handwerkskammer liegen." }
    ],
    verwandt: ["ausbildungsberatung", "eintragung", "abschlusspruefung"]
  },

  {
    id: "ausbildungsberatung",
    thema: "beratung",
    titel: "Ausbildungsberatung: Überwachen & Beraten (§ 76 BBiG)",
    kurz: "Die zuständige Stelle überwacht die Durchführung der Berufsausbildung und fördert sie durch Beratung. Bei Mängeln wird beraten, beanstandet, nachgehalten — als letztes Mittel droht die Untersagung des Ausbildens.",
    stichworte: ["Ausbildungsberatung", "Überwachung", "Betriebsbesuch", "Mängel", "Beanstandung", "Untersagung", "Aufsicht", "Kontrolle"],
    recht: [
      { n: "§ 76 BBiG", t: "Überwachung, Beratung" },
      { n: "§ 33 BBiG", t: "Untersagung des Einstellens und Ausbildens" },
      { n: "§ 32 BBiG", t: "Eignungsfeststellung, Mängelbeseitigung" }
    ],
    fakten: [
      "Doppelauftrag: **Überwachen** der Ausbildungsqualität **und** **Beraten** der Beteiligten — beides gehört zusammen.",
      "Instrumente: **Betriebsbesuche**, Auskunftsrechte (§ 76 Abs. 2: Auskünfte und Vorlage von Unterlagen, z. B. Ausbildungsnachweise), **schriftliche Beanstandung** mit Frist.",
      "Werden Mängel **nicht beseitigt**, informiert die zuständige Stelle die **zuständige Behörde**; diese kann das Einstellen und Ausbilden **untersagen** (§ 33 BBiG).",
      "Beratung ist **kostenlos**, auf Wunsch zunächst **vertraulich**, und steht Betrieben, Azubis und Eltern offen."
    ],
    abschnitte: [
      { t: "Der typische Mängel-Workflow", d: 2, text: "1. **Hinweis** (Beschwerde, Schulmeldung, Betriebsbesuch) → Sachverhalt klären, beide Seiten anhören.\n2. **Beratung** mit konkreten Abhilfen (Ausbildungsplan, Freistellung, Vergütung …), Vereinbarung mit **Frist**; Vermerk anlegen.\n3. **Nachkontrolle** zur Frist; bei Erledigung: dokumentiert schließen.\n4. Bei fortbestehenden erheblichen Mängeln: förmliche **Beanstandung**, Einbindung der zuständigen Behörde, ggf. Verfahren nach **§ 33 BBiG** (Untersagung) — mit Blick auf laufende Ausbildungsverhältnisse (Vermittlung der Azubis!)." },
      { t: "Rechte und Grenzen", d: 3, text: "Die zuständige Stelle kann Auskünfte und Unterlagen verlangen und die Ausbildungsstätte besichtigen; sie ist aber **keine Arbeitsschutzbehörde** und **kein Gericht**. Arbeitszeit- und Arbeitsschutzverstöße werden an die Gewerbeaufsicht abgegeben, Vergütungsstreitigkeiten dem Schlichtungs-/Klageweg überlassen. Diese Schnittstellen transparent zu machen, gehört zur guten Beratung." }
    ],
    rollen: {
      azubi: "Deine Beschwerde löst keinen „Ärger-Automatismus“ aus: Die Beratung hört erst zu, sucht Lösungen mit dem Betrieb und schützt deine Interessen. Je konkreter deine Angaben (Daten, Beispiele, Berichtsheft), desto wirksamer die Hilfe.",
      betrieb: "Sehen Sie Betriebsbesuche als Service: Die Beratung kennt Förderwege, Musterunterlagen und Lösungen aus hunderten Betrieben. Auf Beanstandungen fristgerecht reagieren — Schweigen eskaliert das Verfahren unnötig.",
      beratung: "Jede Stufe dokumentieren (Vermerk mit Anlass, Sachverhalt, Absprache, Frist, Wiedervorlage) — das trägt spätere Maßnahmen. Verhältnismäßigkeit wahren: Ziel ist die gelingende Ausbildung, die Untersagung bleibt ultima ratio."
    },
    faq: [
      { f: "Was passiert, wenn ein Betrieb schlecht ausbildet?", a: "Die zuständige Stelle klärt den Sachverhalt, berät und vereinbart konkrete Abhilfen mit Frist. Bleiben erhebliche Mängel bestehen, kann die zuständige Behörde dem Betrieb das Einstellen und Ausbilden untersagen (§ 33 BBiG). Laufende Azubis werden dabei in andere Betriebe vermittelt." },
      { f: "Darf die Ausbildungsberatung einfach in den Betrieb kommen?", a: "Ja — zur Überwachung der Berufsausbildung kann die zuständige Stelle die Ausbildungsstätte besichtigen und Auskünfte sowie Unterlagen (z. B. Ausbildungsnachweise) verlangen (§ 76 BBiG). Termine werden in der Regel angekündigt." }
    ],
    verwandt: ["zustaendige-stelle", "aktenvermerk", "ausbildungspflicht"]
  },

  {
    id: "aktenvermerk",
    thema: "beratung",
    titel: "Der Aktenvermerk in der Ausbildungsberatung",
    kurz: "Der Aktenvermerk macht Verwaltungshandeln nachvollziehbar: Wer hat wann mit wem was besprochen, was wurde festgestellt, vereinbart und veranlasst? Dieses Tool erstellt Vermerke strukturiert per Formular.",
    stichworte: ["Aktenvermerk", "Vermerk", "dokumentieren", "Gesprächsnotiz", "Akte", "Dokumentation", "Verwaltungshandeln", "Nachweis"],
    recht: [
      { n: "LVwVfG BW", t: "Grundsätze ordnungsgemäßer Aktenführung" },
      { n: "DSGVO / LDSG BW", t: "Datenschutz bei personenbezogenen Daten" }
    ],
    fakten: [
      "Ein Vermerk beantwortet: **Anlass — Beteiligte — Sachverhalt — Einordnung — Ergebnis — weiteres Vorgehen.**",
      "**Zeitnah** verfassen (am selben Tag), sachlich formulieren, **Tatsachen von Bewertungen trennen**.",
      "**Datensparsamkeit:** nur erfassen, was für den Vorgang erforderlich ist; sensible Daten besonders schützen.",
      "Vermerke sind **Grundlage für spätere Maßnahmen** (Beanstandung, § 33-Verfahren, Schlichtung) — Lücken schwächen jedes Verfahren.",
      "Der **Vermerk-Generator** dieses Tools liefert die Struktur und passende Rechtsgrundlagen-Bausteine aus der Wissensdatenbank."
    ],
    abschnitte: [
      { t: "Aufbau eines guten Vermerks", d: 2, text: "- **Kopf:** Aktenzeichen, Datum, Verfasser/in, Art (Telefonat, Besuch, Besprechung)\n- **Anlass:** Wie kam der Vorgang zustande? (Anruf des Azubis, Schulmeldung, Routinebesuch)\n- **Beteiligte:** Personen/Funktionen, Betrieb, Azubi (nur erforderliche Daten)\n- **Sachverhalt:** chronologisch, konkret, mit Daten und Zahlen; wörtliche Kernaussagen kenntlich machen\n- **Rechtliche Einordnung:** einschlägige Normen und deren Anwendung auf den Fall\n- **Ergebnis/Vereinbarung:** Was wurde zugesagt, mit welcher Frist?\n- **Weiteres Vorgehen:** Wiedervorlage, Zuständigkeiten, Info an Dritte" },
      { t: "Formulierungsgrundsätze", d: 3, text: "- Aktiv und präzise: „Der Betrieb sagte zu, ab 01.09. …“ statt „Es wurde besprochen …“\n- Bewertungen kennzeichnen: „Aus Sicht der Unterzeichnerin …“\n- Keine Polemik, keine Diagnosen, keine Spekulation\n- Fremdaussagen im Konjunktiv wiedergeben („Der Azubi berichtet, er müsse …“)\n- Anlagen benennen (Berichtsheft-Kopien, Stundenzettel)\n\nSo bleibt der Vermerk auch nach Jahren — und vor Gericht — belastbar." }
    ],
    rollen: {
      azubi: "Auch für dich gilt: Schreib dir wichtige Vorfälle und Gespräche mit Datum auf. Deine Notizen helfen der Beratung, den Fall schnell zu verstehen — und dir, nichts zu vergessen.",
      betrieb: "Dokumentieren Sie Ausbildungsgespräche und Vereinbarungen kurz schriftlich und geben Sie dem Azubi eine Kopie. Das schafft Verbindlichkeit und schützt bei späteren Streitfragen beide Seiten.",
      beratung: "Nutzen Sie den Vermerk-Generator im Export-Bereich: Formular ausfüllen, Themenbausteine mit Rechtsgrundlagen anhängen, als PDF drucken und zur Akte nehmen. Entwürfe bleiben lokal im Browser gespeichert — keine Daten verlassen den Arbeitsplatz."
    },
    faq: [
      { f: "Wann sollte ich in der Beratung einen Aktenvermerk schreiben?", a: "Immer, wenn der Vorgang später nachvollziehbar sein muss: Beschwerden, Betriebsbesuche, Konfliktgespräche, Zusagen mit Frist, Beanstandungen. Faustregel: Was nicht im Vermerk steht, ist nicht geschehen." }
    ],
    verwandt: ["ausbildungsberatung", "konflikte", "kuendigung"]
  },

  {
    id: "foerderung",
    thema: "beratung",
    titel: "Nachteilsausgleich, Fachpraktiker & Förderwege",
    kurz: "Für Menschen mit Behinderung gibt es Nachteilsausgleich in Prüfungen und eigene Fachpraktiker-Ausbildungen. Bei Lernschwierigkeiten helfen Assistierte Ausbildung und weitere Förderinstrumente.",
    stichworte: ["Nachteilsausgleich", "Behinderung", "Fachpraktiker", "Werker", "Förderung", "AsA", "Assistierte Ausbildung", "Nachhilfe", "Unterstützung", "BAB"],
    recht: [
      { n: "§ 65 BBiG", t: "Nachteilsausgleich" },
      { n: "§ 66 BBiG", t: "Ausbildungsregelungen für Menschen mit Behinderung" },
      { n: "§§ 74 ff. SGB III", t: "Assistierte Ausbildung (AsA flex)" }
    ],
    fakten: [
      "**Nachteilsausgleich (§ 65 BBiG):** z. B. Zeitverlängerung, Hilfsmittel, angepasste Prüfungsformen — **rechtzeitig vor der Prüfung beantragen**, Nachweis erforderlich.",
      "**Fachpraktiker/Werker-Ausbildungen (§ 66 BBiG):** eigene Ausbildungsregelungen, im grünen Bereich z. B. **Fachpraktiker/in Gartenbau** — mit späterer Anschlussoption in die Vollausbildung.",
      "**AsA flex:** kostenlose Unterstützung der Agentur für Arbeit (Stützunterricht, sozialpädagogische Begleitung) — für Azubis **und** entlastend für Betriebe.",
      "**Finanzielle Hilfen:** Berufsausbildungsbeihilfe (BAB), ggf. Wohn- und Fahrtkostenzuschüsse.",
      "Beratung und Antragswege laufen über **Agentur für Arbeit**, zuständige Stelle und ggf. Integrationsfachdienste."
    ],
    abschnitte: [
      { t: "Nachteilsausgleich konkret", d: 2, text: "Der Nachteilsausgleich verändert **nicht die fachlichen Anforderungen**, sondern die Bedingungen: mehr Zeit, Pausen, größere Schrift, separate Räume, Assistenz oder angepasste Aufgabenformate. Antrag bei der zuständigen Stelle mit aussagekräftigem Nachweis (z. B. ärztliche/psychologische Stellungnahme) — am besten schon bei der Prüfungsanmeldung, nicht erst in der Prüfungswoche." },
      { t: "Vom Fachpraktiker zur Vollausbildung", d: 3, text: "Die Fachpraktiker-Ausbildung (§ 66 BBiG) vermittelt reduzierte Theorie bei voller Praxisnähe. Für den Gartenbau ist sie im eigenen Themenbereich **Fachwerker-Ausbildung Gartenbau** ausführlich beschrieben. Wer sich gut entwickelt, kann anschließend in die reguläre Ausbildung wechseln — mit Anrechnung von Ausbildungszeiten. Umgekehrt kann bei Überforderung in der Vollausbildung der Wechsel in die Fachpraktiker-Ausbildung den Abschluss retten. Beide Wege begleitet die zuständige Stelle; die Entscheidung braucht eine fachliche Feststellung (Reha-Beratung der Agentur für Arbeit)." }
    ],
    rollen: {
      azubi: "Unterstützung zu nutzen ist kein Makel: Stützunterricht (AsA flex) ist kostenlos, der Nachteilsausgleich gleicht nur deine Nachteile aus — deine Leistung zählt. Sprich früh mit der Ausbildungsberatung, nicht erst nach der ersten Fünf.",
      betrieb: "AsA flex entlastet Sie bei Theorie-Lücken Ihrer Azubis — nutzen Sie das, bevor die Zwischenprüfung schiefgeht. Für die Ausbildung von Menschen mit Behinderung gibt es Beratung und Zuschüsse; die zuständige Stelle vermittelt.",
      beratung: "Förderketten aktiv anbieten (AsA flex, BAB, Nachteilsausgleich, § 66-Wege) und Übergänge begleiten. Bei § 66-Feststellungen auf saubere Verfahrenswege (Reha-Team) achten und Betriebe für Inklusion gewinnen."
    },
    faq: [
      { f: "Ich habe eine Lese-Rechtschreib-Schwäche — bekomme ich in der Prüfung mehr Zeit?", a: "Bei nachgewiesener Beeinträchtigung ist ein Nachteilsausgleich möglich, z. B. Zeitzuschlag oder Vorlesen der Aufgaben (§ 65 BBiG). Stelle den Antrag mit Nachweis rechtzeitig bei der zuständigen Stelle — am besten direkt mit der Prüfungsanmeldung." },
      { f: "Was ist ein Fachpraktiker im Gartenbau?", a: "Eine Ausbildung nach § 66 BBiG für Menschen mit Behinderung: praxisorientiert, mit reduzierter Theorie und eigener Prüfung. Sie kann als Sprungbrett in die reguläre Gärtner-Ausbildung dienen — Ausbildungszeiten können angerechnet werden." }
    ],
    verwandt: ["fw-grundlagen", "zwischenpruefung", "nichtbestehen"]
  },

  /* =================== Fachwerker-Ausbildung Gartenbau ==============
     Quelle: Handreichung „Fachwerkerausbildung im Gartenbau“,
     RP Freiburg, Netzwerkfassung 1.2, Stand 31.07.2026 (ohne den
     personenbezogenen Kontaktteil). ================================= */
  {
    id: "fw-grundlagen",
    thema: "fachwerker",
    titel: "Fachwerker/in im Gartenbau: Grundlagen & Begriffe",
    kurz: "Die Fachwerkerausbildung ist eine dreijährige Berufsausbildung nach § 66 BBiG für Menschen, für die wegen Art und Schwere ihrer Behinderung eine Ausbildung im anerkannten Beruf Gärtner/in nicht in Betracht kommt. Grundlage in Baden-Württemberg ist die Gartenbaufachwerkerverordnung (GBFWVO).",
    quelle: "Handreichung „Fachwerkerausbildung im Gartenbau“, RP Freiburg, Netzwerkfassung 1.2 (Stand 31.07.2026)",
    stichworte: ["Fachwerker", "Gartenbaufachwerker", "Fachpraktiker", "Werker", "§ 66", "GBFWVO", "Behinderung", "Reha", "Förderschule", "SBBZ", "Fachrichtungen"],
    recht: [
      { n: "§ 64 BBiG", t: "Vorrang der anerkannten Ausbildungsberufe" },
      { n: "§ 66 BBiG", t: "Ausbildungsregelungen der zuständigen Stellen" },
      { n: "GBFWVO BW", t: "Gartenbaufachwerkerverordnung (seit 01.02.2022)" },
      { n: "§ 2 SGB IX", t: "Behinderungsbegriff" }
    ],
    fakten: [
      "**Leitprinzip Regelberuf zuerst (§ 64 BBiG):** Menschen mit Behinderungen sollen grundsätzlich im anerkannten Beruf (Gärtner/in) ausgebildet werden — die Fachwerkerausbildung ist die Ausnahme mit besonderer Begründung.",
      "Voraussetzung ist die **Eignungsfeststellung des zuständigen Rehabilitationsträgers** (meist Reha-Team der Agentur für Arbeit) — schlechte Noten, fehlender Schulabschluss oder SBBZ-Besuch reichen **nicht**.",
      "**Dauer: 3 Jahre**, Teilzeit möglich; die Ausbildung orientiert sich am Berufsbild Gärtner/in.",
      "**Sieben Fachrichtungen:** Baumschule, Friedhofsgärtnerei, Garten- und Landschaftsbau, Gemüsebau, Obstbau, Staudengärtnerei, Zierpflanzenbau.",
      "Der Abschluss ist ein **vollwertiger Berufsabschluss nach § 66 BBiG** — aber nicht identisch mit dem Abschluss Gärtner/in; ein späterer Aufstieg ist möglich, aber nicht automatisch."
    ],
    abschnitte: [
      { t: "Begriffe richtig verwenden", d: 2, text: "- **Fachwerker/in im Gartenbau:** offizielle Berufsbezeichnung nach der baden-württembergischen GBFWVO — so gehört sie in Verträge, Bescheide und Zeugnisse.\n- **Gartenbaufachwerker/in:** gebräuchliche Kurzform, inhaltlich meist dasselbe.\n- **Fachpraktiker/in:** bundesweiter Oberbegriff für § 66-Ausbildungen (so auch bei BERUFENET); Regelungen können je Bundesland abweichen.\n- **„Reha-Bescheinigung“:** umgangssprachlich für das **schriftliche Ergebnis der Eignungsuntersuchung** des Rehabilitationsträgers nach § 3 GBFWVO.\n- **ReZA:** rehabilitationspädagogische Zusatzqualifikation für Ausbildende (Regelfall mind. 320 Stunden)." },
      { t: "Wer gehört zur Zielgruppe?", d: 2, text: "Erforderlich sind kumulativ:\n\n- eine **Behinderung im Sinne des § 2 SGB IX** bzw. eine entsprechende leistungsrechtliche Einordnung\n- die begründete Feststellung, dass eine Ausbildung im **anerkannten Beruf nicht in Betracht kommt** — wegen Art und Schwere der Behinderung\n- eine **positive Eignung** für die konkrete Fachwerkerausbildung und Fachrichtung\n- eine **konkrete Ausbildungsmöglichkeit** (geeigneter Betrieb/Träger, geklärte Berufsschule, realistische Finanzierung)\n- Motivation, Grundbelastbarkeit und ein tragfähiger **Unterstützungsrahmen**\n\n**Nicht ausreichend** sind allein: Besuch eines SBBZ, fehlender Schulabschluss, einzelne nicht bestandene Prüfungen, Sprachprobleme oder vorübergehende Leistungsschwankungen." },
      { t: "Die sieben Fachrichtungen im Überblick", d: 3, text: "- **Baumschule:** Vermehrung, Kultur, Roden, Sortieren, Lagern und Verkauf von Gehölzen\n- **Friedhofsgärtnerei:** Grabstätten anlegen und pflegen, Trauerbinderei, Verkauf\n- **Garten- und Landschaftsbau:** Baustellen, Erdarbeiten, Be-/Entwässerung, befestigte Flächen, vegetationstechnische Arbeiten\n- **Gemüsebau:** Jungpflanzen, Produktionsverfahren, Ernte, Aufbereitung, Vermarktung\n- **Obstbau:** Obstpflanzungen, Ernte, Lagerung, Vermarktung\n- **Staudengärtnerei:** Vermehrung, Produktion, Aufbereitung, Verkauf\n- **Zierpflanzenbau:** Kulturräume, Vermehrung, Produktion, Verkauf\n\nNicht jeder Betrieb, Träger oder Schulstandort deckt alle Fachrichtungen ab — die Fachrichtung deshalb **vor Vertragsabschluss** verbindlich klären." }
    ],
    rollen: {
      azubi: "Die Fachwerkerausbildung ist ein echter Berufsabschluss mit Praxisschwerpunkt — keine „Ausbildung zweiter Klasse“. Ob sie für dich passt, klärt die Reha-Beratung der Agentur für Arbeit gemeinsam mit dir; die Ausbildungsberatung erklärt dir den Weg.",
      betrieb: "Prüfen Sie nicht selbst, ob jemand „ein Fall für § 66“ ist — das entscheidet der Rehabilitationsträger. Sprechen Sie früh mit der Ausbildungsberatung, ob Ihr Betrieb die Voraussetzungen für die Fachwerkerausbildung erfüllt oder wie eine Kooperation aussehen kann.",
      beratung: "Kernbotschaft in jeder Erstberatung: Regelberuf vor § 66, Eignungsfeststellung vor Modellwahl, keine vorschnelle Festlegung. Die Begriffsklärung (Fachwerker/Fachpraktiker/„Reha-Bescheinigung“) verhindert viele Missverständnisse zwischen den Beteiligten."
    },
    faq: [
      { f: "Muss man ohne Schulabschluss automatisch Fachwerker machen?", a: "Nein. Ein fehlender Schulabschluss ist kein Kriterium — entscheidend ist die behinderungsbedingte Feststellung des Rehabilitationsträgers, dass eine Ausbildung im anerkannten Beruf nicht in Betracht kommt (§ 66 BBiG, § 64 BBiG: Vorrang des Regelberufs)." },
      { f: "Ist Fachwerker dasselbe wie Fachpraktiker?", a: "Im Kern ja: „Fachpraktiker/in“ ist der bundesweite Oberbegriff für § 66-Ausbildungen. In Baden-Württemberg lautet die offizielle Bezeichnung nach der GBFWVO „Fachwerkerin/Fachwerker im Gartenbau“." },
      { f: "Kann man nach der Fachwerkerausbildung noch Gärtner/in werden?", a: "Ja, der Aufstieg ist möglich — aber kein Automatismus. Nötig sind eine aktuelle Eignungsprognose, ein neuer Vertrag im anerkannten Beruf und eine individuelle Entscheidung über die Anrechnung. Pauschale Zusagen wie „nur ein Jahr zusätzlich“ gibt es nicht." }
    ],
    verwandt: ["fw-weg", "fw-modelle", "foerderung"]
  },

  {
    id: "fw-weg",
    thema: "fachwerker",
    titel: "Der Weg in die Fachwerkerausbildung: Verfahren & Zuständigkeiten",
    kurz: "Vom Erstkontakt bis zum Ausbildungsbeginn führt ein klarer Fahrplan: Regelberuf prüfen, Reha-Eignung feststellen lassen, Modell und Lernorte klären, Finanzierung sichern — erst dann Vertrag schließen und eintragen lassen.",
    quelle: "Handreichung „Fachwerkerausbildung im Gartenbau“, RP Freiburg, Netzwerkfassung 1.2 (Stand 31.07.2026)",
    stichworte: ["Verfahren", "Ablauf", "Erstkontakt", "Reha-Beratung", "Eignungsuntersuchung", "Eignungsschreiben", "Stopppunkte", "Zeitplan", "Zuständigkeit Fachwerker"],
    recht: [
      { n: "§ 3 GBFWVO", t: "Eignungsuntersuchung als Eintragungsvoraussetzung" },
      { n: "§§ 112 ff. SGB III", t: "Leistungen zur Teilhabe am Arbeitsleben" },
      { n: "§ 66 BBiG", t: "Ausbildungsregelung" }
    ],
    fakten: [
      "**Vier Stopppunkte** vor dem Start: kein schriftliches Eignungsergebnis · kein gesicherter Ausbildungsplatz · ReZA/Unterstützung ungeklärt · Finanzierung nur „in Aussicht“ — bei jedem Stopp gilt: erst klären, dann weiter.",
      "**Ohne schriftliches Ergebnis der Eignungsuntersuchung** des Reha-Trägers darf die zuständige Stelle den Vertrag **nicht eintragen** (§ 3 GBFWVO); ein mündliches „müsste Fachwerker sein“ genügt nie.",
      "**Rollenteilung:** Der Reha-Träger entscheidet über Eignung und Förderung; das **Regierungspräsidium** über Anerkennung der Ausbildungsstätte, Eintragung und Prüfungen; die Schule über die Aufnahme — keine Stelle kann allein „Fachwerker machen“.",
      "**Vertrag vor Beginn** schließen und einreichen; kein rückdatierter oder „vorläufiger“ Start.",
      "Empfohlener Vorlauf für einen Start am 1. September: **etwa ein Jahr** (Orientierung im Herbst, Diagnostik im Winter, Unterlagen bis Juli)."
    ],
    abschnitte: [
      { t: "Das Verfahren in zwölf Schritten", d: 2, text: "1. **Anlass klären** — keine vorschnelle Festlegung auf § 66\n2. **Regelberuf prüfen** — geht Gärtner/in mit Nachteilsausgleich, Teilzeit oder Assistierter Ausbildung?\n3. **Reha-Zugang herstellen** — Berufsberatung/Reha-Beratung, Antrag auf Teilhabeleistungen\n4. **Eignung diagnostisch klären** — Unterlagen, Erprobungen, Stellungnahmen\n5. **Schriftliches Ergebnis sichern** — möglichst mit Fachrichtung und Unterstützungsbedarf\n6. **Ausbildungsmodell wählen** — betrieblich, begleitet, kooperativ, integrativ, besondere Einrichtung; Teilzeit als Querschnitt\n7. **Ausbildungsplatz und Schule klären** — Kapazität, Fachrichtung, Fahrt/Internat\n8. **Betriebliche Eignung prüfen** — Anerkennung, Ausbilderqualifikation, ReZA/Kooperation\n9. **Finanzierung verbindlich klären** — Vergütung, Zuschüsse, Ausbildungsgeld, Fahrt, Lernmittel\n10. **Vertrag erstellen** — richtige Berufsbezeichnung, Fachrichtung, ggf. Teilzeit\n11. **Vor Beginn einreichen und eintragen lassen**\n12. **Startkonferenz** — Ansprechpersonen, Förderplan, Krisenwege, Prüfungsvorbereitung" },
      { t: "Was ins Eignungsschreiben gehört", d: 3, text: "Aus dem Schreiben des Rehabilitationsträgers sollte klar hervorgehen:\n\n- zuständiger Träger und **Datum der Feststellung**\n- das **Ergebnis**: Ausbildung nach § 66 BBiG kommt in Betracht, Regelberuf nicht\n- möglichst die **Fachrichtung** bzw. das berufliche Ziel\n- der empfohlene **Ausbildungsrahmen/Unterstützungsbedarf**\n- eine Kontaktstelle für Rückfragen\n\n**Medizinische Diagnosen** müssen der zuständigen Stelle grundsätzlich **nicht** vollständig mitgeteilt werden — Datenminimierung gilt auch hier." },
      { t: "Empfohlener Jahresfahrplan (Start 1. September)", d: 3, text: "- **September–Dezember des Vorjahres:** Berufsorientierung, Praktika, erste Reha-Beratung\n- **Januar–März:** Eignungsdiagnostik, Modellentscheidung, Kapazitäten prüfen\n- **April–Mai:** schriftliches Ergebnis, Ausbildungsplatz, Anerkennung/ReZA, Finanzierung konkretisieren\n- **Juni:** Vertragsentwurf, Ausbildungsplan, Schulaufnahme\n- **spätestens Juli:** vollständige Unterlagen an die zuständige Stelle\n- **August:** Einarbeitungsplan, Arbeitsschutz, Kommunikationswege\n- **September:** Start nach erfolgter Klärung\n\nSpäte Fälle sind möglich, aber fehleranfällig — die Stopppunkte gelten trotzdem." }
    ],
    rollen: {
      azubi: "Dein erster Weg führt zur Berufsberatung/Reha-Beratung der Agentur für Arbeit — sie stößt die Eignungsprüfung an. Praktika helfen doppelt: Sie klären deinen Berufswunsch und liefern der Diagnostik belastbare Eindrücke.",
      betrieb: "Warten Sie mit dem Vertrag, bis Eignungsschreiben, Modell, Schule und Finanzierung stehen — ein zu früher Start lässt sich nicht heilen und gefährdet Förderleistungen. Die Ausbildungsberatung begleitet Sie durch die zwölf Schritte.",
      beratung: "Die vier Stopppunkte konsequent kommunizieren und dokumentieren. Beim Eignungsschreiben auf Vollständigkeit achten (Fachrichtung!), fehlende Angaben früh beim Reha-Träger nachfordern — das erspart Eintragungsschleifen."
    },
    faq: [
      { f: "Wer stellt fest, ob eine Fachwerkerausbildung in Frage kommt?", a: "Der zuständige Rehabilitationsträger — häufig das Reha-Team der Agentur für Arbeit — auf Basis einer Eignungsuntersuchung. Ohne dessen schriftliches Ergebnis darf der Vertrag nicht eingetragen werden (§ 3 GBFWVO)." },
      { f: "Kann der Betrieb einfach schon mal anfangen lassen, bis alles geklärt ist?", a: "Nein. Der Vertrag muss vor Ausbildungsbeginn geschlossen und eingereicht sein; ein „vorläufiger“ oder rückdatierter Start umgeht die Eignungsfeststellung und gefährdet Eintragung und Förderung." }
    ],
    verwandt: ["fw-grundlagen", "fw-modelle", "fw-betrieb"]
  },

  {
    id: "fw-modelle",
    thema: "fachwerker",
    titel: "Ausbildungsmodelle: betrieblich bis Berufsbildungswerk",
    kurz: "Die Fachwerkerausbildung kennt mehrere Modelle: direkt im Betrieb, betrieblich mit Begleitung, kooperativ oder integrativ beim Bildungsträger, in einer besonderen Einrichtung (BBW) — Teilzeit und das Budget für Ausbildung als Querschnittsoptionen.",
    quelle: "Handreichung „Fachwerkerausbildung im Gartenbau“, RP Freiburg, Netzwerkfassung 1.2 (Stand 31.07.2026)",
    stichworte: ["Modelle", "betrieblich", "kooperativ", "integrativ", "außerbetrieblich", "Berufsbildungswerk", "BBW", "Träger", "Budget für Ausbildung", "Teilzeit Fachwerker"],
    recht: [
      { n: "§ 51 SGB IX", t: "Einrichtungen der beruflichen Rehabilitation" },
      { n: "§ 61a SGB IX", t: "Budget für Ausbildung" },
      { n: "§ 7a BBiG", t: "Teilzeitberufsausbildung" }
    ],
    fakten: [
      "**Modell A — betrieblich:** Vertrag und Vergütung beim anerkannten Fachwerker-Ausbildungsbetrieb; Unterstützung über ReZA des Ausbilders oder gesicherte Kooperation.",
      "**Modell B — begleitet betrieblich:** Vertrag beim Betrieb, zusätzlich verbindlich finanzierte Unterstützung durch einen Träger/Fachdienst (Stützunterricht, Sozialpädagogik, Krisenintervention).",
      "**Modell C — kooperativ:** Der Bildungsträger ist Vertragspartner, wesentliche Praxis läuft im Kooperationsbetrieb — mit schriftlichem Kooperationsvertrag.",
      "**Modell D — integrativ:** Ausbildung beim Träger als Hauptlernort; bei außerbetrieblicher Ausbildung sollen **mindestens 18 Wochen** in anerkannten Betrieben stattfinden.",
      "**Modell E — besondere Einrichtung/BBW** (§ 51 SGB IX): wenn Art oder Schwere der Behinderung besondere Hilfen erfordert — Ausbildung, Schule, Wohnen und Fachdienste verzahnt.",
      "**Teilzeit** (§ 7a BBiG) und das **Budget für Ausbildung** (§ 61a SGB IX) lassen sich mit den Modellen kombinieren."
    ],
    abschnitte: [
      { t: "Welches Modell passt? (Entscheidungshilfe)", d: 2, text: "- Hohe betriebliche Selbstständigkeit, tragfähiger Betrieb → **A oder B**\n- Guter Kooperationsbetrieb, aber zusätzlicher Lern-/Sozialbedarf → **C**\n- Bedarf an engmaschiger, multidisziplinärer Förderung → **D**\n- Komplexe Behinderung, Bedarf an Wohnen/Fachdiensten → **E**\n- Familien-/Gesundheitsgründe, reduzierte Belastbarkeit → **Teilzeit** als Kombination\n- Bisher Werkstatt-Kontext (WfbM/anderer Leistungsanbieter) → **Budget für Ausbildung** prüfen\n\nEntscheidend ist nicht der Name des Förderangebots, sondern die **verbindlich finanzierte Leistung**." },
      { t: "Kooperationsmodell: worauf es ankommt", d: 3, text: "Im Modell C ist der Kooperationsbetrieb **keine bloße Praktikumsstelle**: Er vermittelt vereinbarte Ausbildungsinhalte systematisch und arbeitet eng mit dem Träger zusammen; die Gesamtverantwortung des vertraglichen Ausbildenden bleibt bestehen. Der Kooperationsvertrag regelt mindestens: Aufgaben und Lernorte, Anleitung und Besuchsfrequenz, Arbeitsschutz, Berichte, Datenschutz, Finanzierung und was bei Ende der Förderung geschieht." },
      { t: "Budget für Ausbildung (§ 61a SGB IX)", d: 3, text: "Für den gesetzlich bestimmten Personenkreis — insbesondere Menschen mit Anspruch auf Leistungen im Arbeitsbereich einer Werkstatt — kann das Budget für Ausbildung eine **betriebliche** Ausbildung ermöglichen: Es kann die Ausbildungsvergütung einschließlich des Arbeitgeberanteils zur Sozialversicherung sowie erforderliche Anleitung und Begleitung finanzieren. Die Voraussetzungen sind strikt im Einzelfall zu prüfen; zuständig ist der Rehabilitationsträger." }
    ],
    rollen: {
      azubi: "Ob Betrieb, Träger oder Berufsbildungswerk: Das Modell wird zu deinem Unterstützungsbedarf passend gewählt — nicht umgekehrt. Sag in der Beratung ehrlich, wobei du Hilfe brauchst; das entscheidet über den richtigen Rahmen.",
      betrieb: "Sie müssen nicht alles allein stemmen: Die Modelle B und C holen professionelle Unterstützung an Bord, ohne Ihnen die Ausbildung aus der Hand zu nehmen. Klären Sie im Kooperationsfall Rollen und Kosten schriftlich — vor dem Start.",
      beratung: "Modellwahl immer vom Unterstützungsbedarf her denken und die Finanzierungslogik je Modell früh transparent machen (wer ist Vertragspartner, wer zahlt was). Die Entscheidungsmatrix der Handreichung ist dafür das Arbeitsraster."
    },
    faq: [
      { f: "Wer schließt beim Träger-Modell den Ausbildungsvertrag?", a: "Im kooperativen und integrativen Modell ist regelmäßig der Bildungsträger Vertragspartner; die Praxis findet ganz oder teilweise in (Kooperations-)Betrieben statt. Beim betrieblichen und begleiteten Modell bleibt der Betrieb Vertragspartner." },
      { f: "Geht die Fachwerkerausbildung auch in Teilzeit?", a: "Ja — die GBFWVO lässt Teilzeit nach § 7a BBiG zu: Kürzung der täglichen oder wöchentlichen Zeit um bis zu 50 %, die Gesamtdauer verlängert sich entsprechend (höchstens auf das Anderthalbfache). Schule, überbetriebliche Ausbildung und Prüfungen laufen dabei nicht automatisch anteilig — vorher gemeinsam planen." }
    ],
    verwandt: ["fw-weg", "fw-betrieb", "fw-geld"]
  }
,

  {
    id: "fw-betrieb",
    thema: "fachwerker",
    titel: "Betriebliche Eignung, ReZA, Vertrag & Wechsel",
    kurz: "Wer Fachwerker/innen ausbilden will, braucht mehr als die Gärtner-Anerkennung: rehabilitationspädagogische Qualität (ReZA oder gesicherte Kooperation), passende Ausbilderqualifikation — und die Eintragung setzt das Eignungsschreiben des Reha-Trägers voraus.",
    quelle: "Handreichung „Fachwerkerausbildung im Gartenbau“, RP Freiburg, Netzwerkfassung 1.2 (Stand 31.07.2026)",
    stichworte: ["ReZA", "rehabilitationspädagogische Zusatzqualifikation", "Eignung Betrieb Fachwerker", "Anerkennung", "Kooperationsvertrag", "Umstellung", "Wechsel Gärtner Fachwerker", "Vertrag Fachwerker", "Eintragung Fachwerker", "acht Auszubildende"],
    recht: [
      { n: "§ 4 GBFWVO", t: "Eignung von Ausbildungsstätte und Ausbildenden" },
      { n: "§ 4 Abs. 7 GBFWVO", t: "Ausnahme vom ReZA-Nachweis" },
      { n: "§§ 27–30 BBiG", t: "Allgemeine Eignungsanforderungen" },
      { n: "§ 7, § 8 BBiG", t: "Anrechnung, Verkürzung, Verlängerung" }
    ],
    fakten: [
      "**Ausbildende brauchen:** persönliche und fachliche Eignung, **AEVO**, bei erstmaliger § 66-Ausbildung **mehrjährige Ausbildungserfahrung** — und grundsätzlich die **ReZA mit mindestens 320 Stunden** (acht Kompetenzfelder).",
      "**Ausnahme vom ReZA-Nachweis** (§ 4 Abs. 7 GBFWVO): nur wenn die Qualität anderweitig verlässlich gesichert ist — Regelfall ist die Unterstützung durch eine Einrichtung nach § 51 SGB IX; gelegentliches Coaching genügt nicht.",
      "Eine hauptberuflich vollbeschäftigte Ausbilderperson darf nach der GBFWVO **höchstens acht Auszubildende** gleichzeitig ausbilden.",
      "**Ein Gärtner-Ausbildungsbetrieb ist nicht automatisch Fachwerker-geeignet** — die zusätzliche Prüfung durch die zuständige Stelle ist Pflicht.",
      "**Kein Umschreiben:** Ein laufender Gärtnervertrag wird nicht durch geänderte Überschrift zum Fachwerkervertrag — nötig sind Eignungsfeststellung, neuer Vertrag und Eintragung.",
      "**Keine automatische Anrechnung** früherer Ausbildungszeit — entschieden wird kompetenzbezogen im Einzelfall."
    ],
    abschnitte: [
      { t: "Unterlagen für die Eintragung", d: 2, text: "- **schriftliches Ergebnis der Eignungsuntersuchung** des Reha-Trägers (zwingend vor Eintragung)\n- vollständiger **Ausbildungsvertrag** (richtige Berufsbezeichnung „Fachwerker/in im Gartenbau“ + Fachrichtung, vor Beginn geschlossen)\n- individueller **betrieblicher Ausbildungsplan**\n- Nachweis der **Anerkennung der Ausbildungsstätte** für die Fachwerkerausbildung\n- **Ausbilder-Nachweise** (Fachlichkeit, AEVO, Erfahrung, ReZA bzw. Kooperationskonzept)\n- ggf. **Kooperations-/Unterstützungsvertrag** (Aufgaben, Umfang, Finanzierung, Laufzeit, Datenschutz)\n- geklärte **Schulzuordnung** und — praktisch zwingend — die **Förderbewilligung**" },
      { t: "Die ReZA: acht Kompetenzfelder", d: 3, text: "1. Reflexion der betrieblichen Ausbildungspraxis\n2. Psychologie (Lern-, Verhaltens-, Entwicklungsbesonderheiten)\n3. Pädagogik und Didaktik (kleinschrittige Lernziele, differenzierte Methoden)\n4. Rehabilitationskunde (Reha-System, Teilhabeplanung)\n5. Interdisziplinäre Projektarbeit (Schule, Fachdienste, RP, Reha-Träger)\n6. Arbeitskunde und Arbeitspädagogik (Aufgaben analysieren und anpassen)\n7. Recht (BBiG, SGB, Arbeitsschutz, Datenschutz)\n8. Medizin (Grundverständnis gesundheitlicher Einschränkungen)\n\nEine **belastbare Kooperation** statt eigener ReZA muss verbindlich, qualifiziert, für die gesamte Dauer finanziert und praktisch erreichbar sein — mit Förderplanung, Fallbesprechungen, Stützangeboten, Krisenintervention und dokumentierter Qualitätssicherung." },
      { t: "Wechsel Gärtner/in → Fachwerker/in (und zurück)", d: 3, text: "**In die Fachwerkerausbildung:**\n\n1. Fallklärung: vorübergehende Überforderung oder echte § 66-Indikation? Erst Hilfen im Regelberuf prüfen (Nachteilsausgleich, Teilzeit, Verlängerung, AsA flex, Betriebswechsel).\n2. Reha-Beratung einschalten, schriftliche Eignungsfeststellung einholen.\n3. Modell, Betrieb/Träger, Schule, Finanzierung bestimmen.\n4. Gärtnervertrag in Abstimmung mit der zuständigen Stelle beenden — ohne Versicherungslücke.\n5. Neuen Fachwerkervertrag schließen und **vor** Fortsetzung eintragen lassen.\n6. Anrechnung individuell beantragen (kompetenzbezogen, keine Kalenderautomatik).\n\n**Aufstieg Fachwerker/in → Gärtner/in:** neuer Ausbildungsgang mit aktueller Eignungsprognose, gutem Leistungsbild und Erprobung im höheren Anforderungsniveau; Restdauer entscheidet die zuständige Stelle — nicht pauschal „ein Jahr“.\n\n**Wichtig:** Die Fachwerkerprüfung ist **kein Ersatzabschluss** nach nicht bestandener Gärtnerprüfung — auch dafür gelten Eignungsfeststellung, ordnungsgemäßes Ausbildungsverhältnis und reguläre Zulassung." }
    ],
    rollen: {
      azubi: "Wenn deine Gärtnerausbildung zu scheitern droht, heißt der erste Schritt nicht „umschreiben lassen“, sondern Ursachen klären — oft retten Nachteilsausgleich, Verlängerung oder Stützunterricht den Regelabschluss. Die Reha-Beratung entscheidet, ob § 66 wirklich der richtige Weg ist.",
      betrieb: "Planen Sie die ReZA-Frage vor dem ersten Fachwerkervertrag: eigene Zusatzqualifikation oder schriftlich gesicherte Kooperation mit einem Reha-Träger. Und beachten Sie die Obergrenze von acht Auszubildenden je vollbeschäftigter Ausbilderperson.",
      beratung: "Bei Umstellungswünschen aus laufenden Gärtnerverträgen konsequent das 6-Schritte-Verfahren fahren und dokumentieren — rückwirkende Umdeklarationen sind der häufigste und folgenreichste Verfahrensfehler. ReZA-Ausnahmen nur mit belastbarem Konzept nach § 4 Abs. 7 GBFWVO."
    },
    faq: [
      { f: "Darf ein anerkannter Gärtner-Ausbildungsbetrieb automatisch Fachwerker ausbilden?", a: "Nein. Zusätzlich zur allgemeinen Eignung müssen die rehabilitationspädagogischen Anforderungen erfüllt sein — ReZA (mind. 320 Stunden) oder eine verlässlich gesicherte Unterstützung. Die zuständige Stelle prüft das vor der Eintragung." },
      { f: "Kann ein laufender Gärtnervertrag einfach auf Fachwerker umgestellt werden?", a: "Nein — es braucht die Eignungsfeststellung des Reha-Trägers, einen neuen Fachwerkervertrag, die geeignete Ausbildungsstätte und die Eintragung. Bereits absolvierte Zeit wird individuell, kompetenzbezogen angerechnet — nicht automatisch." },
      { f: "Was ist die ReZA?", a: "Die rehabilitationspädagogische Zusatzqualifikation für Ausbildende in § 66-Ausbildungen: im Regelfall mindestens 320 Stunden in acht Kompetenzfeldern (u. a. Psychologie, Didaktik, Rehabilitationskunde, Recht). Alternativ kann die Qualität über eine geeignete Einrichtung nach § 51 SGB IX gesichert werden." }
    ],
    verwandt: ["fw-weg", "fw-modelle", "ausbilder"]
  },

  {
    id: "fw-inhalte-pruefung",
    thema: "fachwerker",
    titel: "Inhalte, Berufsschule & Prüfungen der Fachwerkerausbildung",
    kurz: "Drei Jahre praxisorientierte Ausbildung mit Pflicht-Lehrgang „Maschinen im Gartenbau“, eigener Zwischen- und Abschlussprüfung (70 % Praxis) und klaren Regeln zum Nachteilsausgleich.",
    quelle: "Handreichung „Fachwerkerausbildung im Gartenbau“, RP Freiburg, Netzwerkfassung 1.2 (Stand 31.07.2026)",
    stichworte: ["Prüfung Fachwerker", "Zwischenprüfung Fachwerker", "Abschlussprüfung Fachwerker", "Pflanzenkenntnisse", "15 Pflanzen", "ÜBA", "Maschinenlehrgang", "Rückenschule", "Ausbildungsplan Fachwerker", "Nachteilsausgleich Fachwerker"],
    recht: [
      { n: "GBFWVO BW", t: "Ausbildungsrahmenplan, Prüfungsregelungen" },
      { n: "§ 65 BBiG", t: "Nachteilsausgleich" },
      { n: "VOAPLandw", t: "Prüfungsverfahren der landwirtschaftlichen Berufe" }
    ],
    fakten: [
      "**Pflicht-ÜBA:** mindestens **zwei Ausbildungswochen** „Einsatz von Maschinen im Gartenbau“ inklusive Arbeitssicherheit und Rückenschule (teilbar in Abschnitte).",
      "Bei **außerbetrieblicher** Ausbildung sollen mindestens **18 Wochen** betriebliche Phasen in anerkannten Ausbildungsstätten stattfinden.",
      "**Zwischenprüfung** (vor Ende des 2. Jahres): 120 Minuten Praxis mit drei Aufgaben + 30 Minuten Pflanzenkenntnisse (**15 Pflanzen** erkennen und benennen).",
      "**Abschlussprüfung:** Praxis 180 Minuten, vier Aufgaben aus dem 3. Jahr (**70 %**); schriftlich gesamt 150 Minuten (**30 %**: Fachwissen 120 min, Pflanzen 30 min/15 Pflanzen).",
      "**Bestehensregel:** Gesamtergebnis mindestens „ausreichend“; nicht bestanden bei einer „ungenügenden“ oder mehr als einer „mangelhaften“ Prüfungsleistung.",
      "**Nachteilsausgleich:** spätestens mit der Prüfungsanmeldung beantragen, ärztlich nachweisen — Maßnahmen ändern die fachlichen Anforderungen nicht."
    ],
    abschnitte: [
      { t: "Ausbildungsplan & Ausbildungsnachweis", d: 2, text: "Der Ausbildende erstellt einen **individuellen betrieblichen Ausbildungsplan** auf Grundlage des Ausbildungsrahmenplans; Abweichungen sind zulässig, wenn Behinderung oder Betriebspraxis es erfordern — das Ausbildungsziel muss erreichbar bleiben. Die zuständige Stelle **kann** vom Führen des Ausbildungsnachweises entbinden (abhängig von Art und Schwere der Behinderung); davon sollte zurückhaltend Gebrauch gemacht werden, denn der Nachweis ist zugleich Lern- und Kommunikationsinstrument." },
      { t: "Gemeinsame Inhalte aller Fachrichtungen", d: 3, text: "- **Ausbildungsbetrieb:** Vertrag, Organisation, soziale Beziehungen, Arbeits- und Tarifrecht, Arbeitsschutz\n- **Natur und Umwelt:** Umweltschutz, rationelle Energie- und Materialverwendung\n- **Betriebliche Abläufe:** Informationsbeschaffung, Arbeitsplanung, wirtschaftliche Zusammenhänge\n- **Böden, Erden, Substrate:** Eigenschaften, Bearbeitung, Pflege\n- **Pflanzen:** Erkennen, Verwendung, Kultur- und Pflegemaßnahmen\n- **Maschinen und Materialien:** sicherer Einsatz, Wartung, Geräte, Werkstoffe\n\nDazu kommen die fachrichtungsspezifischen Inhalte (Abschnitt III des Rahmenplans) — aus ihnen stammt mindestens die Hälfte der schriftlichen Fachwissen-Aufgaben." },
      { t: "Nachteilsausgleich konkret beantragen", d: 3, text: "Mögliche Maßnahmen: angemessene **Zeitverlängerung**, persönliche/sächliche/kommunikative **Hilfsmittel oder Assistenz**, **Ruhepausen** ohne Anrechnung auf die Prüfungszeit, weitere individuell geeignete Anpassungen. Der Antrag sollte die **funktionale Einschränkung** und die passende Maßnahme beschreiben — nicht nur eine Diagnose nennen. Schule, Träger und Betrieb sollten die konkrete Prüfungsbarriere schon Monate vorher beobachten. Hilfen im Unterricht sind **getrennt** vom Prüfungs-Nachteilsausgleich zu beantragen." }
    ],
    rollen: {
      azubi: "Pflanzenkenntnisse entscheiden mit: In Zwischen- und Abschlussprüfung musst du jeweils 15 Pflanzen erkennen und benennen — übe das von Anfang an im Betriebsalltag. Wenn du Unterstützung in der Prüfung brauchst, beantragt ihr den Nachteilsausgleich mit der Anmeldung.",
      betrieb: "Planen Sie die zwei Pflichtwochen Maschinenlehrgang und ggf. die 18 betrieblichen Wochen früh ins Ausbildungsjahr ein. Der individuelle Ausbildungsplan ist Ihr Steuerungsinstrument — halten Sie ihn aktuell und nutzen Sie die Zwischenprüfung als Standortbestimmung.",
      beratung: "Nachteilsausgleiche früh und funktional vorbereiten (Barriere → Maßnahme), Anträge mit der Anmeldung. Bei Befreiungswünschen vom Ausbildungsnachweis restriktiv beraten — der Nachweis trägt die Ausbildungsdokumentation."
    },
    faq: [
      { f: "Wie läuft die Fachwerker-Abschlussprüfung ab?", a: "Praktisch 180 Minuten mit vier gleich gewichteten Aufgaben aus dem dritten Ausbildungsjahr (70 % des Ergebnisses) plus 150 Minuten schriftlich (30 %): 120 Minuten Fachwissen und 30 Minuten Pflanzenkenntnisse mit 15 Pflanzen. Bestanden ist, wer im Gesamtergebnis mindestens „ausreichend“ erreicht — eine ungenügende oder mehr als eine mangelhafte Leistung bedeutet Nichtbestehen." },
      { f: "Kann man beim Fachwerker vom Berichtsheft befreit werden?", a: "Die zuständige Stelle kann abhängig von Art und Schwere der Behinderung von der Pflicht zum Ausbildungsnachweis entbinden. Empfohlen wird das nur ausnahmsweise — der Nachweis ist ein wichtiges Lern- und Kommunikationsinstrument." }
    ],
    verwandt: ["fw-grundlagen", "abschlusspruefung", "foerderung"]
  },

  {
    id: "fw-geld",
    thema: "fachwerker",
    titel: "Vergütung & Förderung in der Fachwerkerausbildung",
    kurz: "Wer zahlt, hängt vom Modell ab: Beim betrieblichen Vertrag zahlt der Betrieb die Ausbildungsvergütung (Mindestvergütung gilt), beim Träger fließen Ausbildungsgeld oder Übergangsgeld nach Förderbescheid. Betriebe können Zuschüsse bis 60/80 % erhalten.",
    quelle: "Handreichung „Fachwerkerausbildung im Gartenbau“, RP Freiburg, Netzwerkfassung 1.2 (Stand 31.07.2026)",
    stichworte: ["Vergütung Fachwerker", "Ausbildungsgeld", "Übergangsgeld", "Zuschuss Arbeitgeber", "Förderung Fachwerker", "Finanzierung", "BAB Fachwerker", "60 Prozent", "80 Prozent"],
    recht: [
      { n: "§ 17 BBiG", t: "Vergütungsanspruch (betrieblicher Vertrag)" },
      { n: "§ 73 SGB III", t: "Zuschüsse zur Ausbildungsvergütung" },
      { n: "§§ 112 ff. SGB III", t: "Leistungen zur Teilhabe (Ausbildungsgeld u. a.)" },
      { n: "§ 61a SGB IX", t: "Budget für Ausbildung" }
    ],
    fakten: [
      "**Begriffe trennen:** Ausbildungsvergütung = vertragliche Zahlung des Ausbildenden; Ausbildungsgeld, Übergangsgeld, BAB, Fahrt-/Unterkunftskosten = Sozialleistungen mit eigenen Voraussetzungen. „Fachwerker bekommen Betrag X“ ist deshalb regelmäßig falsch.",
      "**Betrieblicher Vertrag:** Mindestausbildungsvergütung gilt (Beginn 2026: **724 €** im 1. Jahr, dann +18 %/+35 %/+40 % — Details im Artikel Mindestvergütung); Tarifbindung und 80-%-Regel beachten.",
      "**Arbeitgeberzuschuss** (§ 73 SGB III): bis **60 %** der Vergütung bei Rehabilitand/innen, bis **80 %** bei schwerbehinderten Menschen — plus pauschalierter SV-Anteil; kein Automatismus, **vor Beginn** klären.",
      "**Trägermodell:** Auszubildende erhalten Leistungen zum Lebensunterhalt nach Förderbescheid (Ausbildungsgeld/Übergangsgeld); Maßnahmekosten trägt der Reha-Träger.",
      "**Budget für Ausbildung:** kann Vergütung inkl. Arbeitgeber-SV-Anteil und die nötige Anleitung/Begleitung finanzieren.",
      "**Teilzeit:** Vergütung darf anteilig angepasst werden — Berechnung vorab mit zuständiger Stelle und Förderträger abstimmen."
    ],
    abschnitte: [
      { t: "Weitere Leistungen im Blick behalten", d: 2, text: "Je nach Einzelfall kommen hinzu:\n\n- **Fahrtkosten**, Familienheimfahrten, notwendige **Unterkunft/Internat** und Verpflegung\n- **Lernmittel, Arbeitskleidung, Hilfsmittel**, technische Arbeitshilfen oder Assistenz (behinderungsbedingt)\n- **Berufsausbildungsbeihilfe (BAB)** in geeigneten betrieblichen Konstellationen\n- **Kinderbetreuungskosten** und ergänzende Leistungen\n\nZuständigkeit und Höhe regeln die jeweiligen Bescheide — vor Ausbildungsbeginn beantragen." },
      { t: "Typische Finanzierungsfehler vermeiden", d: 3, text: "- Betrieb und Träger halten sich **gegenseitig** für den Vergütungszahler → Vertragslogik je Modell vorab festlegen\n- **Zuschuss erst nach Beginn** beantragt → keine oder nur teilweise Bewilligung; Anträge gehören vor den Start\n- **Fahrt/Internat/Blockschule** in der Planung vergessen → Deckungslücken im laufenden Jahr\n- **Modellwechsel** ohne Prüfung der Sozialleistungs- und Versicherungsfolgen\n- **Teilzeit** vereinbart, aber Vergütung, Förderdauer und Schulorganisation ungeklärt\n- Förderzusage ist **trägergebunden**, der Betrieb plant ein anderes Modell" }
    ],
    rollen: {
      azubi: "Wieviel Geld du bekommst, hängt vom Modell ab — lass dir in der Beratung genau aufschlüsseln, was Vergütung, was Sozialleistung ist und was du beantragen musst (BAB, Fahrt, Unterkunft). Anträge immer vor dem Start stellen.",
      betrieb: "Der Zuschuss nach § 73 SGB III macht die Fachwerkerausbildung wirtschaftlich gut tragbar — bis 60/80 % der Vergütung plus SV-Pauschale. Klären Sie Höhe und Laufzeit verbindlich mit dem Arbeitgeber-Service/Reha-Team, bevor der Vertrag unterschrieben wird.",
      beratung: "Bei jeder Modellberatung die Zahlungslogik explizit machen (wer zahlt was, aus welchem Bescheid) und die typischen Finanzierungsfehler als Checkliste durchgehen — Deckungslücken sind ein Hauptgrund für Abbrüche im ersten Jahr."
    },
    faq: [
      { f: "Wie viel verdient man in der Fachwerkerausbildung?", a: "Beim betrieblichen Vertrag zahlt der Betrieb die Ausbildungsvergütung — mindestens die gesetzliche Mindestvergütung (Beginn 2026: 724 € im 1. Jahr, mit den gesetzlichen Aufschlägen), tarifgebunden entsprechend mehr. Bei Träger-Modellen gibt es stattdessen Ausbildungsgeld oder Übergangsgeld nach dem Förderbescheid des Reha-Trägers — eine Pauschalaussage gibt es nicht." },
      { f: "Bekommt der Betrieb einen Zuschuss, wenn er Fachwerker ausbildet?", a: "Möglich ist ein Zuschuss zur Ausbildungsvergütung nach § 73 SGB III: bis zu 60 % bei Rehabilitandinnen und Rehabilitanden, bis zu 80 % bei schwerbehinderten oder gleichgestellten Menschen, zuzüglich eines pauschalierten Arbeitgeberanteils zur Sozialversicherung. Höhe und Bewilligung entscheidet die Agentur für Arbeit im Einzelfall — vor Ausbildungsbeginn klären." }
    ],
    verwandt: ["mindestverguetung", "fw-modelle", "sachbezuege-sozialvers"]
  }


  ]
};
