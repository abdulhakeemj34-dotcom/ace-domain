# Native Brand Asset Export Readiness

Stage 10D prepares source-ready Ace Domain brand files for future native Android and iOS icon/splash exports. It does not overwrite platform assets yet.

## Source Files

- `src/assets/brand/ace-domain-mark.svg`: reusable transparent `AD` mark.
- `src/assets/brand/ace-domain-app-icon-master.svg`: 1024x1024 app icon master.
- `src/assets/brand/android-adaptive-foreground.svg`: Android adaptive icon foreground source.
- `src/assets/brand/android-adaptive-background.svg`: Android adaptive icon background source.
- `src/assets/brand/ace-domain-splash-source.svg`: portrait splash/startup source.

## Export Targets

- App icon master: export a 1024x1024 PNG from `ace-domain-app-icon-master.svg`.
- Android adaptive icon: export foreground and background from the two adaptive SVG layers, then map them into `android/app/src/main/res/` using Android Studio or a verified asset generator.
- iOS app icon: export the required PNG sizes into `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.
- Splash source: export optimized portrait and landscape splash images only after final device review.

## Safety Notes

- Keep source SVGs under `src/assets/brand/` as the single editable source set.
- Do not commit large generated PNG sets until the final native icon/splash pass is approved.
- Do not overwrite Android or iOS asset catalogs without a device/emulator verification pass.
- Do not commit real `.env` secrets, API keys, `dist`, or other generated build output.
- Keep the app name as `Ace Domain` and the tagline direction as `Meet the World`.
