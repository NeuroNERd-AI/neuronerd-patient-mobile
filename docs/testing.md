# Testing

Automated checks include TypeScript, ESLint, Expo Doctor/config validation, deterministic Object Recall and Pattern Sequence content tests, reminder-event payload/idempotency tests, and adaptive ML/fallback/recommendation-row tests. The suite currently reports **13 passing tests**. The local game path creates a session before gameplay and uses a transactional result/outbox write; the reconnect coordinator has static coverage through its shared contracts and must still receive device/network E2E coverage.

Before release, run `npm run typecheck`, `npm test`, `npm run lint`, `npx expo-doctor`, `npx expo config --type public`, `git diff --check`, and the credential scan. On a physical development build, test airplane-mode completion, process kill/restart, reconnect retry, duplicate submission, reminder completion/retry, auth expiry, notification permission denial, TalkBack, large text, high contrast, and all four locales. No physical-device test is claimed by this repository milestone.

The current physical-device matrix is recorded in [`docs/e2e-validation.md`](./e2e-validation.md). The Android native project was generated locally with Expo prebuild, but this sandbox has no Android SDK, `adb`, emulator, Gradle installation, or connected device, so development APK creation and all physical-device rows are blocked/not tested rather than inferred from automated checks.
