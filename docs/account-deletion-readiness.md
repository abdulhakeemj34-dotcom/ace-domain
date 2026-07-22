# Account Deletion Readiness

This document prepares Ace Domain for future account deletion requirements. It does not implement destructive deletion, run SQL, or claim store compliance approval.

## Current Account Deletion Status

- In-app account deletion is not implemented yet.
- Public pre-release account deletion instructions exist at `/account-deletion/`.
- Manual support-based deletion will be needed before store submission if in-app deletion is not ready.
- A real monitored support email is not confirmed yet.
- Supabase SQL has been applied, but deletion workflows and data retention rules still need careful backend design.

## Store Requirement Reminder

Before public store submission, users must have a clear way to request or complete account deletion. The final approach should match current Google Play and Apple App Store requirements at the time of submission.

## Data That Would Need Review For Deletion

### Auth Account

- Supabase auth user.
- Session tokens.
- Email identity.
- Any provider metadata.

### Profile

- Display name.
- Username.
- Bio.
- Country/region.
- Interests.
- Profile settings tied to the user.

### Settings

- `user_settings` row.
- Remote preference sync data.
- Related local-only preferences on the user device.

### Posts / Feed

- User posts.
- Comments/replies if implemented live.
- Likes, saves, shares, and post interaction records if stored remotely.

### Community Memberships

- Joined community records.
- Member roles.
- Community posts or moderation history if created by the user.

### Chats / Messages

- Chat thread membership.
- Message records sent by the user.
- Group chat membership.
- Read/unread state.
- Final policy needed: delete, anonymize, or retain messages for other participants according to product/legal rules.

### Notifications

- Notification records.
- Read/unread state.
- Notification delivery preferences.

### Ace AI

- AI prompt/request records if stored later.
- Backend logs if retained by the hosting provider.
- OpenAI processing disclosures if Ace AI is live.

## What May Need Retention Or Anonymization Later

- Safety/reporting records.
- Abuse/moderation evidence.
- Fraud or legal compliance records.
- Group chat continuity records.
- Aggregated non-identifying metrics if analytics are added later.

Any retention/anonymization must be documented in the final privacy policy and reviewed before release.

## Safe Future Implementation Plan

1. Define deletion policy for each Supabase table.
2. Confirm RLS policies and ownership rules.
3. Decide whether deletion is immediate, scheduled, or support-reviewed.
4. Create a backend-only deletion endpoint or secure Supabase Edge Function if needed.
5. Never use service-role keys in frontend code.
6. Add in-app request flow or clear support-based request flow.
7. Add confirmation UX with irreversible-action warnings.
8. Test with a disposable account in a non-production environment.
9. Verify profile, settings, memberships, notifications, and chat policy behavior.
10. Update privacy policy, support docs, and store forms.

## Manual Support Deletion Path For Now

Until in-app deletion exists, the product should provide:

- A real monitored support email.
- Clear instructions for requesting deletion.
- Required identity verification steps that do not ask users to share passwords.
- Expected response timeline.
- Explanation of what can be deleted, retained, or anonymized.

Placeholder support email: `support@acedomain.app` once created and monitored.

## Warnings

- Do not implement destructive deletion blindly.
- Do not delete live Supabase data without backups, RLS review, and table-by-table policy design.
- Do not expose service-role keys in frontend code.
- Do not claim account deletion is complete until the workflow is tested and documented.

## Before Store Submission

- Choose support-based or in-app deletion path.
- Publish account deletion instructions.
- Confirm deletion process with a test account.
- Update privacy policy and store forms.
- Confirm support owner/process.
- Confirm deletion does not break other users' chat/community history unexpectedly.
