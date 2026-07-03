# Privacy And Data Safety Draft Audit

This document is a practical preparation audit for Ace Domain store readiness. It is not a final legal privacy policy, not legal advice, and not a compliance approval.

## Current Data Model Summary

Ace Domain is a mobile-first social app with local/demo fallback and Supabase-ready live features. Some data is stored on-device through localStorage. Live account, profile, settings, feed, community, chat, and notification data can sync through Supabase when configured and when the relevant backend tables/policies are active.

## User Account Data

- Potential data: email, password handled by Supabase auth, user ID/session tokens, username/display name.
- Local storage: Supabase session metadata may be stored locally for session restore.
- Remote storage: Supabase auth and profile tables when live auth is used.
- Store form note: Account data is linked to the user when live auth is active.
- Needs final review: account deletion process, support contact, retention policy.

## Profile Data

- Potential data: display name, username, bio, country/region, interests, avatar initials/style settings.
- Local storage: demo/local profile and app personalization can remain on device.
- Remote storage: profile service can sync profile fields to Supabase for signed-in users.
- Needs final review: which profile fields are public, private, editable, and deletable.

## Posts And Feed Data

- Potential data: posts, likes, saves, comments, shares, story/feed demo interactions.
- Current status: feed behavior includes mock/local fallback and Supabase-ready service paths.
- Remote storage: live posts/feed require final Supabase verification.
- Needs final review: user-generated content moderation, reporting, retention, deletion.

## Communities

- Potential data: joined communities, community posts, member preview data, join/leave state.
- Current status: demo/local fallback exists; live community tables/services are prepared.
- Remote storage: live communities and joins depend on Supabase readiness.
- Needs final review: moderation/admin tooling and community safety process before public launch.

## Chats And Messages

- Potential data: one-on-one messages, group messages, thread membership, timestamps, read/unread state.
- Current status: demo fallback and Supabase realtime foundation exist.
- Remote storage: live chat messages and thread data use Supabase when configured.
- Store form note: messages are user content and may be linked to the user when live chat is active.
- Needs final review: message deletion, blocking/reporting, moderation, retention, and export policy.

## Notifications

- Potential data: notification items, read/unread state, notification category.
- Current status: local/demo notification behavior exists; push delivery is not production-active.
- Remote storage: live notification records may use Supabase when active.
- Not implemented yet: device push notification SDK/workers.

## Settings And Preferences

- Potential data: theme, accessibility, privacy display options, language/region, chat appearance, profile presentation, data-saver preferences.
- Local storage: settings save locally first.
- Remote storage: signed-in settings can sync to Supabase `user_settings`.
- Store form note: preferences may be linked to account if remote sync is active.
- Needs final review: settings deletion when account is deleted.

## Ace AI Usage

- Potential data: prompts typed into Ace AI and assistant replies.
- Current status: Ace AI is separate from user-to-user chat.
- Backend behavior: frontend calls `/api/ai-chat`; `OPENAI_API_KEY` must stay backend-only.
- Remote processing: prompts may be processed by OpenAI when the backend endpoint is deployed and quota is available.
- Needs final review: AI prompt retention, third-party processing disclosure, user-facing privacy copy.

## Supabase Usage

- Public frontend config: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Secret keys: service-role keys must never be used in frontend.
- Remote data: auth, profiles, settings, posts, communities, chats, and notifications depending on feature activation.
- Needs final review: RLS policies, retention, deletion, exports, support workflow.

## Local Storage

Ace Domain may store:

- App settings and settings saved timestamp.
- Global profile/onboarding preferences.
- Global safety settings.
- Supabase session metadata for session restore.
- Demo/local UI state as needed.

Local storage improves offline/demo behavior but must be considered in privacy/support instructions.

## Analytics Future Note

No production analytics SDK is required for this stage. If analytics, crash reporting, or monitoring are added later, update this audit, store privacy forms, README, and the public privacy policy before release.

## Not Implemented Yet

- Push notifications.
- Production moderation/report/block backend.
- Production account deletion UI.
- Payments, wallet, rides, flights, food, marketplace, banking, or commerce modules.
- Production analytics/crash reporting.
- Final legal privacy policy.

## Final Review Needed Before Store Submission

- Confirm live Supabase tables and RLS policies.
- Confirm data deletion and account deletion path.
- Confirm support email and privacy policy URL.
- Confirm OpenAI processing disclosures if Ace AI is listed as live.
- Confirm message/chat retention rules.
- Confirm public profile visibility behavior.
- Complete Google Play Data Safety form based on final behavior.
- Complete Apple App Privacy details based on final behavior.
- Have the final privacy policy reviewed outside this preparation document.
