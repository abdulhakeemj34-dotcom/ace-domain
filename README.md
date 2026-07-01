# Ace Domain - Meet the World

A mobile-first social networking app built with React, TypeScript, Vite, Tailwind CSS, and Capacitor.

## Requirements

- Node.js and npm
- Android Studio for Android device/emulator work
- Xcode on macOS for iOS device/simulator work

## Version 1

- Welcome and account access flow
- Home feed with posts, stories, AI search, Ace AI access, and Global Match
- Trending global conversations
- Mini-games preview cards for the future game hub
- One-on-one and group chat surfaces with demo fallback and Supabase realtime foundation
- Interest communities for Gaming, Anime, Music, Football, Coding, Campus, and Global
- Notifications
- Profile, settings, personalization, accessibility, and local-first settings persistence
- Supabase-ready auth, profiles, posts, communities, chat, notifications, and settings sync
- Backend-only OpenAI chat endpoint for Ace AI
- Native Android and iOS project setup through Capacitor

## Architecture

The app is organized by product feature under `src/features`, shared UI under `src/components`, app-level data/types under `src/app`, service integrations under `src/services`, native-ready page exports under `src/pages`, navigation under `src/navigation`, and future product expansion points under `src/platform`.

Future product modules are intentionally registered as planned architecture only: voice/video, translation expansion, full mini-games, creator economy, marketplace, food ordering, clothes shopping, ride booking, flights, hotels, wallet, payments, and banking features.

Stage 10 visual identity planning is documented in `docs/visual-identity-plan.md`.

Capacitor is configured with:

- App name: `Ace Domain`
- App ID: `com.acedomain.app`
- Web directory: `dist`

## Environment Safety

Use `.env.example` as the template for local configuration. Real `.env` files are ignored and must not be committed.

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public frontend Supabase config.
- `OPENAI_API_KEY` is backend-only and must never be exposed as `VITE_OPENAI_API_KEY`.

The app stays demo-safe when Supabase or OpenAI configuration is missing.

## Quick Start

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

The app can run in demo mode with placeholder env values. Add real Supabase values to enable live auth/data flows, and add `OPENAI_API_KEY` only for the backend AI endpoint.

For a production web build:

```bash
npm run build
```

For native project sync after a successful build:

```bash
npm run cap:sync
```

`dist` is generated build output and is intentionally ignored. The `android` and `ios` folders are tracked because this project is prepared as a real Capacitor mobile app.

## Release Checks

Before sharing or building a release candidate, run:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

## GitHub Readiness

Before creating a remote or pushing this project:

- Confirm `git status` is clean.
- Confirm `.env` is not tracked and `.env.example` contains placeholders only.
- Keep generated `dist` output out of Git.
- Run the release checks above.
- Commit only intentional source, documentation, native project, and configuration changes.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run build` | Run TypeScript build checks and create the production web build in `dist`. |
| `npm run lint` | Run ESLint across the project. |
| `npm run preview` | Preview the production build locally. |
| `npm run cap:sync` | Build the web app and sync `dist` into Android and iOS Capacitor projects. |
| `npm run cap:android` | Build and open the Android project. |
| `npm run cap:ios` | Build and open the iOS project. |
