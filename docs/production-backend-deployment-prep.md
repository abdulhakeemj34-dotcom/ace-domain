# Production Backend Deployment Prep

This note prepares Ace Domain's backend-only Ace AI endpoint for deployment. It does not deploy secrets, change live infrastructure, or require phone testing.

## Recommended First Deployment Target

Use Vercel first for the Ace AI backend route because the project already has:

- A Vite web build that outputs to `dist`.
- A root `api/ai-chat.ts` endpoint compatible with Vercel Functions.
- Backend-only provider keys read from `process.env`.
- A local Vite middleware that reuses the same handler during development.

Other options remain possible later, but Vercel is the smallest move from the current repository shape.

## Current Endpoint

- Route: `POST /api/ai-chat`
- Source: `api/ai-chat.ts`
- Frontend caller: `src/services/aiChatService.ts`
- Local default URL: `/api/ai-chat`
- Optional production/native override: `VITE_ACE_AI_API_URL`

Success response:

```json
{ "reply": "..." }
```

Safe error response:

```json
{ "error": "clear safe error message" }
```

## Vercel Project Settings

Suggested project settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: default npm install
- Production branch: `master`, unless the branch strategy changes later

## Required Environment Variables

Frontend/public variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ACE_AI_API_URL`

Backend-only variables:

- `AI_PROVIDER`
- `AWS_BEARER_TOKEN_BEDROCK`
- `BEDROCK_REGION`
- `BEDROCK_MODEL_ID`
- Optional `OPENAI_API_KEY`
- Optional `OPENAI_MODEL`

Recommended first production AI provider:

```env
AI_PROVIDER=bedrock
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

Set `AWS_BEARER_TOKEN_BEDROCK` in the deployment platform dashboard only. Do not commit it.

## Native App URL Requirement

For hosted web on Vercel, the frontend can call:

```text
/api/ai-chat
```

For a packaged Capacitor native app, configure:

```env
VITE_ACE_AI_API_URL=https://your-production-domain.example/api/ai-chat
```

This is safe because it is only a public endpoint URL. It is not an API key.

## Manual Deployment Steps

1. Import the GitHub repo into Vercel.
2. Confirm build settings: Vite, `npm run build`, output `dist`.
3. Add Supabase public env values.
4. Add backend-only Bedrock env values.
5. Deploy.
6. Open the deployed app.
7. Test Ace AI with a short prompt.
8. If using native builds, set `VITE_ACE_AI_API_URL` to the deployed `/api/ai-chat` URL before `npm run build` and `npm run cap:sync`.

## Safe Endpoint Test

After deployment:

```bash
curl -X POST https://your-production-domain.example/api/ai-chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Say hello from Ace Domain in one sentence.\"}"
```

Expected shape:

```json
{ "reply": "..." }
```

If the response is:

```json
{ "error": "..." }
```

check provider env values, model access, region, and deployment logs. Do not print keys.

## Safety Rules

- Do not expose Bedrock or OpenAI keys with a `VITE_` prefix.
- Do not commit `.env`.
- Do not print full env values in logs or docs.
- Do not use Supabase service-role keys in frontend code.
- Keep Ace AI separate from user-to-user chat.
- Keep demo/local fallback available.

## Remaining Production Work

- Deploy Ace AI backend and confirm the production route.
- Set `VITE_ACE_AI_API_URL` for native builds.
- Run `npm run lint`, `npx tsc -b --pretty false`, `npm run build`, and `npm run cap:sync`.
- Test on a physical Android phone when available.
- Later, test iOS through macOS/Xcode.
