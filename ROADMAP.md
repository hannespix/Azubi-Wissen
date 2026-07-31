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
- **R5 Weitere Module** — Vorschläge aus den Reviews, dann Umsetzung.

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
- **D5 Datensätze** — Glossar, Nachschlag, Checklisten, Berufe, Vorlagen (offen)

## Dauerpflege

- Mindestvergütung jährlich (Bundesanzeiger) · Stand-Datum in `wissen.js`
- Handreichungs-Fassungen nachziehen (Quellenvermerke!)
- Nach jeder Inhaltsänderung: `build_singlefile.py --release` + Commit
