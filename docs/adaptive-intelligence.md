# Adaptive intelligence

NeuroNERd uses an `AdaptiveEngine` interface so game screens remain independent of the recommendation implementation. The MVP primary implementation is `OnDeviceMLAdaptiveEngine`, a small logistic-regression inference path evaluated with TypeScript arithmetic and packaged as `assets/adaptive-models/v1.json`. It predicts next-session completion probability for each adjacent difficulty candidate and selects a gentle bounded recommendation.

The feature schema is `adaptive-features-v1`. It includes recent accuracy, normalized response time, normalized attempts, completion ratio, weighted recent performance, consecutive success/failure streaks, current difficulty, candidate difficulty, and a game-specific bias. Missing history reduces confidence. Recommendations are accepted only when the model artifact passes schema/range checks, there is enough recent activity, and confidence is at least 0.5.

`LocalAdaptiveEngine` is the mandatory offline fallback. It uses transparent thresholds and small one-tier changes based on the same activity context. It activates for model mismatch, malformed assets, insufficient history, or low confidence. Both paths are non-clinical: they do not diagnose dementia, classify severity, calculate risk, or claim cognitive change.

## Training and versioning

Training is offline and outside the mobile runtime. The checked-in `scripts/train_adaptive_model.py` accepts authorized JSONL feature rows, learns a compact model with deterministic gradient descent, and emits a versioned coefficient artifact. A future release must replace the development baseline with an approved de-identified/synthetic dataset, patient-independent evaluation split, calibration report, and model card. The app never downloads a model and never requires an AI or LLM API key.

Every recommendation logs engine, engine version, feature schema version, game key, current/recommended difficulty, probability when available, confidence, fallback reason, and recommendation ID. Logs are local-first and uploaded only through verified patient-scoped telemetry contracts.
