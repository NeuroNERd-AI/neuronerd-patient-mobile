import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | undefined;
export function getDatabase() { dbPromise ??= SQLite.openDatabaseAsync('neuronerd.db'); return dbPromise; }
export async function migrateDatabase() {
  const db = await getDatabase();
  await db.execAsync(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS local_profile (id TEXT PRIMARY KEY NOT NULL, auth_user_id TEXT NOT NULL, display_name TEXT NOT NULL, locale TEXT NOT NULL, role TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS local_game_sessions (session_id TEXT PRIMARY KEY NOT NULL, client_event_id TEXT UNIQUE NOT NULL, game_key TEXT NOT NULL, difficulty TEXT NOT NULL, started_at TEXT NOT NULL, status TEXT NOT NULL, sync_state TEXT NOT NULL DEFAULT 'local');
    CREATE TABLE IF NOT EXISTS local_game_results (session_id TEXT PRIMARY KEY NOT NULL, client_event_id TEXT UNIQUE NOT NULL, game_key TEXT NOT NULL, difficulty TEXT NOT NULL, score REAL NOT NULL, max_score REAL NOT NULL, accuracy REAL NOT NULL, attempts INTEGER NOT NULL, duration_ms INTEGER NOT NULL, completed INTEGER NOT NULL, metrics_json TEXT NOT NULL, created_at TEXT NOT NULL, sync_state TEXT NOT NULL DEFAULT 'queued');
    CREATE TABLE IF NOT EXISTS local_reminders (id TEXT PRIMARY KEY NOT NULL, reminder_key TEXT UNIQUE NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, start_at TEXT NOT NULL, timezone TEXT NOT NULL, category TEXT NOT NULL, notification_id TEXT, is_active INTEGER NOT NULL DEFAULT 1, completed_today INTEGER NOT NULL DEFAULT 0, sync_state TEXT NOT NULL DEFAULT 'synced');
    CREATE TABLE IF NOT EXISTS local_memories (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, memory_type TEXT NOT NULL, created_at TEXT NOT NULL, sync_state TEXT NOT NULL DEFAULT 'queued');
    CREATE TABLE IF NOT EXISTS sync_outbox (id TEXT PRIMARY KEY NOT NULL, entity_type TEXT NOT NULL, operation TEXT NOT NULL, entity_id TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL, payload_json TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, state TEXT NOT NULL DEFAULT 'pending', next_attempt_at TEXT NOT NULL, last_error TEXT);
    CREATE TABLE IF NOT EXISTS adaptive_recommendations (id TEXT PRIMARY KEY NOT NULL, game_key TEXT NOT NULL, engine TEXT NOT NULL, engine_version TEXT NOT NULL, feature_schema_version TEXT NOT NULL, current_difficulty TEXT NOT NULL, recommended_difficulty TEXT NOT NULL, predicted_probability REAL, confidence REAL NOT NULL, fallback_reason TEXT, created_at TEXT NOT NULL);`);
  try { await db.execAsync('ALTER TABLE local_reminders ADD COLUMN notification_id TEXT'); } catch { /* already migrated */ }
}
export async function setState(key: string, value: string) { const db = await getDatabase(); await db.runAsync('INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)', key, value); }
export async function getState(key: string) { const db = await getDatabase(); const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_state WHERE key = ?', key); return row?.value; }
export async function clearPatientData() { const db = await getDatabase(); await db.withTransactionAsync(async () => { await db.execAsync('DELETE FROM local_profile; DELETE FROM local_game_sessions; DELETE FROM local_game_results; DELETE FROM local_reminders; DELETE FROM local_memories; DELETE FROM adaptive_recommendations; DELETE FROM sync_outbox; DELETE FROM app_state;'); }); }
