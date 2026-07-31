import { invoke } from "@tauri-apps/api/core";
import type { Article, ArticleSummary, Category, DataProvider, SearchHit } from "@/lib/types";

export function tauriProvider(): DataProvider {
  return {
    modus: "tauri",
    listCategories: () => invoke<Category[]>("list_categories"),
    listArticles: (kategorie) => invoke<ArticleSummary[]>("list_articles", { kategorie: kategorie ?? null }),
    getArticle: (id) => invoke<Article | null>("get_article", { id }),
    searchArticles: (eingabe, limit = 20) => invoke<SearchHit[]>("search_articles", { eingabe, limit }),
  };
}
