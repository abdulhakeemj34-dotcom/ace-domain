# Native Asset Path Audit

This audit reviews Ace Domain's app icon, splash/startup, and native/mobile asset readiness. It does not generate images, replace native platform assets, or claim final store asset readiness.

## Asset Locations Checked

- `src/assets/brand/`
- `android/app/src/main/res/`
- `ios/App/App/Assets.xcassets/`
- `docs/store-asset-inventory.md`
- `docs/native-brand-assets.md`
- `docs/visual-identity-plan.md`
- `public/`

## Assets Found

### Source Brand Assets

Found under `src/assets/brand/`:

- `ace-domain-mark.svg`
- `ace-domain-app-icon-master.svg`
- `android-adaptive-foreground.svg`
- `android-adaptive-background.svg`
- `ace-domain-splash-source.svg`
- `README.md`

These are source-ready SVG assets, not final store PNG export sets.

### Android Native Resources

Found under `android/app/src/main/res/`:

- Launcher icon PNG resources in `mipmap-*`.
- Adaptive icon XML resources in `mipmap-anydpi-v26`.
- Icon foreground/background resources.
- Splash PNG resources in portrait and landscape density folders.

Status: native resources exist, but they are not confirmed as final approved Ace Domain store assets.

### iOS Native Resources

Found under `ios/App/App/Assets.xcassets/`:

- `AppIcon.appiconset`
- `Splash.imageset`
- Splash PNG files.
- Basic app icon file.

Status: asset catalog exists, but final approved Ace Domain icon/splash export set is not confirmed as applied.

### Public Assets

- No `public/` asset folder is currently required or confirmed.
- Store-ready images should not be added to `public/` unless there is a clear runtime or documentation need.

## Assets Missing

- Final Play Store 512x512 PNG icon.
- Final App Store 1024x1024 PNG icon with no transparency.
- Final iOS app icon size set.
- Final Android adaptive icon foreground/background exports mapped to native resources.
- Final Android launcher icon density set generated from approved artwork.
- Final native splash/launch screen exports.
- Play Store feature graphic 1024x500.
- Store screenshots from tested device builds.
- Optional promo video or preview images.

## Recommended Final Asset Sizes

### App Store / iOS

- 1024x1024 app icon PNG, no transparency.
- Required Xcode AppIcon sizes generated through Xcode or a trusted asset generator.
- Splash/launch assets sized for the final launch storyboard/image set strategy.

### Google Play / Android

- 512x512 Play Store icon PNG.
- 1024x500 feature graphic.
- Adaptive icon foreground and background layers.
- Launcher icon density outputs:
  - mdpi
  - hdpi
  - xhdpi
  - xxhdpi
  - xxxhdpi

### Screenshots

- Android phone screenshots from real device/emulator build.
- iPhone screenshots from simulator/device build.
- Tablet/iPad screenshots only if the app is intentionally tested and listed for those layouts.

## What Should Be Generated Later

- Optimized PNG exports from `src/assets/brand/ace-domain-app-icon-master.svg`.
- Android adaptive icon foreground/background resources from the existing SVG sources.
- Native splash images from `src/assets/brand/ace-domain-splash-source.svg`.
- Store screenshots after phone auth retest and final native QA.
- Feature graphic after brand/store copy is finalized.

## What Should Not Be Committed Yet

- Large generated icon/splash batches before final approval.
- Duplicate unoptimized image sets.
- Store screenshots before they are approved.
- Keystores, signing keys, provisioning profiles, `.env`, or generated build output.

## Notes

- Keep `src/assets/brand/` as the single editable source set for the current brand artwork.
- Do not overwrite Android or iOS asset catalogs until final exports are approved and device-tested.
- Runtime startup animation and native launch assets are different layers. Both must be checked before public release.
