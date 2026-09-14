# Game engine

The three game routes use shared `createGameSession`, adaptive recommendation, `logAdaptiveRecommendation`, and `saveGameResult` repository APIs. Persistence and synchronization are not duplicated per game. A local session is created before play, gameplay remains offline, and completed results are written transactionally to SQLite and the durable outbox.

**Memory Match** now uses a shuffled eight-card grid with face-down/face-up states, four familiar pairs, matched states, incorrect-match feedback, attempt tracking, and a completion summary. **Object Recall** has a calm viewing phase, explicit recall transition, familiar local objects, multi-select recall, three rounds, correct/incorrect/omitted metrics, and accessible checkbox states. **Pattern Sequence** generates deterministic local sequences, hides the next item behind a question mark, offers answer choices, provides live feedback/explanation, and runs five rounds without a countdown.

The result message reports activity progress, attempts, and a non-clinical adaptive explanation. The UI does not expose probabilities, model confidence, cognitive scores, diagnosis, or medical claims. Physical-device interaction remains a separate validation step.
