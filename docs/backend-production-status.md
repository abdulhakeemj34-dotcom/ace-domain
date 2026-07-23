# Backend Production Status

Date: July 23, 2026.

This document summarizes what is production-ready, demo-safe, or still external for Ace Domain backend behavior.

## Supabase

- Frontend uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Missing/placeholder Supabase values do not crash the app; demo/local fallback remains available.
- Service-role keys must never be used in frontend code.
- Settings sync is local-first and can upsert to `user_settings` when authenticated.
- Supabase auth/profile/settings behavior still needs final phone verification before public release claims.

## Ace AI

- Frontend calls `VITE_ACE_AI_API_URL` when provided, otherwise `/api/ai-chat`.
- Native builds should set `VITE_ACE_AI_API_URL` to the deployed HTTPS backend endpoint.
- Backend provider keys are read only in serverless/backend code:
  - `AWS_BEARER_TOKEN_BEDROCK`
  - `OPENAI_API_KEY`
- `AI_PROVIDER` can be `bedrock` or `openai`.
- Ace AI is separate from user-to-user chat.

## Store Submission Risk Notes

- Do not list Ace AI as fully live unless the hosted backend endpoint is deployed and the provider has quota/access.
- Do not list real-time chat as production-live unless live Supabase tables, RLS, and subscriptions are verified.
- Keep demo fallback visible and honest.
- Do not expose backend keys through `VITE_` variables.

## Recommended Production Env

Frontend/native build:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_ACE_AI_API_URL=https://acedomain.app/api/ai-chat
```

Backend/serverless only:

```bash
AI_PROVIDER=bedrock
AWS_BEARER_TOKEN_BEDROCK=your-backend-only-bedrock-key
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
ACE_AI_ALLOWED_ORIGINS=https://acedomain.app,capacitor://localhost,https://localhost
```

Never commit real values.
