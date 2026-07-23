# iOS Build Readiness Checklist

This checklist prepares Ace Domain for a future iOS build and App Store/TestFlight workflow. It does not upload builds, create paid accounts, or claim iOS release readiness.

## Required Local Tools

- macOS is required for real iOS builds.
- Xcode.
- Apple Developer Program membership for device/TestFlight/App Store distribution.
- Node.js and npm.
- CocoaPods if required by the final Capacitor/iOS setup.
- iPhone simulator and preferably a real iPhone for testing.

## Capacitor iOS Setup Status

- Capacitor iOS dependency is installed.
- iOS platform folder is present at `ios/`.
- iOS app folder is present at `ios/App/App`.
- Capacitor config exists in the iOS app folder.
- Web output path is `dist`.
- iOS helper script exists in `package.json`: `npm run cap:ios`.

## Bundle ID

- Planned bundle ID: `com.acedomain.app`.
- Capacitor `appId`: `com.acedomain.app`.
- iOS Info.plist uses Xcode `PRODUCT_BUNDLE_IDENTIFIER`, so final bundle ID must be confirmed in Xcode project settings.

## App Name

- iOS display name: `Ace Domain`.
- Capacitor app name: `Ace Domain`.

## App Icon

- iOS asset catalog exists.
- The iOS app icon asset catalog now contains the Ace Domain 1024x1024 icon source.
- Store-ready source export also exists at `public/store-assets/ace-domain-ios-icon-1024.png`.
- Source-ready brand assets live in `src/assets/brand/`.

## Splash Screen

- iOS splash image set exists.
- Final approved launch/splash assets still need export and device review.
- Runtime startup animation exists inside the app UI, but native launch screen assets still need final native pass.

## Permissions Audit

- No iOS camera, microphone, contacts, location, photo library, or push notification permissions should be requested until real features need them.
- Check Info.plist usage descriptions before any permission-based feature is added.

## Network / Backend Configuration

- Supabase frontend config uses public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- OpenAI and Bedrock keys must remain backend-only.
- Ace AI needs a deployed backend/serverless endpoint for production native builds.
- Local Vite dev middleware is not a production native backend.
- Phone auth retest remains pending after Supabase email cooldown/rate-limit.

## Environment Variable Handling

- Do not commit `.env`.
- Do not print real env values.
- Do not add service-role keys to frontend.
- Do not add `VITE_OPENAI_API_KEY`.
- Do not add `VITE_BEDROCK_API_KEY`.
- Confirm Vite build-time env values are present before syncing native builds.

## Debug / Simulator Build Checklist

1. Use macOS.
2. Run `npm install` if dependencies are missing.
3. Confirm local `.env` exists with safe values.
4. Run `npm run lint`.
5. Run `npx tsc -b --pretty false`.
6. Run `npm run build`.
7. Run `npm run cap:sync`.
8. Open the iOS project in Xcode.
9. Confirm bundle ID and display name.
10. Build/run in an iPhone simulator.
11. Verify app launch, navigation, Settings, demo fallback, and no blank screens.
12. Do not repeatedly test signup/login until Supabase rate-limit cooldown is clear.

## Device Build Checklist

1. Join/configure Apple Developer Program outside this repo.
2. Configure signing team and provisioning profile in Xcode.
3. Connect a physical iPhone.
4. Run the app on device.
5. Verify auth/session after cooldown, settings persistence, chats, communities, profile, Ace AI fallback, and safe layout.
6. Confirm no local dev URLs or localhost-only backend assumptions are used for production behavior.

## TestFlight Checklist

1. Complete phone auth retest.
2. Confirm final app icon in Xcode/App Store Connect; native splash assets still need final review.
3. Prepare privacy/support/account deletion public links.
4. Build a signed archive in Xcode.
5. Upload to App Store Connect.
6. Add test information and test account if needed.
7. Use TestFlight only after backend/live behavior is ready enough for reviewers/testers.

## App Store Submission Blockers

- Phone auth retest.
- Final native splash assets.
- Screenshots.
- Privacy policy URL.
- Support/account deletion public links.
- Signed iOS build.
- Apple Developer account and App Store Connect setup.
- Live backend verification.
- App Privacy answers.

## Windows Limitation

This project can prepare iOS files on Windows, but a real iOS build, simulator run, archive, TestFlight upload, and App Store submission require macOS with Xcode.
