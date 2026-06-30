# Ace Domain Backend Foundation

Stage Three uses Supabase for auth, profile data, social posts, communities, chat tables, and notifications.

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

Only the public anon key belongs in the frontend. Do not commit real `.env` files or service-role secrets.

`OPENAI_API_KEY` is backend-only. It must be read from `process.env.OPENAI_API_KEY` inside serverless/backend code and must never be exposed as `VITE_OPENAI_API_KEY`.

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

## Stage Six AI Chat Endpoint

The backend-only AI foundation lives at `api/ai-chat.ts`.

- Method: `POST`
- Model: `gpt-4o-mini`
- Secret source: `process.env.OPENAI_API_KEY`
- Frontend integration: not connected yet

Accepted request bodies:

```json
{ "message": "Hello Ace Domain" }
```

or:

```json
{
  "messages": [
    { "role": "user", "content": "Hello Ace Domain" }
  ]
}
```

Success response:

```json
{ "reply": "..." }
```

Safe error response:

```json
{ "error": "clear safe error message" }
```

Manual test once deployed or served by a serverless host:

```bash
curl -X POST https://your-domain.example/api/ai-chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello Ace Domain\"}"
```

The endpoint does not hardcode or return API keys. If `OPENAI_API_KEY` is missing, it returns a safe backend configuration error.
