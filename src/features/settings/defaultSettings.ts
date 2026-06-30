import type {
  AppearanceMode,
  AnimationIntensity,
  AppLanguage,
  AppSettings,
  AvatarFrameStyle,
  ChatBubbleShape,
  ChatWallpaper,
  CountryRegion,
  LanguageName,
  MessageDensity,
  MessagePrivacy,
  ProfileAccentColor,
  ProfileBadgeStyle,
  ProfileBannerPreset,
  ProfileDisplayLayout,
  ReceivedBubbleStyle,
  RegionalFormat,
  SentBubbleTone,
  ThemePreset,
  ThemePresetId,
  TimeZonePreference
} from './settingsTypes';

export const appearanceModes = ['premium-dark', 'dark', 'light', 'system'] as const satisfies readonly AppearanceMode[];

export const themePresetOrder = [
  'ace-gold',
  'royal-blue',
  'violet-pulse',
  'cyber-green',
  'crimson-night',
  'silver-frost',
  'ocean-neon',
  'sunset-flame'
] as const satisfies readonly ThemePresetId[];

export const sentBubbleToneOptions = ['theme', 'gold', 'blue', 'violet', 'silver'] as const satisfies readonly SentBubbleTone[];

export const receivedBubbleStyleOptions = ['glass', 'solid', 'outlined'] as const satisfies readonly ReceivedBubbleStyle[];

export const chatBubbleShapeOptions = ['rounded', 'soft', 'sharp'] as const satisfies readonly ChatBubbleShape[];

export const messageDensityOptions = ['comfortable', 'compact'] as const satisfies readonly MessageDensity[];

export const chatWallpaperOptions = ['dark-stars', 'deep-ocean', 'neon-grid', 'plain-dark', 'metallic-gradient'] as const satisfies readonly ChatWallpaper[];

export const regionalFormatOptions = ['auto', 'local-first', 'global-first'] as const satisfies readonly RegionalFormat[];

export const profileBannerOptions = ['cosmic', 'world-grid', 'neon-arena', 'clean-metal', 'aurora'] as const satisfies readonly ProfileBannerPreset[];

export const profileAccentOptions = ['theme', 'gold', 'blue', 'violet', 'green', 'rose'] as const satisfies readonly ProfileAccentColor[];

export const profileBadgeStyleOptions = ['verified', 'founder', 'traveler', 'gamer'] as const satisfies readonly ProfileBadgeStyle[];

export const avatarFrameOptions = ['halo', 'orbit', 'metal', 'minimal'] as const satisfies readonly AvatarFrameStyle[];

export const profileDisplayLayoutOptions = ['classic', 'gamer', 'minimal', 'global'] as const satisfies readonly ProfileDisplayLayout[];

export const messagePrivacyOptions = ['everyone', 'friends-only', 'nobody', 'message-requests'] as const satisfies readonly MessagePrivacy[];

export const appLanguageOptions = ['English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'Hindi'] as const satisfies readonly AppLanguage[];

export const countryRegionOptions = ['Nigeria', 'United States', 'United Kingdom', 'Brazil', 'Japan', 'Global Citizen'] as const satisfies readonly CountryRegion[];

export const timeZoneOptions = ['Auto', 'Africa/Lagos', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'] as const satisfies readonly TimeZonePreference[];

export const languageOptions = ['English', 'Yoruba', 'Spanish', 'French', 'Arabic', 'Portuguese', 'Japanese', 'Hindi'] as const satisfies readonly LanguageName[];

export const animationIntensityOptions = ['normal', 'reduced', 'minimal'] as const satisfies readonly AnimationIntensity[];

export const profileAccentColors: Record<ProfileAccentColor, { accent: string; label: string; soft: string }> = {
  blue: { accent: '#5DA9FF', label: 'Blue', soft: 'rgba(93, 169, 255, 0.16)' },
  gold: { accent: '#F4C95D', label: 'Gold', soft: 'rgba(244, 201, 93, 0.18)' },
  green: { accent: '#73FBD3', label: 'Green', soft: 'rgba(115, 251, 211, 0.16)' },
  rose: { accent: '#FF5F7E', label: 'Rose', soft: 'rgba(255, 95, 126, 0.16)' },
  theme: { accent: 'var(--ad-accent)', label: 'Theme', soft: 'var(--ad-accent-soft)' },
  violet: { accent: '#A78BFA', label: 'Violet', soft: 'rgba(167, 139, 250, 0.16)' }
};

export const themePresets: Record<ThemePresetId, ThemePreset> = {
  'ace-gold': {
    accent: '#F4C95D',
    accentContrast: '#070A16',
    accentSoft: 'rgba(244, 201, 93, 0.18)',
    accentStrong: '#FFD978',
    description: 'Flagship gold with a premium global glow.',
    glow: 'rgba(244, 201, 93, 0.34)',
    id: 'ace-gold',
    name: 'Ace Gold'
  },
  'royal-blue': {
    accent: '#5DA9FF',
    accentContrast: '#06101E',
    accentSoft: 'rgba(93, 169, 255, 0.18)',
    accentStrong: '#9FD0FF',
    description: 'Deep blue signal for clean social discovery.',
    glow: 'rgba(93, 169, 255, 0.32)',
    id: 'royal-blue',
    name: 'Royal Blue'
  },
  'violet-pulse': {
    accent: '#A78BFA',
    accentContrast: '#080513',
    accentSoft: 'rgba(167, 139, 250, 0.18)',
    accentStrong: '#D8B4FE',
    description: 'Futuristic violet for gamer-friendly spaces.',
    glow: 'rgba(167, 139, 250, 0.34)',
    id: 'violet-pulse',
    name: 'Violet Pulse'
  },
  'cyber-green': {
    accent: '#73FBD3',
    accentContrast: '#04100E',
    accentSoft: 'rgba(115, 251, 211, 0.16)',
    accentStrong: '#B8FFE9',
    description: 'Neon social energy with crisp readability.',
    glow: 'rgba(115, 251, 211, 0.3)',
    id: 'cyber-green',
    name: 'Cyber Green'
  },
  'crimson-night': {
    accent: '#FF5F7E',
    accentContrast: '#130409',
    accentSoft: 'rgba(255, 95, 126, 0.18)',
    accentStrong: '#FF9CAF',
    description: 'Warm night-life tone for bold interaction.',
    glow: 'rgba(255, 95, 126, 0.3)',
    id: 'crimson-night',
    name: 'Crimson Night'
  },
  'silver-frost': {
    accent: '#DDE7FF',
    accentContrast: '#070A16',
    accentSoft: 'rgba(221, 231, 255, 0.18)',
    accentStrong: '#FFFFFF',
    description: 'Clean metallic silver for a minimal premium feel.',
    glow: 'rgba(221, 231, 255, 0.26)',
    id: 'silver-frost',
    name: 'Silver Frost'
  },
  'ocean-neon': {
    accent: '#38BDF8',
    accentContrast: '#03101A',
    accentSoft: 'rgba(56, 189, 248, 0.18)',
    accentStrong: '#67E8F9',
    description: 'Bright ocean glow for global mobility.',
    glow: 'rgba(56, 189, 248, 0.32)',
    id: 'ocean-neon',
    name: 'Ocean Neon'
  },
  'sunset-flame': {
    accent: '#FB923C',
    accentContrast: '#140805',
    accentSoft: 'rgba(251, 146, 60, 0.18)',
    accentStrong: '#FDBA74',
    description: 'Warm gold-orange for lively communities.',
    glow: 'rgba(251, 146, 60, 0.3)',
    id: 'sunset-flame',
    name: 'Sunset Flame'
  }
};

export const defaultAppSettings: AppSettings = {
  allowCommunityInvites: true,
  animationIntensity: 'normal',
  appearanceMode: 'premium-dark',
  autoTranslate: false,
  avatarFrameStyle: 'halo',
  biggerText: false,
  buttonLabels: true,
  chatBubbleShape: 'rounded',
  chatWallpaper: 'dark-stars',
  compactCards: false,
  compactMode: false,
  communityUpdateNotifications: true,
  countryRegion: 'Nigeria',
  dataSaverMode: false,
  disableHeavyEffects: false,
  eventReminderNotifications: true,
  friendRequestNotifications: true,
  globalMatchNotifications: true,
  highContrast: false,
  languageLearning: ['Spanish', 'French'],
  languagesSpoken: ['English', 'Yoruba'],
  likesCommentsNotifications: true,
  mentionNotifications: true,
  messageNotifications: true,
  messageDensity: 'comfortable',
  messagePrivacy: 'message-requests',
  notificationPreview: true,
  preferredAppLanguage: 'English',
  profileAccentColor: 'theme',
  profileBadgeStyle: 'verified',
  profileBannerPreset: 'cosmic',
  profileDisplayLayout: 'classic',
  profileSpotlight: true,
  receivedBubbleStyle: 'glass',
  reduceAnimations: false,
  reduceAutoRefresh: false,
  reducedGlow: false,
  regionalFormat: 'auto',
  safetyAlertNotifications: true,
  safetyReminders: true,
  screenReaderLabels: true,
  sentBubbleTone: 'theme',
  showCountry: true,
  showLanguages: true,
  showLocalTime: true,
  showOnlineStatus: true,
  showOriginalLanguage: true,
  showProfileInGlobalMatch: true,
  showTimestamps: true,
  showTypingIndicator: true,
  textFirstCards: false,
  themePreset: 'ace-gold',
  timeZonePreference: 'Auto',
  translationPreview: true
};
