# Stage 17A - Real App Functionality Audit

## Scope

This audit reviews the real-app functionality issues found after Stage 16 Supabase SQL was applied and the app was tested on a phone. It does not change app code, schema, secrets, or provider strategy.

## Critical Blockers

1. Auth/session restore is not reliable enough for real phone use.
   - Files involved: `src/features/auth/AuthScreen.tsx`, `src/services/authService.ts`, `src/lib/supabase.ts`, `src/app/App.tsx`.
   - The app stores the Supabase session locally, but refresh restoration only validates the stored access token through `/auth/v1/user`.
   - There is no refresh-token recovery path when the access token is expired or rejected.
   - If session validation fails after refresh, `getCurrentSession()` clears the stored session and returns the user to unauthenticated state.
   - This can also stop settings/profile sync because the app no longer has an authenticated user.

2. Login expectations are unclear after signup.
   - Files involved: `src/features/auth/AuthScreen.tsx`, `src/services/authService.ts`.
   - Signup accepts display name, email, and password.
   - Login accepts email and password only.
   - The app derives a backend username from email, but it does not support username login yet.
   - If the user expects to login with username plus password, login will fail or be blocked by the email input.

3. Settings controls are visible for options whose visual effect is flat, scoped, or not truly implemented after the black-first redesign.
   - Files involved: `src/features/settings/SettingsCenterScreen.tsx`, `src/styles/index.css`, `src/features/profile/ProfileScreen.tsx`, `src/features/chats/ChatRoomScreen.tsx`, `src/app/App.tsx`.
   - `themePreset` changes app CSS variables, but much of the app now uses black/white styling, so the selected theme may be barely visible.
   - `appearanceMode` has dark/light/system choices, but all modes currently resolve to black-first styling.
   - `chatWallpaper` choices are all rendered as black in CSS.
   - `sentBubbleTone` choices all render the sent bubble as white/black.
   - `profileAccentColor` is not applied to the real profile because `ProfileScreen` hardcodes `--profile-accent` to white.
   - `profileBannerPreset` variations all resolve to the same dark background.

## High Priority Issues

1. Settings persistence needs visible status and phone verification.
   - Files involved: `src/features/settings/settingsStorage.ts`, `src/services/settingsService.ts`, `src/app/App.tsx`.
   - Local storage uses the key `ace-domain.app-settings` and writes through `writeAppSettings()`.
   - Supabase `user_settings` sync is local-first and safely ignores empty remote settings.
   - Remote saves happen in the background and failures are silent in the UI.
   - If auth/session is lost on refresh, remote settings will not load or save.
   - The phone report may be a true persistence failure, a lost auth-session problem, or a perceived failure because theme/wallpaper controls have little visible effect.

2. Profile creation/sync warning is too passive for real account setup.
   - Files involved: `src/services/authService.ts`, `src/services/profileService.ts`, `src/features/auth/AuthScreen.tsx`, `src/features/profile/ProfileScreen.tsx`.
   - Signup creates a profile when a session exists.
   - If Supabase profile upsert fails, the warning is shown but account access can continue.
   - The app should make profile/session sync state clearer after signup.

3. Supabase errors are safely caught, but some raw backend messages may still be user-facing.
   - Files involved: `src/services/authService.ts`, `src/services/settingsService.ts`, `src/services/profileService.ts`, `src/services/postService.ts`, `src/services/communityService.ts`, `src/services/chatService.ts`, `src/services/notificationService.ts`.
   - Rate-limit and network auth errors are friendly.
   - Other Supabase errors can still surface as raw messages.

## Medium Priority Issues

1. Feed is live-ready but still read-only for real posts.
   - Files involved: `src/features/feed/HomeScreen.tsx`, `src/services/postService.ts`.
   - `getFeedPosts()` reads `posts` from Supabase and falls back to mock posts when empty or unavailable.
   - Post like/comment/share/save actions are local state only.
   - `createPost()` exists but is not connected to a visible composer.

2. Communities are live-ready for list and membership, but search and detail content are still partly local.
   - Files involved: `src/features/communities/CommunitiesScreen.tsx`, `src/features/communities/CommunityDetailScreen.tsx`, `src/services/communityService.ts`.
   - `getCommunities()` reads Supabase and falls back to mock data.
   - Join/leave attempts live sync when signed in, otherwise local status is shown.
   - The community search bar is visible but not connected to local filtering.
   - Community detail posts and member previews come from local mock data.

3. Chats are stable with fallback, but live thread creation/membership is limited.
   - Files involved: `src/features/chats/ChatsScreen.tsx`, `src/features/chats/ChatRoomScreen.tsx`, `src/features/chats/useChatThreads.ts`, `src/features/chats/useChatMessages.ts`, `src/services/chatService.ts`.
   - Chat threads and messages fall back to demo data safely.
   - Demo thread IDs do not open live realtime subscriptions.
   - Sending in demo rooms stays local.
   - Live direct/group creation exists in service code but is not fully productized in the UI.

4. Notifications are safe but mostly local/demo unless user notifications exist.
   - Files involved: `src/features/notifications/NotificationsScreen.tsx`, `src/services/notificationService.ts`.
   - Notifications read Supabase when signed in.
   - Empty or unavailable live rows fall back to mock notifications.
   - Mark read/all read updates Supabase when possible, otherwise local state remains usable.

5. Ace AI handles backend errors safely.
   - Files involved: `src/features/ai/AiChatScreen.tsx`, `src/services/aiChatService.ts`, `api/ai-chat.ts`, `vite.config.ts`.
   - Ace AI is separate from user-to-user chat.
   - No frontend OpenAI key is used.
   - Missing backend/quota/network failures produce safe user-facing messages.

## Low Priority Issues

1. Some UI language says "username" or "World ID" while auth only uses display name plus email.
2. Some local-only controls are useful for planning but should be labeled more clearly as local/demo.
3. Global discovery, calendar event actions, story interactions, and post actions are local-only but visually tappable.
4. Community and calendar features are intentionally mock/demo-heavy and should remain secondary until live data is prioritized.

## Settings Button and Control Classification

### Fully Working

- Auth mode toggle, signup/login submit, demo fallback.
- Settings Center back button.
- Theme Picker state update and local/remote save attempt.
- App-level reduced motion, bigger text, high contrast, compact/data-saver classes.
- Chat message density, bubble shape, timestamps, and typing indicator in `ChatRoomScreen`.
- Profile edit modal with local-first save and Supabase profile update attempt.
- Global Safety toggles stored in local storage through `App.tsx`.
- Notification filters and local read/unread toggles.
- Feed search, feed tabs, story viewer, and local post actions.
- Chat list search/filter and chat-room send path.

### Partially Working

- Theme presets: saved and applied to CSS variables, but visually subtle because the accepted layout is mostly black/white.
- Appearance mode: saved, but dark/light/system all currently keep the black-first shell.
- Chat wallpaper: saved and class applied, but all wallpaper classes resolve to black.
- Sent message tone: saved and read, but all tones render as the same white sent bubble.
- Profile banner/avatar/accent/display options: saved and partly previewed, but real profile accent is hardcoded white and banner presets are flattened.
- Notification preference toggles: saved, but no push notification SDK/backend worker is connected yet.
- Privacy/language/translation toggles: saved and partly reflected in UI, but no backend enforcement or translation API exists yet.
- Calendar interested/going/reminder actions: local-only state.
- Community join/leave: optimistic local state with live attempt when auth exists.

### Visible But Not Connected or Placeholder-Like

- Community search bar in `CommunitiesScreen` has no `value` or `onChange`.
- Settings Center `Blocked users` and `Report history` buttons only show local status text.
- Global Safety `Block user` and `Report user` buttons only show local status text.
- Chat room game and voice buttons only show local status text.
- Community detail member/posts empty states say live data will appear later.
- Future module chips: Marketplace, Food, Rides, Flights, Wallet, Creator tools.

### Should Be Hidden, Disabled, or Relabeled Until Ready

- Chat wallpaper choices, unless distinct visual styles are restored.
- Sent bubble tone choices, unless distinct tones are restored.
- Appearance light/system options, unless they intentionally keep black-first and are relabeled.
- Profile accent/banner controls, unless they are applied to the actual profile screen.
- Block/report controls, unless they open a real local management screen.
- Community search, unless it filters the visible list.

## Auth and Session Findings

- Supabase env support is correctly frontend-safe through `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- No service-role key is exposed in frontend code.
- Signup uses Supabase `/signup`.
- Login uses Supabase password grant with email/password.
- Signup can return `needsEmailConfirmation` if Supabase email confirmation is enabled.
- Stored session restoration does not refresh expired tokens.
- Stored session validation clears local auth if `/auth/v1/user` fails.
- This is the most likely cause of "after refresh, login/session was not accepted" if the phone had an expired/rejected session or if the user expected username login.

## Settings Persistence Findings

- Local settings use `ace-domain.app-settings`.
- `readAppSettings()` and `writeAppSettings()` use the same key.
- `handleAppSettingsChange()` updates React state, writes local storage, then tries remote save in the background.
- `loadCurrentUserSettings()` returns no usable remote data for empty `{}` payloads, so empty remote settings should not overwrite local settings.
- If the authenticated session is missing after refresh, settings remote sync will not run.
- Several settings save correctly but do not produce a clear visual change because CSS has been flattened for the black-first redesign.
- There is no visible "settings synced" or "settings saved locally" confirmation.

## Feed and Community Findings

- Feed reads live `posts` when Supabase is configured and falls back safely to mock posts.
- Empty Supabase posts fall back to mock posts.
- Home feed actions are local-only.
- Communities read live rows and fall back safely.
- Community membership attempts live sync but remains usable locally.
- Community search is currently visible but non-functional.
- Community detail uses local mock posts/members.

## Chat and Notification Findings

- Chat list and messages use safe demo fallback.
- Demo chats do not incorrectly start live realtime subscriptions.
- Realtime subscription cleans up on unmount.
- Duplicate message prevention is present in `useChatMessages()`.
- Chat game and voice buttons are placeholders.
- Notifications read/update Supabase when possible and fall back locally.
- Notification state does not crash when live rows are empty.

## Ace AI Findings

- Ace AI screen opens independently from user-to-user chat.
- `aiChatService` calls `/api/ai-chat`.
- Errors are sanitized for missing backend key, quota/rate limit, and network failure.
- OpenAI key remains backend-only in `api/ai-chat.ts`.
- Ace AI availability still depends on backend runtime and quota.

## Mobile and Phone Findings

- Bottom navigation and chat overflow were previously fixed and remain structurally safe.
- The likely phone refresh issue is auth/session restoration, not layout.
- The settings issue needs a targeted phone retest that checks both actual localStorage persistence and visible UI effect.
- No source-level blank-screen route risk was found in the primary app switch.

## Recommended Stage 17B-17F Fix Plan

### Stage 17B - Auth and Session Reliability

- Clarify login fields: email login only, or add safe username-to-email lookup later if desired.
- Add refresh-token session recovery before clearing stored sessions.
- Improve email confirmation handling and phone-friendly signup status.
- Make live auth failures readable without pretending a live account was created.
- Confirm signup, refresh, logout, and login on phone.

### Stage 17C - Settings Persistence and Sync

- Add visible save/sync status for settings.
- Log only safe status internally, never secrets.
- Verify remote upsert/read for `user_settings` after real login.
- Keep localStorage as source of truth when remote is unavailable.
- Add a phone test checklist for settings before/after refresh.

### Stage 17D - Settings UI Functionality Pass

- Implement or hide/disable controls that currently feel fake.
- Make theme/wallpaper/bubble/profile accent options visibly meaningful, or relabel them as coming later.
- Connect community search or remove it until ready.
- Relabel placeholder safety controls as "coming soon" or route them to real local management screens.

### Stage 17E - Live Data Readiness for Feed, Communities, Chats, Notifications

- Verify each live table with empty and non-empty rows.
- Keep mock fallback.
- Decide whether feed creation, community posts, and notification generation remain local/demo or become live.
- Avoid service-role keys in frontend.

### Stage 17F - Manual Phone Regression QA

- Test signup, refresh, login, logout, settings persistence, profile sync, chat fallback/live behavior, notification toggles, and Ace AI unavailable state.
- Confirm no blank screens, no stuck loading states, and no secrets in UI/logs.

## What Should Be Fixed Now

- Auth/session refresh and login clarity.
- Settings persistence visibility and controls that appear non-functional.
- Community search if it remains visible.
- Placeholder controls should either become functional, disabled, or clearly marked as coming soon.

## What Should Be Hidden Until Later

- Marketplace, Food, Rides, Flights, Wallet, and Creator tools.
- Real moderation/report/block flows if no local management screen is implemented.
- Push notification controls if they imply live push delivery.
- Translation auto-translate controls if they imply a real translation backend.

## Manual Phone Testing Needed After Fixes

1. Signup with email/password and display name.
2. Refresh app and confirm session is restored.
3. Logout, then login with email/password.
4. Try username in login field and confirm the app guides the user correctly.
5. Change theme, wallpaper, profile accent, and notification settings.
6. Refresh and confirm which changes persist and which are intentionally local-only.
7. Open Home, Chats, Chat Room, Communities, Community Detail, Notifications, Profile, Settings, Global Discovery, Calendar, and Ace AI.
8. Confirm demo fallback remains usable when live network calls fail.

## Files Inspected

- `src/app/App.tsx`
- `src/app/types.ts`
- `src/features/auth/AuthScreen.tsx`
- `src/services/authService.ts`
- `src/lib/supabase.ts`
- `src/services/profileService.ts`
- `src/features/settings/SettingsCenterScreen.tsx`
- `src/features/settings/GlobalSettingsScreen.tsx`
- `src/features/settings/defaultSettings.ts`
- `src/features/settings/settingsStorage.ts`
- `src/features/settings/settingsTypes.ts`
- `src/components/settings/ThemePicker.tsx`
- `src/components/settings/SettingsRow.tsx`
- `src/components/settings/ToggleRow.tsx`
- `src/styles/index.css`
- `src/features/profile/ProfileScreen.tsx`
- `src/features/feed/HomeScreen.tsx`
- `src/services/postService.ts`
- `src/features/communities/CommunitiesScreen.tsx`
- `src/features/communities/CommunityDetailScreen.tsx`
- `src/services/communityService.ts`
- `src/features/chats/ChatsScreen.tsx`
- `src/features/chats/ChatRoomScreen.tsx`
- `src/features/chats/useChatThreads.ts`
- `src/features/chats/useChatMessages.ts`
- `src/services/chatService.ts`
- `src/features/notifications/NotificationsScreen.tsx`
- `src/services/notificationService.ts`
- `src/features/ai/AiChatScreen.tsx`
- `src/services/aiChatService.ts`
- `src/features/global/GlobalDiscoveryScreen.tsx`
- `src/features/calendar/CalendarScreen.tsx`
- `src/navigation/BottomNavigation.tsx`
- `src/backend/schema.sql`
- `.env.example`
