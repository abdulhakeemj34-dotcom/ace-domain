# Stage 23E Legal And Support Link Audit

This audit checks where Ace Domain can expose support, privacy, terms, safety, and account deletion links. It now has pre-release public page drafts, but it still does not implement destructive account deletion.

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
- Public pre-release drafts now exist for support, privacy, terms/safety, and account deletion.
- A live monitored support inbox is still not confirmed yet.
- In-app account deletion is not implemented yet.
- Destructive deletion should not be added until backend/RLS policy design is complete.

## In-App Update Made

The About Ace Domain section now links to public pre-release drafts for:

- Support: `/support/`.
- Privacy Policy: `/privacy/`.
- Terms & Safety: `/terms/`.
- Account deletion: `/account-deletion/`.

These links make the Settings rows useful while still labeling the content as pre-release draft material.

## Future Link Targets Needed

- Verified monitored support inbox.
- Final legal review and final public policy copy.
- Production-ready account deletion request flow or in-app deletion flow.

## Store Submission Reminder

Before Play Store or App Store submission, Ace Domain needs final reviewed public support, privacy, terms/safety, and account deletion instructions. Pre-release draft pages are helpful, but they are not final approval.
