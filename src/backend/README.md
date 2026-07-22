# Ace Domain Backend Foundation

Ace Domain uses Supabase for auth, profile data, social posts, communities, chat tables, notifications, and settings sync.

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Optional `VITE_ACE_AI_API_URL`
- `OPENAI_API_KEY`
- Optional `AI_PROVIDER`
- Optional `AWS_BEARER_TOKEN_BEDROCK`
- Optional `BEDROCK_REGION`
- Optional `BEDROCK_MODEL_ID`

Only the public anon key belongs in the frontend. Do not commit real `.env` files or service-role secrets.

`VITE_ACE_AI_API_URL` is safe public frontend config because it is only the deployed `/api/ai-chat` endpoint URL. It is useful for packaged Capacitor builds, where relative `/api/ai-chat` may not point to a hosted backend.

`OPENAI_API_KEY` is backend-only. It must be read from `process.env.OPENAI_API_KEY` inside serverless/backend code and must never be exposed as `VITE_OPENAI_API_KEY`.

`AWS_BEARER_TOKEN_BEDROCK` is backend-only. It must be read from `process.env.AWS_BEARER_TOKEN_BEDROCK` inside serverless/backend code and must never be exposed as a `VITE_` variable.

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
- `user_settings`

RLS is enabled for every table. Policies keep public reads limited to profiles, posts, and communities, while user-owned writes are restricted to the authenticated user.

## Frontend Behavior

The app remains mobile-first and demo-safe. If Supabase env keys are missing or a table has no rows yet, the existing premium mock UI stays visible instead of rendering empty screens or crashing.

Settings are local-first. The app reads validated settings from localStorage immediately, then attempts to load `user_settings` for the authenticated Supabase user. If remote settings exist, they are sanitized, applied, and written back to localStorage. Local settings still work without login or Supabase, and failed remote saves do not block the UI.

For the current live-backend readiness snapshot, see [`../../docs/supabase-readiness.md`](../../docs/supabase-readiness.md).

## Stage Seven Settings Sync

`user_settings` stores each user's Stage 5 app settings as `jsonb`.

- Primary key: `user_id`
- Settings payload: `settings`
- Version marker: `settings_version`
- Timestamp trigger: `set_user_settings_updated_at`

RLS policies allow users to select, insert, and update only their own settings rows. The frontend sync foundation lives in `src/services/settingsService.ts` and preserves the localStorage fallback as the immediate source of truth.

## Stage Four Chat

Chat threads and messages are read through the service layer. When a user has a valid Supabase session, chat rooms subscribe to `chat_messages` inserts through Supabase Realtime and clean up the WebSocket subscription when the room unmounts.

Thread membership writes are restricted: clients cannot self-join arbitrary threads by ID. Thread creators can add members through the schema policies, and a future trusted backend flow can expand this safely.

## Stage Six AI Chat Endpoint

The backend-only AI foundation lives at `api/ai-chat.ts`.

- Method: `POST`
- Route: `/api/ai-chat`
- Default OpenAI model: `gpt-4o-mini`
- Default Amazon Bedrock model: `amazon.nova-lite-v1:0`
- OpenAI secret source: `process.env.OPENAI_API_KEY`
- Bedrock secret source: `process.env.AWS_BEARER_TOKEN_BEDROCK`
- Frontend integration: the Ace AI screen calls `/api/ai-chat`

Ace AI is separate from Supabase user-to-user chat. AI provider keys must stay backend-only, and user chat should continue through the Supabase chat service.

Set `AI_PROVIDER=bedrock` to force Amazon Bedrock, or `AI_PROVIDER=openai` to force OpenAI. If `AI_PROVIDER` is omitted, the endpoint prefers Bedrock when `AWS_BEARER_TOKEN_BEDROCK` is available, then falls back to OpenAI when `OPENAI_API_KEY` is available.

For production/native deployment steps, see [`../../docs/production-backend-deployment-prep.md`](../../docs/production-backend-deployment-prep.md).

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

The endpoint does not hardcode or return API keys. If no backend AI provider key is configured, it returns a safe backend configuration error.

## Local Dev AI Endpoint

During `npm run dev`, `vite.config.ts` mounts a local-only middleware for `POST /api/ai-chat`. The middleware reuses `api/ai-chat.ts` and loads backend-only AI environment variables from the root `.env` into the Vite dev server process only.

This does not expose AI keys to frontend code and does not create `VITE_OPENAI_API_KEY` or `VITE_BEDROCK_API_KEY`.

Local test:

```bash
curl -X POST http://127.0.0.1:5173/api/ai-chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello Ace Domain\"}"
```
