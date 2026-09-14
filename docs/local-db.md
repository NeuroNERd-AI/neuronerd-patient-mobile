# Local data

SQLite is the patient-side operational source of truth after bootstrap. The database uses WAL mode and creates local profile, game result, reminder, memory, outbox, app state, and adaptive recommendation tables. The UI reads repositories rather than issuing SQL. Local game results are written before any remote attempt, and each queued mutation gets an immutable idempotency key.

Tokens remain in SecureStore. Patient cache is cleared on sign-out in the production hardening pass. Sensitive memory media is not uploaded by this milestone.
