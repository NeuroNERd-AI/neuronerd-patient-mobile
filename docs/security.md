# Security and release notes

The app uses the Supabase publishable key and authenticated RLS-scoped queries. SecureStore holds the auth session; SQLite never stores passwords or tokens. The client never uses service-role credentials, privileged RPC workarounds, or direct AI-provider keys. Backend security advisor findings are documented in `supabase-contract-audit.md` and require a separate review.

Patient content is minimized, local-first, and cleared on sign-out during release hardening. Gameplay is activity data only. Memory media is deferred until Storage bucket and signed-access policy are verified. Build and test the Android development build on physical devices before a public release.
