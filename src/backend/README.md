# Ace Domain Backend Foundation

Stage Three uses Supabase for auth, profile data, social posts, communities, chat tables, and notifications.

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Only the public anon key belongs in the frontend. Do not commit real `.env` files or service-role secrets.

## Database Setup

Run `src/backend/schema.sql` in the Supabase SQL editor or through a migration runner. It creates:

- `profiles`
- `posts`
- `communities`
- `community_members`
- `chat_threads`
- `chat_thread_members`
- `chat_messages`
- `notifications`

RLS is enabled for every table. Policies keep public reads limited to profiles, posts, and communities, while user-owned writes are restricted to the authenticated user.

## Frontend Behavior

The app remains mobile-first and demo-safe. If Supabase env keys are missing or a table has no rows yet, the existing premium mock UI stays visible instead of rendering empty screens or crashing.

## Stage Four Chat

Chat threads and messages are read through the service layer. When a user has a valid Supabase session, chat rooms subscribe to `chat_messages` inserts through Supabase Realtime and clean up the WebSocket subscription when the room unmounts.

Thread membership writes are restricted: clients cannot self-join arbitrary threads by ID. Thread creators can add members through the schema policies, and a future trusted backend flow can expand this safely.
