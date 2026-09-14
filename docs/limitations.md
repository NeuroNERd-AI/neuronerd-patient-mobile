# Current limitations

**Implemented and locally tested:** dynamic local Home dashboard, interactive Memory Match, multi-round Object Recall, deterministic multi-round Pattern Sequence, local reminder completion/undo and notification request path, text-first memory creation, persistent profile preferences, Help/About navigation, and adaptive recommendation messaging/logging.

**Statically verified but not physically device-tested:** SQLite process-restart retention, reconnect synchronization against live RLS, notification delivery behavior, auth expiry/revocation, TalkBack focus order, high-contrast reflow, large-text behavior across every screen, and long Hindi/Assamese/Bengali strings.

The Android development build and full physical matrix require a workstation with Android SDK/platform tools and a device or emulator. The adaptive artifact remains a development baseline and is not clinically validated or medically meaningful. Reminder-event sync depends on a real remote reminder ID accepted by the existing RLS contract; the seeded demo reminder intentionally remains retryable rather than inventing a backend record. Photos remain optional until storage/access is verified. No backend changes are required or included.
