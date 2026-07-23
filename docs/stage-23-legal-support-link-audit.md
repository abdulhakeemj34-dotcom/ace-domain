# Stage 23E Legal And Support Link Audit

This audit checks where Ace Domain exposes support, privacy, terms, safety, and account deletion links. It now has public app pages plus local report/block controls, but it still does not implement destructive backend account deletion.

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
- Public pages now exist for support, privacy, terms/safety, and account deletion.
- Settings Center links to those pages in-app.
- Global Safety includes local report/block controls and local report history.
- A live monitored support inbox still must be confirmed before store submission.
- Backend destructive account deletion is not implemented yet.
- Destructive deletion should not be added until backend/RLS policy design is complete.

## In-App Update Made

The About Ace Domain section links to public pages for:

- Support: `/support/`.
- Privacy Policy: `/privacy/`.
- Terms & Safety: `/terms/`.
- Account deletion: `/account-deletion/`.

These links make the Settings rows useful and avoid dead legal/support controls.

## Future Link Targets Needed

- Verified monitored support inbox.
- Hosted web URLs for Play Console/App Store Connect.
- Final legal review and final public policy copy.
- Production-ready backend account deletion completion flow.

## Store Submission Reminder

Before Play Store or App Store submission, Ace Domain needs final reviewed public support, privacy, terms/safety, and account deletion instructions at hosted URLs. The in-app pages are ready to package, but store consoles still need public web URLs.
