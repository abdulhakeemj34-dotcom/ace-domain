# Ace Domain Release Handoff

## Current Status

Ace Domain - Meet the World is a mobile-first React, TypeScript, Vite, Tailwind CSS, and Capacitor app prepared for professional review, GitHub handoff, and continued native release preparation.

The current product direction is a black-first, compact, modern mobile social layout with clean feed, messaging, communities, notifications, profile, settings, Global Discovery, Calendar, and Ace AI surfaces.

Current source checkpoint:

- `579633f Add Bedrock provider support for Ace AI`
- `bbcc92b Fix Android Gradle wrapper download timeout`
- `446b7f4 Stage 24E - Native env backend safety audit`

## Completed Stage Summary

- Stage 8: Product walkthrough, stability checks, mobile readiness, and final pre-release QA.
- Stage 9: Professional cleanup, release packaging review, and GitHub readiness checklist.
- Stage 10: Visual identity planning, branding components, native asset readiness, layout direction replacement, post-redesign QA, and final fallback verification.
- Stage 11: Release handoff, final device QA, GitHub push preparation, and repository polish.
- Stage 12: Core product usefulness upgrades across feed, chats, profile, Ace AI entry, and supporting product surfaces.
- Stage 13: Backend activation planning and Supabase readiness direction.
- Stage 14 through Stage 17: Supabase/auth/settings functionality stabilization and phone-test findings.
- Stage 18 through Stage 21: Universal mobile responsiveness, phone-test readiness, auth/settings retest support, and dead-button polish.
- Stage 22 through Stage 24: Release readiness, legal/support link audit, native build readiness, Android/iOS checklists, native asset path audit, and native backend/env safety review.

## Main Features

- Welcome and auth/demo access flow.
- Local demo fallback when live backend services are unavailable.
- Friendly Supabase auth/rate-limit messaging.
- Home feed with posts, stories, Global Match entry points, Calendar access, and Ace AI access.
- Supabase-ready one-on-one and group chat foundation with mock fallback.
- Real-time chat service foundation when Supabase is configured.
- Communities and community detail flow.
- Notifications inbox.
- Profile and edit profile flow.
- Settings, personalization, accessibility, privacy, notification preferences, language preferences, and local-first settings persistence.
- Supabase `user_settings` sync foundation with localStorage as the immediate source of truth.
- Backend-only Ace AI endpoint with Amazon Bedrock or OpenAI provider support.
- Capacitor Android and iOS native project structure.
- Pre-release public page drafts for support, privacy, terms/safety, and account deletion.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Capacitor
- Supabase foundation
- Backend/serverless Ace AI endpoint with Bedrock/OpenAI support

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
- `AWS_BEARER_TOKEN_BEDROCK` is backend-only and must never be exposed as a `VITE_` variable.
- `AI_PROVIDER` can be set to `bedrock` or `openai` for the Ace AI backend endpoint.
- Do not commit service-role keys, private API keys, local logs, generated `dist` output, or local native signing material.

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

Android debug build from Windows after Android Studio/JDK/SDK setup:

```bash
cd android
.\gradlew.bat assembleDebug
```

## Known Limitations

- Supabase email signup can temporarily return a rate-limit response. The app shows a friendly message and keeps demo mode available.
- Ace AI requires a backend/serverless runtime with either Amazon Bedrock or OpenAI configured and valid access/quota.
- Local Vite middleware supports `/api/ai-chat` during development only. Production native builds need a real deployed backend endpoint.
- Android debug build has been verified locally, but a full physical Android phone pass is still recommended.
- iOS native builds require macOS, Xcode, and Apple signing setup.
- Public store release still needs final app icon/splash PNG exports, store screenshots, signing, final legal/support review, a verified monitored support inbox, and final device QA.

## Recommended Next Steps

1. Run the release checks before each new checkpoint.
2. Run Ace Domain on a physical Android phone when available.
3. Retest live Supabase signup after any email rate-limit cooldown clears.
4. Confirm Ace AI through the deployed backend path before native production release.
5. Review and finalize the public privacy/support/account deletion/terms page drafts.
6. Prepare final store assets and screenshots from a real device build.
7. Keep `.env` untracked and `.env.example` placeholder-only.
