# Game engine

The game route uses the shared `createGameSession` and `saveGameResult` repository APIs, so persistence and synchronization are not duplicated per game. It creates a local session before play, keeps gameplay local, calculates normalized activity metrics, obtains an adaptive recommendation, and writes the completed result to SQLite/outbox.

The current demo-level game content supports the three required game keys and pause/re-entry behavior. Memory Match supports pair selection and incorrect pairs. Object Recall currently uses a selection interaction over familiar objects but does not yet implement a distinct timed viewing-to-selection phase. Pattern Sequence currently presents a fixed sequence interaction rather than generated content. These are documented release limitations rather than clinical functionality.
