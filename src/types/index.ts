import type { GameKey } from '../theme/tokens';

export type Locale = 'en' | 'hi' | 'as' | 'bn';
export type SyncState = 'local' | 'queued' | 'synced' | 'failed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Profile = { id: string; authUserId: string; displayName: string; locale: Locale; role: 'patient' | 'caregiver' | 'healthcare_worker' | 'admin' };
export type GameResult = { gameKey: GameKey; sessionId: string; clientEventId: string; difficulty: Difficulty; score: number; maxScore: number; accuracy: number; attempts: number; durationMs: number; completed: boolean; metrics: Record<string, unknown>; createdAt: string; syncState: SyncState };
export type Reminder = { id: string; key: string; title: string; message: string; startAt: string; timezone: string; isActive: boolean; category: 'medicine' | 'hydration' | 'daily_activity' | 'appointment' | 'custom'; completedToday?: boolean; syncState: SyncState };
export type Memory = { id: string; title: string; description: string; type: string; createdAt: string; syncState: SyncState };
export type AppPreferences = { locale: Locale; theme: 'default' | 'large' | 'highContrast'; sound: boolean; notifications: boolean };
