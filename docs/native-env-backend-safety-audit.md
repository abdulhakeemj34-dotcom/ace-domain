# Native Environment And Backend Safety Audit

This audit checks Ace Domain's environment and backend assumptions for future native Android/iOS builds. It does not print real environment values, modify `.env`, add secrets, or change backend behavior.

## Frontend Environment Usage

The frontend reads only public Vite variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are public Supabase browser/mobile configuration values. They are still stored in local `.env` for development and must not be confused with private service-role secrets.

## Supabase Anon Key Handling

- Supabase anon key is used as public frontend config.
- Placeholder values are detected and treated as unconfigured.
- Missing/placeholder Supabase config keeps demo/local fallback available.
- No service-role key is required or used in frontend.

## Ace AI Key Handling

- `OPENAI_API_KEY` is read only from `process.env.OPENAI_API_KEY` in backend/serverless code.
- `AWS_BEARER_TOKEN_BEDROCK` is read only from `process.env.AWS_BEARER_TOKEN_BEDROCK` in backend/serverless code.
- `AI_PROVIDER` may be set to `bedrock` or `openai` to choose the backend provider.
- The app does not use `VITE_OPENAI_API_KEY`.
- The app does not use `VITE_BEDROCK_API_KEY`.
- Frontend Ace AI calls `/api/ai-chat`.
- Local Vite dev mounts `/api/ai-chat` through a dev-only middleware.
- Native production builds need a real deployed backend/serverless route for `/api/ai-chat`; the Vite dev middleware is not a production native backend.

## No Service-Role Key In Frontend

Stage 24 does not add or require service-role keys. Future privileged actions, such as destructive account deletion, must use secure backend-only code and never expose service-role keys to React, Vite, Capacitor, Android, or iOS source files.

## Native App Network Behavior Expectations

- Native builds load the bundled `dist` web app through Capacitor.
- Supabase requests should target the configured Supabase project URL.
- Ace AI requests must resolve to a deployed backend path in production.
- Localhost or Vite-only endpoints should not be assumed available on a real Android/iOS build.
- Network failures must keep demo/local fallback and user-safe error messages.

## Localhost / Dev URL Assumptions

Current local dev notes include `http://127.0.0.1:5173/api/ai-chat` for manual testing. That is only for development and should not be treated as a native release endpoint.

Before native release testing, confirm:

- The production web/native build has the correct Supabase env values.
- Ace AI has a real backend URL/provider runtime or is clearly unavailable.
- No app feature depends on the local Vite server.

## Production Build Environment Notes

Before `npm run build` for a native candidate:

- Provide real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` locally or in the build environment.
- Keep `OPENAI_API_KEY` and `AWS_BEARER_TOKEN_BEDROCK` out of frontend build variables.
- Keep `.env` untracked.
- Confirm build output is synced with `npm run cap:sync`.

## Supabase Redirect / Auth URL Notes

Supabase email confirmation and auth redirect behavior may need native-aware configuration before public release:

- Local dev URL for browser testing.
- Future hosted web URL if a public web version exists.
- Native deep-link or custom scheme only if the app implements it.
- Avoid claiming native email confirmation is complete until it is tested on device.

Phone auth retest is still pending and should happen after Supabase email cooldown/rate-limit clears.

## Mobile Auth Callback Considerations

Ace Domain currently uses email/password auth and stored session restore. If email confirmation links, magic links, OAuth, or deep-link auth are added later, native URL schemes and redirect handling must be designed and tested separately for Android and iOS.

## Safety Requirements Before Native Release

- Do not print `.env` values.
- Do not commit `.env`.
- Do not add service-role keys to frontend.
- Do not add `VITE_OPENAI_API_KEY`.
- Do not add `VITE_BEDROCK_API_KEY`.
- Do not assume local Vite middleware exists in production native builds.
- Do not repeatedly test signup/login while Supabase email rate-limit is active.
- Verify Supabase auth/session/settings behavior on a real phone later.

## Current Risk Summary

- Supabase frontend config path is safe.
- OpenAI and Bedrock key paths are backend-only.
- Demo/local fallback remains important for missing network/backend cases.
- Ace AI production native runtime needs a deployed backend endpoint.
- Auth callback/deep-link behavior needs future review if the auth flow expands beyond email/password.
