# NeuroNERd Patient Mobile — Implementation Verification

**Verification scope:** patient-mobile repository only  
**Baseline:** commit `60311fb`  
**Verification date:** 2026-09-14  
**Backend changes:** none. Supabase verification was read-only.

## 1. Executive Summary

The implementation now passes static and unit validation and preserves the approved local-first, Supabase-isolated, on-device adaptive architecture. This hardening pass fixed the most important lifecycle defects: a game session is now created in SQLite before gameplay; result and outbox writes are transactional; reconnect/bootstrap triggers a single-flight sync; remote acknowledgement is required before local synced state; signed-out cache data is cleared; notification IDs are persisted; and the model’s declared normalization is applied and tested.

The application is **not yet ready for production release**. It is ready for **physical-device E2E testing** after a development build is produced. Object Recall and Pattern Sequence now have deterministic MVP flows, reminder events now have a local outbox/sync path, and adaptive recommendation rows are persisted. The adaptive artifact remains a development baseline, not a clinically validated or medically meaningful model.

## 2. Architecture Verification

| Approved requirement | Current implementation | Status | Evidence/files inspected | Gap / severity / recommended fix |
|---|---|---|---|---|
| Expo Router structure | Route groups `(auth)`, `(tabs)`, and `games/[gameKey]` with root bootstrap | PASS | `app/_layout.tsx`, `app/(auth)/*`, `app/(tabs)/*`, `app/games/[gameKey].tsx` | No known gap |
| Auth flow | Welcome → login → patient profile lookup; SecureStore Supabase session | PARTIAL | `app/(auth)/login.tsx`, `src/services/auth/supabase.ts`, `src/data/remote/patientRepository.ts` | Real account/session expiry needs device E2E; severity medium; test revoked sessions |
| Five-tab navigation | Home, Games, Memories, Reminders, Profile | PASS | `app/(tabs)/_layout.tsx` and five route files | No known gap |
| SQLite local-first architecture | WAL SQLite, local repositories, transactional session/result/outbox and reminder-event writes | PASS | `src/data/local/database.ts`, `src/data/local/repositories.ts` | Live device restart remains untested |
| SecureStore auth persistence | Supabase auth storage adapter uses Expo SecureStore; no password storage | PASS | `src/services/auth/supabase.ts` | No known gap |
| Repository/data separation | SQL is confined to local repositories/database; UI uses repositories | PASS | `src/data/local/*`, route files | `as any` in remote adapter is a typing limitation, not a boundary bypass |
| Supabase adapter isolation | Remote access lives in `src/data/remote` and auth/sync services | PASS | `src/data/remote/patientRepository.ts`, `src/services/sync/coordinator.ts` | No raw UI calls found |
| Durable outbox | Pending item has ID, operation, idempotency key, payload, attempts, retry time, error; game and reminder-event operations use it | PASS | `database.ts`, `repositories.ts`, `coordinator.ts` | Live reconnect remains untested |
| Idempotent synchronization | Session upsert by `client_event_id`; result upsert by `game_session_id`; local ack after both | PASS | `coordinator.ts`, `docs/supabase-contract-audit.md` | Device/network retry E2E remains |
| Three MVP games | Memory Match, multi-round Object Recall, and deterministic multi-round Pattern Sequence use common lifecycle/persistence | PASS | `app/(tabs)/games.tsx`, `app/games/[gameKey].tsx`, `src/domain/games/content.ts` | Device interaction testing remains |
| AdaptiveEngine abstraction | Shared `AdaptiveEngine` contract and two implementations | PASS | `src/domain/adaptive/types.ts`, `fallback.ts`, `onDeviceModel.ts` | No known gap |
| On-device ML | Executable logistic inference, model artifact, validation, normalization, confidence, bounded candidate set | PASS | `onDeviceModel.ts`, `assets/adaptive-models/v1.json`, tests | Artifact is development baseline only |
| Deterministic fallback | Explainable threshold engine handles invalid/low-confidence inputs | PASS | `fallback.ts`, adaptive tests | Recommendation IDs are unique rather than deterministic; decision itself is deterministic |
| Recommendation/version logging | Recommendation metadata is inserted into `adaptive_recommendations` and included in result metrics | PASS | `src/data/local/repositories.ts`, `app/games/[gameKey].tsx`, `database.ts` | Device persistence remains untested |
| Notifications | Permission-aware local schedule, ID persistence, cancellation, offline completion | PASS | `src/services/notifications/index.ts`, database migration | Delivery receipt intentionally not claimed |
| Voice/TTS | Optional `VoiceService` TTS with independent text fallback | PASS | `src/services/voice/index.ts`, `docs/voice.md` | Recognition intentionally not implemented |
| Four-language i18n | English/Hindi/Assamese/Bengali catalog with fallback | PASS | `src/i18n/index.ts`, `docs/localization.md` | Full copy coverage/device string testing remains |
| Accessibility architecture | Large targets, labels/roles, no required countdowns, theme modes | PARTIAL | `src/components/ui/index.tsx`, theme tokens, route screens | Focus order, TalkBack, and full large-text reflow require device testing |
| Documentation | Architecture, auth, sync, security, game, adaptive, model, localization, voice, testing, limitations, audit, verification docs | PASS | `docs/` | Current limitations are explicitly recorded |
| Security boundaries | No privileged/AI keys, SecureStore session, no backend changes, patient lookup and RLS-aware adapter | PASS | `.env.example`, auth/sync adapters, security audit | Backend advisor findings remain a blocked external follow-up |

## 3. Offline-First Verification

| Lifecycle check | Status | Evidence / finding |
|---|---|---|
| Session created locally before gameplay | VERIFIED | `startGame()` awaits `createGameSession()` before enabling choices |
| Gameplay does not require network | VERIFIED | Game state and scoring are local; remote adapter is not called during play |
| Results persisted locally | VERIFIED | `saveGameResult()` writes result and updates session in one SQLite transaction |
| Durable outbox placement | VERIFIED | Same transaction inserts a `game_result` outbox item with `clientEventId` idempotency key |
| Restart retention | VERIFIED by design / not device-tested | SQLite pending rows are not deleted on process exit; physical process-kill test remains |
| Reconnect sync | VERIFIED statically | `startSyncMonitor()` listens to NetInfo; bootstrap also flushes |
| Safe retries and duplicate resistance | VERIFIED statically | `flushing` single-flight guard plus remote unique-key upserts |
| Local state retained before acknowledgement | VERIFIED | Local result/outbox are marked synced only after session and result remote writes succeed |
| Retryable failure | VERIFIED | Attempts, bounded error, and future retry time are retained |
| Calm UX messaging | VERIFIED | `OfflineBanner` says activities are saved safely; no technical error shown to patients |

## 4. Supabase/RLS Verification

The prior read-only audit confirmed the shared project URL, patient relationship path (`profiles.auth_user_id → patients.profile_id`), RLS presence, unique session/result constraints, and patient-scoped write boundaries. The mobile code uses only the publishable key convention and does not include service-role or AI-provider credentials. The sync adapter resolves the current authenticated patient and game before writing.

**PARTIALLY VERIFIED:** live account behavior, revoked-session behavior, and RLS acceptance of every exact payload require a development build and authorized test account. **BLOCKED:** security-advisor findings around existing `SECURITY DEFINER` helpers and leaked-password protection are backend-owned and were not changed.

## 5. Game Verification

| Game | Verified | Current gap |
|---|---|---|
| Memory Match | Intro, ready/start, pause, pair selection, incorrect pair handling, completion/result route, common local persistence, adaptive invocation | No physical interaction test; content is fixed demo content |
| Object Recall | Calm viewing phase, explicit recall transition, familiar local objects, multi-select scoring, three rounds, incorrect/omitted metrics, result persistence, adaptive invocation | Physical-device interaction remains to be tested |
| Pattern Sequence | Deterministic generated sequences, missing-next-item presentation, answer choices, live feedback/explanation, five rounds, result persistence, adaptive invocation | Physical-device interaction remains to be tested |

All three use the common repository persistence and adaptive path; they do not each implement their own sync logic.

## 6. Adaptive ML Verification

`OnDeviceMLAdaptiveEngine` performs logistic-regression inference using a ten-feature vector: accuracy, normalized response time, normalized attempts, completion, weighted recent performance, success/failure streaks, current difficulty, candidate difficulty, and game bias. The packaged artifact is versioned (`logistic-v1.0.0`) and declares `adaptive-features-v1`. Inputs are explicitly rejected when required numeric features are missing or invalid. Candidate difficulty is restricted to the current tier or one adjacent tier. Confidence is calculated and low-confidence/insufficient-history paths use `LocalAdaptiveEngine`.

The training script is dependency-free and emits a versioned JSON artifact. The model card explicitly says the artifact is a development baseline and has no clinical use. The system makes no diagnosis, severity classification, risk score, or medical claim. Inference is offline and no AI/LLM API key is needed.

**Remaining gap:** recommendation metadata is included in game result metrics but is not yet inserted into `adaptive_recommendations`; severity medium. Add that repository write before release.

## 7. Auth/Security Verification

SecureStore-backed Supabase persistence is present. On bootstrap, the app restores the session and resolves the patient. On `SIGNED_OUT`, local patient tables and app state are cleared. The codebase scan found no service-role key, AI key, password, token literal, or unsafe credential logging. The UI presents generic sign-in failure text. No AsyncStorage authentication use, RLS bypass, or direct UI Supabase query was found.

**Remaining gap:** real expired/revoked session and cross-account cache isolation need authorized physical-device testing.

## 8. Accessibility/UX Verification

The implementation retains the approved cream/green/coral/brown palette, large typography, 56dp controls, icon-plus-text tab labels, explicit accessibility labels/roles, no required timer, pause control, empty states, and calm offline copy. Large/high-contrast theme tokens exist.

**PARTIALLY VERIFIED:** long Hindi/Assamese/Bengali strings, TalkBack focus order, small-screen reflow, and high-contrast visual behavior require device or emulator inspection. No redesign was made.

## 9. Notifications/Voice Verification

The local notification adapter is permission-aware and persists notification IDs. Permission denial does not block in-app reminders. Scheduling is not treated as delivery. Reminder completion can be recorded offline. Voice is optional TTS with text controls as the independent fallback; no recognition or cloud voice service was added.

## 10. Test Results

| Check | Result |
|---|---|
| `npm run typecheck` | PASS after hardening fixes |
| `npm test` | PASS — 13 tests across adaptive, game-content, and reminder-sync contracts |
| `npm run lint` | PASS — zero warnings/errors after hardening |
| `npx expo-doctor` | PASS — 21/21 checks |
| `npx expo config --type public` | PASS in baseline |
| `git diff --check` | PASS after final edits |
| Credential scan | PASS — no privileged or AI key patterns found |
| Physical-device E2E | NOT PERFORMED |

## 11. Issues Fixed

The hardening pass fixed pre-play local session creation, transactional result/outbox persistence, reconnect-triggered sync, single-flight sync, retry error persistence, local synced-state acknowledgement, sign-out cache clearing, bootstrap identity persistence, notification ID storage, offline reminder completion, declared ML normalization, model artifact validation, explicit missing-feature handling, and expanded adaptive tests.

## 12. Remaining Limitations

The adaptive artifact is a development baseline and not clinically validated. Reminder-event sync depends on a real remote reminder ID accepted by the existing RLS contract; the seeded demo reminder intentionally remains retryable rather than inventing a backend record. Full device accessibility, session revocation, process-death retry, notification behavior, and live RLS payload tests remain.

## 13. Release Blockers

1. Replace or formally approve the development adaptive artifact with documented authorized training/evaluation evidence.
2. Complete physical-device accessibility, offline process-death, auth expiry, notification, reminder retry, and RLS E2E checks.
3. Validate the live `reminder_events` contract using a real remote reminder ID; no backend change is currently required.

## 14. Recommended Next Milestone

Create a development build and run the approved physical-device matrix using a dedicated patient test account: online bootstrap, airplane-mode game completion, process kill/restart, reconnect retry, duplicate submission, sign-out/sign-in as another test patient, notification permission denial, TalkBack, large text, high contrast, and all four locales. Do not modify Supabase during this milestone; record any backend mismatch as a blocked finding for a separate approved backend change.

## 15. Physical-device E2E validation status

The complete PASS/FAIL/BLOCKED/NOT TESTED matrix is recorded in [`docs/e2e-validation.md`](./e2e-validation.md). The repository was prebuilt for Android locally, but the sandbox has no Android SDK, `adb`, emulator, Gradle installation, or connected physical device. Consequently, APK creation and every physical-device row remain **BLOCKED** or **NOT TESTED**. No physical-device result is claimed.

## 16. Interaction and product polish milestone

The interaction audit is recorded in [`docs/interaction-checklist.md`](./interaction-checklist.md). Home now reads local reminders and completed game results; Memory Match has a real shuffled card grid and matching feedback; Object Recall and Pattern Sequence retain their offline multi-round flows with clearer feedback; reminders support completion, undo, sync status, and local notification requests; Memories has a text-first save form; Profile preferences persist locally; and Help/About is a real route. These changes are locally typechecked/linted and covered by 15 automated tests. Device interaction, notification delivery, accessibility services, and locale rendering remain not physically tested.
