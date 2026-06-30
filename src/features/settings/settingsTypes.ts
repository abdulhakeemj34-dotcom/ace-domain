export type AppearanceMode = 'premium-dark' | 'dark' | 'light' | 'system';

export type ThemePresetId =
  | 'ace-gold'
  | 'royal-blue'
  | 'violet-pulse'
  | 'cyber-green'
  | 'crimson-night'
  | 'silver-frost'
  | 'ocean-neon'
  | 'sunset-flame';

export type SentBubbleTone = 'theme' | 'gold' | 'blue' | 'violet' | 'silver';

export type ReceivedBubbleStyle = 'glass' | 'solid' | 'outlined';

export type ChatBubbleShape = 'rounded' | 'soft' | 'sharp';

export type MessageDensity = 'comfortable' | 'compact';

export type ChatWallpaper = 'dark-stars' | 'deep-ocean' | 'neon-grid' | 'plain-dark' | 'metallic-gradient';

export type RegionalFormat = 'auto' | 'local-first' | 'global-first';

export type ProfileBannerPreset = 'cosmic' | 'world-grid' | 'neon-arena' | 'clean-metal' | 'aurora';

export type ProfileAccentColor = 'theme' | 'gold' | 'blue' | 'violet' | 'green' | 'rose';

export type ProfileBadgeStyle = 'verified' | 'founder' | 'traveler' | 'gamer';

export type AvatarFrameStyle = 'halo' | 'orbit' | 'metal' | 'minimal';

export type ProfileDisplayLayout = 'classic' | 'gamer' | 'minimal' | 'global';

export type MessagePrivacy = 'everyone' | 'friends-only' | 'nobody' | 'message-requests';

export type AppLanguage = 'English' | 'Spanish' | 'French' | 'Arabic' | 'Portuguese' | 'Hindi';

export type CountryRegion = 'Nigeria' | 'United States' | 'United Kingdom' | 'Brazil' | 'Japan' | 'Global Citizen';

export type TimeZonePreference = 'Auto' | 'Africa/Lagos' | 'UTC' | 'America/New_York' | 'Europe/London' | 'Asia/Tokyo';

export type LanguageName = 'English' | 'Yoruba' | 'Spanish' | 'French' | 'Arabic' | 'Portuguese' | 'Japanese' | 'Hindi';

export type AnimationIntensity = 'normal' | 'reduced' | 'minimal';

export type ThemePreset = {
  accent: string;
  accentContrast: string;
  accentSoft: string;
  accentStrong: string;
  description: string;
  glow: string;
  id: ThemePresetId;
  name: string;
};

export type AppSettings = {
  appearanceMode: AppearanceMode;
  chatBubbleShape: ChatBubbleShape;
  chatWallpaper: ChatWallpaper;
  compactCards: boolean;
  compactMode: boolean;
  countryRegion: CountryRegion;
  dataSaverMode: boolean;
  disableHeavyEffects: boolean;
  friendRequestNotifications: boolean;
  globalMatchNotifications: boolean;
  highContrast: boolean;
  languageLearning: LanguageName[];
  languagesSpoken: LanguageName[];
  likesCommentsNotifications: boolean;
  messageNotifications: boolean;
  messageDensity: MessageDensity;
  messagePrivacy: MessagePrivacy;
  mentionNotifications: boolean;
  notificationPreview: boolean;
  profileAccentColor: ProfileAccentColor;
  profileBadgeStyle: ProfileBadgeStyle;
  profileBannerPreset: ProfileBannerPreset;
  profileDisplayLayout: ProfileDisplayLayout;
  profileSpotlight: boolean;
  receivedBubbleStyle: ReceivedBubbleStyle;
  reduceAnimations: boolean;
  reduceAutoRefresh: boolean;
  reducedGlow: boolean;
  regionalFormat: RegionalFormat;
  safetyAlertNotifications: boolean;
  safetyReminders: boolean;
  screenReaderLabels: boolean;
  sentBubbleTone: SentBubbleTone;
  showCountry: boolean;
  showLanguages: boolean;
  showLocalTime: boolean;
  showOnlineStatus: boolean;
  showOriginalLanguage: boolean;
  showProfileInGlobalMatch: boolean;
  showTimestamps: boolean;
  showTypingIndicator: boolean;
  textFirstCards: boolean;
  themePreset: ThemePresetId;
  timeZonePreference: TimeZonePreference;
  translationPreview: boolean;
  autoTranslate: boolean;
  allowCommunityInvites: boolean;
  animationIntensity: AnimationIntensity;
  avatarFrameStyle: AvatarFrameStyle;
  biggerText: boolean;
  buttonLabels: boolean;
  communityUpdateNotifications: boolean;
  eventReminderNotifications: boolean;
  preferredAppLanguage: AppLanguage;
};

export type ChatPersonalizationSettings = Pick<
  AppSettings,
  | 'chatBubbleShape'
  | 'chatWallpaper'
  | 'messageDensity'
  | 'receivedBubbleStyle'
  | 'sentBubbleTone'
  | 'showTimestamps'
  | 'showTypingIndicator'
>;

export type ProfilePersonalizationSettings = Pick<
  AppSettings,
  | 'avatarFrameStyle'
  | 'profileAccentColor'
  | 'profileBadgeStyle'
  | 'profileBannerPreset'
  | 'profileDisplayLayout'
  | 'profileSpotlight'
>;
