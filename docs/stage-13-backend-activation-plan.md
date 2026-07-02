# Stage 13 Backend Activation Plan

Stage 13 prepares Ace Domain to move from demo-safe mode toward real Supabase-backed behavior. This plan is documentation only: it does not run migrations, change live database behavior, expose secrets, or remove local fallback paths.

## Current Backend State

- Supabase client helpers live in `src/lib/supabase.ts`.
- Backend service layers already exist for auth, profiles, posts, communities, chat, notifications, and settings.
- The canonical database schema lives in `src/backend/schema.sql`.
- `user_settings` exists in the schema and supports local-first settings sync.
- User-to-user chat uses the Supabase chat service and remains separate from Ace AI.
- Ace AI calls `/api/ai-chat`, which must use `OPENAI_API_KEY` only in backend/serverless runtime code.
- Demo/local fallback remains active when Supabase config is missing, network requests fail, tables are empty, or the user is not authenticated.

## Demo/Local Areas

- Auth can continue in demo mode if Supabase is unavailable, misconfigured, or rate-limited.
- Home/feed can use curated local data until live posts are ready.
- Communities can use mock communities until live community rows and membership behavior are verified.
- Chats can show demo threads/messages when no valid Supabase session exists.
- Notifications can use local mock state until real notification rows exist.
- Settings write to localStorage first and only sync to Supabase in the background when safe.

## Supabase-Ready Areas

- Auth/signup/login/logout paths are wired for Supabase Auth.
- Profile loading and updating can use the `profiles` table for authenticated users.
- Settings sync can use `user_settings` with row ownership.
- Feed and community reads can use `posts` and `communities`.
- Chat threads/messages can use `chat_threads`, `chat_thread_members`, and `chat_messages`.
- Notifications can use the `notifications` table for the authenticated user.
- Supabase Realtime can subscribe to `chat_messages` after the schema and publication are verified.

## Required Environment Variables

Frontend public config:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend-only config:

- `OPENAI_API_KEY`

Rules:

- Never create or use `VITE_OPENAI_API_KEY`.
- Never place a Supabase service-role key in frontend code.
- Keep real `.env` files untracked.
- Keep `.env.example` as safe placeholders only.

## Supabase Project Setup Requirements

Before activating live behavior, confirm:

- Email signup is enabled only if Ace Domain is ready to receive real test signups.
- Email rate limits are understood, especially during repeated local testing.
- Allowed redirect URLs include the local dev URL and any future hosted web URL.
- Site URL is set to the intended app URL for hosted auth flows.
- Auth email templates do not expose internal-only wording.
- RLS is enabled for all expected tables.
- Realtime is enabled only for tables that need it, starting with `chat_messages`.

## Expected Database Tables

The current schema expects:

- `profiles`
- `posts`
- `communities`
- `community_members`
- `chat_threads`
- `chat_thread_members`
- `chat_messages`
- `notifications`
- `user_settings`

Ownership rules:

- A user can create and update only their own profile.
- A user can create, update, and delete only their own posts.
- A user can select public profiles, posts, and communities where intended.
- A user can manage only their own community membership rows.
- Chat threads and messages are readable only to thread members.
- Chat messages can be inserted only by the authenticated sender when they are a member of the thread.
- Notifications are readable and updateable only by the notification owner.
- Settings rows are readable, insertable, and updateable only by the owner.

## Activation Priority

1. Auth/profile
2. Settings sync
3. Posts/feed
4. Communities
5. Chats
6. Notifications
7. Ace AI backend endpoint

This order activates low-risk identity and preference flows before more interactive social surfaces.

## Proposed Stage 13 Implementation Slices

### 13B Supabase Environment Verification

- Verify `.env` values are present locally without printing secrets.
- Confirm the app detects Supabase as configured.
- Confirm `.env` remains untracked.
- Do not run migrations yet.

### 13C Auth/Profile Live Connection

- Test Supabase signup/login/logout safely.
- Confirm the friendly rate-limit message remains visible when Supabase limits email attempts.
- Verify profile load/update behavior for a real authenticated user.
- Preserve demo fallback if Supabase fails.

### 13D Settings Sync Verification

- Verify `user_settings` reads/writes for an authenticated user.
- Confirm empty remote settings never overwrite useful local settings.
- Confirm localStorage remains the immediate source of truth.

### 13E Feed/Community Live Data Readiness

- Verify live reads from `posts` and `communities`.
- Keep local content visible when tables are empty.
- Review community membership actions without faking success.

### 13F Chat/Notification Live Readiness

- Verify chat thread membership, message load/send, and realtime cleanup.
- Verify notification read/update behavior.
- Keep demo chat available when no authenticated session exists.

### 13G Ace AI Backend Runtime Readiness

- Confirm `/api/ai-chat` is available in the chosen backend/serverless runtime.
- Confirm `OPENAI_API_KEY` is backend-only.
- Confirm quota/provider failures show safe user-facing errors.

### 13H Final Backend Activation QA

- Run a full local and mobile walkthrough.
- Verify demo mode still works after live paths are tested.
- Confirm no secrets or build output are tracked.

## Risk Areas

- Supabase email rate limiting during repeated signup testing.
- Empty live tables making screens look broken if fallback is removed too early.
- Incorrect RLS blocking authenticated writes.
- Realtime subscriptions leaking if cleanup changes are made carelessly.
- Remote settings overwriting local preferences.
- Accidentally exposing service-role or OpenAI secrets.

## Verification Commands

Run before each Stage 13 commit:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

Use `npm run cap:sync` when native platform behavior or Capacitor output may be affected.

## What Not To Touch In Stage 13A

- Do not run Supabase migrations.
- Do not change live database behavior.
- Do not remove demo/local fallback.
- Do not expose secrets.
- Do not add service-role keys to frontend code.
- Do not merge Ace AI with user-to-user chat.
- Do not redesign the app.
- Do not add payments, wallet, banking, rides, flights, food ordering, or marketplace features.
