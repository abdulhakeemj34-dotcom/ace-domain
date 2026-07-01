# Ace Domain - Meet the World

A mobile-first social networking app built with React, TypeScript, Vite, Tailwind CSS, and Capacitor.

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

Capacitor is configured with:

- App name: `Ace Domain`
- App ID: `com.acedomain.app`
- Web directory: `dist`

## Environment Safety

Use `.env.example` as the template for local configuration. Real `.env` files are ignored and must not be committed.

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public frontend Supabase config.
- `OPENAI_API_KEY` is backend-only and must never be exposed as `VITE_OPENAI_API_KEY`.

The app stays demo-safe when Supabase or OpenAI configuration is missing.

## Release Checks

Before sharing or building a release candidate, run:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run cap:sync
npm run cap:android
npm run cap:ios
```
