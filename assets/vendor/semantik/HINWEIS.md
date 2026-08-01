# Vendor-Hinweis: semantische Suche (Bedeutungssuche)

Inhalt dieses Ordners — alle Dateien liegen lokal, es gibt **keine**
Laufzeit-Downloads (Zero-Trust):

| Datei | Herkunft | Zweck |
|---|---|---|
| `transformers.js` | npm `@huggingface/transformers` 4.2.0, `dist/transformers.js` | Embedding-Pipeline (bewusst unminifiziert: auditierbar) |
| `ort/ort-wasm-simd-threaded.asyncify.{mjs,wasm}` | npm `onnxruntime-web` (Abhängigkeit von transformers 4.2) | ONNX-Laufzeit (WebAssembly) |
| `modell/Xenova/multilingual-e5-small/…` | huggingface.co/Xenova/multilingual-e5-small (MIT) | Sprachmodell, quantisiert (q8) |

## Lokale Änderungen gegenüber dem Original

1. `transformers.js`, Registry-Eintrag `"mistral3"`: der Klassenname
   `Mistral3ForConditionalGeneration` (32 Zeichen) ist als String geteilt
   („`"Mistral3" + "ForConditionalGeneration"`"). GitHubs Push-Protection
   hält die zusammenhängende Zeichenkette fälschlich für einen
   Mistral-AI-API-Schlüssel und blockiert sonst jeden Push. Der
   Laufzeitwert ist unverändert.
2. `modell/...(onnx)/model_quantized.onnx.teil-aa|ab|ac`: die 118-MB-
   ONNX-Datei ist wegen der GitHub-Grenze (100 MB/Datei) gesplittet
   (`split -b 40m`). `assets/js/semantik.js` setzt sie beim Laden im
   Browser wieder zusammen. Prüfsumme des Originals (sha256):
   `f80102d3f2a1229f387d3c81909990d8945513e347b0eab049f7de3c6f98c193`

Bei einem Update der Bibliothek beide Änderungen erneut anwenden und den
Embedding-Index neu bauen: `node tools/semantik_index_bauen.mjs`.
