# Game engine

The three game routes use shared `createGameSession`, adaptive recommendation, `logAdaptiveRecommendation`, and `saveGameResult` repository APIs. Persistence and synchronization are not duplicated per game. A local session is created before play, gameplay remains offline, and completed results are written transactionally to SQLite and the durable outbox.

**Memory Match** uses the existing pair-selection flow. **Object Recall** now has a calm viewing phase, an explicit “I am ready to recall” transition, familiar local objects, multi-select recall, three rounds, correct/incorrect/omitted metrics, and accessible checkbox states. **Pattern Sequence** now generates deterministic local sequences, hides the next item behind a question mark, offers answer choices, provides live feedback/explanation, and runs five rounds without a countdown.

All games remain activity-only and make no diagnosis, severity, risk, or medical claims. The adaptive engine is shared and non-clinical.
