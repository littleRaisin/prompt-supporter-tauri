import Database from '@tauri-apps/plugin-sql';
import { migrations } from './migrations';

const DB_PATH = 'sqlite:prompt_supporter.db';

let _db: Database | null = null;

async function getCurrentVersion(db: Database): Promise<number> {
  try {
    const rows = await db.select<{ version: number }[]>(
      'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
    );
    return rows.length > 0 ? (rows[0]?.version ?? 0) : 0;
  } catch {
    return 0;
  }
}

async function runMigrations(db: Database): Promise<void> {
  const currentVersion = await getCurrentVersion(db);
  console.warn(`[DB] Current schema version: ${currentVersion}`);

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.warn(`[DB] Running migration v${migration.version}: ${migration.description}`);
      await migration.up(db);
      await db.execute(
        'INSERT OR REPLACE INTO schema_version (version) VALUES ($1)',
        [migration.version]
      );
    }
  }

  console.warn('[DB] All migrations completed.');
}

export async function initDb(): Promise<Database> {
  if (_db) return _db;

  const db = await Database.load(DB_PATH);

  // v1マイグレーションのためにschema_versionテーブルが存在しない場合を考慮し
  // まずinitial tablesを直接作成してからマイグレーションを走らせる
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    )
  `);

  await runMigrations(db);

  _db = db;
  return _db;
}

export async function getDb(): Promise<Database> {
  if (!_db) {
    throw new Error('[DB] Database is not initialized. Call initDb() first.');
  }
  return _db;
}
