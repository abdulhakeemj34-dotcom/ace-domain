# Stage 18 Responsive Device QA

Ace Domain is in a black-first compact mobile layout. Stage 18 keeps that direction and focuses on making every primary surface reliable across small phones, large phones, short screens, and tablet-sized webviews.

## Current responsive state

- The app shell is centered, black-first, and capped to a mobile width.
- Most list rows already use `min-w-0`, truncation, or line clamp patterns.
- Bottom navigation uses safe-area padding and pointer-safe icon/label spans.
- Chat and Ace AI inputs are fixed near the bottom navigation and need continued keyboard and short-screen testing.
- Settings, profile, global discovery, and calendar contain the densest controls and need extra 320px verification.
- Several screens use `min-h-screen`, which is acceptable but should be strengthened with dynamic viewport units for mobile browser chrome.

## Risk areas found

### Global shell

- `min-h-screen` is used in the root and several full-height screens. Mobile browser chrome can make this less stable than `100dvh` or `100svh`.
- The main app width is capped to `max-w-md`, but no shared tablet/foldable width rule exists yet for 600px to 768px checks.
- Body horizontal overflow is hidden, but long content still needs component-level wrapping.

### Bottom navigation

- The nav already has a reliable tap target and safe-area padding.
- Long labels such as Notifications need continued narrow-phone truncation checks.
- Content padding must stay aligned with the bottom nav height so feed/chat/profile content is never hidden underneath.

### Headers and top bars

- Sticky headers are compact and generally safe.
- Screens with icon plus long title combinations should keep `min-w-0` on the title block.
- iPhone notch and status-bar spacing should be checked on auth, chat room, global discovery, country detail, and calendar.

### Auth and welcome

- Welcome and auth screens use full-height flex layouts.
- Very short screens need scroll support so bottom actions are reachable.
- Auth status/error messages can become multi-line and should stay inside the phone width.

### Home/feed

- Feed rows use content-first structure and mostly safe truncation.
- Story viewer uses a fixed `min-h-[480px]`, which may be tall on 320 x 568 and short-screen devices.
- Trending horizontal rows are acceptable but must not create page-level horizontal scroll.

### Chats and chat room

- Chat previews now clamp safely, but very long names and message text still need small-phone checks.
- Chat room fixed input must remain above bottom nav and usable with the keyboard open.
- Long group names, activity labels, and safety notices need wrapping or truncation checks.

### Communities

- Community search and filter tabs are horizontal and should not create page overflow.
- Join buttons are compact, but small phones need verification when community names are long.
- Detail headers with Join/Joined buttons need 320px checks.

### Notifications

- Notification title, category badge, and time can compete for space on narrow phones.
- Category filters are horizontal and should remain scroll-only inside the filter row.

### Profile

- Profile header uses stats, signals, actions, tabs, and profile rows.
- Long usernames, handles, bios, and language lists need wrap/truncation checks.
- Edit profile modal already uses `100svh`, which is good for short screens.

### Settings

- Settings is the densest screen.
- Some grid controls use 2 or 3 columns at narrow widths and may need more conservative breakpoints.
- Right-side sync/status pills can squeeze row text on small phones.

### Ace AI

- Ace AI is separated from user-to-user chat.
- Message bubbles have max width and should handle long prompts with wrapping.
- Fixed composer needs the same bottom-nav and keyboard checks as chat room.

## Device test matrix

| Device class | Size to test | Main risk |
| --- | --- | --- |
| Small iPhone style | 320px width | Narrow rows, settings grids, buttons, long labels |
| Normal iPhone style | 375px width | Standard flow, auth, feed, nav, chat composer |
| Large iPhone / Pro Max | 414px to 430px width | Wide cards, bottom nav spacing, centered shell |
| Small Android | 360px width | Compact feed, auth keyboard, chat input |
| Large Android / Samsung | 412px to 430px width | Large phone density, chat list, settings |
| Tall narrow screens | 360px to 393px width with tall height | Sticky headers, long scrolling screens |
| Short screens | 320px to 390px width with short height | Welcome/auth actions, chat composer, modals |
| Tablet/foldable-ish | 600px to 768px width | App max width, centered shell, no stretched cards |

## Stage 18B targets

- Add dynamic viewport and safe-area CSS helpers.
- Strengthen global overflow, tap target, and text wrapping safeguards.
- Keep bottom navigation and fixed composers aligned with shared sizing.
- Avoid changing product direction or data logic.

## Stage 18C targets

- Tighten small-width behavior in Home, Chats, Chat Room, Communities, Notifications, Profile, Settings, Global Discovery, Calendar, and Ace AI.
- Replace risky narrow grids with conservative responsive breakpoints where needed.
- Keep long content inside rows, cards, bubbles, and modals.

## Manual QA rule

For each device size, pass requires:

- No page-level horizontal scrolling.
- Bottom navigation never covers tappable content.
- Chat and Ace AI inputs remain usable.
- Auth and settings messages remain readable.
- Buttons stay tappable and do not overlap.
- Long names, messages, labels, and settings text remain inside their containers.
- Demo/local fallback remains visible and understandable.
