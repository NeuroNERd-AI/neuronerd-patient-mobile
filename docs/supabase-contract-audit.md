# Supabase contract audit

**Project:** `neuronerd` (`pwmrblijtqqzmuvqvvur`) in `ap-south-1`  
**Audit mode:** read-only, 2026-09-14  
**Mobile boundary:** authenticated publishable-key access only; no schema or policy changes were made.

## Verified contract

The public schema contains patient-scoped `profiles`, `patients`, `games`, `game_sessions`, `game_results`, `difficulty_profiles`, `reminders`, `reminder_events`, `daily_routines`, `memory_items`, `alerts`, content/language tables, and a `sync_queue`. RLS is enabled for every inspected table. Patient writes are permitted for game sessions/results, reminder events, reminders, memories, daily routines, and patient-owned profile/patient rows according to existing policies. Caregiver reads are mediated by the existing access predicates.

The mobile adapter must resolve the authenticated user to `profiles.auth_user_id`, then resolve a patient by `patients.profile_id`. It must not reproduce caregiver relationship logic for a patient account. Active games and languages are readable to authenticated users. Content variants are readable; administrative writes remain outside the app.

## Idempotency and constraints

`game_sessions.client_event_id` is unique, `game_results.game_session_id` is unique, `reminder_events.client_event_id` is unique, `reminders.reminder_key` is unique, and `difficulty_profiles(patient_id, game_id)` is unique. These constraints support safe retries. The existing patient policy allows session/result creation but does not grant ordinary patient session updates; the mobile client should submit a completed session payload once its local result is final rather than relying on a later patient-side update.

## Security findings retained for follow-up

The security advisor reported three `SECURITY DEFINER` helper functions callable by both `anon` and `authenticated`: `can_access_patient`, `is_caregiver_of_patient`, and `is_patient_of_current_profile`. The advisor also reports disabled leaked-password protection. This implementation does not alter them. They require a separate backend security review because changing them could affect existing caregiver/patient RLS behavior.

## Explicit non-goals

No service-role key, AI key, direct storage upload, server-side AI call, clinical field, diagnosis, severity classification, or medical risk score is part of the patient app. Memory media remains metadata-first until Storage bucket and signed-access policies are separately verified.
