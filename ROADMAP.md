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

## Nächste Ausbaustufen (Vorschläge)

- **M9 Interaktive Checklisten** — Erstberatung/Eintragung/Kooperationspartner
  aus der Handreichung als ausfüllbare, lokal gespeicherte Checklisten mit
  PDF-Export (Basis: lokaldb.js).
- **M10 Musterschreiben-Generator** — Textbausteine (Eignungsschreiben-
  Anforderung, Hinweis an Betriebe, Fallrunden-Protokoll) analog Aktenvermerk.
- **M11 Glossar & §§-Verlinkung** — Kurzglossar; Normzitate im Text automatisch
  mit Artikeln verknüpfen.
- **M12 Inhalts-Export** — Wissensbasis als Markdown/JSON exportieren
  (Wiederverwendung z. B. im geplanten „Fachwerker-Navigator").
- **Kontaktverzeichnis** — bewusst zurückgestellt: personenbezogene Daten
  gehören nicht in dieses Repo; Konzept siehe Fachwerker-Navigator-Briefing
  (eigenes Vorhaben mit lokaler Datenhaltung).

## Dauerpflege

- Mindestvergütung jährlich (Bundesanzeiger) · Stand-Datum in `wissen.js`
- Handreichungs-Fassungen nachziehen (Quellenvermerke!)
- Nach jeder Inhaltsänderung: `build_singlefile.py --release` + Commit
