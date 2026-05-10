import { getDb } from './index';
import type { Translation, Category, SearchCategories } from '../types/Translation';

// ---- 型定義 ----

export type PaginatedResult<T> = {
  items: T[];
  total: number;
};

export type UpsertInput = {
  promptName: string;
  translationText?: string;
  searchWord?: string;
  note?: string;
  favorite?: 0 | 1;
  copyrights?: string;
  category?: Category;
};

export type SearchInput = {
  keyword: string;
  categories: SearchCategories;
  limit: number;
  page: number;
};

// ---- クエリ関数 ----

/** prompt_name で1件取得 */
export async function getTranslation(promptName: string): Promise<Translation | null> {
  const db = await getDb();
  const rows = await db.select<Translation[]>(
    'SELECT * FROM prompt_supporter WHERE prompt_name = $1',
    [promptName]
  );
  return rows[0] ?? null;
}

/** お気に入り一覧（character 固定）をページネーションで取得 */
export async function getFavoriteList(
  limit: number,
  page: number
): Promise<PaginatedResult<Translation>> {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const items = await db.select<Translation[]>(
    `SELECT * FROM prompt_supporter
     WHERE favorite = 1 AND category = 'character'
     ORDER BY updated_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const [{ total }] = await db.select<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM prompt_supporter
     WHERE favorite = 1 AND category = 'character'`
  );
  return { items, total };
}

/** カテゴリ別お気に入り一覧をページネーションで取得 */
export async function getFavoriteListByCategory(
  limit: number,
  page: number,
  category: Category
): Promise<PaginatedResult<Translation>> {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const items = await db.select<Translation[]>(
    `SELECT * FROM prompt_supporter
     WHERE favorite = 1 AND category = $1
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
    [category, limit, offset]
  );
  const [{ total }] = await db.select<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM prompt_supporter
     WHERE favorite = 1 AND category = $1`,
    [category]
  );
  return { items, total };
}

/** キーワード + カテゴリで検索（ページネーション対応） */
export async function searchTranslations(
  input: SearchInput
): Promise<PaginatedResult<Translation>> {
  const db = await getDb();
  const { keyword, categories, limit, page } = input;
  const offset = (page - 1) * limit;
  const kw = `%${keyword}%`;

  // カテゴリ条件を動的に構築
  const categoryConditions: string[] = [];
  if (categories.character) categoryConditions.push("category = 'character'");
  if (categories.tag) categoryConditions.push("category = 'tag'");
  if (categories.copyright) categoryConditions.push("category = 'copyright'");

  const categoryClause =
    categoryConditions.length > 0
      ? `AND (${categoryConditions.join(' OR ')})`
      : '';

  const baseWhere = `
    WHERE (
      prompt_name       LIKE $1 OR
      translation_text  LIKE $1 OR
      search_word       LIKE $1 OR
      note              LIKE $1 OR
      copyrights        LIKE $1
    ) ${categoryClause}
  `;

  const items = await db.select<Translation[]>(
    `SELECT * FROM prompt_supporter ${baseWhere}
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
    [kw, limit, offset]
  );
  const [{ total }] = await db.select<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM prompt_supporter ${baseWhere}`,
    [kw]
  );
  return { items, total };
}

/** 追加または更新 */
export async function upsertTranslation(input: UpsertInput): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO prompt_supporter
       (prompt_name, translation_text, search_word, note, favorite, copyrights, category, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, datetime('now', 'localtime'))
     ON CONFLICT(prompt_name) DO UPDATE SET
       translation_text = excluded.translation_text,
       search_word      = excluded.search_word,
       note             = excluded.note,
       favorite         = excluded.favorite,
       copyrights       = excluded.copyrights,
       category         = excluded.category,
       updated_at       = datetime('now', 'localtime')`,
    [
      input.promptName,
      input.translationText ?? null,
      input.searchWord ?? null,
      input.note ?? null,
      input.favorite ?? 0,
      input.copyrights ?? null,
      input.category ?? 'character',
    ]
  );
}

/** 削除 */
export async function deleteTranslation(promptName: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    'DELETE FROM prompt_supporter WHERE prompt_name = $1',
    [promptName]
  );
}
