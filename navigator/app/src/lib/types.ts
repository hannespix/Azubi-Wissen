// Spiegel der navigator-core-Modelle (Rust) für das Frontend.
export interface Category {
  id: string;
  titel: string;
  beschreibung: string;
  artikel_anzahl: number;
}

export interface ArticleSummary {
  id: string;
  titel: string;
  kurz: string;
  kategorie_id: string;
  kategorie_titel: string;
  status: string;
  geprueft_am: string | null;
}

export interface Article extends ArticleSummary {
  region: string | null;
  quelle: string | null;
  inhalt_md: string;
  tags: string[];
  rechtsgrundlagen: string[];
}

export interface SearchHit {
  id: string;
  titel: string;
  kategorie_id: string;
  kategorie_titel: string;
  status: string;
  schnipsel: string;
}

export interface DataProvider {
  /** "tauri" = echte Desktop-App, "browser" = Vorschau mit sql.js */
  modus: "tauri" | "browser";
  listCategories(): Promise<Category[]>;
  listArticles(kategorie?: string): Promise<ArticleSummary[]>;
  getArticle(id: string): Promise<Article | null>;
  searchArticles(eingabe: string, limit?: number): Promise<SearchHit[]>;
}
