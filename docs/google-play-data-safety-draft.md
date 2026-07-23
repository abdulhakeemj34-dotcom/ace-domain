# Google Play Data Safety Draft

Date: July 23, 2026.

This is a draft checklist for Play Console. Final answers must match the actual production backend, hosted providers, and legal review at submission time.

## Core Position

- App category: Social.
- Account creation: Yes, when Supabase auth is enabled.
- Account deletion: Provide in-app path through Settings/About pages and web path at `/account-deletion/`.
- Privacy policy: Required and available at `/privacy/`, then a hosted HTTPS URL before submission.
- Data encrypted in transit: Yes, production Supabase, hosted backend, and AI provider requests should use HTTPS.
- Data selling: No.
- Advertising ID: Not used in the current app.
- Analytics SDK: Not added in the current app.
- Push notifications permission: Not requested in the current app.

## Data Types Likely Collected

Declare only what is live in the submitted build.

### Personal Info

- Email address: collected for account signup/login when Supabase auth is active.
- Username/display name: collected for profile identity.
- Profile bio/country/interests/avatar metadata: collected if profile editing is active.

Purpose: App functionality, account management, user profile.

### App Activity / App Info

- Settings/preferences: theme, language, accessibility, privacy display choices, notification preferences, data saver, and personalization preferences.

Purpose: App functionality and personalization.

### Messages / User Content

- Posts, comments, stories, communities, chat messages, reports, and profile content when live backend features are enabled.
- Ace AI prompts and replies when Ace AI is connected to the backend endpoint.

Purpose: App functionality, social interaction, safety/moderation, AI response generation.

### Identifiers

- Supabase user ID/session identifiers.

Purpose: Authentication, account management, app functionality.

## Data Sharing Notes

- Supabase may process account/profile/settings/chat/community data as backend infrastructure.
- Bedrock or OpenAI may process Ace AI prompts only through backend/serverless code when Ace AI is active.
- Do not claim "no data sharing" until final production providers and Play Console definitions are reviewed.
- No advertising or data broker sharing is implemented in the current repo.

## Deletion / Retention Draft

- Users can initiate deletion in-app and through the web account deletion page.
- Deletion requests should remove account records and associated data unless legal/safety retention is required.
- If any retention applies, disclose it in the privacy policy and deletion page.

## Play Console Caution

The Data safety form must be updated whenever live features change, including analytics, crash reporting, push notifications, media uploads, location, payments, or advertising.
