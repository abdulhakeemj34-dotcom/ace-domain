import {
  animationIntensityOptions,
  appLanguageOptions,
  appearanceModes,
  avatarFrameOptions,
  chatBubbleShapeOptions,
  chatWallpaperOptions,
  countryRegionOptions,
  defaultAppSettings,
  languageOptions,
  messageDensityOptions,
  messagePrivacyOptions,
  profileAccentOptions,
  profileBadgeStyleOptions,
  profileBannerOptions,
  profileDisplayLayoutOptions,
  receivedBubbleStyleOptions,
  regionalFormatOptions,
  sentBubbleToneOptions,
  themePresetOrder,
  timeZoneOptions
} from './defaultSettings';
import type { AppSettings, LanguageName } from './settingsTypes';

export const APP_SETTINGS_STORAGE_KEY = 'ace-domain.app-settings';
const APP_SETTINGS_META_STORAGE_KEY = 'ace-domain.app-settings-meta';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function optionValue<T extends string>(value: unknown, options: readonly T[], fallback: T) {
  return typeof value === 'string' && options.includes(value as T) ? value as T : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function languageArrayValue(value: unknown, fallback: LanguageName[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const sanitized = value.filter((item): item is LanguageName => (
    typeof item === 'string' && languageOptions.includes(item as LanguageName)
  ));

  return sanitized.length ? [...new Set(sanitized)].slice(0, 6) : fallback;
}

export function sanitizeAppSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return defaultAppSettings;
  }

  return {
    allowCommunityInvites: booleanValue(value.allowCommunityInvites, defaultAppSettings.allowCommunityInvites),
    animationIntensity: optionValue(value.animationIntensity, animationIntensityOptions, defaultAppSettings.animationIntensity),
    appearanceMode: optionValue(value.appearanceMode, appearanceModes, defaultAppSettings.appearanceMode),
    autoTranslate: booleanValue(value.autoTranslate, defaultAppSettings.autoTranslate),
    avatarFrameStyle: optionValue(value.avatarFrameStyle, avatarFrameOptions, defaultAppSettings.avatarFrameStyle),
    biggerText: booleanValue(value.biggerText, defaultAppSettings.biggerText),
    buttonLabels: booleanValue(value.buttonLabels, defaultAppSettings.buttonLabels),
    chatBubbleShape: optionValue(value.chatBubbleShape, chatBubbleShapeOptions, defaultAppSettings.chatBubbleShape),
    chatWallpaper: optionValue(value.chatWallpaper, chatWallpaperOptions, defaultAppSettings.chatWallpaper),
    compactCards: booleanValue(value.compactCards, defaultAppSettings.compactCards),
    compactMode: booleanValue(value.compactMode, defaultAppSettings.compactMode),
    communityUpdateNotifications: booleanValue(value.communityUpdateNotifications, defaultAppSettings.communityUpdateNotifications),
    countryRegion: optionValue(value.countryRegion, countryRegionOptions, defaultAppSettings.countryRegion),
    dataSaverMode: booleanValue(value.dataSaverMode, defaultAppSettings.dataSaverMode),
    disableHeavyEffects: booleanValue(value.disableHeavyEffects, defaultAppSettings.disableHeavyEffects),
    eventReminderNotifications: booleanValue(value.eventReminderNotifications, defaultAppSettings.eventReminderNotifications),
    friendRequestNotifications: booleanValue(value.friendRequestNotifications, defaultAppSettings.friendRequestNotifications),
    globalMatchNotifications: booleanValue(value.globalMatchNotifications, defaultAppSettings.globalMatchNotifications),
    highContrast: booleanValue(value.highContrast, defaultAppSettings.highContrast),
    languageLearning: languageArrayValue(value.languageLearning, defaultAppSettings.languageLearning),
    languagesSpoken: languageArrayValue(value.languagesSpoken, defaultAppSettings.languagesSpoken),
    likesCommentsNotifications: booleanValue(value.likesCommentsNotifications, defaultAppSettings.likesCommentsNotifications),
    mentionNotifications: booleanValue(value.mentionNotifications, defaultAppSettings.mentionNotifications),
    messageNotifications: booleanValue(value.messageNotifications, defaultAppSettings.messageNotifications),
    messageDensity: optionValue(value.messageDensity, messageDensityOptions, defaultAppSettings.messageDensity),
    messagePrivacy: optionValue(value.messagePrivacy, messagePrivacyOptions, defaultAppSettings.messagePrivacy),
    notificationPreview: booleanValue(value.notificationPreview, defaultAppSettings.notificationPreview),
    preferredAppLanguage: optionValue(value.preferredAppLanguage, appLanguageOptions, defaultAppSettings.preferredAppLanguage),
    profileAccentColor: optionValue(value.profileAccentColor, profileAccentOptions, defaultAppSettings.profileAccentColor),
    profileBadgeStyle: optionValue(value.profileBadgeStyle, profileBadgeStyleOptions, defaultAppSettings.profileBadgeStyle),
    profileBannerPreset: optionValue(value.profileBannerPreset, profileBannerOptions, defaultAppSettings.profileBannerPreset),
    profileDisplayLayout: optionValue(value.profileDisplayLayout, profileDisplayLayoutOptions, defaultAppSettings.profileDisplayLayout),
    profileSpotlight: booleanValue(value.profileSpotlight, defaultAppSettings.profileSpotlight),
    receivedBubbleStyle: optionValue(value.receivedBubbleStyle, receivedBubbleStyleOptions, defaultAppSettings.receivedBubbleStyle),
    reduceAnimations: booleanValue(value.reduceAnimations, defaultAppSettings.reduceAnimations),
    reduceAutoRefresh: booleanValue(value.reduceAutoRefresh, defaultAppSettings.reduceAutoRefresh),
    reducedGlow: booleanValue(value.reducedGlow, defaultAppSettings.reducedGlow),
    regionalFormat: optionValue(value.regionalFormat, regionalFormatOptions, defaultAppSettings.regionalFormat),
    safetyAlertNotifications: booleanValue(value.safetyAlertNotifications, defaultAppSettings.safetyAlertNotifications),
    safetyReminders: booleanValue(value.safetyReminders, defaultAppSettings.safetyReminders),
    screenReaderLabels: booleanValue(value.screenReaderLabels, defaultAppSettings.screenReaderLabels),
    sentBubbleTone: optionValue(value.sentBubbleTone, sentBubbleToneOptions, defaultAppSettings.sentBubbleTone),
    showCountry: booleanValue(value.showCountry, defaultAppSettings.showCountry),
    showLanguages: booleanValue(value.showLanguages, defaultAppSettings.showLanguages),
    showLocalTime: booleanValue(value.showLocalTime, defaultAppSettings.showLocalTime),
    showOnlineStatus: booleanValue(value.showOnlineStatus, defaultAppSettings.showOnlineStatus),
    showOriginalLanguage: booleanValue(value.showOriginalLanguage, defaultAppSettings.showOriginalLanguage),
    showProfileInGlobalMatch: booleanValue(value.showProfileInGlobalMatch, defaultAppSettings.showProfileInGlobalMatch),
    showTimestamps: booleanValue(value.showTimestamps, defaultAppSettings.showTimestamps),
    showTypingIndicator: booleanValue(value.showTypingIndicator, defaultAppSettings.showTypingIndicator),
    textFirstCards: booleanValue(value.textFirstCards, defaultAppSettings.textFirstCards),
    themePreset: optionValue(value.themePreset, themePresetOrder, defaultAppSettings.themePreset),
    timeZonePreference: optionValue(value.timeZonePreference, timeZoneOptions, defaultAppSettings.timeZonePreference),
    translationPreview: booleanValue(value.translationPreview, defaultAppSettings.translationPreview)
  };
}

export function readAppSettings(): AppSettings {
  const storage = getStorage();

  if (!storage) {
    return defaultAppSettings;
  }

  try {
    const stored = storage.getItem(APP_SETTINGS_STORAGE_KEY);

    if (!stored) {
      return defaultAppSettings;
    }

    return sanitizeAppSettings(JSON.parse(stored) as unknown);
  } catch {
    return defaultAppSettings;
  }
}

export function writeAppSettings(settings: AppSettings) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(sanitizeAppSettings(settings)));
    storage.setItem(APP_SETTINGS_META_STORAGE_KEY, JSON.stringify({ updatedAt: new Date().toISOString() }));
  } catch {
    // Settings remain active in memory when storage is unavailable.
  }
}

export function readAppSettingsSavedAt() {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const stored = storage.getItem(APP_SETTINGS_META_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!isRecord(parsed) || typeof parsed.updatedAt !== 'string') {
      return null;
    }

    const timestamp = new Date(parsed.updatedAt).getTime();
    return Number.isFinite(timestamp) ? timestamp : null;
  } catch {
    return null;
  }
}
