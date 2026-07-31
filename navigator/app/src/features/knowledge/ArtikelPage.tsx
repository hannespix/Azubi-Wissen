import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, Scale, TagIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { datenquelle } from "@/lib/api";
import { Markdown } from "@/lib/markdown";

export function ArtikelPage() {
  const { id } = useParams({ from: "/artikel/$id" });
  const frage = useQuery({
    queryKey: ["artikel-detail", id],
    queryFn: async () => (await datenquelle()).getArticle(id),
  });
  const a = frage.data;

  if (frage.isLoading) return <p className="text-[var(--text-leise)]">Lade Artikel …</p>;
  if (!a) {
    return (
      <div className="mx-auto max-w-3xl">
        <p>Artikel „{id}“ wurde nicht gefunden.</p>
        <Link to="/wissen" search={{ kategorie: undefined }} className="underline">Zur Wissensdatenbank</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article>
        <nav aria-label="Pfad" className="mb-2 text-sm text-[var(--text-leise)]">
          <Link to="/wissen" search={{ kategorie: undefined }} className="inline-flex items-center gap-1 hover:underline">
            <ChevronLeft aria-hidden className="size-4" /> Wissensdatenbank
          </Link>
          {" · "}
          <Link to="/wissen" search={{ kategorie: a.kategorie_id }} className="hover:underline">
            {a.kategorie_titel}
          </Link>
        </nav>
        <h1 className="text-2xl font-bold leading-tight">{a.titel}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--text-leise)]">
          <StatusBadge status={a.status} />
          {a.geprueft_am && <span>geprüft am {a.geprueft_am}</span>}
          {a.region && <span>· {a.region}</span>}
        </div>
        {a.kurz && <p className="mt-3 max-w-[72ch] text-base font-medium">{a.kurz}</p>}
        <Markdown inhalt={a.inhalt_md} className="prosa mt-4" />
      </article>

      <aside className="lg:sticky lg:top-4 lg:self-start" aria-label="Kontext">
        {a.rechtsgrundlagen.length > 0 && (
          <Card className="mb-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Scale aria-hidden className="size-4" /> Rechtsgrundlagen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-1.5 text-sm">
                {a.rechtsgrundlagen.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
        {a.tags.length > 0 && (
          <Card className="mb-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TagIcon aria-hidden className="size-4" /> Schlagwörter
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {a.tags.map((t) => (
                <span key={t} className="rounded border border-[var(--linie)] px-1.5 py-0.5 text-xs">{t}</span>
              ))}
            </CardContent>
          </Card>
        )}
        {a.quelle && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Quelle</CardTitle></CardHeader>
            <CardContent className="text-xs text-[var(--text-leise)]">{a.quelle}</CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}
