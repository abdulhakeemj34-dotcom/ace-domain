# Supabase Project Setup

Use this checklist before connecting Ace Domain to a real Supabase project. Do not paste real keys into documentation, chat, screenshots, or source files.

## Required Project Values

Copy these values from the Supabase dashboard into your local `.env` file only:

- `VITE_SUPABASE_URL`: Project URL from Project Settings > API.
- `VITE_SUPABASE_ANON_KEY`: Public anon key from Project Settings > API.

The anon key is public frontend configuration for browser/mobile clients. It is still important to rely on RLS for data protection.

Never add a Supabase service-role key to frontend code, `.env.example`, React files, Vite config, Capacitor config, or public docs.

## Auth Settings

Before live signup testing, confirm these Supabase dashboard settings:

- Email provider is enabled only when Ace Domain is ready for real test signups.
- Email confirmation behavior matches the test plan.
- Site URL points to the intended local or hosted app URL.
- Redirect URLs include the local dev URL, future hosted web URL, and any approved native deep-link URL if added later.
- Rate limits are understood before repeatedly creating test accounts.
- Email templates use user-safe Ace Domain wording and do not expose internal setup notes.

## Safe Local Setup

1. Copy `.env.example` to `.env`.
2. Add the project URL and anon key to `.env`.
3. Keep `.env` untracked.
4. Run the standard checks:

```bash
npm run lint
npx tsc -b --pretty false
npm run build
```

If the values are missing, placeholders, or invalid, Ace Domain should remain in demo/local fallback mode instead of crashing.

## Security Rules

- Do not commit `.env`.
- Do not commit generated `dist` output.
- Do not expose real Supabase keys in reports.
- Do not use service-role keys in frontend code.
- Do not run migrations from the app.
- Keep demo/local fallback usable while live Supabase activation is tested.
