# Stage 21 Dead Button Audit

Stage 21A reviewed visible controls across the Ace Domain mobile app without repeatedly testing live signup/login, preserving the Stage 20 auth/session work and the black-first compact social layout.

## Critical Blockers

- None found during source-level control review.

## High Priority Issues To Fix In Stage 21B

- **Chats header new-chat button**: The plus button is labeled as starting a new chat, but it opens an existing/latest thread. It should be disabled or labeled as a future new-chat composer.
- **Home reply preview**: Reply preview looks like a tappable reply thread, but it only increments the local comment count. It should become a static preview or a clearly local interaction.
- **Profile settings row**: The bottom "Settings and privacy" row looks tappable because it has a chevron, but it does not open settings. It should open Settings Center or stop looking tappable.
- **Calendar reminder action**: Reminder is local-only, while the label could imply device/push reminders. It should be labeled as local until native reminders exist.
- **Settings privacy controls**: Some message permission and community invite controls are saved as local preferences but are not enforced by live backend rules yet. They need clearer "Coming soon" or local-only wording.
- **Global safety message controls**: "Who can message me" and stranger request settings are local preferences only and need clearer backend-enforcement messaging.

## Medium Priority Issues

- **Profile World rows**: Some informational rows show chevrons even when they are not navigation controls. Chevron usage should be limited to actual navigation.
- **Ace AI unavailable state**: Error handling is safe, but the visible message can be shorter and more polished.
- **Empty states**: Chat, community, notification, and search empty states are functional but can use tighter, clearer copy.
- **Settings sync warnings**: Existing sync status is safe, but "Could not sync" should read less alarming while still honest.

## Low Priority Issues

- **Communities discovery hint**: The compass action only sets helper text. It works, but the label should stay clear that it is a hint.
- **Post share/comment actions**: These are local demo interactions. They are acceptable for this stage if kept clearly local/demo-safe.
- **Global Discovery filters**: Filters are working local controls and should remain active.
- **Disabled future tools**: Chat game/voice tools, notification delivery options, blocking/report history, and translation automation are already disabled or marked coming soon.

## Screen Findings

| Area | Finding | Classification | Recommended Action |
| --- | --- | --- | --- |
| Bottom navigation | Home, Chat, Communities, Notifications, Profile targets exist and active states are mapped. | Working | Keep. |
| Welcome/Auth | Main path and demo path are wired. Signup/login should not be repeatedly tested until Supabase rate-limit cooldown. | Working with test limit | Keep and avoid repeated live auth attempts. |
| Home/feed | Tabs, search, stories, discovery entry, global match, post likes/comments/share/save are local and responsive. Reply preview is misleading. | Partially working | Make reply preview static or clearly local. |
| Chats | Thread filters, search, open latest, and chat rows work. Plus button is misleading. | Partially working | Disable or mark plus as coming soon. |
| Chat room | Back, send, retry, empty/error states, and composer work. Game and voice tools are disabled. | Working | Keep. |
| Communities | Filters, search, details, join/leave fallback work. Compass hint works as helper text. | Working | Keep, polish copy if needed. |
| Community detail | Back and join/leave work. Member/post sections have safe empty states. | Working | Keep. |
| Notifications | Filters, mark all read, and toggle read state work locally/live-ready. | Working | Polish empty copy if needed. |
| Profile | Edit, Settings header, Settings button, logout, tabs, and local/live profile status work. Bottom settings row is visually tappable but inactive. | Partially working | Make settings row open Settings Center and remove chevrons from non-actions. |
| Settings Center | Visual/chat/profile settings mostly work. Notifications/translation/block/report are disabled. Some privacy controls imply enforcement that is not live yet. | Partially working | Disable or label backend-enforced privacy controls. |
| Global Safety | Privacy display toggles work. Messaging permission controls are local-only and need clearer wording/disabled state. | Partially working | Label enforcement as coming soon. |
| Global Discovery | Back, calendar, filters, clear filters, country detail, and Start Chat work. | Working | Keep. |
| Country detail | Back and informational content work. | Working | Keep. |
| Calendar | Filters and interested/going/reminder state are local. Reminder label needs local-only wording. | Partially working | Rename to local reminder. |
| Ace AI | Back, suggestions, send, loading, and error handling work without mixing with user chat. | Working with backend dependency | Polish unavailable message. |

## Stage 21B-21F Plan

- **21B**: Disable or relabel unfinished controls: chat plus action, local reminder label, backend-enforced privacy controls, profile settings row, and fake reply preview behavior.
- **21C**: Polish user-facing copy for coming soon states, empty states, sync warnings, Ace AI unavailable state, and local fallback messages.
- **21D**: Verify navigation and fix any clear back-flow issues. Calendar should return to the screen that opened it.
- **21E**: Final QA for dead buttons, secrets, build output, lint, TypeScript, and build.
- **21F**: Push Stage 21 commits to GitHub after safety checks pass.

## Manual Phone Testing Later

- Tap each bottom nav item once.
- Open Home story/search/trending/global/calendar/chat entry points.
- Open Chats, enter a room, send one demo-safe message, and return.
- Open Communities, join/leave one room locally, open detail, and return.
- Open Profile, edit local profile, open Settings Center from every visible settings entry, and return.
- Toggle a few local settings, refresh, and confirm settings remain.
- Open Ace AI and verify unavailable/quota messaging stays readable without exposing backend details.
