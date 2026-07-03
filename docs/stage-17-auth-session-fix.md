# Stage 17B - Auth Session Reliability Fix

## What Changed

- Stored Supabase sessions now try refresh-token recovery before the app clears auth state.
- Expiring sessions are refreshed proactively when possible.
- If session validation hits a temporary network failure, the stored session is preserved so the app does not force a logout during a bad connection.
- Profile sync warnings remain non-blocking; a profile sync issue should not log out a user when auth succeeded.
- The auth screen now makes the login requirement clear: login uses email and password. Username login is not active yet.
- Common auth errors now use safer, friendlier messages for invalid credentials, email confirmation, rate limits, duplicate accounts, and network failure.

## What Did Not Change

- No service-role key was added.
- No secret values were added or printed.
- Demo/local fallback remains available.
- Supabase user-to-user chat remains separate from Ace AI.
- Auth was not rewritten from scratch.
- Username login was not added.

## Phone Test Steps

1. Open Ace Domain on the phone.
2. Create an account with display name, email address, and password.
3. If email confirmation is required, confirm the email first.
4. Refresh/reopen the app and confirm the user remains inside Ace Domain.
5. Log out from Profile.
6. Log in with the same email address and password.
7. Confirm trying a username is clearly guided back to email login.
8. Turn off or weaken the network briefly, refresh, and confirm the app does not blank or get stuck.
9. Change a setting after login, refresh, and confirm Stage 17C can isolate settings persistence separately from auth.

## Remaining Follow-Up

- Stage 17C should verify settings persistence after this auth/session fix.
- Stage 17D should clean up visible settings controls that still feel placeholder-like.
