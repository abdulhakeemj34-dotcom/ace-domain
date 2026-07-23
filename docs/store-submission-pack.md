# Store Submission Pack

Date: July 23, 2026.

This pack documents the current Ace Domain store-prep assets and what still needs external store-console work. It does not mean Ace Domain has been submitted or approved.

## Generated Assets

- iOS/App Store icon source: `public/store-assets/ace-domain-ios-icon-1024.png`
- Google Play icon: `public/store-assets/ace-domain-play-icon-512.png`
- Google Play feature graphic: `public/store-assets/ace-domain-feature-graphic-1024x500.jpg`
- iOS native icon catalog image: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- Android launcher PNGs: `android/app/src/main/res/mipmap-*/ic_launcher*.png`
- Android adaptive foreground vector: `android/app/src/main/res/drawable/ic_launcher_foreground.xml`
- Android adaptive background color: `android/app/src/main/res/values/ic_launcher_background.xml`

Regenerate the icon/feature-graphic assets on Windows with:

```bash
npm run store:assets
```

## Native Safety Updates

- Android automatic backup is disabled in `AndroidManifest.xml`.
- Android data extraction rules exclude app data from cloud backup and device transfer.
- Android target SDK remains API 36.
- No new runtime permissions were added.

## Store Copy Starting Points

- Play Store copy draft: `docs/play-store-prep-checklist.md`
- App Store copy draft: `docs/app-store-prep-checklist.md`
- Release handoff: `docs/release-handoff.md`
- Store policy readiness audit: `docs/store-submission-readiness-audit.md`

## Still Required Before Submission

- Host privacy, support, terms, and account deletion pages on stable HTTPS URLs.
- Confirm `support@acedomain.app` exists and is monitored.
- Capture screenshots from real Android and iOS builds.
- Generate final native splash/launch assets after phone/emulator review.
- Configure Android signing outside Git and build a signed `.aab`.
- Configure Apple signing on macOS/Xcode and archive for App Store Connect/TestFlight.
- Complete Google Play Data safety and Apple App Privacy answers honestly.
- Perform final physical Android and iOS QA.

## Safety Rules

- Do not commit `.env`, signing keys, keystores, provisioning profiles, or passwords.
- Do not expose backend-only OpenAI or Bedrock keys in frontend code.
- Do not claim store approval until the app is actually approved.
