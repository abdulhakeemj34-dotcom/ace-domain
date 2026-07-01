# Ace Domain Visual Identity Plan

Stage 10A defines the safe path for adding the next Ace Domain brand system without changing the current app experience yet.

Stage 10B adds the source-ready brand asset folder and updates the reusable logo components toward the approved blue/cyan `AD` direction without changing app behavior.

## Brand Direction

- Premium, modern, mobile-first, and startup-quality.
- Clean tech foundation using black, deep blue, white, and silver.
- Controlled electric blue, cyan, or violet accents for energy, not visual noise.
- A strong `AD` symbol should lead the identity, with the full `Ace Domain` wordmark used only where space allows.
- Branding should feel global, social, futuristic, and confident without making the interface crowded.

## Logo Usage

- Primary lockup: `AD` symbol plus `Ace Domain` wordmark for welcome, startup, profile branding, and About surfaces.
- Compact mark: `AD` symbol only for top bars, small badges, app icon previews, and native icon exports.
- Tagline: `Meet the World` should appear on welcome/startup moments, not every repeated navigation surface.
- Current reusable components should remain the main integration points:
  - `src/components/logo/AceDomainLogo.tsx`
  - `src/components/logo/AceDomainIcon.tsx`
  - `src/components/logo/StartupSplash.tsx`

## App Icon Direction

- Use the `AD` mark only, not the full wordmark.
- Keep the silhouette readable at small sizes.
- Use a rounded-square dark base with a crisp blue/white/silver mark and optional cyan or violet edge light.
- Later native exports should target Android adaptive icons and iOS asset catalog sizes from the same approved source asset.

## Splash And Startup Direction

- Keep a native-safe static splash for launch handoff, then use the React startup animation for the premium reveal.
- Startup should stay short, smooth, and mobile-safe.
- Visual language: deep cinematic background, clean light sweep, subtle orbit/world connection, and restrained glow.
- Avoid heavy image dependencies or long blocking animation timing.

## Brand Tokens

- Keep the existing CSS variable path for runtime theming:
  - `--ad-accent`
  - `--ad-accent-contrast`
  - `--ad-accent-soft`
  - `--ad-accent-strong`
  - `--ad-glow`
- Future token work should align Tailwind colors and CSS variables around:
  - Void black
  - Deep domain blue
  - Frost white
  - Platinum silver
  - Cyan signal accent
  - Optional violet energy accent
- Stage 10B component colors reference the approved board direction: `#0D47FF`, `#00B2FF`, `#00F0FF`, `#0F172A`, and `#FFFFFF`.
- Preserve user theme settings and localStorage/Supabase settings sync behavior.

## Typography Direction

- Keep the current system stack until a final brand typeface is chosen.
- If a custom display font is added later, use a locally hosted web font and verify performance on mobile.
- Use strong uppercase display treatment for logo/startup moments only; keep product screens readable and practical.

## Asset Locations

- Source brand assets: `src/assets/brand/`
- Reusable logo components: `src/components/logo/`
- Global brand tokens and animation helpers: `src/styles/index.css` and `tailwind.config.js`
- App integration points: `src/app/App.tsx` and welcome/profile/about surfaces as needed
- Native mobile assets after approval:
  - Android: `android/app/src/main/res/`
  - iOS: `ios/App/App/Assets.xcassets/`

## Likely Future Files

- `src/components/logo/AceDomainLogo.tsx`
- `src/components/logo/AceDomainIcon.tsx`
- `src/components/logo/StartupSplash.tsx`
- `src/styles/index.css`
- `tailwind.config.js`
- `src/app/App.tsx`
- `src/features/welcome/WelcomeScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/features/settings/SettingsCenterScreen.tsx`
- `capacitor.config.ts` only if native splash/icon configuration requires it

## Safe Implementation Order

1. Add approved source assets under `src/assets/brand/` without replacing UI.
2. Define final brand tokens and verify they do not break existing theme presets.
3. Update reusable logo components, then verify small-size readability.
4. Update startup animation only after logo components are stable.
5. Review welcome, profile, settings, and About branding surfaces.
6. Generate native Android/iOS icon and splash assets from the approved mark.
7. Run lint, TypeScript, production build, Capacitor sync, and a real mobile visual pass.

## Guardrails

- Do not change Supabase chat, Ace AI, settings sync, auth, or backend behavior for branding work.
- Do not expose secrets or add frontend-only secret variables.
- Do not replace the full app visual system in one pass.
- Keep Stage 10B focused on approved assets and reusable brand components only.
