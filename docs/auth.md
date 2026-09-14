# Authentication

First sign-in uses Supabase email/password and requires connectivity. The Supabase client persists its authenticated session through Expo SecureStore; passwords are never stored locally. On app bootstrap, the app restores the Supabase session, resolves the authenticated user through `profiles.auth_user_id`, then resolves the patient through `patients.profile_id`.

A signed-out auth event clears the patient-side SQLite cache and routes the user to the auth group. Cached patient data is not intentionally shown to a different authenticated user. Auth and profile lookup errors are reduced to patient-safe messages. Session revocation handling remains a release-test item because it requires a real device/account session.
