import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Database, Search } from "lucide-react";
import { useState } from "react";
import { APP } from "@/app.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { datenquelle } from "@/lib/api";

const SCHNELLZUGRIFFE = [
  { text: "§ 66 BBiG — Grundlagen", ziel: "fw-grundlagen" },
  { text: "Ablauf der Fachwerkerausbildung", ziel: "fw-weg" },
  { text: "ReZA-Anforderungen", ziel: "fw-betrieb" },
  { text: "Ausbildungsmodelle", ziel: "fw-modelle" },
  { text: "Vergütung & Förderung", ziel: "fw-geld" },
  { text: "Mindestvergütung", ziel: "mindestverguetung" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [wert, setWert] = useState("");
  const kategorien = useQuery({
    queryKey: ["kategorien"],
    queryFn: async () => (await datenquelle()).listCategories(),
  });
  const artikelGesamt = (kategorien.data ?? []).reduce((s, k) => s + k.artikel_anzahl, 0);

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <section>
        <h1 className="text-2xl font-bold">{APP.kurzname}</h1>
        <p className="mt-1 text-[var(--text-leise)]">
          Wissensdatenbank der Ausbildungsberatung für die Fachwerkerausbildung im Gartenbau — {APP.region}.
        </p>
        <form
          className="relative mt-4 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (wert.trim()) navigate({ to: "/suche", search: { q: wert.trim() } });
          }}
          role="search"
        >
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[var(--text-leise)]" />
          <Input
            className="h-12 pl-10 text-base"
            placeholder="Was möchten Sie wissen?"
            aria-label="Zentrale Suche"
            value={wert}
            onChange={(e) => setWert(e.target.value)}
          />
          <Button type="submit" variant="accent" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2">
            Suchen
          </Button>
        </form>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Schnellzugriffe">
          {SCHNELLZUGRIFFE.map((s) => (
            <li key={s.ziel}>
              <Link
                to="/artikel/$id"
                params={{ id: s.ziel }}
                className="inline-block rounded-full border border-[var(--linie)] bg-[var(--flaeche)] px-3 py-1 text-sm hover:border-stone-500"
              >
                {s.text}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Themenbereiche">
        <h2 className="mb-2 font-semibold">Themenbereiche</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(kategorien.data ?? []).map((k) => (
            <Link key={k.id} to="/wissen" search={{ kategorie: k.id }} className="group">
              <Card className="h-full transition-colors group-hover:border-stone-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm">
                    {k.titel}
                    <ArrowRight aria-hidden className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-[var(--text-leise)]">
                  {k.artikel_anzahl} Artikel
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm text-[var(--text-leise)]">
            <span className="inline-flex items-center gap-2">
              <Database aria-hidden className="size-4" />
              {artikelGesamt} Artikel in {(kategorien.data ?? []).length} Themenbereichen
            </span>
            <span>Inhalte: Azubi-Wissen v1 + Handreichung Fachwerkerausbildung (Netzwerkfassung 1.2)</span>
            <span>Stand {APP.stand}</span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
