# Stage 22A Release Readiness Audit

This audit checks whether Ace Domain is structurally ready for Play Store and App Store preparation. It is not a store submission checklist, legal approval, or production launch approval.

## Current Release State

- App name: **Ace Domain**
- App ID: `com.acedomain.app`
- Web build: Vite output to `dist`
- Native shell: Capacitor Android and iOS folders are present
- Layout direction: black-first compact social mobile app
- Backend: Supabase foundation with demo/local fallback
- AI: backend-only Ace AI endpoint foundation; OpenAI key must stay server-side
- Current known phone blocker: Supabase email signup/login retest is pending because of provider rate-limit cooldown

## Ready Now

- React, TypeScript, Vite, Tailwind, and Capacitor project structure.
- Capacitor config uses the correct app name, app ID, and `dist` web directory.
- Android and iOS native project folders exist.
- README documents setup, scripts, environment safety, and release checks.
- `.env.example` uses placeholders and marks `OPENAI_API_KEY` as backend-only.
- `.gitignore` protects `.env`, `.env.*`, `dist`, node modules, local cache, and TypeScript build info.
- Stage 18 responsive work, Stage 20 auth/session/settings fixes, and Stage 21 dead-button polish are preserved.
- Demo/local fallback remains available when Supabase or OpenAI is unavailable.

## Needs Phone Test

- Signup after Supabase email rate-limit cooldown or with a fresh test email.
- Login after refresh on a real phone.
- Settings persistence after refresh while signed in.
- Demo fallback path on a real phone.
- Core tap-through for Home, Chats, Chat Room, Communities, Notifications, Profile, Settings, Global Discovery, Calendar, and Ace AI.
- Android emulator or device test after a native sync/build.
- iOS simulator/device test on macOS before any App Store planning becomes concrete.

## Needs Production Build Check

- `npm run lint`
- `npx tsc -b --pretty false`
- `npm run build`
- `npm run cap:sync` before native release candidate testing.
- Android Studio debug build and signed release build.
- Xcode archive validation on macOS for iOS.

## Needs Store Asset

- Final app icon PNG exports from the approved AD mark.
- Android adaptive icon foreground/background exports.
- iOS app icon set export.
- Splash screen/native launch image exports.
- Play Store feature graphic.
- Play Store and App Store screenshots from an approved phone build.
- Optional preview/promo visuals after the app is fully testable.

## Needs Legal/Privacy Text

- Public privacy policy URL.
- Support contact email.
- Account deletion instructions.
- Data safety answers for Google Play.
- App privacy details for Apple.
- Terms/community safety language if public social features go live.
- Final legal review before public release. The project docs are preparation notes, not legal advice.

## Needs Backend/Live Feature Completion

- Supabase auth phone retest after rate-limit cooldown.
- Reliable live profile creation/loading.
- Settings sync verification against the real Supabase project.
- Decide which feed/community/post data is demo-only versus live.
- Chat realtime verification against live Supabase tables.
- Notification delivery is not production-live yet.
- Moderation/report/block workflows are not production-live yet.
- Ace AI requires a deployed backend/runtime and valid OpenAI quota.

## Not Needed Yet

- Actual Google Play submission.
- Actual Apple App Store submission.
- Paid developer account setup inside this repo.
- Store upload builds.
- App review responses.
- Production analytics SDK.
- Push notification SDK.
- Payment, wallet, rides, flights, food, marketplace, banking, or other future commerce modules.

## Store Submission Blockers

- Supabase auth phone retest is still pending.
- Production privacy policy is not finalized.
- Store screenshots and native app icon PNG exports are not final.
- Android signing and iOS signing are not complete.
- Live backend readiness has not been fully verified on device.
- Account deletion/support flow needs final public instructions.

## Stage 22 Recommendation

Proceed with store preparation documentation only. Do not submit builds until the phone auth retest passes, final assets exist, privacy/support pages are ready, and native Android/iOS release builds have been tested.
