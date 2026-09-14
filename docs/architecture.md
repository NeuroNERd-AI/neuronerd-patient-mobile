# Current architecture

NeuroNERd is an Expo Router React Native application with presentation routes under `app/`, domain services under `src/domain/`, local SQLite repositories under `src/data/local/`, and Supabase adapters isolated under `src/data/remote/` and `src/services/auth/`. SQLite is the patient-side operational source of truth after bootstrap. The UI does not import Supabase directly.

The adaptive boundary is `AdaptiveEngine`; `OnDeviceMLAdaptiveEngine` evaluates a packaged, versioned logistic artifact offline and delegates to `LocalAdaptiveEngine` on invalid input, stale schema, insufficient history, or low confidence. No cloud AI is required.
