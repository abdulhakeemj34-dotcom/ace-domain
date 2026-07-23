# Android Build Readiness Checklist

This checklist prepares Ace Domain for a future Android build and Play Store track. It does not generate signing keys, upload builds, or claim release readiness.

## Required Local Tools

- Node.js and npm.
- Android Studio.
- Android SDK installed through Android Studio.
- Java/JDK compatible with the Android Gradle setup.
- Gradle wrapper already present in the Android project.
- Android emulator or physical Android phone for testing.
- Ignored `android/local.properties` may be used locally to point Gradle to the Android SDK.

## Capacitor Android Setup Status

- Capacitor Android dependency is installed.
- Android platform folder is present at `android/`.
- Native Android app folder is present at `android/app`.
- Capacitor web output path is `dist`.
- Local debug build has succeeded with `.\gradlew.bat assembleDebug`.
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
- Ace Domain launcher PNGs and adaptive icon foreground/background resources are applied.
- Source-ready brand assets exist in `src/assets/brand/`.
- Run `npm run store:assets` to regenerate icon exports after brand changes.

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
- OpenAI and Bedrock keys must remain backend-only.
- Native builds must use deployed backend endpoints for Ace AI; local `/api/ai-chat` dev middleware is not a production native backend.
- Phone auth retest remains pending because of Supabase email cooldown/rate-limit.

## Environment Variable Handling

- Do not commit `.env`.
- Do not print real env values.
- Do not add service-role keys to frontend.
- Do not add `VITE_OPENAI_API_KEY`.
- Do not add `VITE_BEDROCK_API_KEY`.
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
2. Confirm final app icon/adaptive icon on emulator or phone; native splash assets still need final review.
3. Confirm privacy/support/account deletion public links.
4. Verify live backend behavior on Android.
5. Configure release signing outside Git using local environment variables:
   - `ACE_DOMAIN_ANDROID_KEYSTORE_PATH`
   - `ACE_DOMAIN_ANDROID_KEYSTORE_PASSWORD`
   - `ACE_DOMAIN_ANDROID_KEY_ALIAS`
   - `ACE_DOMAIN_ANDROID_KEY_PASSWORD`
6. Build signed Android App Bundle (`.aab`) with `npm run android:bundle:release`.
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
- Final native splash assets.
- Privacy policy URL.
- Support/account deletion public links.
- Signed release build.
- Live backend verification.
- Production Ace AI backend route.
- Store screenshots.
- Play Store data safety answers.
