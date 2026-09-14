# Current limitations

**Implemented and locally tested:** Object Recall viewing/recall rounds, deterministic Pattern Sequence generation/feedback, local reminder-event payload/outbox creation, adaptive recommendation row persistence, and shared game lifecycle wiring.

**Statically verified but not physically device-tested:** SQLite process-restart retention, reconnect synchronization against live RLS, notification delivery behavior, auth expiry/revocation, TalkBack focus order, high-contrast reflow, and long Hindi/Assamese/Bengali strings.

The Android native project can be generated with Expo prebuild, but the current sandbox lacks Android SDK/platform tools, an emulator, and a physical device. The development APK and the full matrix are therefore blocked; see [`docs/e2e-validation.md`](./e2e-validation.md).

The adaptive artifact remains a development baseline and is not clinically validated or medically meaningful. The app must not be used for diagnosis, severity classification, clinical risk scoring, or medical claims. The demo reminder is local-only until it is replaced by a remote reminder whose ID is accepted by the existing `reminder_events` RLS contract. No backend changes are required or included.
