// Sichere Markdown-Darstellung: marked (Parser) + DOMPurify (Sanitizer).
// Importierte Inhalte werden nie ungefiltert in den DOM geschrieben.
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";

marked.setOptions({ gfm: true, breaks: false, async: false });

export function markdownZuHtml(md: string): string {
  const roh = marked.parse(md) as string;
  return DOMPurify.sanitize(roh, { USE_PROFILES: { html: true } });
}

export function Markdown({ inhalt, className }: { inhalt: string; className?: string }) {
  const html = useMemo(() => markdownZuHtml(inhalt), [inhalt]);
  return <div className={className ?? "prosa"} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Für Suchtreffer: nur <mark> zulassen, alles andere escapen. */
export function schnipselHtml(schnipsel: string): string {
  return DOMPurify.sanitize(schnipsel, { ALLOWED_TAGS: ["mark"], ALLOWED_ATTR: [] });
}
