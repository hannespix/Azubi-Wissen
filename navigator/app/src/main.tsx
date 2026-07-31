import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createHashHistory, createRootRoute, createRoute, createRouter, RouterProvider,
} from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "@/components/layout";
import { AssistentPage } from "@/features/assistent/AssistentPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ArtikelPage } from "@/features/knowledge/ArtikelPage";
import { WissenPage } from "@/features/knowledge/WissenPage";
import { SuchePage } from "@/features/search/SuchePage";
import { EinstellungenPage } from "@/features/settings/EinstellungenPage";
import { anwenden } from "@/lib/theme";
import "./styles.css";

anwenden(); // Thema/Schriftgrad vor dem ersten Render setzen

const wurzel = createRootRoute({ component: Layout });

const start = createRoute({ getParentRoute: () => wurzel, path: "/", component: DashboardPage });
const wissen = createRoute({
  getParentRoute: () => wurzel,
  path: "/wissen",
  component: WissenPage,
  validateSearch: (s: Record<string, unknown>) => ({
    kategorie: typeof s.kategorie === "string" && s.kategorie ? s.kategorie : undefined,
  }),
});
const artikel = createRoute({ getParentRoute: () => wurzel, path: "/artikel/$id", component: ArtikelPage });
const suche = createRoute({
  getParentRoute: () => wurzel,
  path: "/suche",
  component: SuchePage,
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
});
const assistent = createRoute({ getParentRoute: () => wurzel, path: "/assistent", component: AssistentPage });
const einstellungen = createRoute({ getParentRoute: () => wurzel, path: "/einstellungen", component: EinstellungenPage });

const routeTree = wurzel.addChildren([start, wissen, artikel, suche, assistent, einstellungen]);
// Hash-History: unabhängig vom Einhängepfad (Tauri, lokale Datei, Pages)
const router = createRouter({ routeTree, history: createHashHistory() });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
