# Stage 12 Product Upgrade Plan

Stage 12 should make Ace Domain feel more useful, alive, and social while preserving the stable black-first compact layout and the local/Supabase fallback architecture.

This is a planning document only. Stage 12A does not implement product changes.

## Current Product State

- Ace Domain is stable through Stage 11 and has been prepared for GitHub handoff.
- The app has a mobile-first React, TypeScript, Vite, Tailwind CSS, and Capacitor foundation.
- The accepted UI direction is black-first, compact, and social-app oriented.
- Auth supports live Supabase paths when configured and safe demo/local fallback when unavailable.
- Supabase foundations exist for profiles, posts, communities, chat, notifications, and settings sync.
- User-to-user chat and Ace AI are intentionally separate.
- Ace AI has a backend endpoint foundation, but OpenAI availability depends on backend runtime and quota.
- Settings persistence is local-first with safe background Supabase sync.

## Stage 12 Goal

Stage 12 should improve product value, not visual decoration. The main objective is to make the core app feel more like something people can actually use every day:

- Home should feel like a real social feed.
- Chats should feel like a useful inbox and conversation space.
- Profile should feel like a clear social identity.
- Ace AI should be easier to understand and enter without mixing with human chat.
- Supabase readiness should become clearer without breaking demo mode.

## Priority Order

1. Home/feed usefulness
2. Chats experience
3. Profile/social identity
4. Ace AI entry/usefulness
5. Supabase readiness review

## Stage 12B - Home Feed Usefulness

Objective: Make Home feel more like a real social feed and less like a static showcase.

Recommended work:

- Improve post hierarchy with clearer author, timestamp, body, media/action spacing, and engagement states.
- Make story and trending entry points feel useful but compact.
- Add better local-state feed interactions where already appropriate: react, save, comment count, share count, and lightweight reply preview.
- Keep Global Match, Calendar, Communities, and Ace AI as clean entry points rather than large feature dumps.
- Improve empty/loading/error states for future live feed data.

Likely files:

- `src/features/feed/HomeScreen.tsx`
- `src/app/data.ts`
- `src/components/Avatar.tsx`
- `src/components/SearchBar.tsx`
- Shared feed/card helpers only if duplication becomes meaningful.

Verification:

- Home still renders in demo mode.
- Bottom navigation still works.
- No horizontal overflow on mobile.
- `npm run lint`
- `npx tsc -b --pretty false`
- `npm run build`

## Stage 12C - Chats Experience

Objective: Make chat feel more useful, alive, and trustworthy while preserving Supabase/user chat separation.

Recommended work:

- Improve demo thread names and preview text so the inbox feels realistic.
- Strengthen unread, online, muted, group, and active indicators.
- Refine chat room empty/loading/error states.
- Improve message grouping, timestamps, and local sending feedback without changing real-time provider strategy.
- Keep chat input safe above bottom navigation and mobile keyboards.

Likely files:

- `src/features/chats/ChatsScreen.tsx`
- `src/features/chats/ChatRoomScreen.tsx`
- `src/features/chats/useChatThreads.ts`
- `src/features/chats/useChatMessages.ts`
- `src/services/chatService.ts`
- Mock chat data in `src/app/data.ts` or related data files.

Risk areas:

- Do not break Supabase realtime subscription cleanup.
- Do not fake successful live backend writes.
- Do not mix Ace AI with user-to-user chat.

## Stage 12D - Profile And Social Identity

Objective: Make the profile feel like a real identity page, not a settings hub.

Recommended work:

- Improve profile stats, actions, and tab content.
- Clarify user identity: username, handle, country/language visibility, interests, and activity.
- Keep settings entry accessible but not dominant.
- Add better local edit-profile feedback where already supported.
- Improve profile empty states for posts, communities, and saved content.

Likely files:

- `src/features/profile/ProfileScreen.tsx`
- `src/features/settings/SettingsCenterScreen.tsx`
- `src/types/global.ts`
- `src/data/mockGlobalData.ts`

Risk areas:

- Preserve settings persistence and privacy toggles.
- Do not add real marketplace, wallet, payments, rides, food, flights, or banking.

## Stage 12E - Ace AI Entry And Usefulness

Objective: Make Ace AI clearer and more useful without changing provider strategy.

Recommended work:

- Improve the Ace AI entry point on Home so users understand what it helps with.
- Improve prompt suggestions around social openers, culture, communities, profile polish, and safety.
- Improve Ace AI empty/error states, especially quota or unavailable backend situations.
- Keep Ace AI visually and logically separate from user-to-user chat.

Likely files:

- `src/features/ai/AiChatScreen.tsx`
- `src/services/aiChatService.ts`
- `src/features/feed/HomeScreen.tsx`

Risk areas:

- Do not expose `OPENAI_API_KEY`.
- Do not change OpenAI provider strategy in this stage.
- Do not route Ace AI through Supabase user chat.

## Stage 12F - Supabase Readiness Review

Objective: Clarify what is demo/local and what is ready for live Supabase without running migrations in the planning stage.

Recommended work:

- Review services for safe fallback behavior.
- Document which tables are expected for auth, profiles, posts, communities, chat, notifications, and settings.
- Identify screens that still rely on mock data.
- Improve user-facing unavailable states where live data is missing.
- Keep local/demo mode fully usable.

Likely files:

- `src/services/authService.ts`
- `src/services/profileService.ts`
- `src/services/postService.ts`
- `src/services/communityService.ts`
- `src/services/chatService.ts`
- `src/services/notificationService.ts`
- `src/services/settingsService.ts`
- `src/backend/schema.sql`
- `src/backend/README.md`

Risk areas:

- Do not run migrations without explicit instruction.
- Do not remove mock/demo fallback.
- Do not hardcode secrets.
- Do not expose service-role keys.

## What Should Not Be Touched

- Do not redesign the accepted black-first compact layout.
- Do not rewrite the app shell or routing.
- Do not remove Capacitor.
- Do not change backend/provider strategy.
- Do not mix Ace AI with Supabase user chat.
- Do not add payments, wallet, banking, rides, flights, food ordering, marketplace, or real-time voice/video.
- Do not remove localStorage fallback.
- Do not expose or commit `.env` secrets.

## Quality Gates For Every Stage 12 Slice

Run before committing:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

Recommended when native readiness may be affected:

```bash
npm run cap:sync
```

## Recommended Next Step

Start with Stage 12B. It should focus only on Home/feed usefulness with small, verifiable changes and no backend migration.
