// vorlagen.js — E-Mail- und Schreibvorlagen der zuständigen Stelle /
// Ausbildungsberatung. Platzhalter stehen in [ECKIGEN KLAMMERN] und werden
// in der Vorlagen-Ansicht per Formular gefüllt. `anhaenge` verweist auf
// Einträge aus quellen.js (Formulare, die typischerweise beigelegt werden).
// `anhaengePlan: true` legt zusätzlich den betrieblichen Ausbildungsplan der
// gerade gewählten Fachrichtung bei (Zuordnung über `fuer` in quellen.js).
// **Fett** wird in der HTML-Fassung der Mail zu <strong>; Zeilen mit „- " und
// „1. " werden zu Aufzählungen. Die Texte enden mit der Grußformel — Name und
// Dienststelle kommen aus der Signatur des E-Mail-Programms.
// Kategorien folgen dem Ausbildungsverlauf (vor der Ausbildung → Betrieb →
// Vertrag → laufende Ausbildung → Prüfung); neue Vorlagen dort einordnen, wo
// der Fall zeitlich ankommt. Die Reihenfolge hier ist die Anzeigereihenfolge.
// PFLEGE: Texte fachlich prüfen wie Wissensartikel; Stand unten aktualisieren.
window.VORLAGEN = {
  stand: "01.10.2026",
  kategorien: [
    { id: "vorher",   titel: "Vor der Ausbildung" },
    { id: "betrieb",  titel: "Ausbildungsbetriebe" },
    { id: "vertrag",  titel: "Vertrag & Ausbildungsstart" },
    { id: "waehrend", titel: "Während der Ausbildung" },
    { id: "pruefung", titel: "Prüfung & Abschluss" }
  ],
  vorlagen: [

  /* ================= Vor der Ausbildung ============================== */
  { id: "interesse-gaertner",
    kategorie: "vorher",
    titel: "Interesse an einer Gärtnerausbildung (Fachrichtung)",
    betreff: "Ihre Anfrage: Ausbildung Gärtner/in, Fachrichtung [FACHRICHTUNG]",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nschön, dass Sie sich für die Ausbildung zur Gärtnerin/zum Gärtner in der Fachrichtung [FACHRICHTUNG] interessieren!\n\n**Der Weg in die Ausbildung:**\n1. **Praktikum** im Wunschbereich — der beste Realitätscheck und oft der Türöffner (Vordruck Praktikantenvertrag anbei).\n2. **Ausbildungsbetrieb finden:** Anerkannte Betriebe Ihrer Region nennen wir Ihnen gerne; auch die Jobbörse der Agentur für Arbeit und die Betriebe selbst helfen weiter.\n3. **Vertrag schließen:** Der Betrieb reicht den Berufsausbildungsvertrag bei uns zur Eintragung ein — die Unterlagen und den betrieblichen Ausbildungsplan Ihrer Fachrichtung finden Sie anbei bzw. in unserem Formularbereich.\n\n**Gut zu wissen:** Die Ausbildung dauert 3 Jahre (Verkürzung z. B. mit Abitur möglich), Berufsschule je nach Region als Teilzeit- oder Blockunterricht, Vergütung mindestens nach Tarif/Mindestausbildungsvergütung. Zur Fachrichtung [FACHRICHTUNG] beraten wir Sie gerne auch telefonisch zu Besonderheiten, Betrieben und Schulstandorten.\n\nMit freundlichen Grüßen",
    hinweise: "Der Ausbildungsplan der gewählten Fachrichtung hängt automatisch an; regionale Schulstandorte ergänzen.",
    anhaenge: ["praktikantenvertrag", "bav", "ba-berufetv"],
    anhaengePlan: true,
    stichworte: ["Interesse", "Gärtnerausbildung", "Fachrichtung", "Berufswunsch", "Einstieg"],
    artikel: ["ausbildungsvertrag", "zustaendige-stelle"] },

  { id: "interesse-fachwerker",
    kategorie: "vorher",
    titel: "Interesse an einer Fachwerkerausbildung (§ 66 BBiG)",
    betreff: "Ihre Anfrage: Fachwerkerausbildung im Gartenbau",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nvielen Dank für Ihre Anfrage zur Fachwerkerausbildung im Gartenbau.\n\nDie Fachwerkerausbildung ist eine **dreijährige Berufsausbildung nach § 66 BBiG** für Menschen, für die wegen Art und Schwere einer Behinderung eine Ausbildung im anerkannten Beruf Gärtner/in nicht in Betracht kommt. Wichtig zu wissen:\n\n- **Erster Schritt ist immer die Reha-Beratung der Agentur für Arbeit:** Sie prüft mit einer Eignungsuntersuchung, ob die Fachwerkerausbildung der richtige Weg ist — ohne dieses schriftliche Ergebnis dürfen wir keinen Vertrag eintragen. Vorrangig wird geprüft, ob die reguläre Gärtnerausbildung mit Unterstützung (z. B. Stützunterricht, Nachteilsausgleich, Teilzeit) möglich ist.\n- Danach klären wir gemeinsam **Ausbildungsmodell** (Betrieb, Bildungsträger oder besondere Einrichtung), Fachrichtung, Berufsschule und Finanzierung.\n- Betriebe benötigen für die Fachwerkerausbildung eine besondere Eignung (rehabilitationspädagogische Qualifikation oder gesicherte Unterstützung) — dazu beraten wir Betriebe gerne.\n\nBitte vereinbaren Sie als nächsten Schritt einen Termin bei der Berufsberatung/Reha-Beratung Ihrer Agentur für Arbeit [AGENTUR_ORT]. Parallel stehen wir für alle Fragen rund um Betriebe, Verfahren und Vertrag zur Verfügung.\n\nMit freundlichen Grüßen",
    hinweise: "Keine Eignungszusagen machen — die Entscheidung liegt beim Reha-Träger. Bei Betrieben zusätzlich auf ReZA/Kooperation eingehen.",
    anhaenge: ["ba-reha", "gesetz-gbfwvo"],
    stichworte: ["Fachwerker", "Interesse", "§ 66", "Reha", "Behinderung", "Anfrage"],
    artikel: ["fw-grundlagen", "fw-weg"] },

  { id: "teilzeitausbildung",
    kategorie: "vorher",
    titel: "Interesse an einer Teilzeitausbildung (§ 7a BBiG)",
    betreff: "Ihre Anfrage: Ausbildung in Teilzeit",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\ngerne informieren wir Sie über die Ausbildung in Teilzeit.\n\n**Das Wichtigste:**\n- Teilzeit ist seit 2020 **für alle** möglich — ein besonderer Grund ist nicht mehr erforderlich (§ 7a BBiG).\n- Die tägliche oder wöchentliche Ausbildungszeit kann um **bis zu 50 %** reduziert werden; die Gesamtdauer verlängert sich entsprechend, höchstens auf das Anderthalbfache.\n- Die **Vergütung** darf entsprechend der Kürzung angepasst werden; Berufsschule (oft Blockunterricht) und überbetriebliche Lehrgänge laufen in der Regel in vollem Umfang weiter — das planen wir gemeinsam realistisch.\n- Die Teilzeitvereinbarung wird im Berufsausbildungsvertrag festgehalten und bei uns eingetragen; eine spätere Umstellung eines laufenden Vertrags ist über den Änderungsantrag möglich.\n\nWenn Sie bereits einen Betrieb im Blick haben, sprechen Sie das Modell dort offen an — viele Betriebe haben gute Erfahrungen gemacht. Gerne unterstützen wir das Gespräch mit Informationen oder vermitteln Kontakte.\n\nMit freundlichen Grüßen",
    hinweise: "Bei Teilzeit wegen Kinderbetreuung/Pflege auf die Vorlage „Ausbildung mit Kind“ und Förderleistungen verweisen.",
    anhaenge: ["bav", "bav-aenderung"],
    stichworte: ["Teilzeit", "Teilzeitausbildung", "§ 7a", "reduzierte Stunden"],
    artikel: ["teilzeit-verkuerzung"] },

  { id: "ausbildung-mit-kind",
    kategorie: "vorher",
    titel: "Ausbildung mit Kind — Möglichkeiten & Unterstützung",
    betreff: "Ihre Anfrage: Ausbildung mit Kind",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\neine Ausbildung mit Kind ist gut machbar — viele Auszubildende gehen diesen Weg erfolgreich. Die wichtigsten Bausteine:\n\n- **Teilzeitausbildung (§ 7a BBiG):** Reduzierung der täglichen/wöchentlichen Zeit um bis zu 50 % — das gängige Modell für Eltern. Die Gesamtdauer verlängert sich entsprechend.\n- **Finanzielle Unterstützung:** Berufsausbildungsbeihilfe (BAB) inklusive Zuschlägen für Kinderbetreuung, Kindergeld, ggf. Wohngeld und Leistungen für Bildung und Teilhabe. Die Agentur für Arbeit berät und nimmt Anträge online entgegen — bitte **vor Ausbildungsbeginn** stellen.\n- **Betreuung & Schule:** Blockunterricht und Betreuungszeiten früh zusammen planen; Schulen und Betriebe finden hier fast immer Lösungen. Fehlzeiten wegen Erkrankung des Kindes sind über die gesetzlichen Regelungen abgesichert.\n- **Schutzrechte:** Während Schwangerschaft und Elternzeit gelten Mutterschutz und besonderer Kündigungsschutz auch in der Ausbildung; die Ausbildung kann für Elternzeit unterbrochen und danach fortgesetzt werden.\n\nGerne besprechen wir Ihre konkrete Situation ([SITUATION]) persönlich und helfen bei der Suche nach einem teilzeitoffenen Betrieb.\n\nMit freundlichen Grüßen",
    hinweise: "Individuelle Leistungsansprüche nicht zusagen — auf BAB-Rechner und Beratung der Agentur verweisen.",
    anhaenge: ["ba-bab", "bav"],
    stichworte: ["Kind", "Eltern", "Ausbildung mit Kind", "Teilzeit", "BAB", "alleinerziehend"],
    artikel: ["teilzeit-verkuerzung", "sachbezuege-sozialvers"] },

  /* ================= Ausbildungsbetriebe ============================= */
  { id: "anerkennung-ausbildungsbetrieb",
    kategorie: "betrieb",
    titel: "Anerkennung als Ausbildungsbetrieb & Ausbilder/in — Unterlagen und Verfahren",
    betreff: "Anerkennung als Ausbildungsbetrieb und Ausbilder/in — [BERUF], Fachrichtung [FACHRICHTUNG]",
    // Verallgemeinert aus der Praxis-E-Mail der Ausbildungsberatung (RP
    // Freiburg, 05/2026) samt ihren Anlagen. Ergänzt um die Unbedenklichkeits-
    // bescheinigung (§ 2 Abs. 6 GartAusbStEignV, auch Nr. 9 des Antrags) und
    // die Antragstermine der RP-Verfahrensseite.
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nanbei erhalten Sie die Informationen und Unterlagen zur Anerkennung Ihres Betriebs als Ausbildungsstätte für den Beruf [BERUF], Fachrichtung [FACHRICHTUNG]. Anerkannt werden zwei Dinge: der Betrieb als Ausbildungsstätte und die Person, die ausbildet.\n\n**1. Anerkennung als Ausbildungsstätte**\n\nDamit Ihr Betrieb künftig ausbilden kann, muss die Betriebsstätte zunächst in einem förmlichen Verfahren durch uns als Ausbildungsstätte anerkannt werden. Bitte füllen Sie dafür den beigefügten „Antrag auf Anerkennung der Ausbildungsstätte im Gartenbau“ vollständig aus und reichen Sie ihn unterschrieben bei uns ein. Beizufügen sind:\n\n- eine **Unbedenklichkeitsbescheinigung der Berufsgenossenschaft** (für Gartenbaubetriebe die SVLFG) über die Einhaltung der Unfallverhütungsvorschriften — sie darf nicht älter als ein Jahr sein\n- die **Bilanzen der letzten drei Jahre** — liegen sie nicht vor, genügt eine Bestätigung Ihres Steuerbüros im Wortlaut des beigefügten Blatts\n\nDas beigefügte Merkblatt erläutert die Anforderungen an die Ausbildungsstätte. Der betriebliche Ausbildungsplan für die Fachrichtung [FACHRICHTUNG] zeigt, welche Inhalte Ihr Betrieb vermitteln muss.\n\n**2. Anerkennung als Ausbilderin oder Ausbilder**\n\nFür die Ausbildung braucht Ihr Betrieb außerdem eine persönlich und fachlich geeignete Ausbilderin oder einen geeigneten Ausbilder. Auch diese Person muss zunächst in einem förmlichen Verfahren durch uns anerkannt werden. Bitte reichen Sie dafür den beigefügten „Antrag auf Anerkennung als Ausbilder/in im Gartenbau“ vollständig ausgefüllt und unterschrieben ein — zusammen mit diesen Unterlagen:\n\n- **tabellarischer Lebenslauf** — mit allen Zeiten der gärtnerischen Berufspraxis und den jeweiligen Betrieben\n- **Nachweis der fachlichen Eignung** — Kopie des Meisterprüfungszeugnisses bzw. des Techniker- oder Hochschulabschlusses\n- **Nachweis der berufs- und arbeitspädagogischen Eignung** (Ausbildereignungsprüfung), sofern sie nicht bereits im Abschluss enthalten ist — in der Gärtnermeisterprüfung ist sie das\n- **aktuelles erweitertes Führungszeugnis**\n\n**Zum Führungszeugnis:** Das erweiterte Führungszeugnis stellt das Bürgerbüro nur gegen eine schriftliche Aufforderung aus. Dafür kann diese E-Mail vorgelegt werden. Wir bestätigen hiermit, dass wir das erweiterte Führungszeugnis benötigen, um die persönliche Eignung der Ausbilderin bzw. des Ausbilders für die berufliche Ausbildung — auch minderjähriger — Auszubildender zu prüfen (§ 30a Abs. 1 Nr. 2 Buchst. a und Abs. 2 BZRG).\n\n**3. Weiterer Ablauf**\n\nSobald die Unterlagen vollständig vorliegen, vereinbaren wir mit Ihnen einen Termin für eine Begehung vor Ort. Daran nimmt der Gutachterausschuss teil — je eine Vertretung der Arbeitgeber- und der Arbeitnehmerseite des Berufsstands. Anträge, die bis **20. April** eingehen, berücksichtigen wir für den Frühsommertermin, Anträge bis **20. September** für den Herbsttermin; später eingehende Anträge berücksichtigen wir im nächsten Halbjahr.\n\nStellen wir fest, dass Ausbildungsstätte und Ausbilder/in geeignet sind, erhalten Ihr Betrieb und die Ausbilderin bzw. der Ausbilder die Anerkennungsbescheide. Danach können Sie bei uns die Vertragsunterlagen anfordern und Auszubildende einstellen. Abgeschlossene Ausbildungsverträge reichen Sie bitte unverzüglich nach Vertragsschluss mit den Anlagen zur Eintragung bei uns ein.\n\n**Wichtig:** Solange Ihr Betrieb nicht anerkannt ist, dürfen Sie noch keine Auszubildenden einstellen (§ 27 Abs. 1 und 3 BBiG) — bitte also noch kein Ausbildungsverhältnis eingehen und keinen Ausbildungsplatz zusagen.\n\nAußerdem liegen bei: die Datenschutzhinweise zum Anerkennungsverfahren, die Einverständniserklärung zur Veröffentlichung im Ausbildungsstättenverzeichnis (freiwillig) und die Anschriften der Gewerbeaufsicht, die für Fragen des Arbeits- und Jugendarbeitsschutzes zuständig ist.\n\nBei Rückfragen melden Sie sich gerne bei mir.\n\nMit freundlichen Grüßen",
    hinweise: "Für Betriebe, die erstmals ausbilden wollen — Ausbildungsstätte und Ausbilder/in werden zusammen anerkannt. Ist die ausbildende Person schon anerkannt (die Anerkennung gilt persönlich, auch nach einem Betriebswechsel), Abschnitt 2 und den Ausbilder-Antrag herausnehmen; geht es nur um eine neue Ausbilderin oder einen neuen Ausbilder, passt die Vorlage „Anerkennung als Ausbilder/in im Gartenbau“. Der Antragsvordruck nennt unter Nr. 9 auch ein Führungszeugnis des Ausbildenden (Betriebsinhaber/in) — bildet die Inhaberin oder der Inhaber nicht selbst aus und wird es verlangt, im Text ergänzen. Die Liste der Gewerbeaufsicht hat den Stand 12/2010; die aktuellen Anschriften stehen auf der Seite der Gewerbeaufsicht Baden-Württemberg (Download-Center).",
    anhaenge: ["antrag-ausbildungsstaette-gartenbau", "merkblatt-anerkennung-ausbildungsstaette", "bilanzen-bestaetigung-steuerbuero",
      "antrag-ausbilder-gartenbau", "einverstaendnis-ausbildungsstaettenverzeichnis", "datenschutz-anerkennung-ausbildungsbetrieb",
      "gewerbeaufsicht-rb-freiburg", "gesetz-gartausbsteignv", "rp-anerkennung"],
    anhaengePlan: true,
    stichworte: ["Anerkennung", "Anerkennungsverfahren", "Ausbildungsbetrieb", "Ausbildungsstätte", "Ausbilder", "erstmals ausbilden", "Gutachterausschuss", "Begehung", "Bilanzen", "Steuerbüro", "Berufsgenossenschaft", "Unbedenklichkeitsbescheinigung", "Führungszeugnis", "20. April", "20. September"],
    artikel: ["ausbilder", "eintragung"] },

  { id: "anerkennung-ausbilder",
    kategorie: "betrieb",
    titel: "Anerkennung als Ausbilder/in im Gartenbau — Antragsformular",
    betreff: "Ihre Anerkennung als Ausbilderin bzw. Ausbilder im Gartenbau — Antragsformular",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nanbei erhalten Sie das Formular „Antrag auf Anerkennung als Ausbilderin bzw. Ausbilder im Gartenbau“. Bitte senden Sie es uns vollständig ausgefüllt und unterschrieben zurück — zusammen mit diesen Unterlagen:\n\n- **tabellarischer Lebenslauf** — bitte mit allen Zeiten Ihrer gärtnerischen Berufspraxis und den jeweiligen Betrieben\n- **Nachweis der fachlichen Eignung** — Kopie des Meisterprüfungszeugnisses bzw. des Techniker- oder Hochschulabschlusses\n- **Nachweis der berufs- und arbeitspädagogischen Eignung** (Ausbildereignungsprüfung), sofern sie nicht bereits in Ihrem Abschluss enthalten ist — in der Gärtnermeisterprüfung ist sie das\n- **aktuelles erweitertes Führungszeugnis**\n\n**Zum Führungszeugnis:** Das erweiterte Führungszeugnis stellt das Bürgerbüro nur gegen eine schriftliche Aufforderung aus. Dafür können Sie diese E-Mail vorlegen. Wir bestätigen hiermit, dass wir das erweiterte Führungszeugnis benötigen, um Ihre persönliche Eignung für die berufliche Ausbildung — auch minderjähriger — Auszubildender zu prüfen (§ 30a Abs. 1 Nr. 2 Buchst. a und Abs. 2 BZRG).\n\nSobald alles vollständig bei uns ist, prüfen wir Ihre persönliche und fachliche Eignung. Liegen alle Voraussetzungen vor, sprechen wir die Anerkennung aus. Sie gilt für Sie persönlich — wechseln Sie später in einen anderen Betrieb, ist keine neue Anerkennung nötig.\n\nBei Fragen melden Sie sich gerne bei mir.\n\nMit freundlichen Grüßen",
    hinweise: "Für die Person, die selbst ausbilden soll — etwa eine neue Ausbilderin oder ein neuer Ausbilder in einem schon anerkannten Betrieb. Bildet der Betrieb erstmals aus, passt die Vorlage „Anerkennung als Ausbildungsbetrieb & Ausbilder/in“: Sie enthält diesen Antrag und alle Unterlagen für die Ausbildungsstätte. Die Betriebsleitung weist nur ihre persönliche Eignung nach; bildet sie nicht selbst aus, bestellt sie eine anerkannte Ausbilderin oder einen anerkannten Ausbilder. Das Führungszeugnis nach Prüfung nur für die Eignungsentscheidung verwenden und nach § 30a Abs. 3 BZRG löschen, sobald die Person die Tätigkeit nicht ausübt — spätestens sechs Monate nach ihrer letzten Ausübung.",
    anhaenge: ["antrag-ausbilder-gartenbau"],
    stichworte: ["Ausbilder", "Ausbilderin", "Anerkennung", "Eignung", "Führungszeugnis", "Ausbildereignung", "Meister", "Antrag"],
    artikel: ["ausbilder", "eintragung"] },

  { id: "betriebsbesuch-ankuendigung",
    kategorie: "betrieb",
    titel: "Ankündigung eines Beratungs-/Betriebsbesuchs",
    betreff: "Terminvorschlag: Besuch der Ausbildungsberatung am [TERMIN]",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nim Rahmen unserer Aufgaben nach § 76 BBiG (Beratung und Überwachung der Berufsausbildung) möchten wir Ihren Ausbildungsbetrieb besuchen und schlagen den [TERMIN] um [UHRZEIT] vor.\n\nThemen des Besuchs:\n\n- Stand der Ausbildung ([AZUBI_NAME]) und betrieblicher Ausbildungsplan\n- Ausbildungsnachweise (bitte bereithalten)\n- [WEITERE_THEMEN]\n\nDer Besuch dient in erster Linie der Unterstützung — bringen Sie gerne Ihre Fragen mit (Förderinstrumente, Prüfungen, Vertragsfragen). Sollte der Termin nicht passen, melden Sie sich einfach für eine Alternative.\n\nMit freundlichen Grüßen",
    hinweise: "Bei anlassbezogenen Besuchen (Beschwerde) Ton neutral halten und keine Vorverurteilung transportieren.",
    anhaenge: [],
    stichworte: ["Betriebsbesuch", "Termin", "Ankündigung", "§ 76"],
    artikel: ["ausbildungsberatung"] },

  /* ================= Vertrag & Ausbildungsstart ====================== */
  { id: "vertragsunterlagen",
    kategorie: "vertrag",
    titel: "Vertragsunterlagen an Betrieb versenden",
    betreff: "Ihre Ausbildungsvertragsunterlagen — [BERUF], Beginn [AUSBILDUNGSBEGINN]",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nvielen Dank für Ihre Nachricht. Für den Abschluss des Berufsausbildungsvertrags ([BERUF], Fachrichtung [FACHRICHTUNG], Ausbildungsbeginn [AUSBILDUNGSBEGINN]) erhalten Sie anbei:\n\n- den ausfüllbaren Berufsausbildungsvertrag (BAV) mit Hinweisen zur Einreichung\n- den betrieblichen Ausbildungsplan Ihrer Fachrichtung (als Vertragsanlage)\n- das Infoblatt für Auszubildende\n\nBitte reichen Sie den vollständig ausgefüllten und von allen Beteiligten unterschriebenen Vertrag **vor Ausbildungsbeginn** in allen Ausfertigungen bei uns ein. Bei minderjährigen Auszubildenden denken Sie bitte an die Unterschriften der gesetzlichen Vertreter und die ärztliche Erstuntersuchung (§ 32 JArbSchG).\n\nBei Fragen zum Ausfüllen helfen wir gerne weiter.\n\nMit freundlichen Grüßen",
    hinweise: "Der betriebliche Ausbildungsplan der gewählten Fachrichtung hängt automatisch an; bei Teilzeit zusätzlich auf § 7a BBiG und die angepasste Vergütung hinweisen.",
    anhaenge: ["bav", "bav-hinweise", "infoblatt-azubi"],
    anhaengePlan: true,
    stichworte: ["Vertragsunterlagen", "BAV versenden", "neuer Vertrag", "Unterlagen anfordern"],
    artikel: ["ausbildungsvertrag", "eintragung"] },

  { id: "fehlende-unterlagen",
    kategorie: "vertrag",
    titel: "Erinnerung: fehlende Unterlagen zur Eintragung",
    betreff: "Eintragung [AZUBI_NAME] — es fehlen noch Unterlagen",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nvielen Dank für die Einreichung des Berufsausbildungsvertrags für [AZUBI_NAME]. Für die Eintragung fehlen uns noch:\n\n- [FEHLENDE_UNTERLAGEN]\n\nBitte reichen Sie die Unterlagen bis zum [FRIST] nach — gerne per E-Mail als PDF oder postalisch. Die Eintragung (und damit u. a. die spätere Prüfungszulassung) können wir erst nach Vollständigkeit vornehmen.\n\nMit freundlichen Grüßen",
    hinweise: "Typisch fehlen: ärztliche Erstuntersuchung (Minderjährige), Unterschrift eines Elternteils, betrieblicher Ausbildungsplan, Ausbildereignungs-Nachweis. Meldet der Betrieb, dass keine Arztpraxis untersuchen will, liegt die LAB-Handreichung dazu als Anlage bei.",
    anhaenge: ["bav-hinweise", "lab-jau-empfehlung"],
    stichworte: ["fehlende Unterlagen", "Erinnerung", "Nachreichen", "Eintragung"],
    artikel: ["eintragung", "jugendliche"] },

  /* ================= Während der Ausbildung ========================== */
  { id: "vertragsaenderung",
    kategorie: "waehrend",
    titel: "Vertragsänderung bestätigen / Unterlagen anfordern",
    betreff: "Änderung des Ausbildungsverhältnisses [AZUBI_NAME] — [AENDERUNG]",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nSie möchten das Ausbildungsverhältnis von [AZUBI_NAME] ändern ([AENDERUNG], z. B. Verkürzung, Verlängerung, Teilzeit, Ausbilderwechsel).\n\nBitte verwenden Sie dafür den beigefügten „Antrag auf Änderung der Eintragung“ und reichen Sie ihn unterschrieben von Betrieb und Auszubildender/Auszubildendem (bei Minderjährigen zusätzlich gesetzliche Vertreter) bei uns ein. Für eine **Verkürzung** fügen Sie bitte die Nachweise bei (z. B. Schulabschluss, Vorbildung); über den Antrag entscheiden wir nach Aktenlage und melden uns bei Rückfragen.\n\nDie Änderung wird mit der Eintragung in das Verzeichnis wirksam; Sie erhalten eine Bestätigung.\n\nMit freundlichen Grüßen",
    hinweise: "Bei Verlängerung nach nicht bestandener Prüfung genügt das Verlangen der/des Auszubildenden (§ 21 Abs. 3 BBiG) — Formulierung dann entsprechend anpassen.",
    anhaenge: ["bav-aenderung"],
    stichworte: ["Vertragsänderung", "Verkürzung", "Verlängerung", "Teilzeit", "Ausbilderwechsel"],
    artikel: ["teilzeit-verkuerzung", "eintragung"] },

  { id: "berichtsheft-erinnerung",
    kategorie: "waehrend",
    titel: "Erinnerung an Ausbildungsnachweis (Betrieb & Azubi)",
    betreff: "Ausbildungsnachweis [AZUBI_NAME]: bitte auf Stand bringen",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nim Rahmen von [ANLASS, z. B. der Prüfungsvorbereitung / eines Beratungsgesprächs] ist aufgefallen, dass der Ausbildungsnachweis von [AZUBI_NAME] größere Lücken aufweist.\n\nZur Erinnerung: Der Nachweis ist **während der Ausbildungszeit** zu führen (§ 14 Abs. 2 BBiG), von der Ausbilderin/dem Ausbilder **regelmäßig durchzusehen** und ist **Zulassungsvoraussetzung** für die Abschlussprüfung (§ 43 Abs. 1 Nr. 2 BBiG).\n\nBitte holen Sie die fehlenden Einträge zeitnah gemeinsam nach — stichwortartige Wocheneinträge genügen — und stellen Sie die regelmäßige Führung sicher. Bei Fragen zur Form (auch digital möglich) helfen wir gerne.\n\nMit freundlichen Grüßen",
    hinweise: "Bei wiederholten Lücken Betriebsgespräch anbieten; Hinweis auf digitale Berichtsheft-Portale kann helfen.",
    anhaenge: ["berichtsheft-gaertner"],
    stichworte: ["Berichtsheft", "Erinnerung", "Ausbildungsnachweis", "Lücken", "Mahnung"],
    artikel: ["berichtsheft"] },

  { id: "aufloesungsvertrag",
    kategorie: "waehrend",
    titel: "Auflösung/Aufhebung des Ausbildungsverhältnisses — Unterlagen & Hinweise",
    betreff: "Auflösung des Ausbildungsverhältnisses [AZUBI_NAME] — weitere Schritte",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nSie haben uns die beabsichtigte einvernehmliche Auflösung des Ausbildungsverhältnisses von [AZUBI_NAME] zum [DATUM_ENDE] mitgeteilt.\n\nBitte beachten Sie:\n\n- Verwenden Sie für die Meldung an uns den beigefügten Vordruck „Abmeldung/Auflösung eines Berufsausbildungsverhältnisses“ (von beiden Seiten unterschrieben, bei Minderjährigen auch gesetzliche Vertreter).\n- Regeln Sie im Aufhebungsvertrag Resturlaub, Zeugnis (§ 16 BBiG) und die Herausgabe des Ausbildungsnachweises.\n- Bei einem **Betriebswechsel** wird die bisherige Ausbildungszeit angerechnet; der neue Vertrag über die Restzeit ist vor Fortsetzung zur Eintragung einzureichen.\n- Ohne gesicherten Anschluss empfehlen wir der/dem Auszubildenden die frühzeitige Meldung bei der Agentur für Arbeit; unsere Ausbildungsberatung unterstützt bei der Suche nach einem Anschlussbetrieb.\n\nMit freundlichen Grüßen",
    hinweise: "Bei Konfliktlagen aktiv Beratung/Vermittlung anbieten, bevor aufgelöst wird.",
    anhaenge: ["bav-abmeldung"],
    stichworte: ["Auflösung", "Aufhebungsvertrag", "Abmeldung", "Betriebswechsel"],
    artikel: ["aufhebung", "kuendigung"] },

  /* ================= Prüfung & Abschluss ============================= */
  { id: "ap-anmeldung",
    kategorie: "pruefung",
    titel: "Anmeldung zur Abschlussprüfung — Information an Betriebe",
    betreff: "Abschlussprüfung [PRUEFUNGSTERMIN]: Anmeldung Ihrer Auszubildenden",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nfür die Abschlussprüfung [PRUEFUNGSTERMIN] bitten wir um Anmeldung Ihrer Auszubildenden bis zum [ANMELDESCHLUSS].\n\nZur Zulassung sind erforderlich (§ 43 BBiG):\n\n- zurückgelegte Ausbildungszeit (bzw. Vertragsende innerhalb von zwei Monaten nach dem Prüfungstermin)\n- Teilnahme an der Zwischenprüfung\n- ordnungsgemäß geführte und gegengezeichnete Ausbildungsnachweise\n- eingetragenes Ausbildungsverhältnis\n\nBitte prüfen Sie insbesondere den Stand des Ausbildungsnachweises frühzeitig. Anträge auf **Nachteilsausgleich** (§ 65 BBiG) sind mit der Anmeldung zu stellen und ärztlich zu belegen. Der Arbeitstag unmittelbar vor der schriftlichen Abschlussprüfung sowie die Prüfungstage sind bezahlt freizustellen (§ 15 BBiG).\n\nDie Einladung mit Ort und Ablauf erhalten die Prüflinge rechtzeitig vor dem Termin.\n\nMit freundlichen Grüßen",
    hinweise: "Prüfungstermin oben wählen — die Anmeldefrist trägt sich dann selbst ein: 1. April für den Sommertermin, 1. November des Vorjahres für den Wintertermin (Prüfung im Februar, z. B. Wintertermin 2027 → Frist 01.11.2026). je Durchgang eintragen; Hinweis auf Pflanzenlisten der Fachrichtung ergänzen, wo passend.",
    anhaenge: ["pflanzenlisten", "pflanze-bw"],
    stichworte: ["Anmeldung Abschlussprüfung", "Prüfungsanmeldung", "Zulassung", "Fristen"],
    artikel: ["abschlusspruefung", "freistellung"] },

  { id: "externenpruefung",
    kategorie: "pruefung",
    titel: "Externenprüfung (§ 45 Abs. 2 BBiG): Ablauf, Zulassung & Literatur",
    betreff: "Ihre Anfrage zur Externenprüfung im Beruf [BERUF] — Ablauf und Unterlagen",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nvielen Dank für Ihr Interesse an der Abschlussprüfung im Beruf [BERUF] (Fachrichtung: [FACHRICHTUNG]). Sie können diese Prüfung auch ohne vorherige Ausbildung ablegen — als sogenannte Externenprüfung. Wie das geht, haben wir Ihnen hier zusammengestellt; den **Anmeldebogen** und die wichtigsten Unterlagen finden Sie im Anhang.\n\n**Ihre Frist:** [ANTRAGSFRIST] — für die Prüfung [PRUEFUNGSTERMIN].\n\n**Das brauchen wir von Ihnen:**\n1. einen formlosen Antrag auf Zulassung, von Ihnen unterschrieben\n2. den ausgefüllten Anmeldebogen (anbei)\n3. Kopien Ihrer Arbeitszeugnisse und betrieblichen Bescheinigungen — sie sollen **alle Zeiten im Gartenbau** belegen sowie Art und Umfang Ihrer gärtnerischen Arbeit\n4. einen tabellarischen Lebenslauf\n5. Ihr letztes Zeugnis der allgemeinbildenden Schule\n\n**Wer zugelassen wird:** Sie brauchen Berufserfahrung im **Anderthalbfachen der Ausbildungszeit** — bei drei Jahren Regelausbildung also **4,5 Jahre, auch mit Abitur** (§ 45 Abs. 2 BBiG). Fehlt Ihnen etwas an dieser Zeit, ist das noch kein Ausschluss: Wenn Sie mit Zeugnissen oder auf anderem Weg glaubhaft machen, dass Sie den Beruf beherrschen, können wir Sie trotzdem zulassen. Ausbildung und Arbeit im Ausland zählen mit.\n\n**So läuft die Prüfung ab:**\n- **Ihr praktischer Prüfungstag:** fünf praktische Aufgaben (zusammen 3,5–4,5 Stunden), Pflanzenbestimmung (20 Pflanzen in 20 Minuten) und ein Prüfungsgespräch (60 Minuten).\n- **Vorher an der Berufsschule:** drei schriftliche Prüfungen — Betriebliche Zusammenhänge, Wirtschafts- und Sozialkunde, Pflanzenkenntnisse. Diese Noten zählen zusammen mit dem praktischen Tag für Ihr Berufsabschlusszeugnis.\n- Die **Berufsschule besuchen Sie vorher nicht** — ohne Ausbildungsvertrag ist das auch nicht möglich.\n- Ein **Berichtsheft brauchen Sie nicht**, überbetriebliche Lehrgänge (z. B. DEULA) ebenso wenig.\n- Ihre Prüfung hat **dasselbe Niveau wie die reguläre Gesellenprüfung**. Was verlangt wird, steht in der Ausbildungsordnung Ihrer Fachrichtung (anbei).\n\n**So bereiten Sie sich vor:**\n- **Ausbildungsrahmenplan** der Ausbildungsordnung (GärtnAusbV) und der **betriebliche Ausbildungsplan Ihrer Fachrichtung** — beide anbei. Daraus ergibt sich der Stoff, der in der praktischen Prüfung verlangt wird: die Fertigkeiten und Kenntnisse Ihrer Fachrichtung im zeitlichen Ablauf der drei Ausbildungsjahre. Gehen Sie die Punkte durch und prüfen Sie, was Sie schon können und wo Sie üben müssen.\n- die **Pflanzenlisten** Ihrer Fachrichtung — sie sind die Grundlage der Pflanzenbestimmung. Üben lässt sich damit kostenlos auf pflanze-bw.de.\n- Berufsschul-Standardwerke, etwa „Fachkunde für Gärtner“ (Handwerk und Technik) oder die Reihe „Der Gärtner“ (Ulmer) mit dem Band Ihrer Fachrichtung; zur Wiederholung eignen sich Frage-Antwort-Bände wie „Prüfungsbuch Gartenbau“. Achten Sie auf die aktuelle Auflage — die Buchhandlung oder die berufsbildende Schule berät Sie dazu.\n\nZu Lernmaterial und Prüfungsaufgaben selbst können wir Ihnen leider wenig weiterhelfen. Bei allen Fragen zum Verfahren sind wir aber gerne für Sie da.\n\nMit freundlichen Grüßen",
    hinweise: "Prüfungstermin oben wählen — die Anmeldefrist trägt sich dann selbst ein: 1. April für den Sommertermin, 1. November des Vorjahres für den Wintertermin (Prüfung im Februar, z. B. Wintertermin 2027 → Frist 01.11.2026). je Durchgang eintragen. Der betriebliche Ausbildungsplan der oben gewählten Fachrichtung hängt automatisch an — er zeigt den prüfbaren Stoff des praktischen Tages. Prüfungsablauf und Buchhinweise sind am Beispiel Gärtner/in formuliert — bei anderen Berufen Aufgabenzahl, Zeiten und Literatur anpassen. Bei offensichtlich fehlenden Zeiten früh auf Nachqualifizierungswege (Umschulung, Teilzeitausbildung) hinweisen. Keine einzelnen Händler oder Bezugsquellen empfehlen.",
    anhaenge: ["anmeldebogen-extern", "gesetz-gaertnausbv", "pflanzenlisten", "pflanze-bw",
               "rp-gaertner-portal", "infodienst-gaertner", "lra-ka-infodienst"],
    anhaengePlan: true,
    stichworte: ["Externenprüfung", "extern", "§ 45", "ohne Ausbildung", "Zulassung", "Literatur", "Quereinstieg"],
    artikel: ["abschlusspruefung", "zustaendige-stelle"] },

  { id: "stellungnahme-ausbildungsstand",
    kategorie: "pruefung",
    titel: "Stellungnahme zum Ausbildungsstand anfordern (hohe Fehlzeiten)",
    betreff: "Abschlussprüfung [AZUBI_NAME] — Stellungnahme zum Ausbildungsstand erbeten",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nfür die Entscheidung über die Zulassung von [AZUBI_NAME] zur Abschlussprüfung im Beruf [BERUF], Fachrichtung [FACHRICHTUNG], benötigen wir Ihre fachliche Einschätzung. Anlass sind die gemeldeten Fehlzeiten; über die Zulassung entscheidet die zuständige Stelle, bei Zweifeln der Prüfungsausschuss (§ 46 Abs. 1 BBiG).\n\n**Vorab zur Einordnung:** Wir stellen die Erkrankungen nicht infrage und benötigen keine Diagnosen. Es geht allein darum, welche Ausbildungsinhalte tatsächlich vermittelt und erworben wurden.\n\nBitte beantworten Sie uns bis zum [FRIST] folgende Punkte:\n\n1. Welche Ausbildungsabschnitte und Tätigkeiten waren von den Ausfällen betroffen?\n2. Welche Inhalte wurden inzwischen nachgeholt — wann, wie und unter wessen Anleitung?\n3. Welche Tätigkeiten erledigt [AZUBI_NAME] bereits selbstständig und sicher?\n4. Wo fehlen noch Anleitung, Übung oder praktische Erfahrung?\n5. Welche Lücken lassen sich bis zum Prüfungstermin realistisch schließen — mit welchem Plan?\n\nHilfreich sind konkrete Beobachtungen statt allgemeiner Einschätzungen. Ein Satz wie „zu viele Fehltage“ beschreibt noch keine fehlende Fähigkeit und trägt die Entscheidung nicht.\n\nBitte legen Sie außerdem bei:\n\n- eine **Fehlzeitenübersicht** (Zeitraum, Ausbildungsjahr, Lernort, ausgefallene Tage, entschuldigt ja/nein)\n- den aktuellen **Ausbildungsnachweis**\n- vorhandene **Lehrgangsnachweise**\n\nBitte beachten Sie bei der Übersicht: Berufsschul- und Lehrgangstage sind selbst Ausbildungszeit (§ 15 BBiG) und keine Fehlzeit; zu erfassen sind nur tatsächlich ausgefallene Ausbildungstage, nicht die Kalendertage einer Krankschreibung.\n\nFalls wesentliche Inhalte bis zum Prüfungstermin nicht nachzuholen sind, sprechen Sie uns bitte frühzeitig an — eine Verlängerung nach § 8 Abs. 2 BBiG ist auf Antrag der auszubildenden Person möglich und oft der bessere Weg als eine Nichtzulassung.\n\nMit freundlichen Grüßen",
    hinweise: "Vor dem Versand die gemeldeten Fehlzeiten auf Zählfehler prüfen — Kalendertage statt Ausbildungstage, mitgezählte Wochenenden und doppelt gewertete Schultage sind die häufigsten. Die Frist so setzen, dass die Unterlagen vor dem Anmeldeschluss vorliegen.",
    anhaenge: [],
    stichworte: ["Stellungnahme", "Fehlzeiten", "Ausbildungsstand", "Zulassung", "Einzelfallprüfung", "Nachholplan"],
    artikel: ["fehlzeiten-zulassung", "abschlusspruefung"] },

  { id: "pruefung-nachteilsausgleich",
    kategorie: "pruefung",
    titel: "Nachteilsausgleich: Rückmeldung zu Antrag",
    betreff: "Ihr Antrag auf Nachteilsausgleich — [AZUBI_NAME]",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\nvielen Dank für den Antrag auf Nachteilsausgleich für [AZUBI_NAME] zur Prüfung am [PRUEFUNGSTERMIN].\n\nDamit wir angemessene Maßnahmen festlegen können (§ 65 BBiG), benötigen wir eine aktuelle ärztliche oder psychologische Stellungnahme, die die **funktionale Einschränkung in der Prüfungssituation** beschreibt (z. B. verlangsamtes Schreiben, Konzentrationsspannen) — eine Diagnose allein genügt nicht. Bitte reichen Sie den Nachweis bis [FRIST] nach.\n\nMögliche Maßnahmen sind insbesondere Zeitverlängerung, zusätzliche Pausen, Hilfsmittel oder Assistenz; die fachlichen Anforderungen bleiben unverändert. Sie erhalten von uns einen schriftlichen Bescheid.\n\nMit freundlichen Grüßen",
    hinweise: "Bei Fachwerker-Prüfungen gilt der Nachteilsausgleich nach GBFWVO entsprechend.",
    anhaenge: [],
    stichworte: ["Nachteilsausgleich", "Antrag", "Prüfung", "Behinderung", "Zeitverlängerung"],
    artikel: ["foerderung", "fw-inhalte-pruefung", "abschlusspruefung"] },

  { id: "vertragsverlaengerung-pruefung",
    kategorie: "pruefung",
    titel: "Verlängerung nach nicht bestandener Abschlussprüfung",
    betreff: "Verlängerung des Ausbildungsverhältnisses [AZUBI_NAME] bis zur Wiederholungsprüfung",
    text: "Sehr geehrte/r [ANREDE_NAME],\n\n[AZUBI_NAME] hat die Abschlussprüfung am [PRUEFUNGSDATUM] nicht bestanden und die Verlängerung des Ausbildungsverhältnisses verlangt.\n\nZur Rechtslage: Auf Verlangen der/des Auszubildenden verlängert sich das Berufsausbildungsverhältnis **bis zur nächstmöglichen Wiederholungsprüfung, höchstens um ein Jahr** (§ 21 Abs. 3 BBiG). Eine Zustimmung des Betriebs ist nicht erforderlich; die Vergütung ist mindestens in Höhe des letzten Ausbildungsjahres weiterzuzahlen.\n\nWir haben die Verlängerung bis zum [NEUES_ENDE] im Verzeichnis vermerkt. Die Anmeldung zur Wiederholungsprüfung erfolgt über den Betrieb; bereits bestandene Prüfungsteile können nach der Prüfungsordnung angerechnet werden.\n\nFür die gezielte Vorbereitung empfehlen wir ein Gespräch mit der Berufsschule und ggf. Stützunterricht (AsA flex der Agentur für Arbeit).\n\nMit freundlichen Grüßen",
    hinweise: "Fristen der nächsten Wiederholungsprüfung konkret nennen, sobald Termine feststehen.",
    anhaenge: ["bav-aenderung"],
    stichworte: ["Verlängerung", "nicht bestanden", "Wiederholungsprüfung", "§ 21"],
    artikel: ["nichtbestehen", "teilzeit-verkuerzung"] }
  ]
};
