# Native Brand Asset Export Readiness

Stage 10D prepared source-ready Ace Domain brand files. The store-readiness pass now generates app icon exports and applies safer native launcher icon resources. Splash assets remain source-ready pending final phone/emulator review.

## Source Files

- `src/assets/brand/ace-domain-mark.svg`: reusable transparent `AD` mark.
- `src/assets/brand/ace-domain-app-icon-master.svg`: 1024x1024 app icon master.
- `src/assets/brand/android-adaptive-foreground.svg`: Android adaptive icon foreground source.
- `src/assets/brand/android-adaptive-background.svg`: Android adaptive icon background source.
- `src/assets/brand/ace-domain-splash-source.svg`: portrait splash/startup source.

## Export Targets

- App icon master: generated through `npm run store:assets`.
- Android adaptive icon: foreground/background are mapped into `android/app/src/main/res/`.
- iOS app icon: generated into `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.
- Splash source: export optimized portrait and landscape splash images only after final device review.

## Generated Store Assets

- `public/store-assets/ace-domain-play-icon-512.png`
- `public/store-assets/ace-domain-ios-icon-1024.png`
- `public/store-assets/ace-domain-feature-graphic-1024x500.jpg`

Regenerate on Windows with:

```bash
npm run store:assets
```

## Safety Notes

- Keep source SVGs under `src/assets/brand/` as the single editable source set.
- Keep generated store assets small and intentional.
- Do not overwrite splash resources without a device/emulator verification pass.
- Do not commit real `.env` secrets, API keys, `dist`, or other generated build output.
- Keep the app name as `Ace Domain` and the tagline direction as `Meet the World`.
