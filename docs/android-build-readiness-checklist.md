# Android Build Readiness Checklist

This checklist prepares Ace Domain for a future Android build and Play Store track. It does not generate signing keys, upload builds, or claim release readiness.

## Required Local Tools

- Node.js and npm.
- Android Studio.
- Android SDK installed through Android Studio.
- Java/JDK compatible with the Android Gradle setup.
- Gradle wrapper already present in the Android project.
- Android emulator or physical Android phone for testing.

## Capacitor Android Setup Status

- Capacitor Android dependency is installed.
- Android platform folder is present at `android/`.
- Native Android app folder is present at `android/app`.
- Capacitor web output path is `dist`.
- Android helper scripts exist in `package.json`:
  - `npm run cap:sync`
  - `npm run cap:android`

## Package ID / Application ID

- Planned package ID: `com.acedomain.app`.
- Android `applicationId`: `com.acedomain.app`.
- Android namespace: `com.acedomain.app`.
- Capacitor `appId`: `com.acedomain.app`.

## App Name

- Android app label: `Ace Domain`.
- Capacitor app name: `Ace Domain`.

## App Icon / Adaptive Icon

- Current Android icon resource files exist.
- Final approved Ace Domain PNG/adaptive exports are not confirmed as applied.
- Source-ready brand assets exist in `src/assets/brand/`.
- Final Android adaptive foreground/background should be exported and applied later.

## Splash Screen

- Android splash PNG resources exist.
- Final approved splash export still needs device review before replacing native resources.
- Runtime startup animation exists inside the app UI, but native launch screen assets still need final native pass.

## Permissions Audit

- Current Android manifest includes `android.permission.INTERNET`.
- No camera, contacts, media, location, microphone, or notification permissions are currently required by the app stage.
- Add new permissions later only when a real feature requires them.

## Network / Backend Configuration

- Supabase frontend config uses public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- OpenAI key must remain backend-only.
- Native builds must use deployed backend endpoints for Ace AI; local `/api/ai-chat` dev middleware is not a production native backend.
- Phone auth retest remains pending because of Supabase email cooldown/rate-limit.

## Environment Variable Handling

- Do not commit `.env`.
- Do not print real env values.
- Do not add service-role keys to frontend.
- Do not add `VITE_OPENAI_API_KEY`.
- Build-time Vite variables must be prepared before production native builds.

## Debug Build Checklist

1. Run `npm install` if dependencies are missing.
2. Confirm `.env` exists locally with safe values.
3. Run `npm run lint`.
4. Run `npx tsc -b --pretty false`.
5. Run `npm run build`.
6. Run `npm run cap:sync`.
7. Open Android Studio with `npm run cap:android` or directly open `android/`.
8. Build/run on emulator or physical device.
9. Verify app launch, bottom navigation, Settings, demo fallback, and no blank screens.
10. Do not repeatedly test signup/login until Supabase rate-limit cooldown is clear.

## Release Build Checklist

1. Complete phone auth retest.
2. Apply final app icon/adaptive icon/splash assets.
3. Confirm privacy/support/account deletion public links.
4. Verify live backend behavior on Android.
5. Configure release signing outside Git.
6. Build signed Android App Bundle (`.aab`).
7. Test signed release build on a real phone.
8. Keep keystore files, passwords, signing configs, local `.env`, and generated outputs out of Git.

## Signing Key / Keystore Warning

- Do not generate signing keys in this stage.
- Do not commit keystore files.
- Do not commit key passwords.
- Store signing credentials securely outside the repository.

## Play Store Internal Testing Note

Use Play Store internal testing only after:

- A signed release build exists.
- Store listing assets are ready.
- Privacy/data safety answers are prepared.
- Test account and account deletion/support paths are ready.
- Phone auth retest passes.

## Blockers Before Real Android Release

- Phone auth retest.
- Final app icon/splash assets.
- Privacy policy URL.
- Support/account deletion public links.
- Signed release build.
- Live backend verification.
- Store screenshots and feature graphic.
- Play Store data safety answers.
