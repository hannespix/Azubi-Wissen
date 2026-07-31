import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { datenquelle } from "@/lib/api";
import { schnipselHtml } from "@/lib/markdown";

export function SuchePage() {
  const { q } = useSearch({ from: "/suche" });
  const navigate = useNavigate();
  const [wert, setWert] = useState(q);
  useEffect(() => setWert(q), [q]);

  const treffer = useQuery({
    queryKey: ["suche", q],
    enabled: q.trim().length > 1,
    queryFn: async () => (await datenquelle()).searchArticles(q, 30),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold">Suche</h1>
      <form
        role="search"
        className="relative mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/suche", search: { q: wert.trim() } });
        }}
      >
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-leise)]" />
        <Input
          autoFocus
          className="pl-9"
          value={wert}
          onChange={(e) => setWert(e.target.value)}
          placeholder="Suchbegriffe … (mehrere Wörter = UND; Synonyme und Wortanfänge werden mitgesucht)"
          aria-label="Suchbegriffe"
        />
      </form>

      <p className="mt-2 text-sm text-[var(--text-leise)]" role="status">
        {q.trim().length > 1
          ? treffer.isLoading
            ? "Suche läuft …"
            : `${treffer.data?.length ?? 0} Treffer für „${q}“`
          : "Mindestens zwei Zeichen eingeben."}
      </p>

      <ul className="mt-3 grid gap-2">
        {(treffer.data ?? []).map((t) => (
          <li key={t.id}>
            <Link to="/artikel/$id" params={{ id: t.id }} className="group block">
              <Card className="transition-colors group-hover:border-stone-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-leise)]">
                    <span>{t.kategorie_titel}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="mt-1 font-medium">{t.titel}</div>
                  <p
                    className="schnipsel mt-1 text-sm text-[var(--text-leise)]"
                    dangerouslySetInnerHTML={{ __html: schnipselHtml(t.schnipsel) }}
                  />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
