import type { AdaptiveContext, AdaptiveEngine, DifficultyRecommendation } from './types';
import { FEATURE_SCHEMA_VERSION } from './types';
import type { Difficulty } from '../../types';
import model from '../../../assets/adaptive-models/v1.json';
import { LocalAdaptiveEngine } from './fallback';

const levels: Difficulty[] = ['easy', 'medium', 'hard'];
const id = () => `mlrec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
function features(context: AdaptiveContext, candidate: Difficulty) {
  const history = context.recentResults.slice(-5);
  const recentAccuracy = history.length ? history.reduce((s, r) => s + r.accuracy, 0) / history.length : 0.5;
  const avgResponse = history.length ? history.reduce((s, r) => s + Math.min(r.durationMs / 120000, 1), 0) / history.length : 0.5;
  const avgAttempts = history.length ? history.reduce((s, r) => s + Math.min(r.attempts / 10, 1), 0) / history.length : 0.2;
  const completion = history.length ? history.filter((r) => r.completed).length / history.length : 0.5;
  const recentPerformance = history.length ? history.reduce((s, r, index) => s + r.accuracy * (index + 1), 0) / history.reduce((s, _, index) => s + index + 1, 0) : 0.5;
  const current = levels.indexOf(context.currentDifficulty) / 2;
  const candidateLevel = levels.indexOf(candidate) / 2;
  const successStreak = clamp(context.consecutiveSuccesses / 5);
  const failureStreak = clamp(context.consecutiveFailures / 5);
  const gameBias = context.gameKey === 'memory-match' ? 0.03 : context.gameKey === 'object-recall' ? 0 : -0.02;
  return [recentAccuracy, 1 - avgResponse, 1 - avgAttempts, completion, recentPerformance, successStreak, failureStreak, current, candidateLevel, gameBias];
}
export class OnDeviceMLAdaptiveEngine implements AdaptiveEngine {
  private fallback = new LocalAdaptiveEngine();
  recommendNextDifficulty(context: AdaptiveContext): DifficultyRecommendation {
    try {
      if (model.schemaVersion !== FEATURE_SCHEMA_VERSION || !Array.isArray(model.weights) || model.weights.length !== 10) throw new Error('model schema mismatch');
      const currentIndex = levels.indexOf(context.currentDifficulty);
      const candidates = levels.filter((_, index) => Math.abs(index - currentIndex) <= 1);
      const scored = candidates.map((candidate) => {
        const x = features(context, candidate);
        const z = model.bias + model.weights.reduce((sum, weight, index) => sum + weight * x[index], 0);
        const probability = 1 / (1 + Math.exp(-z));
        return { candidate, probability };
      });
      const target = 0.72;
      const chosen = scored.sort((a, b) => Math.abs(a.probability - target) - Math.abs(b.probability - target))[0];
      const confidence = clamp(0.45 + Math.min(context.recentResults.length, 5) * 0.08 - Math.abs(chosen.probability - target) * 0.4);
      if (confidence < 0.5 || context.recentResults.length < 2) throw new Error('insufficient confidence');
      return { difficulty: chosen.candidate, predictedSuccessProbability: Number(chosen.probability.toFixed(3)), confidence: Number(confidence.toFixed(3)), rationale: 'A small offline learning model selected a comfortable next step from your recent activity.', engine: 'on-device-ml', engineVersion: model.modelVersion, featureSchemaVersion: FEATURE_SCHEMA_VERSION, recommendationId: id() };
    } catch (error) {
      const fallback = this.fallback.recommendNextDifficulty(context);
      return { ...fallback, fallbackReason: error instanceof Error ? error.message : 'model unavailable' };
    }
  }
}
