import type Database from '@tauri-apps/plugin-sql';

export type Migration = {
  version: number;
  description: string;
  up: (db: Database) => Promise<void>;
};

export const migrations: Migration[] = [
  {
    version: 1,
    description: 'Create initial tables',
    up: async (db) => {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS prompt_supporter (
          prompt_name    TEXT PRIMARY KEY,
          translation_text TEXT,
          search_word    TEXT,
          note           TEXT,
          favorite       INTEGER NOT NULL DEFAULT 0,
          copyrights     TEXT,
          updated_at     TEXT DEFAULT (datetime('now', 'localtime'))
        )
      `);
      await db.execute(`
        CREATE TABLE IF NOT EXISTS schema_version (
          version INTEGER PRIMARY KEY
        )
      `);
    },
  },
  {
    version: 2,
    description: "Add category column to prompt_supporter",
    up: async (db) => {
      // 移行済みDBにはすでにカラムが存在する場合があるため存在チェックを行う
      const columns = await db.select<{ name: string }[]>(
        `PRAGMA table_info(prompt_supporter)`
      );
      const hasCategory = columns.some((col) => col.name === 'category');
      if (!hasCategory) {
        await db.execute(`
          ALTER TABLE prompt_supporter ADD COLUMN category TEXT DEFAULT 'character'
        `);
      }
    },
  },
];
