# Store Reviewer Notes Draft

Date: July 23, 2026.

Use this as a draft for Play Console/App Store Connect review notes. Replace placeholders before submission.

## Suggested Reviewer Note

Ace Domain is a mobile-first social app with feed, chats, communities, notifications, profile, settings, Global Discovery, Calendar, and Ace AI surfaces.

Login uses email and password. Demo mode remains available for basic review if live backend services are temporarily unavailable. If account creation is rate-limited during review, please use the provided test credentials or continue with demo mode while contacting support.

Safety controls are available in Settings > Global Safety. Users can locally block users, create safety reports, and send reports to support. Privacy, support, terms/safety, and account deletion pages are available from Settings/About and through the public hosted links.

Ace AI is separate from user-to-user chat. AI provider keys are backend-only and are not included in frontend code.

## Replace Before Submission

- Test account email: `[add reviewer test email]`
- Test account password: `[add reviewer test password]`
- Privacy URL: `[add hosted privacy URL]`
- Support URL: `[add hosted support URL]`
- Account deletion URL: `[add hosted account deletion URL]`
- Any region/device limitations: `[add if needed]`

## Do Not Claim Unless Verified

- Do not claim live AI replies work unless the deployed backend provider has quota/access.
- Do not claim real-time chat production readiness unless Supabase live tables and RLS are verified.
- Do not claim account deletion completion unless the support/backend workflow is monitored and tested.
