# Apple App Privacy Draft

Date: July 23, 2026.

This is a draft for App Store Connect App Privacy answers. Final answers must match the submitted build and production providers.

## Privacy Policy URL

Required before submission. Use a stable HTTPS URL, for example:

`https://acedomain.app/privacy/`

## Privacy Choices URL

Optional but recommended because Ace Domain offers account deletion and privacy controls:

`https://acedomain.app/account-deletion/`

## Tracking

Current repo answer: No tracking. No ad SDK or cross-app tracking SDK is present.

## Data Linked To The User

Declare only data actually collected in the submitted production build.

- Contact Info: email address for account auth.
- User Content: profile text, posts, comments, stories, community content, chat messages, safety reports, and Ace AI prompts if those live paths are enabled.
- Identifiers: user ID/session identifiers.
- Other Data: settings/preferences if synced to Supabase.

Primary purpose: App functionality.

## Data Not Currently Present

Do not declare unless added later:

- Location.
- Contacts.
- Photos/videos from device library.
- Microphone/camera data.
- Payment information.
- Advertising data.
- Health/fitness data.
- Browsing history outside Ace Domain.

## Third-Party Processing

- Supabase processes backend/auth data when configured.
- Bedrock or OpenAI processes Ace AI prompts only through backend/serverless code when Ace AI is active.
- If more SDKs are added later, App Privacy answers and any required privacy manifests must be updated.

## Account Deletion

Apple requires apps with account creation to let users initiate account deletion in the app. Ace Domain exposes account deletion instructions through Settings/About pages and `/account-deletion/`. Before final submission, confirm the deletion path is easy to find and the support workflow is monitored.

## Final Review Caution

Do not submit these answers unchanged if production behavior differs from this draft. App Privacy details must be accurate and kept up to date.
