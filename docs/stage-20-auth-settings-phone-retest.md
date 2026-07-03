# Stage 20 Auth Settings Phone Retest

Use this checklist after Stage 20 is built locally. It is focused on real Supabase auth persistence and settings effects.

## Before testing

1. Wait for Supabase email rate-limit cooldown before retesting.
2. Do not repeatedly retry signup while Supabase says email is temporarily limited.
3. Use a fresh test email if needed.
4. Do not capture or share passwords, session tokens, Supabase keys, or `.env` values.

## Start the app

```bash
npm run dev -- --host 0.0.0.0
```

Open the Vite Network URL on the phone.

## Auth retest steps

1. Open Ace Domain on phone.
2. Tap `Get started`.
3. Sign up with:
   - display name / username-style name
   - email address
   - password
4. If Supabase requires email confirmation, confirm the email before logging in.
5. Confirm the app message says: `Check your email to confirm your account before logging in.`
6. Login with email/password only.
7. Confirm username login is not implied or required.
8. Refresh the phone browser.
9. Confirm the user remains logged in if the Supabase session is valid.
10. If login fails, record the exact visible error message.

## Settings persistence retest steps

1. Open Profile.
2. Open Settings Center.
3. Change a supported setting:
   - theme preset
   - chat wallpaper
   - sent message tone
   - chat bubble shape
   - message density
   - profile accent
   - profile banner
   - profile badge
   - compact mode
   - high contrast
4. Confirm the setting changes immediately in the visible preview or supported screen.
5. Refresh the phone browser.
6. Confirm the setting remains.
7. If logged in, confirm local settings are not wiped by empty remote settings.
8. Confirm settings status says synced or safely saved locally.

## Settings effects retest

1. Chat wallpaper should show in the Settings chat preview and in Chat Room.
2. Theme preset should change accent-colored UI elements.
3. Premium dark and Dark appearance should remain black-first and visibly update supported panel feel.
4. Light/System appearance should be disabled or marked coming soon.
5. Profile personalization should show in the profile preview and Profile screen.
6. Chat personalization should show in the chat preview and Chat Room.
7. Notification push controls should be disabled or marked coming soon.
8. Auto-translate controls should be disabled or marked coming soon.
9. No Settings button should look active while doing nothing.

## Logout and restore retest

1. Logout.
2. Confirm the app returns to Welcome.
3. Login again with email/password.
4. Confirm Profile loads or shows a non-blocking sync warning.
5. Confirm Settings restore after login.
6. Refresh again and confirm session remains if valid.

## Pass criteria

The phone test passes when:

- Signup handles email confirmation clearly.
- Login uses email/password only.
- Rate-limit message is friendly and does not auto-retry.
- Valid session survives browser refresh.
- Demo mode remains available but separate from real login.
- Settings save locally first.
- Settings persist after refresh.
- Remote settings do not wipe local settings.
- Working controls visibly take effect.
- Unfinished controls are disabled or marked coming soon.

## Fail criteria

Record a failure if:

- The app enters a blank screen after refresh.
- Login does not accept correct confirmed email/password.
- The app says signup succeeded when email confirmation is still required.
- The app gets stuck on `Connecting...`.
- Settings reset after refresh.
- Empty Supabase settings overwrite local settings.
- A Settings control is tappable but has no effect or explanation.
- Chat wallpaper/theme/profile controls do not visibly apply where promised.

## What to capture

- Phone model or viewport size.
- Whether the user was in live login or demo mode.
- Screenshot of any bad message, reset setting, or dead control.
- Exact visible error text.
- Whether the keyboard was open.
- Do not capture passwords, tokens, keys, or `.env` values.
