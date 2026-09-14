# Physical-device E2E validation

**Validation date:** 2026-09-14
**Device:** None available in the sandbox
**Development build:** Android native project generated locally with Expo prebuild; APK installation/build is blocked because Android SDK, `adb`, Gradle, emulator, and a connected physical device are unavailable.
**Policy:** No physical-device result is claimed.

| Area | Result | Evidence / next action |
|---|---|---|
| Automated pre-flight | PASS | TypeScript, Vitest, ESLint, Expo Doctor, Expo config, diff check, and credential scan passed |
| Android development build preparation | PARTIAL / BLOCKED | `android/` generated locally by Expo prebuild; `npx expo run:android --no-install --variant debug` blocked by missing Android SDK and `adb` |
| Online login/bootstrap | NOT TESTED | Requires development build and authorized test account |
| SecureStore session restoration | NOT TESTED | Requires process restart on a device |
| Memory Match | NOT TESTED | Automated content/lifecycle coverage exists; physical interaction pending |
| Object Recall | NOT TESTED | Automated deterministic content coverage exists; physical interaction pending |
| Pattern Sequence | NOT TESTED | Automated deterministic content coverage exists; physical interaction pending |
| Offline gameplay | NOT TESTED | Requires airplane-mode device run |
| Process kill/restart while unsynced | NOT TESTED | Requires device process termination and SQLite inspection |
| Reconnect synchronization | NOT TESTED | Requires device network transition and live Supabase test account |
| Retry behavior | NOT TESTED | Requires induced network/remote failure |
| Duplicate submission resistance | NOT TESTED | Requires repeated reconnect/flush scenario against live RLS |
| Reminder completion/retry | NOT TESTED | Local outbox contract is automated; live remote acknowledgement pending |
| Notification permission granted | NOT TESTED | Requires Android notification permission prompt |
| Notification permission denied | NOT TESTED | Requires Android permission denial path |
| Auth expiry/revocation | NOT TESTED | Requires authorized revoked-session scenario |
| Sign-out cache clearing | NOT TESTED | Requires two test users and device restart/inspection |
| TalkBack | NOT TESTED | Requires Android accessibility service |
| Large text | NOT TESTED | Requires device font-size settings |
| High contrast | NOT TESTED | Requires device/theme inspection |
| English | NOT TESTED | Requires device locale/UI walkthrough |
| Hindi | NOT TESTED | Requires device locale/UI walkthrough |
| Assamese | NOT TESTED | Requires device locale/UI walkthrough |
| Bengali | NOT TESTED | Requires device locale/UI walkthrough |

## Required follow-up environment

Run the Android development build from a workstation with Android SDK/platform tools, Gradle-compatible Java, and a connected Android device or emulator. Use a non-production patient test account and do not alter Supabase schema, RLS, Auth configuration, or backend infrastructure. Record every row above as **PASS**, **FAIL**, or **BLOCKED** only after observing it on the device.
