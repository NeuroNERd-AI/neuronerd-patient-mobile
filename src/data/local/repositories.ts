import { getDatabase } from './database';
import type { GameResult, Memory, Reminder } from '../../types';

const id = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
export async function createGameSession(gameKey: GameResult['gameKey'], difficulty: GameResult['difficulty']) {
  const db = await getDatabase(); const sessionId = id('session'); const clientEventId = id('session_event'); const startedAt = new Date().toISOString();
  await db.runAsync('INSERT INTO local_game_sessions (session_id, client_event_id, game_key, difficulty, started_at, status, sync_state) VALUES (?, ?, ?, ?, ?, ?, ?)', sessionId, clientEventId, gameKey, difficulty, startedAt, 'started', 'local');
  return { sessionId, clientEventId, startedAt };
}
export async function saveGameResult(result: GameResult) {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT OR REPLACE INTO local_game_results (session_id, client_event_id, game_key, difficulty, score, max_score, accuracy, attempts, duration_ms, completed, metrics_json, created_at, sync_state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', result.sessionId, result.clientEventId, result.gameKey, result.difficulty, result.score, result.maxScore, result.accuracy, result.attempts, result.durationMs, result.completed ? 1 : 0, JSON.stringify(result.metrics), result.createdAt, result.syncState);
    await db.runAsync("UPDATE local_game_sessions SET status = ?, sync_state = ? WHERE session_id = ?", result.completed ? 'completed' : 'abandoned', result.syncState, result.sessionId);
    await db.runAsync('INSERT OR IGNORE INTO sync_outbox (id, entity_type, operation, entity_id, idempotency_key, payload_json, next_attempt_at) VALUES (?, ?, ?, ?, ?, ?, ?)', result.clientEventId, 'game_result', 'create', result.sessionId, result.clientEventId, JSON.stringify(result), result.createdAt);
  });
}
export async function listGameResults() { const db = await getDatabase(); return db.getAllAsync<GameResult>('SELECT session_id as sessionId, client_event_id as clientEventId, game_key as gameKey, difficulty, score, max_score as maxScore, accuracy, attempts, duration_ms as durationMs, completed, metrics_json as metrics, created_at as createdAt, sync_state as syncState FROM local_game_results ORDER BY created_at DESC LIMIT 20'); }
export async function saveMemory(memory: Memory) { const db = await getDatabase(); await db.runAsync('INSERT OR REPLACE INTO local_memories (id, title, description, memory_type, created_at, sync_state) VALUES (?, ?, ?, ?, ?, ?)', memory.id, memory.title, memory.description, memory.type, memory.createdAt, memory.syncState); }
export async function listMemories() { const db = await getDatabase(); return db.getAllAsync<Memory>('SELECT id, title, description, memory_type as type, created_at as createdAt, sync_state as syncState FROM local_memories ORDER BY created_at DESC'); }
export async function seedReminders() { const db = await getDatabase(); const count = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM local_reminders'); if (!count?.count) await db.runAsync('INSERT INTO local_reminders (id, reminder_key, title, message, start_at, timezone, category) VALUES (?, ?, ?, ?, ?, ?, ?)', 'demo-reminder', 'morning-water', 'Drink some water', 'A small glass is a good start.', new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone, 'hydration'); }
export async function listReminders() { const db = await getDatabase(); return db.getAllAsync<Reminder>('SELECT id, reminder_key as key, title, message, start_at as startAt, timezone, category, is_active as isActive, completed_today as completedToday, sync_state as syncState FROM local_reminders ORDER BY start_at'); }
