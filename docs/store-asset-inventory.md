# Store Asset Inventory

This inventory lists assets Ace Domain will need for future Play Store and App Store preparation. It does not generate final images, submit builds, or replace native platform assets.

## Assets Already In The Repo

Source-ready brand files live in `src/assets/brand/`:

- `ace-domain-mark.svg`
- `ace-domain-app-icon-master.svg`
- `android-adaptive-foreground.svg`
- `android-adaptive-background.svg`
- `ace-domain-splash-source.svg`
- `README.md`

Supporting documentation:

- `docs/native-brand-assets.md`
- `docs/visual-identity-plan.md`

## App Icon

- Ready source/export: final app icon PNG exports are generated from the Ace Domain source artwork.
- Play Store target: 512x512 PNG.
- App Store target: 1024x1024 PNG with no transparency.
- Source available: `src/assets/brand/ace-domain-app-icon-master.svg`.
- Generated exports:
  - `public/store-assets/ace-domain-play-icon-512.png`
  - `public/store-assets/ace-domain-ios-icon-1024.png`
  - `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- Status: generated and committed; final visual check in Play Console/App Store Connect still required.

## Android Adaptive Icon

- Ready source/export: adaptive foreground/background resources are mapped into Android resource folders.
- Source available:
  - `src/assets/brand/android-adaptive-foreground.svg`
  - `src/assets/brand/android-adaptive-background.svg`
- Native resources:
  - `android/app/src/main/res/drawable/ic_launcher_foreground.xml`
  - `android/app/src/main/res/values/ic_launcher_background.xml`
  - Android mipmap launcher PNGs regenerated from Ace Domain artwork.
- Status: applied for build readiness; final emulator/phone launcher visual check still required.

## Splash Screen / Launch Image

- Needed: native launch/splash assets after device review.
- Source available: `src/assets/brand/ace-domain-splash-source.svg`.
- Status: source ready, final platform-specific exports missing.

## Startup Image / Brand Reveal

- Runtime startup animation already exists as app UI.
- Native splash/launch screens still need final platform exports.
- Status: app-side brand direction ready; native export pending.

## Play Store Feature Graphic

- Needed: 1024x500 feature graphic.
- Generated export: `public/store-assets/ace-domain-feature-graphic-1024x500.jpg`.
- Status: generated and committed; final Play Console preview check still required.

## Screenshots Needed

Capture from real tested builds:

- Welcome/auth/demo entry.
- Home/feed.
- Chats list.
- Chat room.
- Communities.
- Global Discovery.
- Profile.
- Settings.
- Ace AI only if backend behavior is production-ready.

Status: missing final store screenshots.

## Text Assets Needed

- Short promo text.
- Full description.
- App Store subtitle.
- App Store promotional text.
- Keywords.
- Release notes.
- Support email.
- Privacy policy URL.
- Website/landing page URL.

Drafts exist in:

- `docs/play-store-prep-checklist.md`
- `docs/app-store-prep-checklist.md`

Status: drafts ready, final public copy pending.

## Support And Policy Assets

- Needed: public support email.
- Needed: public privacy policy URL.
- Needed: account deletion instructions.
- Needed: data safety/app privacy answers.
- Status: draft audit exists in `docs/privacy-data-safety-audit.md`; final public/legal text missing.

## Demo/Test Account

- Needed: App Review/Play review test account if live account features are required.
- Blocker: Supabase email rate-limit cooldown and phone auth retest are still pending.
- Status: not ready.

## Website / Landing Page Placeholder

- Needed later: public landing page or support page URL.
- Status: not created in this repo.

## Missing Before Real Store Submission

- Final native splash/launch assets.
- Real device screenshots.
- Public support email.
- Public privacy policy URL.
- Account deletion instructions.
- Review/test account.
- Signed Android release build.
- Signed iOS archive.

## Safety Notes

- Do not commit `.env`.
- Do not commit secrets, signing keys, provisioning profiles, keystore passwords, or generated build output.
- Do not commit large generated image sets until the final native asset pass is approved.
- Do not claim store submission or approval until it actually happens.
