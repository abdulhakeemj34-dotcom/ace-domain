# Store Submission Readiness Audit

Date: July 23, 2026.

This audit checks Ace Domain against high-risk Apple App Store and Google Play rejection areas. It is not legal approval and does not submit the app to either store.

## Official Policy Areas Checked

- Apple App Review Guideline 1.2 requires user-generated-content apps to include filtering, reporting, blocking, and published contact information.
- Apple account deletion guidance requires apps with account creation to make account deletion easy to find in-app and to offer full account deletion rather than only deactivation.
- Apple App Review Guideline 5.1.1 requires an accessible in-app privacy policy that explains data collection, third parties, retention, and deletion.
- Google Play User Generated Content policy requires terms, in-app reporting, blocking, and ongoing moderation appropriate for UGC/social features.
- Google Play User Data policy requires a privacy policy, Data safety consistency, and both in-app and external account deletion paths when account creation is offered.
- Google Play target API level requirement for new apps and updates is Android 16/API 36 starting August 31, 2026. Ace Domain already targets API 36.

## Risks Found

- Public pages were labeled as draft/pre-release, which can look incomplete to app review.
- Settings legal/support links still used "Open draft" wording.
- Report/block controls were visible but disabled/coming soon.
- Account deletion was only a draft page, not a clear request initiation path.
- Ace AI had safety language but no direct unsafe-output report path.

## Fixes Made

- Converted public pages into app-facing pages without draft/pre-release wording:
  - `/privacy/`
  - `/support/`
  - `/terms/`
  - `/account-deletion/`
- Added a mailto-based account deletion request starter.
- Added local Safety & Moderation controls in Global Safety:
  - block user locally
  - unblock user locally
  - save safety report locally
  - send safety report to support
  - view recent local report history
- Updated Settings Center:
  - blocked users and report history now open Global Safety
  - legal/support/account deletion links use "Open" instead of "Open draft"
- Added Ace AI unsafe-output report link.
- Updated README and release handoff docs to reflect public pages and remaining hosted URL requirements.

## Remaining Non-Code Store Requirements

- Create and monitor `support@acedomain.app`.
- Deploy/host the public pages on a stable HTTPS URL for Play Console and App Store Connect.
- Complete Google Play Data safety answers to match final behavior.
- Complete Apple App Privacy details to match final behavior.
- Confirm whether an iOS privacy manifest is required after generating an Xcode archive/privacy report.
- Prepare final app icons, splash assets, screenshots, signing keys, and release builds.
- Perform a final physical Android test and an iOS test on macOS/Xcode before submission.
- Implement backend moderation and destructive account deletion completion before large public launch.

## Current Store Readiness Result

Ace Domain is more acceptable structurally after this pass: public policy surfaces exist, in-app privacy links exist, report/block controls are no longer dead, account deletion can be initiated, and Android target API is current.

The project is still not ready to submit until external store-console items, hosted policy URLs, support inbox verification, signed release builds, and device QA are complete.
