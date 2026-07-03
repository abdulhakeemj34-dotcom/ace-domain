# Stage 19 Phone Test Script

Use this script for the next real phone test after Stage 17 settings/auth fixes and Stage 18 responsiveness work.

## Start the app for phone testing

From the project folder:

```bash
npm run dev -- --host 0.0.0.0
```

Open the Network URL shown by Vite on the phone. The phone and computer must be on the same local network.

Do not paste or share local `.env` values during testing.

## Test flow

### 1. Startup and welcome

- App opens without a blank screen.
- Welcome screen fits the phone height.
- `Get started` opens auth.
- `Continue without signup` opens demo/local mode.
- No horizontal scroll appears.

### 2. Signup and login

- Try signup with username/display name, email, and password.
- If Supabase rate limit appears, the message should be friendly and demo mode should be easy to tap.
- Login clearly asks for email and password.
- Login should not imply username login is active.
- Loading state should not get stuck on `Connecting...`.

### 3. Refresh and session restore

- After successful login, refresh the phone browser.
- App should restore the session if Supabase has a valid session.
- Profile sync warning should not log the user out.
- If session restore fails, capture the exact visible message without exposing tokens.

### 4. Settings persistence

- Open Profile, then Settings.
- Change a supported setting such as theme preset, chat wallpaper, profile accent, profile banner, timestamps, or compact mode.
- Refresh the app.
- Confirm the setting remains applied locally.
- If signed in, confirm empty remote settings do not wipe local settings.

### 5. Settings controls

- Confirm active controls visibly change the app where expected.
- Confirm coming-soon controls are disabled or clearly labeled.
- Confirm Global Safety opens and returns correctly.
- Confirm no setting causes a blank screen.

### 6. Home/feed

- Check feed tabs: For you, Following, Global.
- Open stories and close the story viewer.
- Use search.
- Tap post actions: like, comment, share, save.
- Confirm feed rows stay inside the phone width.

### 7. Communities

- Search communities.
- Switch filters.
- Join/leave a community.
- Open a community detail screen and go back.
- Confirm no long community name or topic escapes its row.

### 8. Chats

- Open Chats.
- Search and filter People/Groups.
- Open a chat room.
- Type a message.
- Confirm the chat input stays above the bottom navigation and remains usable with the keyboard open.
- Confirm live/demo fallback messages are understandable.

### 9. Notifications

- Switch notification filters.
- Toggle a notification read/unread.
- Mark all read.
- Confirm category badges and time labels do not overflow.

### 10. Profile

- Check profile header, stats, tabs, and World section.
- Open edit profile.
- Type long text in profile fields.
- Save and confirm the modal closes safely.
- Confirm settings and logout buttons remain tappable.

### 11. Global Discovery, Country Detail, and Calendar

- Open Global Discovery from Home.
- Change filters and clear filters.
- Start Chat from a match card.
- Open Country Detail and go back.
- Open Calendar and test Interested, Going, Reminder.
- Confirm cards remain centered and mobile-first on large phones.

### 12. Ace AI

- Open Ace AI from Home.
- Try a suggested prompt.
- If the backend/OpenAI quota is unavailable, the error should be clear and safe.
- Confirm Ace AI remains separate from user-to-user chat.
- Confirm no OpenAI key appears in the UI or logs.

### 13. Rotation and zoom

- Rotate the phone if possible.
- Try browser zoom or text scaling if available.
- Confirm no major overlap, hidden fixed buttons, or horizontal page scroll.

## Pass criteria

The test passes when:

- App starts and navigates without blank screens.
- Auth/demo fallback is usable.
- Login/session restore works when Supabase returns a valid session.
- Settings persist after refresh.
- Bottom navigation works with one tap.
- Chat and Ace AI inputs remain usable with keyboard open.
- No primary screen has horizontal page scroll.
- Text remains readable on small and large phones.
- Coming-soon controls are not confusing.
- No secrets appear in UI, logs, screenshots, or source.

## Fail criteria

Record a failure if:

- A screen blanks, reloads unexpectedly, or crashes.
- Signup/login gets stuck.
- Settings reset after refresh.
- Any visible button appears tappable but does nothing without explanation.
- Chat input or Ace AI input is covered by the bottom navigation or keyboard.
- Any screen scrolls sideways at page level.
- Text overflows outside a card, bubble, row, or header.
- A secret, token, key, or raw credential appears anywhere visible.

## What to capture for failures

- Screenshot of the broken screen.
- Phone model or browser viewport size.
- Screen name and exact action taken.
- Whether user was signed in or in demo mode.
- Whether keyboard was open.
- Any safe visible error message.
- Do not capture or share passwords, keys, tokens, or `.env` values.

## Do not test yet

These areas are intentionally not part of this phone test unless a later stage activates them:

- Payments, wallet, banking, marketplace, rides, flights, food ordering.
- Voice/video calling.
- Push notifications.
- Real moderation backend for block/report history.
- Username login.
- Production app-store native icon/splash export verification.
