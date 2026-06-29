# Ace Domain - Meet the World

A mobile-first social networking app built with React, TypeScript, Vite, Tailwind CSS, and Capacitor.

## Version 1

- Welcome and account access flow
- Home feed with posts, stories, AI search, and Global Match
- Trending global conversations
- Mini-games preview cards for the future game hub
- One-on-one and group chat surfaces, including a Stage One chat room UI
- Interest communities for Gaming, Anime, Music, Football, Coding, Campus, and Global
- Notifications
- Profile and account-ready UI
- Native Android and iOS project setup through Capacitor

## Architecture

The app is organized by product feature under `src/features`, shared UI under `src/components`, app-level data/types under `src/app`, native-ready page exports under `src/pages`, navigation under `src/navigation`, and future product expansion points under `src/platform`.

Future modules are intentionally registered as planned architecture only: authentication, database, realtime chat, voice/video, translation, mini-games, creator economy, marketplace, food ordering, clothes shopping, ride booking, flights, hotels, wallet, payments, and banking features.

Capacitor is configured with:

- App name: `Ace Domain`
- App ID: `com.acedomain.app`
- Web directory: `dist`

## Scripts

```bash
npm install
npm run dev
npm run build
npm run cap:sync
npm run cap:android
npm run cap:ios
```
