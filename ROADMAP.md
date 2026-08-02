# ROADMAP — Ausbildung Grüne Berufe (vormals Azubi-Wissen)

> **Tool-Zweck:** „Ausbildung Grüne Berufe" — Wissensdatenbank und
> Arbeitshilfen der Ausbildungsberatung für alle grünen Berufe: Suche,
> Berufe, Nachschlag mit Rechnern, Checklisten, Vorlagen, Downloads,
> Glossar, eigener Assistent, PDF-Export, Aktenvermerke — komplett offline.
> **Zielgruppe/Ablage:** Ausbildungsberatung, Betriebe, Azubis; Nutzerdaten
> nur lokal im Browser (IndexedDB), keine personenbezogenen Daten im Repo.

## Umgesetzt (v1, Juli 2026)

- **M0 Gerüst** — Vorlage, Theme, Logo, CI-Workflows *(PR #1)*
- **M1 Wissensbasis** — 38 Artikel / 9 Themenbereiche / 83 FAQ, 3 Detailstufen,
  Rollenhinweise, Rechtsgrundlagen, Quellenvermerke *(PR #1, #6)*
- **M2 App & Artikelansicht** — Router, Start, Detailgrad-Umschalter,
  Rollen-Tabs, FAQ-Akkordeon *(PR #2)*
- **M3 Suche** — Strg+K-Palette: fuzzy, Synonyme, Stoppwörter, Tastatur *(PR #2, #3)*
- **M4 KI-Assistent (lokal)** — Retrieval + Antwortsynthese mit Quellen,
  Folgefragen, Fallback *(PR #3)*
- **M5 Export & Vermerk** — PDF-Handout je Zielgruppe, Aktenvermerk-Generator *(PR #4)*
- **M6 Lokale Datenbank** — IndexedDB: Entwürfe, Vermerke, Notizen *(PR #4)*
- **M7 Single-File** — `azubi-wissen-offline.html`, Doppelklick-fähig *(PR #5)*
- **M8 Fachwerker-Themenbereich** — Handreichung Netzwerkfassung 1.2 *(PR #6)*

## Umgesetzt (v1.1): Formulare & Quellen

- **Q1 Infrastruktur** — `assets/js/quellen.js`, Ansicht „Formulare & Quellen",
  Suchpalette-Gruppe (u. a. „bav" → BAV-Vordruck), Verknüpfung in Artikeln
- **Q2 RP-Kernformulare** — BAV (ausfüllbar), Hinweise, Infoblatt, Abmeldung,
  Änderung, Praktikanten-/Kooperationsverträge, ÜBA-Anlagen, Vergütungs-/
  Urlaubstabellen (vendored unter `formulare/`, Herkunft in `QUELLEN.md`)
- **Q3 Ausbildungspläne** — je 7 Fachrichtungen Gärtner + Fachwerker
- **Q4 Gesetze** — BBiG, JArbSchG, ArbZG, BUrlG, EntgFG, GärtnAusbV (amtliche
  PDFs), GBFWVO als Landesrecht-Link
- **Q5–Q8 Externe Quellen** — Arbeitsagentur (BAB, Ausbildungsgeld, AsA flex,
  Reha, BERUFENET, berufe.tv, planet-beruf), SVLFG (Unterweisung, Checklisten,
  Betriebsanweisungen), Berichtsheft-Portale, Pflanzenlisten, Berufsschulen —
  als gekennzeichnete Online-Links

> **Fachwerker-Navigator pausiert** (Beschluss 31.07.2026): kein separates
> Desktop-Tool — dieses Tool ist die eine Wissensdatenbank und Hilfssoftware
> für alle Themen der zuständigen Stelle. Der Ordner `navigator/` bleibt als
> Archiv liegen, wird aber nicht weiterentwickelt.

## Ausbaustufe v2: Hilfssoftware für die zuständige Stelle

- **V1 E-Mail-Vorlagen-Center** ✅ — 14 Vorlagen in 3 Kategorien
  (Vertrag & Eintragung, Prüfung, Beratungsalltag): Vertragsunterlagen,
  Vertragsänderung/-verlängerung, Auflösungsvertrag, AP-Anmeldung,
  Externenprüfung (§ 45 Abs. 2 BBiG) mit Literaturliste, Nachteilsausgleich,
  Teilzeitausbildung, Ausbildung mit Kind, Fachwerker-/Gärtner-Interesse u. a.
  Platzhalter ausfüllen → Vorschau → kopieren oder als E-Mail öffnen;
  passende Anhänge und Hintergrund-Artikel verlinkt. *(PR #11)*
- **V2 Download-Center** ✅ — alle Dokumente als aufklappbare Baumstruktur
  nach Thematik (Verträge, Ausbildungspläne, Tabellen, Gesetze, Prüfung,
  Förderung, Arbeitsschutz, Portale) mit Filter. *(PR #11)*
- **V3 Eigene Inhalte** ✅ — eigene Artikel schreiben und Dokumente/Verträge
  hochladen direkt im Tool (`#/eigene`, IndexedDB): erscheinen in
  Wissensdatenbank (Filter „Eigene Artikel"), Suche/Palette, Download-Baum
  („Eigene Dokumente") und PDF-Export; JSON-Sicherung mit Export/Import.
  *(PR #12)*
- **V4 Schnellnachschlag** ✅ — `#/nachschlag` mit kompakten Karten:
  Mindestvergütung (Beginnjahre 2024–2026), Urlaub nach Alter, Probezeit/
  Kündigung/Fristen, Arbeitszeit Jugendliche vs. Erwachsene, Eigenheiten
  der 7 Fachrichtungen (mit Ausbildungsplan-Links); in Suche und Palette
  integriert. *(PR #13)*
- **V5 Feinschliff & UI 2026** ✅ — Liquid-Glass-Design (Header, Suchpalette,
  Hamburger-Menü mit Blur), weiche Elevation/Schatten, haptische Hover-/
  Press-Zustände, gestaffelte Einblend-Animationen, flüssige Übergänge über
  die View-Transitions-API (Routen und Filter), „Zuletzt angesehen" auf der
  Startseite, Schnellzugriffe nach oben; `prefers-reduced-motion` schaltet
  alle Bewegungen ab. *(PR #13)*
- **PWA** ✅ — installierbar (Manifest) mit Service Worker: Kern-App wird
  vorgecacht und läuft komplett offline; Formulare/PDFs wandern beim ersten
  Abruf in den Cache; nur eigene Ursprünge, keine externen Requests.
  *(PR #13)*

## Weitere Ausbaustufen

- **M9 Interaktive Checklisten** ✅ — `#/checklisten`: Erstberatung
  Fachwerker (12 Schritte + Stopppunkte der Handreichung), Vertragsprüfung &
  Eintragung, Betriebsbesuch, AP-Anmeldung — abhaken mit Fortschrittsbalken,
  Notiz je Vorgang, Stand lokal gespeichert (IndexedDB v3), Druck/PDF für
  die Akte, in Suche/Palette integriert. *(PR #14)*
- **M11 Glossar & §§-Verlinkung** ✅ — `#/glossar` mit 29 Begriffen
  (A–Z, tipptoleranter Filter, Deep-Links, Verweise auf Artikel/Quellen);
  Normzitate wie „§ 21 Abs. 3 BBiG" werden in Artikeln, FAQ, Rechtsboxen
  und Nachschlagkarten automatisch mit den lokalen Gesetzes-PDFs verlinkt.
  Dazu Mobile-Korrekturen: deckendes Hamburger-Menü (Backdrop-Filter-
  Verschachtelung), Touch-Navigation, Suchfeld-Überlauf. *(PR #15)*
- **Kontaktverzeichnis** — bewusst zurückgestellt: personenbezogene Daten
  gehören nicht in dieses Repo.

## Perfektionierung (v3) — Auftrag 31.07.2026

> „Überarbeite, verlinke und verbessere alle Inhalte … eigene Reviews
> (inhaltlich, UI, Erweiterungsvorschläge) … PR für PR."

- **R1 Inhalts-Recherche 2** ✅ — 8 neue Quellen: zentrale RP-Seiten
  (Unterlagen für Ausbildende, Anerkennung mit Fristen 20.04./20.09.),
  Eignungsverordnung GartAusbStEignV, KMK-Rahmenlehrplan (vendored),
  BiBB „Ausbildung gestalten", Infodienst/FAQ Landratsamt Karlsruhe,
  Bürgerdienst AP-Anmeldung; Ausbilder-Artikel um Anerkennungsverfahren
  erweitert; neue Baum-Gruppe „Weitere öffentliche Stellen". *(PR #16)*
- **R2 Inhalts-Review & Querverlinkung** ✅ — automatischer Integritäts-
  Durchgang über alle Datenmodule: Querverweise werden zur Laufzeit
  symmetrisiert (38 fehlende Rückverweise geschlossen, gilt automatisch
  für neue Artikel), fünf Artikel ohne Quellen-Anbindung an BBiG/Abmeldung
  angebunden, Typografie-Reste bereinigt, ROADMAP-Kopf aktualisiert;
  Referenzprüfungen Vorlagen/Checklisten/Glossar ohne Befund. *(PR #23)*
- **R3 UI-Review** ✅ — Screenshot-Durchgang aller 11 Ansichten in 390 px
  und 1280 px; behoben: umbrechender Header-Suchknopf, gequetschte
  Desktop-Navigation (nowrap + adaptive Suchknopf-Breite), Fokus-Rahmen
  auf Überschriften nach Routenwechsel, unterstrichene und bei Umbruch
  fragmentierte Chips. *(PR #17)*
- **R4 Rechner-Module** ✅ — vier interaktive Rechner im Schnellnachschlag
  mit Live-Ergebnis (gelbes Ergebnisfeld mit dunkler Kontur, aria-live):
  Urlaubsrechner (Geburtsdatum → Werktage nach JArbSchG/BUrlG +
  Arbeitstage), Vergütungsrechner (Beginnjahr × Ausbildungsjahr →
  Mindestvergütung), Fristenrechner (Probezeit-Ende, spätestes
  Verlängerungsende nach § 21 Abs. 3), Teilzeitrechner (§ 7a mit
  1,5-fach-Kappung); über die Palette findbar („urlaubsrechner" …).
  *(PR #22)*
- **R5 Weitere Module: Fahrplan & Jahreskreis** ✅ — (1) **Ausbildungs-
  fahrplan-Rechner** im Nachschlag: Beginn, Dauer, Probezeit und
  optional Geburtsdatum → chronologische Terminliste (Eintragung,
  Probezeitende, Jugendschutz-Untersuchungsfristen mit
  Entfällt-ab-18-Logik, Zwischenprüfungs-Fenster, Arbeitsuchend-Meldung
  3 Monate vor Ende, Vertragsende) — jede Station mit Artikel-Querlink
  und verlinkter Rechtsgrundlage. (2) **Jahreskreis der Ausbildungs-
  beratung** (Auftrag 31.07.): 12-Monats-SVG-Timeline nach den
  Infografik-Regeln (Grau-Basis, Gelb nur für den aktuellen Monat mit
  Outline, Rauten für Fixtermine 20.04./20.09./31.12./01.01.) mit
  16 wiederkehrenden Stationen in 4 Gruppen — Prüfungswesen (Anmeldung,
  Zwischenprüfungen, Zulassung/Berichtsheftkontrolle, Prüferschulungen,
  Sommer-/Winterprüfung, Freisprechung, Aufgabenausschüsse), Schulen
  (Besuche der Eingangs- und Abschlussklassen, Klassenbildung),
  Verträge & Betriebe, Jahreswechsel (MiAV-Check, Statistik-Stichtag);
  Zeiträume ohne Fixdatum ausdrücklich als Orientierung markiert;
  vollständige barrierefreie Detailliste mit Querlinks. Tests: mini_r5
  (22) + Regressionen (Zähler aktualisiert) grün. *(PR #30)*
- **R6 Notenrechner & Bestehensregeln** ✅ — Auftrag 31.07.: Wie kommen
  die Prüfungsnoten zustande? Neuer Artikel **„Noten & Bestehen: So wird
  die Abschlussprüfung gewertet"** (39. Artikel) mit Rechenweg,
  Beispielrechnung, Ergänzungsprüfungs-Kapitel und
  Fachrichtungs-Hinweis — amtlich belegt aus § 9 Abs. 5–7 GärtnAusbV
  (Systematik in allen 7 Fachrichtungen identisch, § 11 gegengeprüft).
  Neuer **Notenrechner** im Schnellnachschlag: Gewichtungs-Schaubild
  (Praxis 60 % = 5 Aufgaben à 12 %, Fächer 40 % = 4 Fächer à 10 %,
  CI-konform in Grau mit Outline), 9 Notenfelder, live gerechnetes
  Gesamtergebnis mit ✓/✗-Bestehens-Checkliste (beide Blöcke + Gesamt
  ausreichend, keine Sechs, höchstens eine Fünf) und automatischem
  Hinweis auf die mündliche Ergänzungsprüfung (§ 9 Abs. 5: Antrag,
  Fachwahl durch Prüfling, Gewichtung 2:1) samt Beispielrechnung.
  Tests: mini_r6 (19) + alle Regressionen grün. *(PR #31)*
- **R7 Merkliste & Karten-Druck** ✅ — (1) **Merkliste**: Stern an
  jedem Artikel (Aktionszeile) und jeder Nachschlag-Karte; gemerkte
  Inhalte erscheinen als eigene Sektion oben auf der Startseite
  (lokal in `aw.merkliste`, max. 40 Einträge, aria-pressed,
  aktiver Stern gelb mit dunkler Kontur). (2) **„Karte drucken"**
  an jeder Nachschlag-Karte: druckt genau diese Karte als sauberes
  A4-Handout (Jahreskreis, Fahrplan, Notenrechner-Ergebnis …) —
  Formulare und Navigation werden im Druck ausgeblendet, für
  Schulbesuche und Beratungsgespräche. Tests: mini_r7 (14) + alle
  Regressionen grün. *(PR #32)*
- **R8 Komplettsicherung** ✅ — Sicherungsformat Version 2: neben
  eigenen Artikeln/Dokumenten sichert der Export jetzt Aktenvermerke,
  Artikel-Notizen, Checklisten-Stände und die Einstellungen
  (Merkliste, zuletzt angesehen, Vorlagenwerte/-historie, Detailstufe,
  Rolle) in einer JSON-Datei; der Import stellt alles wieder her und
  liest Version-1-Sicherungen weiterhin ein — für Netzlaufwerk-Ablage
  und Gerätewechsel. Tests: mini_r8 (14, inkl. Export→Import in ein
  frisches Browserprofil). *(PR #33)*
- **R9 UI/A11y-Abschlussreview** ✅ — Screenshot-Review mobil (390 px)
  und desktop aller neuen Module mit drei Fixes: (1) verschachtelte
  Links behoben — Querlinks laufen jetzt vor der §§-Verlinkung und
  normVerlinken lässt bestehende <a> aus ([[id|§ 15 BBiG]] erzeugte
  vorher einen leeren Link im Link); (2) 42-px-Überlauf des
  Kartenkopfs auf Mobil beseitigt (min-width: 0 für die Überschrift);
  (3) Fixtermin-Rauten im Jahreskreis werden am Monatsrand nicht mehr
  angeschnitten. Automatische Prüfschleife: kein horizontaler
  Überlauf, keine Elemente ohne Label, keine leeren/verschachtelten
  Links — zusammen mit allen 10 Testsuiten grün (124 Checks).
  *(PR #34)*
- **R10 Doku-Finale** ✅ — README auf den Endstand gebracht: Titel und
  Beschreibung „Ausbildung Grüne Berufe", vollständiger Modulkatalog
  (Berufe, Nachschlag mit 6 Rechnern, Jahreskreis, Vorlagen-Automatik,
  Merkliste, Karten-Druck, Komplettsicherung, PWA) mit aktuellen
  Zahlen (39 Artikel, 101 FAQ, 86 Quellen, 35 Glossarbegriffe,
  18 Berufe, 33 verlinkte Gesetze/Verordnungen) und
  Querverweis-Pflegehinweisen. *(PR #35)*

- **R11 Mobil-Fix große Systemschrift** ✅ — Screenshot-Report
  (01.08.): Die Filterleiste im Download-Center lief auf dem
  Smartphone über den Rand. Ursache: Suchfeld mit width:100 % als
  Flex-Basis drückte den Such-Knopf bei vergrößerter Systemschrift
  aus dem Container; zusätzlich überliefen Karten-Grids mit festen
  rem-Mindestbreiten ab ~130 % Schrift. Fix: .bw-search-Eingabe auf
  flex-basis 0, alle Auto-Fill-Grids auf minmax(min(100 %, X rem)),
  Umbruch-Absicherung für Karten. Messschleife über alle 12 Routen
  bei 390 px/360 px und 130 % Schrift: null Überläufe; alle
  Regressionen grün. *(PR #36)*

- **K1 Assistent 2.0** ✅ — Auftrag 01.08.: „echter" machen ohne
  Halluzinationsrisiko. (1) **Rechnende Antworten**: berechenbare
  Fragen (Urlaub nach Alter, Mindestvergütung nach Beginnjahr/
  Lehrjahr, Teilzeit-Dauer, Probezeitende mit Datum) beantwortet der
  Assistent jetzt mit dem konkreten Wert, verlinkter Rechtsgrundlage
  und Sprung zum Rechner — die Rechenkerne sind mit den Rechner-
  Karten geteilt (app.js exportiert miavWert/urlaubNachAlter/
  teilzeitDauer/probezeitEnde). (2) **Dialoggedächtnis**: kurze
  Folgefragen („und mit 18?") erben das vorige Thema, transparent
  gekennzeichnet. (3) **Zwei-Artikel-Synthese**: liegt der zweitbeste
  Treffer nah am besten, fließen seine passendsten Fakten mit in die
  Antwort. (4) **Begriffs-/Vergleichsfragen** („Unterschied …?")
  antworten aus dem Glossar mit Wortstamm-Abgleich. (5) Intent-
  gewichtete Satzwahl (Zahlen bei Wieviel/Wann, Regelwörter bei
  Darf/Muss). Tests: mini_k1 (16) + Regressionen grün. *(PR #37)*

- **K2 Assistent kennt das Werkzeug & bietet Dokumente an** ✅ —
  Auftrag 01.08.: „die KI soll auch Dokumente anbieten und die
  Module und Bereiche unseres Tools kennen". (1) **Werkzeug-Katalog**
  (beim ersten Zugriff aus den Datenmodulen aufgebaut, neue Inhalte
  erscheinen automatisch): alle 12 Module/Funktionen, Nachschlag-
  Karten & Rechner, E-Mail-Vorlagen, Checklisten, Themenbereiche und
  alle Download-Einträge. (2) **Navigationsfragen** („Wo finde ich
  …?", „Zeig mir …", „Welche Vorlage/Checkliste …?", „Wie sichere
  ich …?") antworten mit direkten Verweisen — Dateien mit Download-
  Attribut, externe Angebote gekennzeichnet; Existenzfragen („Gibt
  es …?") übernehmen den Werkzeugpfad nur, wenn alle Wörter treffen
  und die Wissensdatenbank nicht besser antwortet. (3) **Übersicht**
  („Was kannst du?"/„Hilfe"): Fähigkeiten + alle Bereiche verlinkt.
  (4) **Passende Dokumente** unter jeder Wissensantwort: Vorlagen
  und Checklisten über ihr artikel-Feld, Formulare über die Anhänge
  passender Vorlagen — der Zweitartikel der Synthese zählt mit.
  (5) Fix aus dem Test: Folgefragen-Anreicherung fällt bei null
  Treffern auf die reine Frage zurück (vorher Fallback-Sackgasse
  nach Themenwechsel). Tests: mini_k2 (23) + mini_k1 (16) grün.
  *(PR #38)*

- **Hotfix Stichwort-Nachschlag** ✅ — Live-Fund: „Bav" antwortete
  mit dem „Nein. …" einer zufällig passenden Ja/Nein-FAQ. Reine
  Stichwörter starten jetzt mit Artikel + Definition und gelten
  nicht mehr als Anschlussfrage. *(PR #39)*

- **K3 Bedeutungssuche — lokales Sprachmodell, optional** ✅ —
  zweite Stufe des KI-Ausbaus (gewählte Option „3 + 2").
  (1) **Vendor** `assets/vendor/semantik/`: transformers.js 4.2
  (Browser-Bundle), ONNX-Runtime-WASM (asyncify) und
  multilingual-e5-small **q8** — die 118-MB-ONNX wegen der
  GitHub-100-MB-Grenze in drei Teilen, die der Loader im Browser
  wieder zusammensetzt (env.fetch-Hook + customCache; Blob wird
  memoisiert). Erkenntnisse dokumentiert im Loader: localModelPath
  muss **relativ** sein (absolute URL ⇒ get_file_metadata übergeht
  den Lokal-Zweig und meldet „Tokenizer fehlt"), und nur
  `transformers.min.js` ist selbständig (das web-Bundle erwartet
  einen Bundler). (2) **Index**: tools/semantik_index_bauen.mjs
  bettet 39 Artikel + 101 FAQ mit „passage:"-Präfix ein →
  assets/daten/semantik-index.json (405 KB, dim 384); Neuaufbau
  nur bei Inhaltsänderungen nötig. (3) **Opt-in-UI** im Assistenten:
  „Bedeutungssuche aktivieren" (≈ 150 MB, bleibt lokal), Fortschritt
  in der Statuszeile, nach Erfolg Autostart über aw.semantik;
  Einzeldatei-Version blendet alles aus. Service Worker legt die
  Modelldateien in den dauerhaften Datei-Cache (überstehen
  App-Updates; kein Doppelspeicher, da useBrowserCache aus).
  (4) **Hybrid-Ranking**: Reciprocal Rank Fusion über die
  Artikel-Einträge; semantische NEUE Kandidaten erst ab Schwelle
  0,80 (sonst kippt Rauschen den ehrlichen Fallback); bei kaum
  Stichwort-Substanz führt der semantisch klare Artikel („Chef
  zahlt zu spät" → Vergütung); FAQ-Schützenhilfe: liegt der
  Artikel der Top-FAQ semantisch vor dem Artikel-Top, genügt die
  niedrige Dominanzschwelle („rauswerfen" → Kündigungs-FAQ statt
  Lernpflicht-Streutreffer). Die kurzen FAQ-Passagen selbst bleiben
  aus Fusion/Rettung draußen (dichtes Rauschband 0,83+).
  Tests: mini_k3 (16, inkl. **Zero-Trust-Assertion: kein einziger
  externer Request beim Modellladen und Antworten**), Regressionen
  mini_k1 (16) + mini_k2 (27), Einzeldatei-Smoke grün. *(PR #40)*

- **S1 Bedeutungssuche kennt das Werkzeug** ✅ — Modulkatalog nach
  `assets/js/module.js` ausgelagert (eine Quelle für Assistent UND
  Embedding-Build); semantik_index_bauen.mjs bettet zusätzlich 42
  Werkzeug-Einträge ein (Module, Nachschlag-Karten, Vorlagen,
  Checklisten; Index-Version 2, 182 Einträge, 528 KB). Wirkung mit
  aktiver Bedeutungssuche: Navigationsfragen ohne Stichworttreffer
  werden semantisch gerettet („Unterstützung beim Formulieren einer
  Nachricht an den Betrieb" → konkrete Vorlage, Schwelle 0,82,
  gekennzeichnet); „Passende Dokumente" ergänzt semantisch klar
  passende Vorlagen/Checklisten/Rechner (≥ 0,84, ohne allgemeine
  Module). Messwerte: Anschreiben→berichtsheft-erinnerung 0,876,
  „womit ausrechnen ob bestanden"→Notenrechner 0,871, „Termine übers
  Jahr"→Jahreskreis 0,877. Tests: mini_s1 (17) + alle Regressionen
  (k1 16, k2 27, k3 16), Einzeldatei-Smoke. *(PR #41)*

- **S2 Quellen-Live-Check 08/2026** ✅ — alle 93 externen URLs aus
  quellen.js/berufe.js geprüft (Status + Redirects) und alle lokalen
  Dateipfade verifiziert. Ergebnis: 3 Funde, alle behoben —
  (1) BA-Seite „Ausbildungsgeld" entfernt → Reha-Übersichtsseite
  (führt Ausbildungsgeld inkl. Online-Antrag); (2) planet-beruf.de
  dauerhaft ins BA-Bildungsportal überführt → Eintrag umbenannt
  („Bildungsportal der Arbeitsagentur, früher planet-beruf.de");
  (3) KMK-Rahmenlehrplan-PDF: Dateipfad der KMK umgezogen. MiAV 2027
  geprüft: Bekanntmachung folgt erst im November 2026 (BIBB/BMBF) —
  2026er-Werte bleiben korrekt. Prüfskript: scratchpad
  quellen_check.mjs; Endlauf 93/93 OK. *(PR #42)*

- **S3 Navigator M1.1 — Inhalts-Sync** ✅ — die Markdown-Wissensbasis
  des Fachwerker-Navigators (navigator/knowledge/) auf den Endstand
  des Browsertools synchronisiert: 39 Artikel (neu ap-noten), alle
  D-Serien-Vertiefungen, 76 Synonymgruppen; export-wissen.mjs löst
  die Querlink-Syntax ([[…]]) jetzt in Klartext auf. Verifiziert:
  Inhalts-Validierung, cargo test navigator-core, Vite-Build.
  Details: navigator/docs/ROADMAP.md (M1.1). *(PR #43)*

- **S4 Verwaltungsvorschriften & BIBB-Empfehlungen** ✅ — Auftrag
  01.08.: „zu jedem Thema, wo vorhanden, die Verwaltungsvorschriften
  recherchieren und praktisch verknüpfen". Neue untergesetzliche
  Ebene mit 14 Quellen (Typen vwv/empfehlung), 12 davon als lokale
  PDFs in formulare/vwv/: **Land BW** — VwV Ausbildungsnachweise &
  Berichtshefte (MLR 16.04.2012), VwVBBiL (ÜBA & Prüfungszulassung,
  21.09.2011), VOAPLandw (Prüfungsdurchführung, Landesrecht-Link),
  BBiG-ZuVO (+ RP-Zuständigkeitstabelle), Arbeitsrichtlinien für
  Ausbildungsberater (08.08.1977); **BIBB-Hauptausschuss** — HA 156
  Ausbildungsnachweise (2020), HA 174 Teilzeit (10.12.2025!), HA 129
  Verkürzung/Verlängerung (2021), HA 120 Musterprüfungsordnung
  (07.10.2025!), HA 96 Externenprüfung, HA 136 Rahmenregelung § 66,
  HA 154 ReZA, HA 162 Eignung der Ausbildungsstätten. Einbindung:
  eigene Baumgruppe im Download-Center (Land/BIBB), Etiketten
  „Verwaltungsvorschrift"/„BIBB-Empfehlung", artikel-Verknüpfung →
  sichtbar unter „Formulare & Links zum Thema" der passenden Artikel
  (berichtsheft, abschlusspruefung, ap-noten, teilzeit-verkuerzung,
  fw-*, ausbilder, eintragung, zustaendige-stelle …); Assistent
  beantwortet „Gibt es eine Verwaltungsvorschrift zu …?"/„Welche
  Empfehlung …?" (Nav-Trigger + Art-Filter). Neu: tools/quellen-md.mjs
  generiert den Herkunftsnachweis formulare/QUELLEN.md (48 lokale
  Dateien). Tests: mini_s4 (17) + Regressionen k1/k2, Offline-Check,
  Einzeldatei-Smoke. *(PR #44)*

- **S5 pflanze-bw.de eingebunden** ✅ — Auftrag 01.08.: das
  Pflanzenkenntnis-Werkzeug bei den Pflanzenlisten ergänzen (bisher
  nur die Karlsruher Listen). Neuer Portal-Eintrag (gekennzeichnet
  als privates, nicht-kommerzielles Lernangebot; ohne Konto/Tracking,
  offline nutzbar; 14 Profile, über 2.100 Arten, alle 7 Fachrichtungen
  + Fachwerker; Prüfmodus mit Prüfungsbögen und Notenschema) —
  verknüpft mit Abschluss-/Zwischenprüfung und Fachwerker-Prüfung,
  als Anhang der Prüfungs-Vorlagen (AP-Anmeldung, Externenprüfung),
  Querverweis in der Pflanzenlisten-Beschreibung. Tests: mini_s4
  erweitert (19), Regression k2, Offline-Check. *(PR #45)*

- **S6 App-Icon „Keimling"** ✅ — eigenes Zeichen statt BW-Löwe:
  zwei Kreisbogen-Blätter, Schwarz auf Gelb, maskable; SVG-Master +
  alle PNG-Größen + ICO generiert (icon_render im Scratchpad).
  *(PR #46)*

- **S7 BBiG im Volltext** ✅ — Auftrag 02.08.: das komplette BBiG
  durchsuchbar und in beide Richtungen verknüpft. Bewusst NICHT als
  Wissensartikel (Suchflutung, Pflege), sondern als eigenes
  Gesetzes-Modul: tools/gesetz_import.py parst das amtliche gii-XML
  von gesetze-im-internet.de (gemeinfrei, § 5 UrhG) deterministisch
  nach assets/js/gesetzestexte.js — **121 Paragrafen** mit voller
  Gliederungshierarchie (Teil › Kapitel › Abschnitt › Unterabschnitt),
  nummerierte Aufzählungen als eingerückte Zeilen, Stand automatisch
  aus den Standangaben (aktuell: Neufassung 16.04.2025, zuletzt
  geändert 28.10.2025). Ansichten: #/gesetz/bbig (Übersicht mit
  Teil-Gruppen + Fuzzy-Filter, direkte §-Nummer trifft immer) und
  #/gesetz/bbig-17 (Wortlaut, Gliederungspfad, ‹/›-Nachbarn,
  Merkliste, amtliche Einzelnorm + Gesamt-PDF). **Verlinkung in beide
  Richtungen:** jedes §-BBiG-Zitat im ganzen Werkzeug (Fakten, FAQ,
  Rechtsgrundlagen-Boxen, Vorlagen, Checklisten, Glossar) springt
  jetzt intern auf die Norm statt aufs PDF (normVerlinken-Zweig);
  Rückrichtung über GESETZ_ARTIKEL (aus den kuratierten
  recht[]-Feldern, inkl. §§-Bereichs-Expansion) → „Behandelt in
  diesen Artikeln" auf jeder Paragrafenseite. Globale Suche:
  eigene Palette-Gruppe „Gesetzestexte" (UND-fuzzy über Nr, Titel,
  Wortlaut). Assistent: „Was steht in § 17 BBiG?" — auch
  absatzgenau („§ 22 Abs. 2 BBiG") — zitiert den Wortlaut (max.
  900 Zeichen) mit Volltext- und Artikel-Verweisen; Modul-Eintrag
  „BBiG im Volltext" in module.js (Werkzeug-Navigation + Semantik-
  Index 183). Dauerpflege: nach Gesetzesänderung
  `python3 tools/gesetz_import.py` erneut ausführen. Tests: mini_s7
  (21) + Regressionen k1/k2/s4/k3, Offline-Check, Einzeldatei-Smoke
  (Volltext funktioniert auch per Doppelklick). *(PR #47)*

- **S8 Menü-Einstieg Gesetze** ✅ — Nav-Punkt „Gesetze" + Startkarte;
  Aktiv-Marker berücksichtigt Unterrouten. *(PR #48)*

- **S9 Neun Gesetze im Volltext** ✅ — Auftrag 02.08.: weitere für
  Azubis wichtige Gesetze einpflegen. Importer-WERKE-Liste erweitert
  um JArbSchG (68 §§), BUrlG (17), ArbZG (27), ArbSchG (29), EntgFG
  (15), KSchG (28), TzBfG (24), AEVO (9) — zusammen mit dem BBiG
  **338 Paragrafen / 450 KB**, alle amtlich aktuell (ArbSchG Stand
  22.12.2025, EntgFG 12.05.2026). Neue Werkübersicht #/gesetz
  (Menüziel), alles generisch: normVerlinken über die
  GESETZ_VOLLTEXT-Map (EFZG→EntgFG-Alias; Werknamen-Kollision
  JArbSchG/ArbSchG über Wortgrenzen + längste zuerst gelöst),
  Rückverweis-Index je Werk (werk:nr), Palette und Assistent-
  Paragrafnachschlag für alle Werke („Was steht in § 19 JArbSchG?",
  „§ 3 BUrlG"). BGB/SGB bleiben bewusst PDF (Umfang, Randbezug).
  Tests: mini_s7 auf 31 Checks erweitert (inkl. Kollisionscheck:
  kein JArbSchG-Zitat zeigt auf ArbSchG), Regressionen k1/k2/
  smoke_start, Offline-Check, Einzeldatei. *(PR #49)*

**Stand 31.07.2026: Alle beauftragten Ausbaustufen sind umgesetzt.**
Weiterbetrieb über die Dauerpflege-Punkte unten; neue Module über
neue Roadmap-Einträge.

## Ausbau v4: Alle grünen Berufe — Auftrag 31.07.2026

> „Das ganze Tool für alle grünen Berufe umbauen … E-Mail-Vorlagen mit
> Dropdowns, Automatisierung, Eingabe-Historie — einfach, intuitiv, schnell."

- **G1 Berufe-Grundausbau** ✅ — Umbenennung in „Ausbildung Grüne Berufe"
  (Kurzname „Grüne Berufe BW"; Speicher-IDs unverändert für Datenerhalt);
  neues Datenmodul `berufe.js` mit 18 Berufen (14 BBiG-Berufe inkl.
  Landwirt, Winzer, Fischwirt, Brenner, Tierwirt, Pferdewirt, Forstwirt,
  Hauswirtschafter, Milchtechnologe, Milchw. Laborant, Pflanzentechnologe,
  Revierjäger, Fachkraft Agrarservice; 3 × § 66; Hufbeschlagschmied) mit
  Fachrichtungen, Verordnungen und verifizierten RP-/Infodienst-Links;
  Ansicht `#/berufe` mit Detail-Deep-Links, Palette-Gruppe, Nav-Punkt,
  neue Startseite. *(PR #19)*
- **G2 Vorlagen-Automatisierung** ✅ — typisierte Angaben-Felder statt
  leerer Textfelder: BERUF als Dropdown (17 Berufe, Gärtner/in vorbelegt)
  mit **abhängiger Fachrichtungs-Auswahl** (Beruf ohne Fachrichtungen →
  Feld entfällt, Floskeln werden automatisch bereinigt); Prüfungstermin-
  Dropdown mit Jahresoptionen; Datumsfelder als Datepicker (heute bzw.
  +14 Tage bei Fristen vorbelegt, Ausgabe in de-DE); **Eingabe-Historie**:
  Textfelder schlagen die letzten 8 Werte vor (datalist, gemerkt beim
  Kopieren/Versenden) und bleiben vorlagenübergreifend vorbelegt;
  Externenprüfungs-Vorlage auf [BERUF] generalisiert. *(PR #20)*
- **G3 Inhalte je Beruf vertiefen** ✅ — Berufe-Detail mit drei neuen
  Aktionen: Verordnung (Landwirt: verifizierter gesetze-im-internet-Link,
  Gärtner: lokales PDF, übrige: Regelungs-Übersicht Bildungsserver Agrar),
  BERUFENET-Suchlink je Beruf, **„E-Mail-Vorlagen für diesen Beruf"**
  (übernimmt den Beruf automatisch in die Vorlagen, verwirft unpassende
  Fachrichtung); zwei neue Quellen (Bildungsserver Agrar,
  BW-Rechtsgrundlagen Agrarbereich); Vergütungs-/Urlaubs-Fußnoten
  berufsübergreifend präzisiert. *(PR #24)*
- **G4 RP-Look** ✅ — Kopfzeile im Design von rp.baden-wuerttemberg.de
  (Screenshot-Auftrag): vollgelber Header mit schwarzem Logo und schwarzen
  Symbolen, gestaffeltes Menü-Icon, aktiver Punkt mit schwarzem Marker;
  gelber Seitenrand-Störer „Fragen" (öffnet den Assistenten, mit dunkler
  Kontur); Browser-Statusleiste bleibt weiß. *(PR #21)*

## Detailausbau v5: Inhalte vertiefen & verlinken — Auftrag 31.07.2026

Jeden Artikel und jeden Datensatz ausbauen; Rechtsgrundlagen und Quellen
immer verlinken; Querlinks zwischen Artikeln.

- **D1 Verlinkungs-Infrastruktur** ✅ — §§-Verlinkung deckt jetzt **30
  Werke** ab (BGB, ArbSchG, KSchG, BetrVG, SGB III/IV/IX, BAföG, DSGVO
  mit „Art."-Zitaten, EFZG-Alias sowie alle 14 Ausbildungsordnungen der
  grünen Berufe — Slugs über die amtlichen Teillisten von
  gesetze-im-internet.de verifiziert); Regex versteht Bereichszitate
  („§§ 34–36 BBiG"); **[[artikel-id]]-Querlink-Syntax** in Fakten,
  Abschnitten, FAQ, Rollen und Glossar (Suchindex löst Links zu Klartext
  auf, Druck neutralisiert sie); Berufe-Datensätze mit amtlichen
  Verordnungskürzeln und direkten Volltext-Links (15 neue
  `verordnungUrl`); Download-Baum mit eigener Gruppe
  „Ausbildungsordnungen der grünen Berufe" (14 Einträge) und 9 weiteren
  Gesetzes-Quellen; drei dünne FAQ-Bestände ergänzt. Tests: mini_d1 (20)
  + Regressionen G2/R4/G3/Start grün. *(PR #25)*
- **D2 Artikel-Tranche 1** ✅ — 14 Artikel der Themen Vertrag,
  Azubi-Pflichten und Betriebs-Pflichten vertieft: rund 30 neue
  Querlinks im Fließtext, 8 neue FAQ (u. a. fehlende Eintragung,
  Probezeit-Anrechnung, JArbSchG ab 18, Wegezeiten Schule,
  Kostenklauseln), 3 neue Abschnitte (Änderungsverträge im laufenden
  Verhältnis, Schutzregeln für unter 18-Jährige mit §§ 22/23/29/47
  JArbSchG, elektronischer Ausbildungsnachweis). Neuer Dauertest
  smoke_d2: alle 38 Artikel rendern in Stufe 3 fehlerfrei, alle
  Querlink-Ziele existieren. *(PR #26)*
- **D3 Artikel-Tranche 2** ✅ — 10 Artikel der Themen Vergütung, 
  Arbeitszeit/Urlaub und Schule/Prüfung vertieft: ~34 weitere Querlinks
  (u. a. Zulassungsvoraussetzungen der Abschlussprüfung komplett
  verlinkt, Überstunden ↔ Arbeitszeitgrenzen, Schlechtwetter ↔ Urlaub),
  3 neue FAQ (MiAV-Erhöhung gilt nicht rückwirkend, Lohnsteuer,
  Sachbezugsgrenzen) und neuer Abschnitt „Urlaubsentgelt ist nicht
  Urlaubsgeld". Bestand: 90 Querlink-Verwendungen auf 29 Ziele,
  smoke_d2 komplett grün. *(PR #27)*
- **D4 Artikel-Tranche 3** ✅ — 14 Artikel der Themen Konflikte/Ende,
  Beratung und Fachwerker vertieft: ~45 weitere Querlinks (u. a.
  Zwölf-Schritte-Verfahren der Fachwerkerausbildung komplett auf die
  Detailartikel verlinkt, Mängel-Workflow der Beratung, Wechsel-Wege);
  neue Quelle TzBfG (verifiziert) samt neuer FAQ zur befristeten
  Anschlussbeschäftigung (§ 14 Abs. 2 TzBfG, automatisch verlinkt).
  Bestand: 135 Querlink-Verwendungen auf 36 der 38 Artikel; smoke_d2
  und mini_d1 grün. *(PR #28)*
- **D5 Datensätze** ✅ — Verlinkung wirkt jetzt in JEDEM Datensatz:
  Nachschlag-Tabellen (Grundlage-Spalten klickbar), Karten-Kurztexte
  und Fußnoten, Checklisten-Punkte samt Hinweisen (inkl. Druck) und
  Vorlagen-Hinweise laufen über fmtInline (§§ + Querlinks); Glossar um
  6 Begriffe erweitert (AEVO, Budget für Ausbildung, eAU, JAV,
  Sachbezug, Schlichtungsausschuss); Fristen-Tabelle + Klagefrist und
  Schadensersatz-Frist; neue Quelle AEVO (ausbeignv_2009, verifiziert);
  Checklisten-Punkte verlinken Förderwege und Modelle. Tests: mini_d5
  (14) + smoke_d2/mini_d1/G2/R4 grün. *(PR #29)*

## Dauerpflege

- Mindestvergütung jährlich (Bundesanzeiger) · Stand-Datum in `wissen.js`
- Handreichungs-Fassungen nachziehen (Quellenvermerke!)
- Bei Gesetzesänderungen (BBiG, JArbSchG, BUrlG, ArbZG, ArbSchG, EntgFG,
  KSchG, TzBfG, AEVO): `python3 tools/gesetz_import.py` (Volltext-Modul)
- Nach jeder Inhaltsänderung: `build_singlefile.py --release` + Commit
  (bei neuen Artikeln/FAQ zusätzlich `node tools/semantik_index_bauen.mjs`)
