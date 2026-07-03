# Stage 20 Auth Settings Diagnosis

Stage 20 focuses on the real phone issue found after Supabase SQL was applied: signup entered the app, but refresh/login behavior was unreliable, repeated login attempts hit Supabase email rate limits, and settings testing could not continue until auth/session reliability was fixed.

## Files inspected

- `src/lib/supabase.ts`
- `src/services/authService.ts`
- `src/services/profileService.ts`
- `src/services/settingsService.ts`
- `src/app/App.tsx`
- `src/features/auth/AuthScreen.tsx`
- `src/features/settings/settingsStorage.ts`
- `src/features/settings/SettingsCenterScreen.tsx`
- `src/features/settings/GlobalSettingsScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/styles/index.css`

## Current auth flow summary

- Supabase is accessed through a lightweight custom REST/Auth wrapper, not the Supabase JS client.
- Supabase URL and anon key are read from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Signup uses `/auth/v1/signup` with email/password.
- Signup sends display name and generated username as user metadata.
- Username is profile data only; it is not used as the Supabase login identity.
- Login uses `/auth/v1/token?grant_type=password` with email/password only.
- Login screen copy already says username login is not active.
- If signup returns a session, the app stores the session in localStorage.
- If signup returns a user but no session, the app treats it as pending email confirmation.
- Profile creation only runs when a user and session exist.
- Login creates the profile row if it is missing.
- Rate-limit style errors are normalized to a friendly demo-fallback message.

## Current session restore summary

- Stored Supabase session lives in localStorage under `ace-domain.supabase.session`.
- App startup calls `getCurrentSession()` once.
- `getCurrentSession()` reads stored session, refreshes if near expiry, validates `/auth/v1/user`, and clears bad sessions.
- There is no real auth-state subscription because the project is not using the Supabase JS client.
- There is no app-level auth restore loading state; the app starts on Welcome while the stored-session check runs.
- If restore succeeds, App switches to Home and triggers settings sync.
- If restore is delayed or fails, the app remains logged out.

## Current settings flow summary

- Local settings are the immediate source of truth.
- Settings save to localStorage under `ace-domain.app-settings`.
- A local metadata timestamp is stored separately.
- Remote settings load from `user_settings` only when a stored session exists.
- Remote settings are ignored if empty or unusable.
- If local settings are newer than remote settings, local settings seed Supabase.
- Settings changes update React state and localStorage first, then attempt a background remote upsert.
- Remote settings sync currently trusts `getStoredSession()`, not a freshly validated current session.

## Root cause candidates

1. **Email confirmation may be required by Supabase.**  
   If Supabase requires email confirmation, signup can create a user without a usable session. The app should not treat that as a ready login, and the user must confirm the email before login.

2. **Session restore is one-shot and not explicit enough.**  
   App startup checks stored session once, but there is no auth restore state, no retry path, and no explicit restored/demo auth mode. On phone refresh, the app can appear logged out while restore is still pending or if the stored session validation fails.

3. **No auth-state subscription exists.**  
   Because the app does not use the Supabase JS client, auth changes are not observed from a central listener. The current custom wrapper needs a small local auth event mechanism so App can react consistently to login/logout/session storage changes.

4. **Settings/profile sync can run from a stored session instead of a known valid session.**  
   `settingsService` and `profileService` use `getStoredSession()` directly. If the stored session is stale or the auth restore is not complete, remote sync can fail or appear disconnected even though local settings remain safe.

5. **Settings effects are mixed between global and screen-specific surfaces.**  
   Chat wallpaper applies in the chat room, not globally. Profile personalization applies on the profile screen. Light/system appearance is intentionally not ready and is disabled. Some notification/privacy options are local preference toggles with limited visible app-wide effects.

## Recommended Stage 20B-20F fix plan

### 20B - Session Restore Fix

- Add a small auth listener/event helper around the custom stored session flow.
- Make App track auth restore state on startup.
- Restore authenticated state only after `getCurrentSession()` returns a valid session.
- Keep demo fallback separate from real authenticated state.
- Make logout clear app auth state through the same auth change path.

### 20C - Signup/Login Correctness Fix

- Tighten auth copy around email/password login.
- Ensure email-confirmation state clearly says the user must confirm email before logging in.
- Keep rate-limit errors friendly and make demo fallback obvious.
- Avoid any message that implies username login works.

### 20D - Profile + Settings Auth Link Fix

- Add a reusable validated-session helper for profile/settings services.
- Make settings remote sync wait for a valid current session.
- Keep local settings first and never overwrite good local settings with empty/stale remote settings.
- Keep profile/settings failures as non-blocking warnings.

### 20E - Settings Effects + Personalization Controls Fix

- Audit visible settings controls.
- Make supported controls clearly state where they apply.
- Disable or label placeholder-only controls.
- Ensure chat wallpaper, chat bubble controls, profile accents, profile banners, compact mode, high contrast, and theme accent controls visibly affect supported surfaces.

### 20F - Auth + Settings Phone Retest Checklist

- Add a phone retest document for signup, email confirmation, login, refresh session restore, settings persistence, and settings effect checks.
- Include a warning not to repeatedly retry while Supabase says email is temporarily limited.

## What should be fixed now

- Auth restore reliability.
- Login/signup clarity.
- Session-gated profile/settings remote sync.
- Settings controls that look active but do not clearly apply.

## What should remain untouched

- Supabase SQL.
- Service-role keys.
- Ace AI backend/provider logic.
- User-to-user chat realtime logic.
- Black-first compact layout.
- Demo/local fallback.
- Stage 18/19 responsive fixes.
