import type { AdaptiveContext, AdaptiveEngine, DifficultyRecommendation } from './types';
import { FEATURE_SCHEMA_VERSION } from './types';
import type { Difficulty } from '../../types';

const levels: Difficulty[] = ['easy', 'medium', 'hard'];
const id = () => `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
export class LocalAdaptiveEngine implements AdaptiveEngine {
  readonly version = 'rules-v1';
  recommendNextDifficulty(context: AdaptiveContext): DifficultyRecommendation {
    const latest = context.recentResults[context.recentResults.length - 1];
    const history = context.recentResults.slice(-5);
    const avgAccuracy = history.length ? history.reduce((sum, item) => sum + item.accuracy, 0) / history.length : 0.5;
    const avgAttempts = history.length ? history.reduce((sum, item) => sum + item.attempts, 0) / history.length : 1;
    let delta = 0;
    if (avgAccuracy >= 0.82 && context.consecutiveSuccesses >= 2 && avgAttempts <= 2) delta = 1;
    if (avgAccuracy < 0.55 || context.consecutiveFailures >= 2 || latest?.completed === false) delta = -1;
    const currentIndex = levels.indexOf(context.currentDifficulty);
    const difficulty = levels[Math.max(0, Math.min(levels.length - 1, currentIndex + delta))];
    const rationale = delta > 0 ? 'You have been doing well, so we will gently add a little challenge.' : delta < 0 ? 'We will make the next activity a little gentler.' : 'We will keep a comfortable pace for the next activity.';
    return { difficulty, confidence: history.length >= 3 ? 0.72 : 0.42, rationale, engine: 'rules-fallback', engineVersion: this.version, featureSchemaVersion: FEATURE_SCHEMA_VERSION, recommendationId: id() };
  }
}
