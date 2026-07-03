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

- Needed: final app icon PNG export.
- Play Store target: 512x512 PNG.
- App Store target: 1024x1024 PNG with no transparency.
- Source available: `src/assets/brand/ace-domain-app-icon-master.svg`.
- Status: source ready, final PNG exports missing.

## Android Adaptive Icon

- Needed: adaptive foreground and background assets mapped into Android resource folders.
- Source available:
  - `src/assets/brand/android-adaptive-foreground.svg`
  - `src/assets/brand/android-adaptive-background.svg`
- Status: source ready, final Android resource export not applied.

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
- Source available: no final store graphic yet.
- Status: missing.

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

- Final icon PNG exports.
- Final Android adaptive icon resources.
- Final iOS app icon set.
- Final native splash/launch assets.
- Play Store feature graphic.
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
