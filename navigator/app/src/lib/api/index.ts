// Datenzugriff mit zwei Treibern:
//  - Tauri (Desktop): IPC-Kommandos -> navigator-core (Rust, maßgeblich)
//  - Browser-Vorschau: sql.js (SQLite-WASM) mit denselben Migrationen und
//    derselben Markdown-Wissensbasis. Dient Entwicklung/Tests ohne Desktop-
//    Build; fachlich maßgeblich bleibt die Rust-Implementierung.
import type { DataProvider } from "@/lib/types";

let instanz: Promise<DataProvider> | null = null;

export function datenquelle(): Promise<DataProvider> {
  if (!instanz) {
    instanz = (async () => {
      if ("__TAURI_INTERNALS__" in window) {
        const { tauriProvider } = await import("./tauri");
        return tauriProvider();
      }
      const { browserProvider } = await import("./browser");
      return browserProvider();
    })();
  }
  return instanz;
}
