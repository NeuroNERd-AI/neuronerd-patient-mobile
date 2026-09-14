import type { Difficulty, GameResult } from '../../types';
import type { GameKey } from '../../theme/tokens';

export type AdaptiveContext = {
  gameKey: GameKey;
  currentDifficulty: Difficulty;
  recentResults: Pick<GameResult, 'accuracy' | 'attempts' | 'durationMs' | 'completed' | 'difficulty'>[];
  consecutiveSuccesses: number;
  consecutiveFailures: number;
};
export type DifficultyRecommendation = { difficulty: Difficulty; predictedSuccessProbability?: number; confidence: number; rationale: string; engine: 'on-device-ml' | 'rules-fallback'; engineVersion: string; featureSchemaVersion: string; recommendationId: string; fallbackReason?: string };
export type AdaptiveEngine = { recommendNextDifficulty(context: AdaptiveContext): DifficultyRecommendation };
export const FEATURE_SCHEMA_VERSION = 'adaptive-features-v1';
