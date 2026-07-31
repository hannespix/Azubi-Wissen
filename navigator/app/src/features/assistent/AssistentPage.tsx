import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function AssistentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold">KI-Assistent</h1>
      <Card className="mt-3">
        <CardHeader><CardTitle className="text-sm">Geplant (Milestone 7)</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm text-[var(--text-leise)]">
          <p>
            Der Assistent antwortet später ausschließlich quellengebunden (RAG) auf Basis der
            lokalen Wissensdatenbank — mit Quellenleiste je Antwort, Datenschutzvorschau vor
            jeder externen Anfrage und Unterstützung für ein lokales Modell (Ollama).
          </p>
          <p>
            Bis dahin: Die <Link to="/suche" search={{ q: "" }} className="underline">Volltextsuche</Link> findet
            bereits tippfehlertolerant mit Synonymen über alle Artikel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
