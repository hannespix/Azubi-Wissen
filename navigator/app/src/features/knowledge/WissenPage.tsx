import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { datenquelle } from "@/lib/api";
import { cn } from "@/lib/utils";

export function WissenPage() {
  const { kategorie } = useSearch({ from: "/wissen" });
  const navigate = useNavigate();
  const kategorien = useQuery({
    queryKey: ["kategorien"],
    queryFn: async () => (await datenquelle()).listCategories(),
  });
  const artikel = useQuery({
    queryKey: ["artikel", kategorie ?? "alle"],
    queryFn: async () => (await datenquelle()).listArticles(kategorie),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-bold">Wissensdatenbank</h1>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Nach Themenbereich filtern">
        <button
          className={cn(
            "rounded-full border px-3 py-1 text-sm",
            !kategorie ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900" : "border-[var(--linie)] bg-[var(--flaeche)]"
          )}
          onClick={() => navigate({ to: "/wissen", search: { kategorie: undefined } })}
          aria-pressed={!kategorie}
        >
          Alle
        </button>
        {(kategorien.data ?? []).map((k) => (
          <button
            key={k.id}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              kategorie === k.id
                ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                : "border-[var(--linie)] bg-[var(--flaeche)]"
            )}
            onClick={() => navigate({ to: "/wissen", search: { kategorie: k.id } })}
            aria-pressed={kategorie === k.id}
          >
            {k.titel}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(artikel.data ?? []).map((a) => (
          <Link key={a.id} to="/artikel/$id" params={{ id: a.id }} className="group">
            <Card className="h-full transition-colors group-hover:border-stone-500">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-leise)]">
                  <span>{a.kategorie_titel}</span>
                  <StatusBadge status={a.status} />
                </div>
                <CardTitle className="text-sm">{a.titel}</CardTitle>
              </CardHeader>
              <CardContent className="line-clamp-3 text-sm text-[var(--text-leise)]">{a.kurz}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {artikel.isSuccess && artikel.data.length === 0 && (
        <p className="mt-8 text-center text-[var(--text-leise)]">Keine Artikel in diesem Themenbereich.</p>
      )}
    </div>
  );
}
