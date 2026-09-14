import type { AdaptiveContext, AdaptiveEngine, DifficultyRecommendation } from './types';
import { FEATURE_SCHEMA_VERSION } from './types';
import type { Difficulty } from '../../types';
import packagedModel from '../../../assets/adaptive-models/v1.json';
import { LocalAdaptiveEngine } from './fallback';

type Normalization = { durationMs?: { min: number; max: number }; attempts?: { min: number; max: number } };
type ModelArtifact = { modelVersion: string; schemaVersion: string; bias: number; weights: number[]; normalization?: Normalization };
const levels: Difficulty[] = ['easy', 'medium', 'hard'];
const id = () => `mlrec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const normalize = (value: number, min: number, max: number) => max > min ? clamp((value - min) / (max - min)) : 0;
export function buildAdaptiveFeatures(context: AdaptiveContext, candidate: Difficulty, normalization: Normalization = packagedModel.normalization) {
  const history = context.recentResults.slice(-5);
  if (history.some((r) => ![r.accuracy, r.attempts, r.durationMs].every(Number.isFinite))) throw new Error('missing or invalid activity features');
  const recentAccuracy = history.length ? history.reduce((s, r) => s + clamp(r.accuracy), 0) / history.length : 0.5;
  const duration = normalization?.durationMs ?? { min: 0, max: 120000 };
  const attempts = normalization?.attempts ?? { min: 0, max: 10 };
  const avgResponse = history.length ? history.reduce((s, r) => s + normalize(r.durationMs, duration.min, duration.max), 0) / history.length : 0.5;
  const avgAttempts = history.length ? history.reduce((s, r) => s + normalize(r.attempts, attempts.min, attempts.max), 0) / history.length : 0.2;
  const completion = history.length ? history.filter((r) => r.completed).length / history.length : 0.5;
  const recentPerformance = history.length ? history.reduce((s, r, index) => s + clamp(r.accuracy) * (index + 1), 0) / history.reduce((s, _, index) => s + index + 1, 0) : 0.5;
  const current = levels.indexOf(context.currentDifficulty) / 2;
  const candidateLevel = levels.indexOf(candidate) / 2;
  const gameBias = context.gameKey === 'memory-match' ? 0.03 : context.gameKey === 'object-recall' ? 0 : -0.02;
  return [recentAccuracy, 1 - avgResponse, 1 - avgAttempts, completion, recentPerformance, clamp(context.consecutiveSuccesses / 5), clamp(context.consecutiveFailures / 5), current, candidateLevel, gameBias];
}
function validArtifact(model: ModelArtifact) { return Boolean(model?.modelVersion && model.schemaVersion === FEATURE_SCHEMA_VERSION && Number.isFinite(model.bias) && Array.isArray(model.weights) && model.weights.length === 10 && model.weights.every(Number.isFinite)); }
export class OnDeviceMLAdaptiveEngine implements AdaptiveEngine {
  private fallback = new LocalAdaptiveEngine();
  constructor(private readonly model: ModelArtifact = packagedModel) {}
  recommendNextDifficulty(context: AdaptiveContext): DifficultyRecommendation {
    try {
      if (!validArtifact(this.model)) throw new Error('model schema mismatch or invalid coefficients');
      const currentIndex = levels.indexOf(context.currentDifficulty); if (currentIndex < 0) throw new Error('unsupported difficulty');
      const candidates = levels.filter((_, index) => Math.abs(index - currentIndex) <= 1);
      const scored = candidates.map((candidate) => { const x = buildAdaptiveFeatures(context, candidate, this.model.normalization); const z = this.model.bias + this.model.weights.reduce((sum, weight, index) => sum + weight * x[index], 0); return { candidate, probability: 1 / (1 + Math.exp(-z)) }; });
      const target = 0.72; const chosen = scored.sort((a, b) => Math.abs(a.probability - target) - Math.abs(b.probability - target))[0];
      const confidence = clamp(0.45 + Math.min(context.recentResults.length, 5) * 0.08 - Math.abs(chosen.probability - target) * 0.4);
      if (confidence < 0.5 || context.recentResults.length < 2) throw new Error('insufficient confidence');
      return { difficulty: chosen.candidate, predictedSuccessProbability: Number(chosen.probability.toFixed(3)), confidence: Number(confidence.toFixed(3)), rationale: 'A small offline learning model selected a comfortable next step from your recent activity.', engine: 'on-device-ml', engineVersion: this.model.modelVersion, featureSchemaVersion: FEATURE_SCHEMA_VERSION, recommendationId: id() };
    } catch (error) { const fallback = this.fallback.recommendNextDifficulty(context); return { ...fallback, fallbackReason: error instanceof Error ? error.message : 'model unavailable' }; }
  }
}
