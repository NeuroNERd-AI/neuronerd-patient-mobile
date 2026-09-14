# Interaction audit checklist

This milestone audits patient-mobile interactions before targeted implementation changes.

| Surface | Current finding | Target behavior | Validation |
|---|---|---|---|
| Home | Greeting, reminder, and activity cards are hardcoded; help card has no action | Load local profile/reminders/results; show progress and help destination | SQLite repository tests and typecheck |
| Games catalogue | Start links work; no visible recent progress or adaptive-friendly context | Preserve navigation and show patient-paced descriptions | Existing route checks plus device pending |
| Memory Match | Existing route is playable but result feedback is minimal | Preserve flow; expose clear summary and non-clinical language | Existing game tests; device pending |
| Object Recall | Existing multi-round flow works; feedback and metrics need clearer presentation | Preserve flow; show selections/round summary and calm feedback | Existing game tests; device pending |
| Pattern Sequence | Existing multi-round flow works; feedback exists but summary is generic | Preserve flow; show clear progress/feedback | Existing game tests; device pending |
| Memories | Add button has no handler; no form/loading/error/sync confirmation | Text-first add flow, local persistence, queued/synced status | Repository/UI tests; device pending |
| Reminders | Completion works locally but no undo or notification action | Complete/undo safely; schedule local notification when permitted; show sync state | Repository contract tests; device pending |
| Profile/settings | Large text, contrast, sound, help buttons are inert | Persist preferences locally and apply theme/text scale; functional help | Preference tests; device pending |
| Gear/help | No consistent destination | Add a contextual Help & About screen and route | Navigation/typecheck; device pending |
| Authentication | Login has handler/loading/error; sign-out clears cache | Preserve and verify disabled/loading/error behavior | Existing auth code; live device pending |

## Global interaction rules

All new controls use the shared large `Button`/`Field` primitives, expose accessibility labels or roles, provide a visible state change, avoid required timers, remain local-first, and never describe activity results as medical scores. No Supabase schema, RLS, Auth configuration, caregiver repository, Figma repository, or secret configuration is changed.
