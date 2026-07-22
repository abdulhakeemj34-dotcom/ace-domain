# Stage 17F - Final Phone QA Checklist

Use this checklist after Stage 17B, 17C, 17D, and 17E are built locally.

## Start the App for Phone Testing

1. Make sure the phone and computer are on the same network.
2. Start the dev server with host access:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
3. Open the Network URL shown by Vite on the phone.
4. Do not share or screenshot `.env`, tokens, passwords, or browser storage.

## Auth and Session Restore

1. Open Ace Domain on the phone.
2. Create an account with display name, email address, and password.
3. If Supabase requires email confirmation, confirm the email before testing login.
4. Refresh the phone browser while signed in.
5. Confirm the app stays inside Ace Domain and does not return to the welcome screen.
6. Log out from Profile.
7. Log in again with the same email address and password.
8. Confirm the login screen clearly asks for email/password and does not imply username login.
9. Confirm demo mode is still easy to enter if live auth is unavailable.

## Settings Persistence and Sync

1. Go to Profile > Settings.
2. Change a visible setting such as theme preset, chat wallpaper, sent bubble tone, profile accent, or notification preference.
3. Confirm the Settings status changes to a local/sync state such as `Sync pending`, `Synced`, or `Could not sync, saved on this device`.
4. Refresh the phone browser.
5. Confirm the changed setting is still selected.
6. If signed in, confirm the status does not show a stuck loading state.
7. Confirm empty or stale remote settings do not wipe the local setting.

## Settings Controls

1. Confirm light/system appearance options are disabled or clearly marked as coming soon.
2. Confirm chat wallpaper changes are visible in Chat Room without noisy backgrounds.
3. Confirm sent message tone changes the sent bubble color.
4. Confirm profile accent/banner choices affect Profile.
5. Confirm blocked users/report history controls are marked coming soon and are not fake active buttons.
6. Confirm notification/privacy/language/data-saver toggles still save local preferences.

## Home and Feed

1. Open Home.
2. Confirm feed renders with no blank screen.
3. Try search and clear search.
4. Tap stories and close the story viewer.
5. Try like/comment/share/save local post actions.
6. Confirm live feed failure, if any, shows a friendly local/demo fallback message.

## Communities

1. Open Communities.
2. Search for a visible community name or topic.
3. Clear the search and confirm the full list returns.
4. Use category filters.
5. Open a community detail page and go back.
6. Join/leave a community and confirm the copy is honest about local/live sync.

## Chats

1. Open Chats.
2. Search chats and clear search.
3. Open a direct chat and a group chat.
4. Send a demo/local message.
5. Confirm game and voice buttons are disabled/coming soon, not fake active controls.
6. Confirm live chat failures, if any, show friendly fallback messages.

## Notifications

1. Open Notifications.
2. Use category filters.
3. Mark one notification read/unread.
4. Mark all read.
5. Confirm live notification failure, if any, shows local/demo behavior without raw backend detail.

## Ace AI

1. Open Ace AI from Home.
2. Confirm it is separate from user-to-user chat.
3. Send a prompt if the local/backend endpoint is available.
4. If the AI provider/backend is unavailable, confirm the error is readable and does not expose keys.

## Global Discovery and Calendar

1. Open Global Discovery.
2. Use filters and clear filters.
3. Start Chat from a match and confirm it opens chat without mixing with Ace AI.
4. Open Country Detail and return.
5. Open Calendar.
6. Toggle interested, going, and reminder local states.

## Release Safety

1. Confirm `.env` is not tracked.
2. Confirm `dist` is not tracked.
3. Confirm no service-role key appears in frontend code.
4. Confirm no Supabase/OpenAI/Bedrock secrets appear in UI, docs, or logs.
5. Run final checks:
   ```bash
   npm run lint
   npx tsc -b --pretty false
   npm run build
   ```

## Pass Criteria

- Auth survives refresh.
- Email/password login works after logout.
- Settings persist after refresh.
- Settings status is understandable.
- No dead/fake buttons remain in checked areas.
- Demo/local fallback remains usable.
- No blank screens or stuck loading states appear.
- No secrets are exposed.
