# ROADMAP — Ausbildung Grüne Berufe (vormals Azubi-Wissen)

> **Tool-Zweck:** Offline-Wissensdatenbank „Rechte & Pflichten in der
> Ausbildung" (grüne Berufe) mit Suche, lokalem Assistenten, PDF-Export,
> Aktenvermerk-Generator und lokaler Datenbank.
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
- **R2 Inhalts-Review & Querverlinkung** — alle 38+ Artikel: verwandt-Links
  vervollständigen, Artikel↔Quellen↔Vorlagen↔Checklisten verknüpfen,
  Typografie/Fakten prüfen.
- **R3 UI-Review** ✅ — Screenshot-Durchgang aller 11 Ansichten in 390 px
  und 1280 px; behoben: umbrechender Header-Suchknopf, gequetschte
  Desktop-Navigation (nowrap + adaptive Suchknopf-Breite), Fokus-Rahmen
  auf Überschriften nach Routenwechsel, unterstrichene und bei Umbruch
  fragmentierte Chips. *(PR #17)*
- **R4 Rechner-Module** — Urlaubsanspruch (Alter/Eintritt), Vergütung
  (Beginnjahr/Tarif), Fristen (Probezeit-Ende, Verlängerung), Teilzeit-Dauer.
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
- **G3 Inhalte generalisieren** — Artikel/Nachschlag/Checklisten auf alle
  Berufe erweitern (Vergütungs-/Urlaubstabellen je Sparte, berufsspezifische
  Quellen und Formulare).

## Dauerpflege

- Mindestvergütung jährlich (Bundesanzeiger) · Stand-Datum in `wissen.js`
- Handreichungs-Fassungen nachziehen (Quellenvermerke!)
- Nach jeder Inhaltsänderung: `build_singlefile.py --release` + Commit
