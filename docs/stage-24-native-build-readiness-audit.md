# Stage 24A Native Build Readiness Audit

This audit checks Ace Domain's structure for future Android and iOS native builds. It does not submit to stores, upload builds, create paid accounts, generate signing keys, or claim native release readiness.

## Current Native State

- Web stack: React, TypeScript, Vite, Tailwind CSS.
- Native wrapper: Capacitor.
- Capacitor app name: `Ace Domain`.
- Capacitor app ID: `com.acedomain.app`.
- Web output path: `dist`.
- Android project folder: present.
- iOS project folder: present.
- Android application ID: `com.acedomain.app`.
- Android app label: `Ace Domain`.
- Android version fields: `versionCode 1`, `versionName "1.0"`.
- iOS display name: `Ace Domain`.
- iOS bundle ID source: Xcode `PRODUCT_BUNDLE_IDENTIFIER`.
- iOS marketing/build versions: Xcode `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION`.

## Ready Now

- `package.json` includes native helper scripts:
  - `cap:sync`
  - `cap:android`
  - `cap:ios`
- `capacitor.config.ts` points Capacitor to `dist`.
- Android and iOS platform folders exist.
- Android manifest includes only the internet permission.
- Android package/application ID matches the planned ID.
- App name is consistent across Capacitor, Android strings, and iOS Info.plist.
- Store prep, support/privacy readiness, and brand asset docs already exist.

## Missing

- Final Android release signing key and secure signing config.
- Final iOS signing team/provisioning setup.
- Final approved native icon/splash PNG exports.
- Public privacy policy URL.
- Public support/account deletion links.
- Real phone auth retest after Supabase rate-limit cooldown.
- Verified local Android debug build path.
- Full physical Android phone walkthrough.
- Verified native iOS simulator/device build on macOS/Xcode.

## Partial

- Native asset catalogs/resources exist, but they still need final approved Ace Domain icon/splash exports.
- iOS project exists, but iOS builds require macOS/Xcode and Apple signing.
- Android debug build path has been verified locally. Release builds still require signing.
- Backend readiness exists at foundation level, but real-device auth/settings/chat/Ace AI behavior still needs verification.

## Needs Manual Install / Tooling

- Node.js and npm.
- Android Studio with Android SDK.
- Java/JDK compatible with the Android Gradle setup.
- Android SDK path should stay local in ignored `android/local.properties`.
- macOS with Xcode for iOS.
- CocoaPods if required by the final Capacitor/iOS setup.
- Physical device or emulator/simulator testing.
- Developer account setup only when Ace is ready for real store work.

## Needs Later Store Setup

- Play Store internal testing track setup.
- Apple TestFlight setup.
- Store app icons, screenshots, feature graphic, descriptions, privacy/data safety forms.
- Signing key/provisioning management outside Git.
- Public policy/support/account deletion URLs.

## Not Required Yet

- Store submission.
- Paid account creation inside this project stage.
- Build upload.
- Signing key generation.
- Push notification setup.
- Analytics SDK.
- Payments, marketplace, rides, food, flights, wallet, banking, or other future modules.

## Blockers Before Real Native Release

- Full Android phone walkthrough and phone auth retest are still pending.
- Final native assets are not exported/applied.
- Public privacy/support/account deletion links are not live.
- Android signing is not configured for release.
- iOS signing and App Store Connect setup are not configured.
- Live backend behavior must be verified on real devices.

## Recommendation

Ace Domain is structurally ready for native build preparation and has passed a local Android debug build. It is not ready for real Android/iOS release builds or store submission until signing, final assets, public policy/support links, production backend routing, and real-device testing are complete.
