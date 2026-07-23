# Store Console Submission Kit

Date: July 23, 2026.

This kit gives Ace Domain copy, links, reviewer notes, privacy-answer starting points, and release commands for Play Console and App Store Connect. It is preparation material, not legal approval and not store approval.

## App Identity

- App name: Ace Domain
- Tagline: Meet the World
- Android package ID: `com.acedomain.app`
- iOS bundle ID target: `com.acedomain.app`
- Primary category: Social / Social Networking
- Secondary category fit: Lifestyle or Communication, depending on final store positioning
- Support email: `support@acedomain.app` once created and monitored

## Hosted URL Map

Use a stable HTTPS domain before submission. Recommended production URLs:

- Privacy Policy: `https://acedomain.app/privacy/`
- Terms and Safety: `https://acedomain.app/terms/`
- Support: `https://acedomain.app/support/`
- Account Deletion: `https://acedomain.app/account-deletion/`
- Ace AI endpoint for native builds: `https://acedomain.app/api/ai-chat`

Temporary Vercel URLs can be used for testing, but final store metadata should use stable production URLs owned by Ace Domain.

## Play Store Metadata

- Title: Ace Domain
- Short description: Meet the world through chats, communities, discovery, and Ace AI.
- Full description:

Ace Domain is a mobile-first global social app built for meeting people, joining communities, discovering cultures, and keeping conversations organized in one premium dark experience.

Explore a compact social feed, open one-on-one and group chats, discover global matches, join interest communities, manage notifications, customize your profile, and use Ace AI for social prompts and discovery help.

Ace Domain is designed around a black-first mobile interface, clear navigation, safety controls, report/block tools, privacy pages, and demo-safe fallback behavior while live Supabase features continue moving toward production readiness.

## App Store Metadata

- Name: Ace Domain
- Subtitle: Meet the World
- Promotional text: Explore global chats, communities, discovery, and Ace AI in a premium mobile social app.
- Keywords: social, chat, communities, global, friends, discovery, profile, AI, culture, gaming
- Description:

Ace Domain is a mobile-first social app designed for global connection. Discover people, join interest communities, follow a compact social feed, manage chats, personalize your profile, and use Ace AI for social prompts and discovery support.

Ace Domain keeps the experience clean, dark, and mobile-focused while offering safety controls, account deletion instructions, privacy pages, and demo-safe fallback behavior as live Supabase features move toward production readiness.

## Reviewer Notes

Use this as a starting point in store review notes:

Ace Domain is a social app with feed, chats, communities, profile, settings, safety controls, and Ace AI. Demo/local fallback is available if live backend services are temporarily unavailable. Login uses email and password. If account creation is rate-limited during testing, reviewers can continue in demo mode while support is contacted for test access. User-generated content features include report and block entry points in Settings > Global Safety. Account deletion instructions are available in Settings and at `/account-deletion/`.

Before final submission, replace this note with real test credentials and hosted production URLs.

## Generated Store Assets

- Play icon: `public/store-assets/ace-domain-play-icon-512.png`
- Play feature graphic: `public/store-assets/ace-domain-feature-graphic-1024x500.jpg`
- App Store icon source: `public/store-assets/ace-domain-ios-icon-1024.png`
- iOS native icon catalog image: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`

## Required Manual Store Forms

- Google Play Data safety: use `docs/google-play-data-safety-draft.md`.
- Apple App Privacy: use `docs/apple-app-privacy-draft.md`.
- Content rating / age rating: complete in the store consoles based on final live feature behavior.

## Release Commands

Run standard checks:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
npm run cap:sync
```

Regenerate store assets:

```bash
npm run store:assets
```

Build signed Android App Bundle after setting local signing environment variables:

```bash
npm run android:bundle:release
```

Do not commit signing keys, passwords, provisioning profiles, or `.env`.

## Still Required Before Submission

- Host stable HTTPS URLs.
- Confirm support inbox is real and monitored.
- Add real reviewer test credentials if account features are gated.
- Capture screenshots from real Android/iOS builds.
- Complete store privacy/data forms honestly.
- Run final physical device QA.
- Build signed release packages outside Git.
