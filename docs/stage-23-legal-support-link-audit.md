# Stage 23E Legal And Support Link Audit

This audit checks where Ace Domain can later expose support, privacy, terms, safety, and account deletion links. It does not publish live legal pages and does not implement destructive account deletion.

## Areas Checked

- Settings Center.
- Profile screen.
- Auth/welcome surfaces.
- Stage 22 store preparation docs.
- Stage 23 support/privacy/account deletion drafts.

## Findings

- Settings Center is the safest current in-app place for support/legal readiness labels.
- Profile already links to Settings Center.
- Auth/welcome surfaces should stay focused on account access and demo mode for now.
- No live support inbox or public privacy URL is confirmed yet.
- In-app account deletion is not implemented yet.
- Destructive deletion should not be added until backend/RLS policy design is complete.

## In-App Update Made

The About Ace Domain section now includes non-tappable status rows for:

- Support / Coming soon.
- Privacy Policy / Draft.
- Terms & Safety / Draft.
- Account deletion / Coming soon.

These rows avoid dead buttons because they are labels/status surfaces, not actions.

## Future Link Targets Needed

- Public support page or monitored email link.
- Public privacy policy URL.
- Public terms/community safety URL.
- Account deletion request page or in-app deletion flow.

## Store Submission Reminder

Before Play Store or App Store submission, Ace Domain needs real public support, privacy, terms/safety, and account deletion instructions. Draft docs are not enough for public release.
