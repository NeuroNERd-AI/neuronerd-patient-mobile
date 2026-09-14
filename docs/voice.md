# Voice and notifications

`VoiceService` is an optional TTS adapter using `expo-speech`. Text controls remain independent and are sufficient for navigation and game completion. No recognition or cloud voice API is required. Device/offline speech limitations are documented in known limitations.

The notification adapter requests permission, schedules local reminders, persists the returned notification identifier, supports cancellation, and provides offline reminder completion. Scheduling is not treated as delivery; the app does not mark a reminder delivered merely because a notification was scheduled. Permission denial leaves the in-app reminder path usable.
