# Supabase Readiness Review

Stage 12F documents the current live-backend readiness without running migrations or changing provider strategy.

## Current Safety Posture

- Frontend Supabase access uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- No service-role key is required or exposed in frontend code.
- Missing or placeholder Supabase values keep the app in demo/local mode instead of crashing.
- Local settings remain the immediate source of truth, with background `user_settings` sync only when a Supabase session exists.
- Ace AI remains separate from Supabase user-to-user chat and uses the backend-only OpenAI endpoint path.

## Expected Supabase Tables

The canonical schema lives in `src/backend/schema.sql` and currently expects:

- `profiles`
- `posts`
- `communities`
- `community_members`
- `chat_threads`
- `chat_thread_members`
- `chat_messages`
- `notifications`
- `user_settings`

RLS is enabled for all expected tables. User-owned writes should stay restricted to the authenticated user, while public reads remain limited to appropriate social surfaces such as profiles, posts, and communities.

## Schema And Migration Readiness

`src/backend/schema.sql` is the review source for future manual Supabase SQL Editor or migration-runner work. Stage 14C does not apply this SQL automatically.

Before running SQL against a real Supabase project:

- Confirm the target project is the correct Ace Domain project.
- Review the full SQL file before execution.
- Keep a database backup or recovery path for any project with real data.
- Run schema changes manually from the Supabase dashboard or an approved migration workflow.
- Do not run destructive resets, drops, or broad data deletes.
- Do not use service-role keys in frontend code to bypass RLS.
- Keep demo/local fallback available while live tables are verified.

Current ownership expectations:

- `profiles.id` maps to `auth.users.id`.
- `posts.user_id` maps to the post owner.
- `community_members.user_id` maps to the joined user.
- `chat_threads.created_by` maps to the thread creator.
- `chat_thread_members.user_id` maps to each member.
- `chat_messages.sender_id` maps to the authenticated sender.
- `notifications.user_id` maps to the notification owner.
- `user_settings.user_id` maps to the settings owner.

Live verification should start with auth/profile and settings before posts, communities, chats, and notifications.

## Live-Ready Areas

- Auth service can call Supabase signup, login, profile refresh, and logout when configured.
- Profile service can load and upsert the current user's profile when authenticated.
- Post and community services can read live rows when tables exist.
- Chat service can load threads/messages, send messages, and subscribe to `chat_messages` inserts when configured and authenticated.
- Notification service can read and update the authenticated user's notifications.
- Settings service can load/upsert `user_settings` without blocking local UI state.

## Demo/Local Fallback Areas

- Auth keeps demo access available when Supabase is unavailable, misconfigured, or temporarily rate-limited.
- Home/feed content still uses curated local demo data when live posts are unavailable.
- Communities remain useful with mock data when live community rows are unavailable.
- Chats keep mock/demo conversations available when there is no authenticated Supabase session.
- Notifications can display local mock states when live rows are unavailable.
- Settings continue to work locally without login or network access.

## Risks To Preserve

- Do not remove localStorage settings fallback.
- Do not fake live Supabase success when a network request fails.
- Do not merge Ace AI into user-to-user chat tables.
- Do not commit `.env` or generated build output.
- Do not add service-role keys to frontend code.
- Do not run database migrations without explicit instruction and a backup/review path.

## Verification Commands

Run these before any Supabase-facing release checkpoint:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

Use `npm run cap:sync` when native platform assets or Capacitor runtime behavior may be affected.

## Stage 16 Live Test Status

Stage 16 confirms the app is ready for real Supabase testing, but the live dashboard/account steps still require manual action in the Supabase project and the running app.

Source-ready:

- Local `.env` is supported for real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values without committing secrets.
- Auth can attempt real signup/login and keeps demo mode available for network failure or email rate limits.
- Profile sync warnings remain non-blocking when profile rows cannot be created or loaded.
- Settings remain local-first and only apply remote `user_settings` data when the payload is usable.
- Feed and communities fall back to curated local data when live tables are missing, empty, or blocked by RLS.
- Chat and notifications fall back safely when live tables are missing, empty, or blocked by RLS.
- Demo chat threads stay local and do not open realtime subscriptions.
- Ace AI stays separate from Supabase user-to-user chat.

Manual checks still needed:

1. Apply `src/backend/schema.sql` in the Supabase SQL Editor using `docs/stage-15-supabase-apply-checklist.md`.
2. Create or log in with a test user through the app without sharing credentials in docs or chat.
3. Confirm profile creation/loading either succeeds or shows the existing non-blocking profile sync warning.
4. Change a setting while signed in, refresh the app, and confirm local settings are not overwritten by empty remote settings.
5. Check Home, Communities, Chats, and Notifications after SQL is applied to confirm live rows appear when present and demo fallback remains when rows are empty.
6. Keep `.env`, service-role keys, session tokens, and generated `dist` output out of Git.
