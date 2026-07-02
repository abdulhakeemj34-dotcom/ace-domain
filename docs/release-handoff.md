# Ace Domain Release Handoff

## Current Status

Ace Domain - Meet the World is a mobile-first React, TypeScript, Vite, Tailwind CSS, and Capacitor app prepared for professional review and eventual GitHub sharing.

The current app is stable through Stage 10. The accepted product direction is a black-first, compact, modern mobile social layout with clean feed, messaging, communities, notifications, profile, settings, Global Discovery, Calendar, and Ace AI surfaces.

Latest source checkpoints at the time of this handoff:

- `aca1825 Stage 11A - Final release handoff preparation`
- `23305c5 Stage 10E - Final post redesign visual QA`
- Stage 10F and Stage 10G completed with no code changes required.
- Git was clean after the Stage 11A release handoff checkpoint.

## Completed Stage Summary

- Stage 8: Product walkthrough, stability checks, mobile readiness, and final pre-release QA.
- Stage 9: Professional cleanup, release packaging review, and GitHub readiness checklist.
- Stage 10: Visual identity planning, branding components, native asset readiness, layout direction replacement, post-redesign QA, and final fallback verification.

## Main Features

- Welcome and auth/demo access flow.
- Local demo fallback when live backend services are unavailable.
- Home feed with posts, stories, Global Match entry points, Calendar access, and Ace AI access.
- Supabase-ready one-on-one and group chat foundation with mock fallback.
- Real-time chat service foundation when Supabase is configured.
- Communities and community detail flow.
- Notifications inbox.
- Profile and edit profile flow.
- Settings, personalization, accessibility, privacy, notification preferences, language preferences, and local-first settings persistence.
- Supabase `user_settings` sync foundation with localStorage as the immediate source of truth.
- Backend-only OpenAI endpoint foundation for Ace AI.
- Capacitor Android and iOS native project structure.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Capacitor
- Supabase foundation
- Backend/serverless OpenAI endpoint

## Setup Commands

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS or Linux:

```bash
cp .env.example .env
npm run dev
```

Production check:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

Native sync after a successful web build:

```bash
npm run cap:sync
```

## Environment Safety

- Real `.env` files must stay local and untracked.
- `.env.example` contains placeholders only.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public frontend Supabase config.
- `OPENAI_API_KEY` is backend-only and must never be renamed to or exposed as `VITE_OPENAI_API_KEY`.
- Do not commit service-role keys, private API keys, local logs, or generated `dist` output.

## Release Checks

Run before GitHub sharing, demo packaging, or public release:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
git status
```

Recommended native checks:

```bash
npm run cap:sync
```

Then test on a real phone or emulator before public release.

## Known Limitations

- Supabase email signup may temporarily return a rate-limit response. The app now shows a friendly message and keeps demo mode available, but real signup should be retested after the rate limit window clears.
- The Codex desktop environment could confirm local availability and source-level navigation, but it could not complete a live in-app browser tap-through against the local Vite port during Stage 10G.
- A final physical phone or emulator pass is still recommended before public GitHub/public release sharing.
- OpenAI responses depend on the backend endpoint running with a valid `OPENAI_API_KEY` and sufficient OpenAI quota.

## Recommended Next Steps

1. Run the release checks on the local machine.
2. Run Ace Domain on a real phone or emulator.
3. Retest live Supabase signup after the email rate limit clears.
4. Confirm `.env` is untracked and `.env.example` remains placeholder-only.
5. Create the GitHub remote only when ready.
6. Push only after reviewing `git status` and the latest commit history.
