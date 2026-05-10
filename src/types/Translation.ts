export type Category = 'character' | 'tag' | 'copyright';

export type Translation = {
  prompt_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  /** NOT NULL DEFAULT 0 のため常に存在する */
  favorite: 0 | 1;
  copyrights?: string;
  /** DEFAULT 'character' のため常に存在する */
  category: Category;
  updated_at?: string;
};

export type TranslationList = Translation[];

export type SearchCategories = {
  character: boolean;
  tag: boolean;
  copyright: boolean;
};
