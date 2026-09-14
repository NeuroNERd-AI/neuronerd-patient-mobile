# Model card: adaptive baseline logistic model

**Model version:** `logistic-v1.0.0`  
**Task:** estimate the probability of completing the next patient-paced game session at an adjacent difficulty.  
**Runtime:** deterministic on-device TypeScript inference.  
**Clinical use:** none.

This repository contains a development baseline artifact to prove the packaging and fallback path. It is not a clinical model, does not infer dementia or severity, and must not be described as an assessment. Before a public demo or release, replace it with an artifact trained from an authorized, de-identified or synthetic dataset and record the data provenance, split strategy, calibration, and limitations here.

The feature vector is versioned and includes activity-only signals: accuracy, response time, attempts, completion, recent performance, consecutive success/failure, current difficulty, candidate difficulty, and game-specific performance. Demographic, clinical, diagnosis, severity, and unrelated behavioral features are excluded. A bounded one-tier recommendation and deterministic fallback protect against overconfident changes.
