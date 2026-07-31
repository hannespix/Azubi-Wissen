import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Aliase auf die geteilten Verzeichnisse des Navigators:
// @core (SQL-Migrationen), @knowledge (Markdown-Wissensbasis),
// @data (Seed-Daten wie Synonyme) — Single Source of Truth mit Rust-Seite.
export default defineConfig({
  // Relative Pfade: läuft im Tauri-Fenster, lokal UND unter Unterpfaden
  // (z. B. GitHub Pages /navigator/).
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@core": fileURLToPath(new URL("../core", import.meta.url)),
      "@knowledge": fileURLToPath(new URL("../knowledge", import.meta.url)),
      "@data": fileURLToPath(new URL("../data", import.meta.url))
    }
  },
  server: { port: 5173, strictPort: true },
  build: { chunkSizeWarningLimit: 1500 }
});
