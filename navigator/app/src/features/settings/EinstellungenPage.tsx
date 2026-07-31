import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { datenquelle } from "@/lib/api";
import {
  schriftgradLesen, schriftgradSetzen, themaLesen, themaSetzen,
  type Schriftgrad, type Thema,
} from "@/lib/theme";

export function EinstellungenPage() {
  const [thema, setThema] = useState<Thema>(themaLesen());
  const [grad, setGrad] = useState<Schriftgrad>(schriftgradLesen());
  const [modus, setModus] = useState("");
  useEffect(() => { datenquelle().then((d) => setModus(d.modus)); }, []);

  return (
    <div className="mx-auto grid max-w-2xl gap-4">
      <h1 className="text-xl font-bold">Einstellungen</h1>

      <Card>
        <CardHeader><CardTitle className="text-sm">Erscheinungsbild</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div role="group" aria-label="Design" className="flex flex-wrap gap-2">
            {(["hell", "dunkel", "system"] as const).map((t) => (
              <Button
                key={t}
                variant={thema === t ? "default" : "secondary"}
                size="sm"
                aria-pressed={thema === t}
                onClick={() => { themaSetzen(t); setThema(t); }}
              >
                {t === "hell" ? "Hell" : t === "dunkel" ? "Dunkel" : "System"}
              </Button>
            ))}
          </div>
          <div role="group" aria-label="Schriftgröße" className="flex flex-wrap gap-2">
            {(["s", "m", "l"] as const).map((g) => (
              <Button
                key={g}
                variant={grad === g ? "default" : "secondary"}
                size="sm"
                aria-pressed={grad === g}
                onClick={() => { schriftgradSetzen(g); setGrad(g); }}
              >
                Schrift {g.toUpperCase()}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">KI-Assistent</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--text-leise)]">
          <p>
            Modus: <strong>deaktiviert</strong> (Standard). Der Assistent wird in einem späteren
            Milestone quellengebunden (RAG) umgesetzt — wahlweise mit lokalem Modell (Ollama)
            oder externem Anbieter. Ohne ausdrückliche Aktivierung verlässt keine Anfrage dieses Gerät.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Datenquelle</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--text-leise)]">
          {modus === "tauri" ? (
            <p>Desktop-Modus: SQLite-Datenbank im Benutzerprofil; Wissensbasis wird beim ersten Start importiert.</p>
          ) : (
            <p>Browser-Vorschau: SQLite läuft als WebAssembly im Speicher (sql.js) mit derselben Wissensbasis. Maßgeblich ist die Desktop-Fassung.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
