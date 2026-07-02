# Stage 15 Supabase Apply Checklist

Use this checklist when applying Ace Domain backend SQL manually in the Supabase dashboard. Do not run it from the app, do not paste service-role keys into frontend files, and do not commit local `.env` values.

## Before Applying SQL

- Confirm the local `.env` contains only public frontend Supabase config for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Confirm no Supabase service-role key is present in React, Vite, Capacitor, public docs, or `.env.example`.
- Back up the Supabase project or confirm it is still safe to recreate before applying schema changes.
- Review [src/backend/schema.sql](../src/backend/schema.sql) fully before running it.
- Do not run destructive SQL against production data without a separate backup and rollback plan.

## Safe Apply Order

1. Open the Supabase dashboard for the Ace Domain project.
2. Go to SQL Editor.
3. Paste the contents of [src/backend/schema.sql](../src/backend/schema.sql).
4. Review the SQL one more time before running it.
5. Run the SQL once.
6. If Supabase reports existing triggers or policies, confirm the message matches the expected `drop policy if exists` / `drop trigger if exists` replacement flow before rerunning.

## Expected Tables

- `profiles`
- `posts`
- `communities`
- `community_members`
- `chat_threads`
- `chat_thread_members`
- `chat_messages`
- `notifications`
- `user_settings`

## Expected Ownership Rules

- `profiles.id` maps to `auth.users.id`.
- `posts.user_id` maps to the post owner.
- `community_members.user_id` maps to the member.
- `chat_threads.created_by` maps to the thread creator.
- `chat_thread_members.user_id` maps to the thread member.
- `chat_messages.sender_id` maps to the authenticated sender.
- `notifications.user_id` maps to the notification owner.
- `user_settings.user_id` maps to `auth.users.id`.

## RLS Verification

After applying SQL, confirm row level security is enabled for every expected table. Confirm policies allow only the intended behavior:

- Users can insert and update only their own profile.
- Users can create, update, and delete only their own posts.
- Communities are readable.
- Users can join and leave communities only as themselves.
- Chat messages are readable and writable only by thread members.
- Notifications are readable and updateable only by the owner.
- Settings are readable, insertable, and updateable only by the owner.

## Post-Apply Checks

Run these local checks after the manual SQL step:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

Then test the app safely:

- Demo mode still opens when Supabase is unavailable.
- Live signup/login works or shows the friendly rate-limit message.
- Profile sync failure shows a warning instead of crashing.
- Settings still save locally first.
- Empty live chat tables still show demo conversations instead of a broken inbox.

## Do Not Do

- Do not commit `.env`.
- Do not paste secret values into docs, screenshots, chat, or source files.
- Do not add a Supabase service-role key to frontend code.
- Do not disable RLS to make frontend calls pass.
- Do not run `drop table`, `truncate`, or broad delete commands against production data.
