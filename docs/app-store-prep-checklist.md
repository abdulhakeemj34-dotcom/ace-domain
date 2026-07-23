# Apple App Store Prep Checklist

This checklist prepares Ace Domain for a future Apple App Store submission. It does not mean the app has been submitted, approved, uploaded, or reviewed by Apple.

## App Identity

- App name: **Ace Domain**
- Bundle ID target: `com.acedomain.app`
- Product direction: premium black-first global social app for feed, chats, communities, discovery, profile, settings, and Ace AI.

## App Store Listing Drafts

### Subtitle Draft

Meet the World

### Promotional Text Draft

Explore global chats, communities, discovery, and Ace AI in a premium mobile social app.

### Description Draft

Ace Domain is a mobile-first social app designed for global connection. Discover people, join interest communities, follow a compact social feed, manage chats, personalize your profile, and use Ace AI for social prompts and discovery support.

Ace Domain keeps the experience clean, dark, and mobile-focused while preserving demo-safe fallback behavior as live Supabase features move toward production readiness.

### Keywords Draft

social, chat, communities, global, friends, discovery, profile, AI, culture, gaming

### Category Recommendation

- Primary category: Social Networking
- Secondary fit: Lifestyle, depending on final product positioning.

## Screenshots Needed

Capture from a real iPhone simulator/device after final iOS build testing:

- Welcome/auth/demo entry.
- Home/feed.
- Chats list.
- Chat room.
- Communities.
- Global Discovery.
- Profile.
- Settings.
- Ace AI, only if the backend behavior is production-ready.

Recommended sizes to prepare later:

- 6.7-inch iPhone screenshots.
- 6.5-inch iPhone screenshots if required by current App Store Connect rules.
- 5.5-inch iPhone screenshots if still requested for compatibility.
- iPad screenshots only if the app is positioned and tested for iPad.

## Visual Assets Needed

- Final 1024x1024 app icon PNG with no transparency is generated at `public/store-assets/ace-domain-ios-icon-1024.png`.
- iOS app icon asset catalog now contains the Ace Domain 1024x1024 icon source.
- Native launch/splash assets if required by final iOS presentation.
- Optional preview video only after the app is fully testable and stable.

## Privacy Requirements

- Public privacy policy URL.
- App Privacy details in App Store Connect.
- Support contact.
- Account deletion instructions.
- User-generated content/moderation notes if public posts/chats are active.
- Final review of Supabase/OpenAI data handling before listing.

## App Privacy Details Preparation

Prepare answers for:

- Contact info: email if used for account auth.
- User content: posts, profile, communities, chats/messages when live.
- Identifiers: Supabase user ID/session behavior.
- Usage data: only if analytics are added later.
- Diagnostics: only if crash/error reporting is added later.
- AI prompts: Ace AI content sent to backend/OpenAI only when the AI endpoint is active.
- Data linked to user: depends on final Supabase tables and auth state.

Do not claim final privacy behavior until live backend and deployment are verified.

## Sign-In And Account Behavior

- Login should clearly use email/password.
- Demo/local fallback remains available, but App Review may require a real test account if account features are gated.
- Supabase email rate-limit must clear before final signup/login retest.
- Profile creation/loading and session restore must pass on iOS before submission.

## Account Deletion And Support

- Provide a support email before submission.
- Provide account deletion instructions before submission.
- If account deletion is not in-app yet, document the support-based deletion path clearly and verify it meets current Apple requirements before release.

## iOS Build And Signing Checklist

- Run `npm run lint`.
- Run `npx tsc -b --pretty false`.
- Run `npm run build`.
- Run `npm run cap:sync`.
- Open the iOS project on macOS with Xcode.
- Confirm bundle ID `com.acedomain.app`.
- Confirm display name `Ace Domain`.
- Configure signing team and provisioning profile outside Git.
- Test on iPhone simulator.
- Test on a real iPhone if available.
- Archive and validate only after all phone auth/backend blockers are cleared.
- Keep signing credentials, provisioning files, local `.env`, and build output out of Git.

## Capacitor/iOS Readiness Note

The repository has an iOS Capacitor project folder. Final App Store readiness still requires macOS/Xcode testing, signing setup, asset export into the native asset catalog, and App Store Connect configuration.

## Blocked Until Phone Auth Test Passes

- Reliable App Review test account setup.
- Claims about live signup/login.
- Final screenshots showing account flows.
- Production App Privacy answers for live account data.
- App Store upload/archive validation.

## Not Yet Needed

- App Store submission.
- Paid Apple Developer account action inside this repo.
- App Review replies.
- Production analytics SDK.
- Push notification SDK.
- Payment, wallet, rides, flights, food, marketplace, banking, or other future modules.
