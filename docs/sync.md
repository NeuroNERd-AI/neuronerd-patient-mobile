# Synchronization

Completed game results are written locally in a SQLite transaction together with a durable outbox row keyed by `client_event_id`. The game session is created locally before gameplay, and the result updates the local session before the outbox is acknowledged. Reconnect and authenticated bootstrap trigger a single-flight outbox flush through NetInfo.

The current game sync adapter resolves the authenticated patient and game IDs from Supabase, upserts `game_sessions` by unique `client_event_id`, then upserts `game_results` by unique `game_session_id`. Only after both remote writes succeed are the local result and outbox marked synced. Failures increment attempts, preserve the pending item, record a bounded error, and schedule a retry. A future hardening milestone should add a dedicated local reminder-event outbox mapper; reminder completion is currently retained locally and documented as a limitation.
