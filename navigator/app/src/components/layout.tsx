// Grundlayout nach Briefing §13: linke Navigation, obere Suchleiste,
// Inhaltsbereich. Die rechte Kontextleiste stellen die Seiten selbst.
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  BookOpen, Bot, Home, Moon, Search, Settings, Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { APP } from "@/app.config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { datenquelle } from "@/lib/api";
import { anwenden, themaLesen, themaSetzen } from "@/lib/theme";

const NAV = [
  { zu: "/", titel: "Dashboard", icon: Home },
  { zu: "/wissen", titel: "Wissen", icon: BookOpen },
  { zu: "/suche", titel: "Suche", icon: Search },
  { zu: "/assistent", titel: "KI-Assistent", icon: Bot, geplant: true },
  { zu: "/einstellungen", titel: "Einstellungen", icon: Settings },
] as const;

export function Layout() {
  const navigate = useNavigate();
  const [suchwert, setSuchwert] = useState("");
  const [modus, setModus] = useState<string>("");
  const [dunkel, setDunkel] = useState(false);

  useEffect(() => {
    anwenden();
    setDunkel(document.documentElement.classList.contains("dark"));
    datenquelle().then((d) => setModus(d.modus)).catch((e) => { console.error("Datenquelle fehlgeschlagen:", e); setModus("fehler"); });
  }, []);

  function suchen(e: React.FormEvent) {
    e.preventDefault();
    if (suchwert.trim()) navigate({ to: "/suche", search: { q: suchwert.trim() } });
  }

  function themaWechseln() {
    themaSetzen(themaLesen() === "dunkel" ? "hell" : "dunkel");
    setDunkel(document.documentElement.classList.contains("dark"));
  }

  return (
    <div className="flex min-h-screen">
      <a
        href="#hauptinhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-[var(--flaeche)] focus:px-3 focus:py-2"
      >
        Zum Inhalt springen
      </a>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--linie)] bg-[var(--flaeche)] md:flex">
        <div className="border-b border-[var(--linie)] p-4">
          <div className="text-sm font-bold leading-tight">{APP.name}</div>
          <div className="mt-1 text-xs text-[var(--text-leise)]">{APP.traeger}</div>
        </div>
        <nav aria-label="Hauptnavigation" className="flex-1 p-2">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.zu}>
                <Link
                  to={n.zu}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 [&.active]:bg-stone-900 [&.active]:text-stone-50 dark:[&.active]:bg-stone-100 dark:[&.active]:text-stone-900"
                  activeOptions={{ exact: n.zu === "/" }}
                >
                  <n.icon aria-hidden className="size-4" />
                  <span>{n.titel}</span>
                  {"geplant" in n && n.geplant ? <Badge className="ml-auto">geplant</Badge> : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-[var(--linie)] p-3 text-xs text-[var(--text-leise)]">
          {modus === "browser" ? "Browser-Vorschau (sql.js)" : modus === "tauri" ? "Desktop-Modus" : modus === "fehler" ? "Datenquelle nicht verfügbar" : "Initialisiere …"} · Stand {APP.stand}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-[var(--linie)] bg-[var(--flaeche)] px-4 py-2.5">
          <form onSubmit={suchen} role="search" className="relative flex-1 md:max-w-xl">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-leise)]" />
            <Input
              type="search"
              value={suchwert}
              onChange={(e) => setSuchwert(e.target.value)}
              placeholder="Wissensdatenbank durchsuchen … (auch tippfehlertolerant)"
              aria-label="Wissensdatenbank durchsuchen"
              className="pl-9"
            />
          </form>
          <Button
            variant="ghost"
            size="icon"
            onClick={themaWechseln}
            aria-label={dunkel ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
          >
            {dunkel ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
        </header>
        <main id="hauptinhalt" className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
