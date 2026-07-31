# ROADMAP — Azubi-Wissen

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
- **V3 Eigene Inhalte** — eigene Artikel, Dokumente und Verträge direkt im
  Tool anlegen/hochladen (IndexedDB), in Suche und Download-Baum integriert,
  JSON-Sicherung (Export/Import).
- **V4 Schnellnachschlag** — Tarif-/Vergütungstabellen, Urlaubsansprüche nach
  Alter, Fristen und Eigenheiten der Fachrichtungen als kompakte
  Nachschlagekarten.
- **V5 Feinschliff** — Startseite/Navigation modernisieren, zuletzt
  angesehene Inhalte, Barrierefreiheits-Feinschliff.

## Weitere Ideen

- **M9 Interaktive Checklisten** — Erstberatung/Eintragung/Kooperationspartner
  aus der Handreichung als ausfüllbare, lokal gespeicherte Checklisten mit
  PDF-Export (Basis: lokaldb.js).
- **M11 Glossar & §§-Verlinkung** — Kurzglossar; Normzitate im Text automatisch
  mit Artikeln verknüpfen.
- **Kontaktverzeichnis** — bewusst zurückgestellt: personenbezogene Daten
  gehören nicht in dieses Repo.

## Dauerpflege

- Mindestvergütung jährlich (Bundesanzeiger) · Stand-Datum in `wissen.js`
- Handreichungs-Fassungen nachziehen (Quellenvermerke!)
- Nach jeder Inhaltsänderung: `build_singlefile.py --release` + Commit
