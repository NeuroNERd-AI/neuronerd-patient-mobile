# NeuroNERd Patient Mobile

A local-first React Native + Expo patient companion for gentle games, reminders, memories, and accessible daily routines.

## Run locally

```bash
npm install
cp .env.example .env
npm run start
```

Required public configuration:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Only the publishable key belongs in the mobile build. Never add a service-role key or AI-provider key.

## MVP behavior

The app includes the five-tab patient shell, online email/password sign-in, SQLite bootstrap, offline-safe game result persistence, a durable outbox, three patient-paced game routes, reminder/memory placeholders, four-language catalog foundations, accessible large targets, text-first voice fallback, and a packaged on-device adaptive model with deterministic fallback.

Gameplay is activity, not a medical assessment. The adaptive system must not be used for diagnosis, severity, clinical risk, or cognitive decline claims.
