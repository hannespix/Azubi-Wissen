# Azubi Wissen — Wissens- und Arbeitstool für die Ausbildung in den grünen Berufen

Offline-Wissensdatenbank und Arbeitswerkzeug für die Ausbildungsberatung in
**allen grünen Berufen** (Gärtner/in, Landwirt/in, Winzer/in, Fischwirt/in,
Tierwirt/in, Forstwirt/in u. v. m. — inkl. der § 66-Fachwerkerausbildung).
Intelligente Suche, lokaler KI-Assistent, sechs Rechner, Jahreskreis der
Beratung, automatisierte E-Mail-Vorlagen, PDF-Export und Aktenvermerk-
Generator. Verantwortlich: **Hannes Pix** — privat entwickeltes
Fachwerkzeug, **kein amtliches Angebot**. **Läuft vollständig offline — keine externen
Requests, keine Cloud, keine Telemetrie.**

## Nutzung

**Online (GitHub Pages, nach jedem Merge automatisch aktualisiert):**
`https://hannespix.github.io/Azubi-Wissen/` — **passwortgeschützt**
(Zugangspasswort, je Gerät nur einmal einzugeben; Zugang schalten Hannes Pix
oder Christoph Zilz frei: azubiwissen@pix-el.de). Als **PWA installierbar**
(„Zum Startbildschirm hinzufügen"), danach auch im Flugmodus nutzbar.

**Variante 1 — Einzeldatei (empfohlen für Zero-Trust-Arbeitsplätze):**
[`azubi-wissen-offline.html`](azubi-wissen-offline.html) herunterladen und
per **Doppelklick** öffnen. Eine Datei (rund 8 MB), alles enthalten — auch
die an den E-Mail-Vorlagen hängenden PDF-Anlagen, sodass „E-Mail mit
Anlagen erzeugen" hier genauso funktioniert wie online. Ausgenommen sind
nur die 12 MB betrieblichen Ausbildungspläne: Sie würden die Datei
verdreifachen und gehen deshalb als amtlicher Link zur RP-Seite mit.
Notizen, Vermerke und Merkliste bleiben lokal im Browser gespeichert.
Die Datei aus der Online-Fassung ist ebenfalls verschlüsselt und fragt beim
ersten Öffnen auf einem Gerät nach dem Zugangspasswort.

**Variante 2 — Repo-Ordner über lokalen Server** (für Entwicklung):
```
python3 -m http.server 8000     # dann http://localhost:8000/
```

## Funktionen

| Bereich | Was es kann |
|---|---|
| **Wissensdatenbank** | 42 Artikel in 9 Themenbereichen mit 3 Detailstufen, 134 FAQ, Praxishinweisen je Rolle (Azubi/Betrieb/Beratung) und ~150 Querverweisen; **33 Gesetze und Verordnungen klickbar verlinkt** (§§-Zitate öffnen den amtlichen Volltext, Bereichszitate wie „§§ 34–36 BBiG" inklusive) |
| **Grüne Berufe** | 18 Berufe mit Fachrichtungen, amtlichen Verordnungskürzeln, direktem Volltext-Link zur Ausbildungsordnung, BERUFENET-Link und Sprung in die vorbelegten E-Mail-Vorlagen; **je Beruf ein Knopf in die Betriebsdatenbank des Landes** (anerkannte Ausbildungsbetriebe, filterbar nach Landkreis/Betriebszweig/öko) — bei Gärtner, Tierwirt, Pferdewirt und den Gartenbaufachwerkern fachrichtungsgenau |
| **Schnellnachschlag** | 12 Karten: Tarif-/Urlaubstabellen, Fristen, Arbeitszeit, Fachrichtungen + **6 Rechner** (Urlaub nach Alter, Mindestvergütung, Probezeit/Fristen, Teilzeit, **Ausbildungsfahrplan** mit Jugendschutz-Fristen, **Notenrechner** mit Bestehens-Checkliste nach GärtnAusbV) |
| **Jahreskreis** | Das wiederkehrende Jahr der Ausbildungsberatung als 12-Monats-Timeline: Prüfungsrunden, Zulassung & Berichtsheftkontrolle, Schulbesuche (Eingangs-/Abschlussklassen), Anerkennungs-Fixtermine 20.04./20.09., Gremien, Jahreswechsel-Aufgaben |
| **Suche (Strg+K oder /)** | global, multitoken, fuzzy (tippfehler- und diakritikatolerant), Synonyme, Gruppierung, Tastaturnavigation — über Artikel, FAQ, Berufe, Quellen, Vorlagen, Checklisten, Glossar und eigene Inhalte |
| **E-Mail-Vorlagen** | 17 Vorlagen in fünf Kategorien entlang des Ausbildungsverlaufs — **Vor der Ausbildung · Ausbildungsbetriebe · Vertrag & Ausbildungsstart · Während der Ausbildung · Prüfung & Abschluss**; unter „Ausbildungsbetriebe“ steht die **Anerkennung als Ausbildungsbetrieb & Ausbilder/in** — die Praxis-E-Mail der Ausbildungsberatung als allgemeine Vorlage, die alle Unterlagen mitschickt (beide Anträge, Merkblatt, Steuerbüro-Blatt, Datenschutzhinweise, Einverständniserklärung, Gewerbeaufsicht, Ausbildungsplan der Fachrichtung) — daneben die Anerkennung als Ausbilder/in allein und die Ankündigung des Betriebsbesuchs. Automatik: Berufs- und Fachrichtungs-Dropdowns, Datums-/Fristfelder, gemerkte Eingabewerte und Eingabe-Historie — ausfüllen, kopieren, versenden. **„E-Mail mit Anlagen erzeugen"** lädt die fertige Nachricht als `.eml` inklusive der zugehörigen PDF-Anlagen; Doppelklick öffnet sie im Mailprogramm als sendefertigen Entwurf (ein `mailto:`-Link kann keine Anhänge übertragen). Die Datei ist eine **gestaltete HTML-Mail** (Überschriften, Aufzählungen, benannte Links) mit Nur-Text-Fassung als Rückfallebene; sie endet mit der Grußformel — **Name und Dienststelle kommen aus der Outlook-Signatur**. Bei Vertrags-, Interessen-, Betriebsanerkennungs- und Externenprüfungs-Vorlagen hängt **der betriebliche Ausbildungsplan der gewählten Fachrichtung automatisch an** — er zeigt den prüfbaren Stoff; ein Wechsel der Fachrichtung tauscht den Plan mit. Jede Anlage lässt sich über „PDF öffnen" **vor dem Anhaken ansehen** |
| **Checklisten** | 6 interaktive Listen (Erstberatung Fachwerker, Eintragung, Einstiegsqualifizierung, **Fehlzeiten & Prüfungszulassung**, Betriebsbesuch, AP-Anmeldung) mit lokal gespeichertem Abhak-Stand und Druckfassung |
| **Glossar** | 39 Fachbegriffe von 80-Prozent-Regel bis Zwischenprüfung — mit §§-Links, Artikel- und Quellen-Chips |
| **Gesetze & Vorschriften** | Neun Gesetze komplett im Werkzeug (`#/gesetz`): BBiG, JArbSchG, BUrlG, ArbZG, ArbSchG, EntgFG, KSchG, TzBfG, AEVO — zusammen 338 Paragrafen als eigene Seiten, durchsuchbar, mit Gliederung, Nachbar-Navigation und Rückverweisen auf die Artikel; jedes §-Zitat im Werkzeug springt direkt auf die Norm. **Gleichrangig daneben: die zentralen Verwaltungsvorschriften und BIBB-Empfehlungen als Karten** (VOAPLandw, VwV Berichtsheft, VwVBBiL, BBiG-ZuVO, Musterprüfungsordnung HA 120, Ausbildungsnachweise HA 156), die übrigen kompakt darunter. Nach Gesetzesänderungen: `python3 tools/gesetz_import.py` |
| **Download-Center** | 137 Quellen im Baum: RP-Formulare (BAV u. a.), **eigene Gruppe „Anerkennung als Ausbildungsbetrieb & Ausbilder/in“** mit allen sieben Unterlagen, Ausbildungspläne, 72 lokale PDFs, alle 14 Ausbildungsordnungen der grünen Berufe, Gesetze, **Verwaltungsvorschriften des Landes (VwV Berichtsheft, VOAPLandw, BBiG-ZuVO) und BIBB-Hauptausschuss-Empfehlungen**, BA-Förderung, SVLFG, öffentliche Portale |
| **KI-Assistent (lokal)** | Antworten ausschließlich aus der Wissensbasis mit Quellenangaben (§§ + Artikel) — rechnet (Urlaub, Vergütung, Teilzeit, Probezeit, Noten), kennt alle Module, bietet passende Vorlagen/Checklisten/Formulare an; keine Eingabe verlässt das Gerät, keine Rechtsberatung |
| **Bedeutungssuche (optional)** | Auf Klick lädt der Assistent ein lokales Sprachmodell (multilingual-e5-small, quantisiert, ≈ 150 MB aus `assets/vendor/semantik/`) und versteht dann frei formulierte Fragen („Chef zahlt zu spät" → Vergütung). Komplett offline, keine Cloud; ohne Modell arbeitet die Stichwortsuche unverändert. **Im Index stecken auch die 335 Gesetzesparagrafen und alle 130 Quellen** — „Azubi durchgefallen, Ausbildung verlängern" landet bei § 21 BBiG, obwohl die Norm keins dieser Wörter enthält; passende §§ bietet der Assistent als Sprungziel an. Index neu bauen nach Inhaltsänderungen: `npm i @huggingface/transformers && node tools/semantik_index_bauen.mjs` |
| **Passt inhaltlich dazu** | An Artikeln, Paragrafen, Vorlagen, Checklisten, Nachschlag-Karten und Dokumenten steht, was inhaltlich in der Nähe liegt, aber nirgends von Hand verknüpft ist — ein Artikel nennt die Norm, ein Formular den erklärenden Artikel. Die Nachbarn werden **beim Bauen** aus denselben Vektoren gerechnet und als Schlüsselliste abgelegt (`assets/js/nachbarn.js`, 42 KB): **kein Modell-Download nötig**, funktioniert deshalb auch in der Einzeldatei. Geprüfte Verweise stehen darüber und werden nicht doppelt gezeigt |
| **Einstiegsqualifizierung** | Die EQ nach § 54a SGB III als eigener Artikel mit der Frage, die in der Beratung am häufigsten falsch beantwortet wird: Für eine geförderte EQ muss der Betrieb **weder anerkannter Ausbildungsbetrieb sein noch einen Meister beschäftigen** — die Eignung nach §§ 27–33 BBiG ist keine Fördervoraussetzung. Dazu die acht RP-Formulare (Vertrag, Qualifizierungsbausteine je Fachrichtung, Ausbildungsnachweis, Zeugnis), die Fachlichen Weisungen der BA und eine Prüf-Checkliste, deren Maßstab die **Durchführbarkeit** ist, nicht die Anerkennung |
| **Fehlzeiten & Prüfungszulassung** | Was gilt, wenn jemand lange krank war? Der Artikel trennt, was in der Beratung oft vermischt wird: Das BBiG nennt **keine** Höchstzahl an Fehltagen; der 10-%-Richtwert ist weder Anspruch noch Ablehnungsgrenze; Berufsschul- und Lehrgangstage sind **selbst Ausbildungszeit**, keine Fehlzeit. Dazu die Zählregeln mit Rechenbeispiel, was die Einzelfallprüfung bewertet, wer entscheidet (§ 46 BBiG), die Abgrenzung von Nichtzulassung und Nichtbestehen — plus Checkliste und eine E-Mail-Vorlage, die beim Betrieb eine **brauchbare** Stellungnahme abfragt |
| **Merkliste & Druck** | Stern an Artikeln und Karten → Schnellzugriff auf der Startseite; „Karte drucken" macht aus Jahreskreis, Fahrplan & Co. ein A4-Handout für Schulbesuche |
| **Export & Vermerk** | PDF-Handout je Zielgruppe und Detailgrad; formulargestützter Aktenvermerk mit Rechtsgrundlagen-Bausteinen und Autosave |
| **Eigene Inhalte** | Artikel und Dokumente selbst anlegen (lokal, überall auffindbar) + **Komplettsicherung** als JSON: eigene Inhalte, Vermerke, Notizen, Checklisten-Stände und Einstellungen — für Netzlaufwerk-Ablage und Gerätewechsel |

## Inhalte pflegen

Alle Fachinhalte liegen in **`assets/js/`** als Datenmodule (Pflegehinweise
in den Dateiköpfen): `wissen.js` (Artikel), `berufe.js`, `quellen.js`,
`vorlagen.js`, `nachschlag.js` (inkl. Jahreskreis), `checklisten.js`,
`glossar.js`. Wichtigste Wartungspunkte:

- **Mindestausbildungsvergütung**: jährliche Bekanntmachung im Bundesanzeiger
  → Tabelle im Artikel `mindestverguetung`, MIAV-Konstante in `app.js` und
  `stand` aktualisieren (Jahreskreis erinnert im 4. Quartal daran).
- **Querverweise**: `[[artikel-id]]` bzw. `[[artikel-id|Linktext]]` in
  Fakten, Abschnitten, FAQ und Hinweisen; §§-Zitate werden automatisch
  verlinkt, wenn das Werk in `GESETZ_QUELLE` (app.js) steht.
- **Fachwerker-Bereich**: Quelle ist die Handreichung „Fachwerkerausbildung
  im Gartenbau" (Netzwerkfassung 1.2, 31.07.2026) — bei neuer Fassung
  Artikel und Quellenvermerke nachziehen. Der personenbezogene Kontaktteil
  der Handreichung wird bewusst **nicht** im Repo geführt.
- **Bedeutungsnetz** (Semantik-Index + „Passt inhaltlich dazu"): nach
  Inhaltsänderungen `npm i @huggingface/transformers && node
  tools/semantik_index_bauen.mjs` — der Lauf braucht rund zehn Minuten und
  schreibt die Nachbarn gleich mit. Wurden nur Titel oder Verweise geändert,
  genügt `node tools/nachbarn_bauen.mjs` (Sekunden, ohne Modell).
- **Verknüpfungen prüfen** (nach jeder Inhaltstranche empfohlen):
  `node tools/verknuepfungen_pruefen.mjs` meldet, was inhaltlich
  zusammengehört, aber nicht verknüpft ist — Artikelpaare ohne
  `[[querverweis]]`, Normen, die ein naher Artikel nie nennt, Dokumente ohne
  `artikel:`-Zuordnung und Artikel, die näher an einem fremden Themenbereich
  liegen als an ihrem eigenen. Das Werkzeug **ändert nichts** und erscheint
  nicht in der Oberfläche: es schlägt vor, die Redaktion entscheidet. Jeder
  Bericht nennt am Ende die gemessenen Ähnlichkeitsverteilungen und das
  Perzentil der eingestellten Schwelle — wer mehr Vorschläge sehen will,
  senkt sie im Kopf der Datei. `--top 10` kürzt je Abschnitt, `--md` gibt
  Markdown zum Ablegen aus.
- **Neue PDFs** (Vordrucke, Merkblätter): amtliche Dateien tragen im
  Dateikopf oft Namen oder Kürzel der Bearbeiterin bzw. des Bearbeiters.
  Vor dem Einchecken `python3 tools/pdf_metadaten.py --bereinigen DATEI`
  (optional `--titel "…"`) — Seiten, Text und Formularfelder bleiben
  unverändert, das Werkzeug prüft das nach. Word-Vorlagen vorher als PDF
  ausgeben. Das CI weist Dateien mit Personenangaben im Dateikopf zurück.
- Nach Inhaltsänderungen: `python3 tools/build_singlefile.py --release`
  ausführen und die neue `azubi-wissen-offline.html` mitcommitten.

## Aktualität & Prüfstand

Ob Dokumente, Anträge, Gesetzesquellen und Links noch aktuell sind, prüft
`tools/aktualitaet_pruefen.py` — **außerhalb** des Werkzeugs, denn das
Werkzeug selbst ruft nichts aus dem Netz ab (Zero-Trust).

- **Per Knopfdruck:** GitHub → Actions → „Aktualitätsprüfung“ → „Run
  workflow“ (auch in der GitHub-App). Außerdem läuft sie jeden Montag früh.
- **Was geprüft wird:** jeder Link aus Datenmodulen und Code (erreichbar,
  dauerhaft umgezogen, Fehlerseite trotz „200 OK“, Kennwörter je Quelle);
  jede lokale Datei mit Online-Fassung (Textvergleich — Seitenfüße werden
  ignoriert); der Stand jedes Gesetzes aus dem amtlichen XML von
  gesetze-im-internet.de; Vordrucke ohne Online-Fassung nach Alter; Werte
  mit Ablaufdatum aus `assets/js/ablaufdaten.js`.
- **Ergebnis:** ein Issue „Aktualitätsprüfung“ mit Checkliste (Kommentar bei
  Handlungsbedarf = Benachrichtigung, schließt sich, wenn alles aktuell ist),
  `assets/js/pruefstand.js` auf main (Seite **#/pruefstand** im Werkzeug,
  Etiketten im Download-Center) und ein **Aktualisierungs-PR** mit allem,
  was sich maschinell übernehmen lässt: Gesetzes-Volltexte neu importieren,
  neue PDF-Fassungen übernehmen (Dateikopf bereinigt, Stand nachgezogen,
  Offline-Datei neu gebaut), umgezogene Links eintragen. Damit die Action
  PRs öffnen darf: Settings → Actions → General → „Allow GitHub Actions to
  create and approve pull requests“; sonst verlinkt das Issue den Branch.
- **Pflege-Felder in `quellen.js`:** `pdf` (direkte Adresse der
  Online-Fassung), `erwartet` (Kennwörter), `bestaetigt: "JJJJ-MM"`
  (Vordruck von der Redaktion als noch gültig bestätigt — Erinnerung erst
  nach 12 Monaten), `pruefung: "ohne-vergleich"`.
- **Lokal:** `python3 tools/aktualitaet_pruefen.py` (Bericht),
  `--pruefstand` (Prüfstand schreiben), `--aktualisieren` (Übernahme),
  `--pdf-suchen` (direkte PDF-Adressen für Seiten-Links finden),
  `--selbsttest` (offline, läuft auch in der CI). Braucht node und pypdf.

## Zugangsschutz

Die Online-Fassung ist seit S48 mit einem **Zugangspasswort** geschützt —
ohne Server: Beim Pages-Deploy verschlüsselt `tools/zugang_bauen.py` alle
Inhalts- und Programmskripte (als ein Paket), den Suchindex, die Dateien unter
`formulare/` und die Offline-Datei mit **AES-256-GCM**; den Schlüssel leitet
PBKDF2-SHA-256 (600 000 Runden) aus dem Passwort ab. `assets/js/zugang.js`
zeigt das Anmeldefenster, prüft das Passwort lokal und merkt sich den
Schlüssel im Browser des Geräts — das Passwort ist also **je Gerät nur einmal**
nötig; „Abmelden“ im Menü löscht ihn. Impressum und Datenschutz
(`assets/js/rechtliches.js`) bleiben ohne Anmeldung erreichbar.

- **Passwort festlegen/ändern:** GitHub → Settings → Secrets and variables →
  Actions → Secret **`ZUGANG_PASSWORT`** (mindestens 10 Zeichen, besser eine
  Passphrase), danach Actions → „GitHub Pages“ → „Run workflow“. Alle Geräte
  fragen dann einmal das neue Passwort ab. Fehlt das Secret, bricht der
  Deploy ab — die Seite geht nie unverschlüsselt online.
- **Zugang anfragen:** Personen und Adresse stehen in `assets/js/kontakt.js`
  (`zugang`).
- **Neue Skripte mit Inhalten** in `index.html` zwischen
  `<!-- geschuetzt:anfang -->` und `<!-- geschuetzt:ende -->` eintragen;
  davor steht nur, was ohne Anmeldung laufen muss.
- **Grenze:** Geschützt ist die Website. **Solange dieses Repo öffentlich
  ist, sind alle Inhalte hier im Quelltext lesbar** — wirksam wird der Schutz
  erst mit einem privaten Repo (GitHub Pages aus privaten Repos braucht
  GitHub Pro).
- **Lokal/Entwicklung** ist der Schutz aus (keine Konfiguration → kein Login).
  Prüfen: `python3 tools/zugang_bauen.py --selbsttest` (läuft in der CI,
  braucht `cryptography`).

## Prüfungen & Build

```
python3 tools/check_offline.py              # Offline-/CDN-Gate (läuft im CI)
python3 tools/pdf_metadaten.py              # keine Namen im PDF-Dateikopf (läuft im CI, braucht pypdf)
python3 tools/aktualitaet_pruefen.py        # Aktualitätsprüfung (Netz; --selbsttest offline in der CI)
python3 tools/zugang_bauen.py --selbsttest  # Zugangsschutz durchspielen (läuft im CI, braucht cryptography)
python3 tools/build_singlefile.py           # dist/index.html (unversioniert)
python3 tools/build_singlefile.py --release # + azubi-wissen-offline.html
node tools/nachbarn_bauen.mjs --bericht     # Nachbarn messen, nichts schreiben
node tools/verknuepfungen_pruefen.mjs       # Redaktionsbericht: fehlende Verweise
node --check assets/js/*.js                 # Syntax
```

## Struktur

```
index.html                     App-Shell (Router, Navigation, PWA)
bw-theme.css                   Design-System (Single Source of Truth)
sw.js                          Service Worker (versionierte App-Shell)
azubi-wissen-offline.html      Einzeldatei-Auslieferung (generiert, versioniert)
assets/js/wissen.js …          Datenmodule (Inhalte — hier pflegen)
assets/js/kontakt.js           Anbieter-/Kontaktangaben (eine Quelle für Seite + Assistent)
assets/js/rechtliches.js       Rechtliches & Impressum (unverschlüsselt, ohne Anmeldung erreichbar)
assets/js/zugang.js            Anmeldefenster + Entschlüsselung der Online-Fassung (S48)
assets/js/nachbarn.js          „Passt inhaltlich dazu" (generiert — nicht von Hand ändern)
assets/js/app.js               Ansichten, Suche, Rechner, Jahreskreis, Merkliste
assets/js/assistent.js         lokaler KI-Assistent (Retrieval + Synthese)
assets/js/export.js            PDF-Handout + Aktenvermerk-Generator
assets/js/lokaldb.js           lokale Datenbank (IndexedDB/localStorage)
assets/css/app.css             App-Komponenten (nur --bw-*-Tokens) + Druck (A4)
formulare/                     36 lokale PDFs mit Herkunftsnachweis (QUELLEN.md)
tools/                         Offline-Check, Single-File-Builder, Index + Nachbarn, Redaktionsbericht
```

## Rechtliches

Privat gepflegte Fachinformation — **keine Rechtsberatung im
Einzelfall, kein amtliches Angebot**. Verantwortlich ist **Hannes Pix**
(Anbieterangaben in `assets/js/kontakt.js`, einzige Quelle). Das Werkzeug
führt unter **`#/rechtliches`** (Link im Fußbereich jeder Seite)
Anbieterkennzeichnung, Datenschutz-Erklärung (alles lokal, keine
Übertragung), Erklärung zur Barrierefreiheit und Lizenzhinweise;
Kontakt: azubiwissen@pix-el.de; Anbieterangaben wie im
Impressum von pix-el.de. Verbliebener Platzhalter: Nachnutzungsregel.
Das Repo ist öffentlich — deshalb liegen hier **keine geschützten
Landes-Assets**: Die Schriften sind Source Sans 3/Source Serif 4 (Adobe,
SIL OFL 1.1, frei verteilbar), das Zeichen ist der eigene „Keimling“
(`assets/logo/azubi-wissen-zeichen.svg`). Landeswappen, RPF-Logo und die
BaWue-Schriften dürfen nicht eingecheckt werden → `assets/fonts/LIZENZ.md`,
`assets/logo/LIZENZ.md`.
Keine personenbezogenen Echtdaten im Repo; Nutzerdaten (Notizen, Vermerke,
Merkliste, Sicherungen) verbleiben ausschließlich lokal.

Prozess & Weiterentwicklung: `AGENTS.md`, `ROADMAP.md`. Design & Technik:
`CLAUDE.md`.
