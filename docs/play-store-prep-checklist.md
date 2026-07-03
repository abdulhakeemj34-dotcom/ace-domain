# Google Play Prep Checklist

This checklist prepares Ace Domain for a future Google Play submission. Nothing here means the app has been submitted, approved, or uploaded.

## App Identity

- App name: **Ace Domain**
- Package ID: `com.acedomain.app`
- Repository name: `ace-domain`
- Product direction: premium black-first global social app for chats, feed, communities, discovery, profile, settings, and Ace AI.

## Store Listing Drafts

### Short Description Draft

Meet the world through chats, communities, global discovery, and Ace AI.

### Full Description Draft

Ace Domain is a mobile-first global social app built for meeting people, joining communities, discovering cultures, and keeping conversations organized in one premium dark experience.

Use Ace Domain to explore a social feed, open one-on-one and group chats, discover global matches, join interest communities, manage notifications, customize your profile, and use Ace AI for social prompts and discovery help.

The current app is prepared with demo-safe fallback behavior while Supabase-powered live features continue moving toward production readiness.

### Category Recommendation

- Primary category: Social
- Secondary fit: Communication / Lifestyle, depending on final store positioning.

### Target Users

- People who want global social discovery and chat.
- Students, creators, gamers, culture explorers, and community builders.
- Mobile-first users who prefer compact dark social apps.

## Visual Assets Needed

- Final 512x512 Play Store app icon PNG.
- Android adaptive icon foreground/background exports.
- Feature graphic: 1024x500.
- Phone screenshots from a tested Android build.
- Optional tablet screenshots after tablet QA.
- Optional promo video only after the product is fully stable.

## Screenshot List

- Welcome/auth/demo entry.
- Home/feed.
- Chats list.
- Chat room.
- Communities.
- Global Discovery.
- Profile.
- Settings.
- Ace AI unavailable/available state, only when backend behavior is production-ready.

## Privacy And Policy Requirements

- Public privacy policy URL.
- Support email.
- Account deletion instructions.
- Data safety form answers.
- User-generated content/moderation notes if public posting/chat is active.
- Clear statement for demo/local fallback behavior if shown during testing.

## Data Safety Form Preparation

Prepare answers for:

- Account data: email, username, profile details.
- User content: posts, communities, chat messages when live backend is active.
- App activity: settings/preferences, notifications, local state.
- AI prompts: Ace AI messages sent to backend/OpenAI only when the AI endpoint is active.
- Data retention and deletion: needs final product/legal decision before launch.
- Data encryption in transit: Supabase/OpenAI HTTPS paths; confirm final deployment setup.
- Data sharing: do not claim "no sharing" until Supabase/OpenAI/hosting behavior is finalized.

## Permissions Audit

- Confirm Android manifest permissions before release.
- Avoid unnecessary device permissions.
- Push notifications are not production-active yet.
- Camera/photo/media access should not be requested unless a real feature needs it.
- Location access should not be requested unless a future live feature truly requires it.

## Account And Test Access

- Test account will be required for review if live account features are enabled.
- Supabase email rate-limit must be cleared before reliable signup/login testing.
- Demo mode should remain available for local/basic review, but it should not replace required test credentials if Google needs account access.
- Account deletion/support instructions must be public before submission.

## Backend Requirements

- Supabase auth/session retested on a real Android device.
- Profile row creation/loading verified.
- Settings sync verified after refresh.
- Feed/community/chat/notification live behavior clearly separated from demo fallback.
- Ace AI backend deployed securely if AI is listed as a live feature.
- OpenAI key remains backend-only.

## Android Build And Signing Checklist

- Run `npm run lint`.
- Run `npx tsc -b --pretty false`.
- Run `npm run build`.
- Run `npm run cap:sync`.
- Open Android project in Android Studio.
- Confirm app ID `com.acedomain.app`.
- Confirm app name `Ace Domain`.
- Generate or configure release signing key securely outside Git.
- Build Android App Bundle (`.aab`) for release.
- Test signed release build on a real Android phone.
- Confirm `.env`, signing files, keystore passwords, and generated build output are not committed.

## Blocked Until Phone Auth Test Passes

- Real signup/login listing claims.
- Reliable review test account setup.
- Public release candidate upload.
- Data safety answers involving live account data.
- Final production screenshots showing account flows.

## Not Yet Needed

- Actual Play Console submission.
- Paid developer account action inside this repo.
- Production analytics SDK.
- Push notification SDK.
- Payment, wallet, rides, flights, food, marketplace, banking, or other future modules.
