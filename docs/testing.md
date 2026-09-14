# Testing

Automated checks include TypeScript, ESLint, Expo Doctor/config validation, deterministic Object Recall and Pattern Sequence content tests, Memory Match contract coverage, reminder-event payload/idempotency tests, preference/theme tests, and adaptive ML/fallback/recommendation-row tests. The suite currently reports **15 passing tests**. The local game path creates a session before gameplay and uses a transactional result/outbox write; the reconnect coordinator has static coverage through its shared contracts and must still receive device/network E2E coverage.

The interaction audit checklist is recorded in [`docs/interaction-checklist.md`](./interaction-checklist.md). Home now reads local reminders/results, Memories has a text-first local save flow, Reminders support complete/undo and local notification requests, Profile settings persist locally, and Help/About has a real route.

Before release, run `npm run typecheck`, `npm test`, `npm run lint`, `npx expo-doctor`, `npx expo config --type public`, `git diff --check`, and the credential scan. On a physical development build, test airplane-mode completion, process kill/restart, reconnect retry, duplicate submission, reminder completion/retry, auth expiry, notification permission denial, TalkBack, large text, high contrast, and all four locales. No physical-device test is claimed by this repository milestone.
