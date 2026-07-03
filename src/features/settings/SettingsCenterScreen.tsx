import { type CSSProperties } from 'react';
import {
  ArrowLeft,
  AtSign,
  BadgeCheck,
  Bell,
  CalendarDays,
  Eye,
  Gamepad2,
  Gauge,
  Globe2,
  Heart,
  Info,
  Languages,
  Lock,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Type,
  UserPlus,
  UserRound,
  UsersRound
} from 'lucide-react';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { ThemePicker } from '../../components/settings/ThemePicker';
import { ToggleRow } from '../../components/settings/ToggleRow';
import {
  animationIntensityOptions,
  appearanceModes,
  appLanguageOptions,
  avatarFrameOptions,
  chatBubbleShapeOptions,
  chatWallpaperOptions,
  countryRegionOptions,
  languageOptions,
  messageDensityOptions,
  messagePrivacyOptions,
  profileAccentOptions,
  profileAccentColors,
  profileBadgeStyleOptions,
  profileBannerOptions,
  profileDisplayLayoutOptions,
  receivedBubbleStyleOptions,
  regionalFormatOptions,
  sentBubbleToneOptions,
  themePresets,
  timeZoneOptions
} from './defaultSettings';
import type {
  AnimationIntensity,
  AppearanceMode,
  AppSettings,
  AvatarFrameStyle,
  ChatBubbleShape,
  ChatWallpaper,
  LanguageName,
  MessageDensity,
  MessagePrivacy,
  ProfileBadgeStyle,
  ProfileBannerPreset,
  ProfileDisplayLayout,
  ReceivedBubbleStyle,
  RegionalFormat,
  SentBubbleTone
} from './settingsTypes';

type SettingsCenterScreenProps = {
  onBack: () => void;
  onChange: (settings: AppSettings) => void;
  onOpenGlobalSafety: () => void;
  settings: AppSettings;
  syncStatus: string;
};

type OptionButtonProps = {
  active: boolean;
  description?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

const appearanceCopy: Record<AppearanceMode, { description: string; label: string }> = {
  'premium-dark': { description: 'Signature cinematic Ace Domain look.', label: 'Premium dark' },
  dark: { description: 'Cleaner dark shell with less atmosphere.', label: 'Dark' },
  light: { description: 'Bright shell with dark readable surfaces.', label: 'Light' },
  system: { description: 'Follows the device preference where safe.', label: 'System' }
};

const sentToneCopy: Record<SentBubbleTone, string> = {
  blue: 'Blue',
  gold: 'Gold',
  silver: 'Silver',
  theme: 'Theme',
  violet: 'Violet'
};

const receivedStyleCopy: Record<ReceivedBubbleStyle, string> = {
  glass: 'Glass',
  outlined: 'Outlined',
  solid: 'Solid'
};

const shapeCopy: Record<ChatBubbleShape, string> = {
  rounded: 'Rounded',
  sharp: 'Sharp premium',
  soft: 'Soft'
};

const densityCopy: Record<MessageDensity, string> = {
  comfortable: 'Comfortable',
  compact: 'Compact'
};

const wallpaperCopy: Record<ChatWallpaper, string> = {
  'dark-stars': 'Dark stars',
  'deep-ocean': 'Deep ocean',
  'metallic-gradient': 'Metallic gradient',
  'neon-grid': 'Neon grid',
  'plain-dark': 'Plain dark'
};

const regionalCopy: Record<RegionalFormat, string> = {
  auto: 'Auto',
  'global-first': 'Global first',
  'local-first': 'Local first'
};

const profileBannerCopy: Record<ProfileBannerPreset, string> = {
  aurora: 'Aurora',
  'clean-metal': 'Clean metal',
  cosmic: 'Cosmic',
  'neon-arena': 'Neon arena',
  'world-grid': 'World grid'
};

const badgeCopy: Record<ProfileBadgeStyle, string> = {
  founder: 'Founder',
  gamer: 'Gamer',
  traveler: 'Traveler',
  verified: 'Verified'
};

const avatarFrameCopy: Record<AvatarFrameStyle, string> = {
  halo: 'Halo',
  metal: 'Metal',
  minimal: 'Minimal',
  orbit: 'Orbit'
};

const profileAccentCopy: Record<AppSettings['profileAccentColor'], string> = {
  blue: 'Blue',
  gold: 'Gold',
  green: 'Green',
  rose: 'Rose',
  theme: 'Theme',
  violet: 'Violet'
};

const displayLayoutCopy: Record<ProfileDisplayLayout, string> = {
  classic: 'Classic',
  gamer: 'Gamer',
  global: 'Global',
  minimal: 'Minimal'
};

const messagePrivacyCopy: Record<MessagePrivacy, string> = {
  everyone: 'Everyone',
  'friends-only': 'Friends only',
  'message-requests': 'Message requests only',
  nobody: 'Nobody'
};

const animationIntensityCopy: Record<AnimationIntensity, string> = {
  minimal: 'Minimal',
  normal: 'Normal',
  reduced: 'Reduced'
};

const comingLater = ['Marketplace', 'Food', 'Rides', 'Flights', 'Wallet', 'Creator tools'];
const activeAppearanceModes = new Set<AppearanceMode>(['premium-dark', 'dark']);

function OptionButton({ active, description, disabled = false, label, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[20px] border p-3 text-left transition duration-300 ${
        disabled
          ? 'cursor-not-allowed border-white/10 bg-black text-zinc-600 opacity-60'
          : active
          ? 'border-white bg-white text-black'
          : 'border-white/10 bg-black text-white hover:border-white/20'
      }`}
      aria-pressed={active}
    >
      <span className={`block text-sm font-black ${disabled ? 'text-zinc-500' : active ? 'text-black' : 'text-white'}`}>{label}</span>
      {description && <span className={`mt-1 block text-xs leading-5 ${disabled ? 'text-zinc-600' : active ? 'text-black/60' : 'text-zinc-500'}`}>{description}</span>}
    </button>
  );
}

function SmallOptionButton({ active, label, onClick }: Omit<OptionButtonProps, 'description'>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-black transition duration-300 ${
        active ? 'border-white bg-white text-black' : 'border-white/10 bg-black text-zinc-500'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function ProfilePreview({ settings }: { settings: AppSettings }) {
  const accent = profileAccentColors[settings.profileAccentColor];
  const previewStyle = {
    '--profile-accent': accent.accent,
    '--profile-accent-soft': accent.soft
  } as CSSProperties;

  return (
    <div className={`profile-preview profile-banner-${settings.profileBannerPreset} profile-layout-${settings.profileDisplayLayout} rounded-[28px] border border-white/10 p-4`} style={previewStyle}>
      <div className="flex items-center gap-3">
        <div className={`avatar-frame-${settings.avatarFrameStyle} grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/10 bg-zinc-950 text-lg font-black text-white`}>
          AD
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-lg font-black text-white">Ace Explorer</p>
            <BadgeCheck size={17} className="text-[#1d9bf0]" />
          </div>
          <p className="truncate text-xs text-frost/55">{badgeCopy[settings.profileBadgeStyle]} badge / {displayLayoutCopy[settings.profileDisplayLayout]} layout</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Global', 'Gaming', 'Culture'].map((item) => (
          <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-500">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SettingsCenterScreen({ onBack, onChange, onOpenGlobalSafety, settings, syncStatus }: SettingsCenterScreenProps) {
  const selectedTheme = themePresets[settings.themePreset];

  const update = (patch: Partial<AppSettings>) => {
    onChange({ ...settings, ...patch });
  };

  const toggleLanguage = (field: 'languageLearning' | 'languagesSpoken', language: LanguageName) => {
    const current = settings[field];
    const next = current.includes(language)
      ? current.filter((item) => item !== language)
      : [...current, language].slice(0, 6);

    update({ [field]: next });
  };

  return (
    <section className="animate-rise pb-8">
      <header className="px-4 pb-3 pt-6">
        <button type="button" onClick={onBack} className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to profile">
          <ArrowLeft size={20} />
        </button>
        <div className="glass-panel overflow-hidden rounded-[28px] p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[color:var(--ad-accent-contrast)] ad-accent-bg ad-accent-ring">
              <Sparkles size={25} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[color:var(--ad-accent)]">Account Controls</p>
              <h1 className="mt-1 text-2xl font-black text-white">Settings Center</h1>
              <p className="mt-2 text-sm leading-5 text-frost/60">
                Local-first controls for Ace Domain appearance, profile feel, notifications, privacy, language, and mobile comfort.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.055] p-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-frost/40">Active theme</p>
            <p className="mt-2 text-xl font-black text-white">{selectedTheme.name}</p>
            <p className="mt-1 text-sm leading-6 text-frost/50">{selectedTheme.description}</p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-black px-3 py-2">
            <span className="text-xs font-bold text-zinc-500">Settings status</span>
            <span className="max-w-[11rem] shrink-0 rounded-full bg-white/10 px-3 py-1 text-center text-xs font-black leading-4 text-white">{syncStatus}</span>
          </div>
        </div>
      </header>

      <div className="space-y-4 px-4">
        <SettingsSection
          eyebrow="Account"
          title="Account"
          description="Account controls stay frontend-safe in this stage. Backend auth and chat history are left untouched."
          icon={<UserRound size={20} />}
        >
          <SettingsRow label="Account mode" description="Supabase auth remains connected when configured; local fallback keeps the app usable without forcing backend writes.">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-frost/70">Local-safe</span>
          </SettingsRow>
          <SettingsRow label="Settings storage" description="Preferences save locally first, then sync to Supabase in the background when you are signed in.">
            <span className="block max-w-[8.5rem] rounded-full px-3 py-1 text-center text-xs font-black leading-4 ad-accent-bg">{syncStatus}</span>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          eyebrow="Appearance"
          title="Appearance"
          description="Choose the visual shell and premium accent system without changing the app direction."
          icon={<Palette size={20} />}
        >
          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            {appearanceModes.map((mode) => {
              const isAvailable = activeAppearanceModes.has(mode);
              return (
                <OptionButton
                  key={mode}
                  active={settings.appearanceMode === mode}
                  disabled={!isAvailable}
                  label={appearanceCopy[mode].label}
                  description={isAvailable ? appearanceCopy[mode].description : 'Coming soon. Ace Domain is black-first in this build.'}
                  onClick={() => update({ appearanceMode: mode })}
                />
              );
            })}
          </div>
          <ToggleRow
            checked={settings.reducedGlow}
            description="Softens large glows and shadows while keeping the premium dark feel."
            icon={<Sparkles size={18} />}
            label="Reduced glow"
            onChange={() => update({ reducedGlow: !settings.reducedGlow })}
          />
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Theme presets</p>
            <ThemePicker value={settings.themePreset} onChange={(themePreset) => update({ themePreset })} />
          </div>
        </SettingsSection>

        <SettingsSection
          eyebrow="Chat"
          title="Chat Personalization"
          description="These controls change only chat presentation. Realtime Supabase chat and mock fallback stay intact."
          icon={<MessageCircle size={20} />}
        >
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Sent message tone</p>
            <div className="grid grid-cols-2 gap-3">
              {sentBubbleToneOptions.map((tone) => (
                <OptionButton key={tone} active={settings.sentBubbleTone === tone} label={sentToneCopy[tone]} onClick={() => update({ sentBubbleTone: tone })} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Received bubble style</p>
            <div className="grid grid-cols-3 gap-2">
              {receivedBubbleStyleOptions.map((style) => (
                <OptionButton key={style} active={settings.receivedBubbleStyle === style} label={receivedStyleCopy[style]} onClick={() => update({ receivedBubbleStyle: style })} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Bubble shape</p>
              <div className="grid gap-2">
                {chatBubbleShapeOptions.map((shape) => (
                  <OptionButton key={shape} active={settings.chatBubbleShape === shape} label={shapeCopy[shape]} onClick={() => update({ chatBubbleShape: shape })} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Message density</p>
              <div className="grid gap-2">
                {messageDensityOptions.map((density) => (
                  <OptionButton key={density} active={settings.messageDensity === density} label={densityCopy[density]} onClick={() => update({ messageDensity: density })} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Chat wallpaper</p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {chatWallpaperOptions.map((wallpaper) => (
                <OptionButton key={wallpaper} active={settings.chatWallpaper === wallpaper} label={wallpaperCopy[wallpaper]} onClick={() => update({ chatWallpaper: wallpaper })} />
              ))}
            </div>
          </div>
          <ToggleRow checked={settings.showTimestamps} description="Show message time and delivery status under each bubble." icon={<MessageCircle size={18} />} label="Show timestamps" onChange={() => update({ showTimestamps: !settings.showTimestamps })} />
          <ToggleRow checked={settings.showTypingIndicator} description="Show the prepared typing/presence indicator in chat rooms." icon={<Sparkles size={18} />} label="Typing indicator UI" onChange={() => update({ showTypingIndicator: !settings.showTypingIndicator })} />
        </SettingsSection>

        <SettingsSection
          eyebrow="Profile"
          title="Profile Personalization"
          description="Local-only World ID styling. No uploads, buckets, or Supabase writes."
          icon={<Paintbrush size={20} />}
        >
          <ProfilePreview settings={settings} />
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Banner preset</p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {profileBannerOptions.map((banner) => (
                <OptionButton key={banner} active={settings.profileBannerPreset === banner} label={profileBannerCopy[banner]} onClick={() => update({ profileBannerPreset: banner })} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Profile accent</p>
            <div className="flex flex-wrap gap-2">
              {profileAccentOptions.map((accent) => (
                <SmallOptionButton key={accent} active={settings.profileAccentColor === accent} label={profileAccentCopy[accent]} onClick={() => update({ profileAccentColor: accent })} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Badge style</p>
              <div className="grid gap-2">
                {profileBadgeStyleOptions.map((badge) => (
                  <OptionButton key={badge} active={settings.profileBadgeStyle === badge} label={badgeCopy[badge]} onClick={() => update({ profileBadgeStyle: badge })} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Avatar frame</p>
              <div className="grid gap-2">
                {avatarFrameOptions.map((frame) => (
                  <OptionButton key={frame} active={settings.avatarFrameStyle === frame} label={avatarFrameCopy[frame]} onClick={() => update({ avatarFrameStyle: frame })} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Display layout</p>
            <div className="grid grid-cols-2 gap-2">
              {profileDisplayLayoutOptions.map((layout) => (
                <OptionButton key={layout} active={settings.profileDisplayLayout === layout} label={displayLayoutCopy[layout]} onClick={() => update({ profileDisplayLayout: layout })} />
              ))}
            </div>
          </div>
          <ToggleRow checked={settings.profileSpotlight} description="Keep premium spotlight styling ready for profile branding surfaces." icon={<UserRound size={18} />} label="Profile spotlight" onChange={() => update({ profileSpotlight: !settings.profileSpotlight })} />
        </SettingsSection>

        <SettingsSection eyebrow="Alerts" title="Notifications" description="Local preferences only. No push notification SDKs or backend workers." icon={<Bell size={20} />}>
          <ToggleRow checked={settings.messageNotifications} description="Show message alerts in the local notification experience." icon={<MessageCircle size={18} />} label="Messages" onChange={() => update({ messageNotifications: !settings.messageNotifications })} />
          <ToggleRow checked={settings.friendRequestNotifications} description="Surface new friend request activity." icon={<UserPlus size={18} />} label="Friend requests" onChange={() => update({ friendRequestNotifications: !settings.friendRequestNotifications })} />
          <ToggleRow checked={settings.globalMatchNotifications} description="Notify when Global Match activity is ready." icon={<Globe2 size={18} />} label="Global Match" onChange={() => update({ globalMatchNotifications: !settings.globalMatchNotifications })} />
          <ToggleRow checked={settings.communityUpdateNotifications} description="Keep community updates visible." icon={<UsersRound size={18} />} label="Community updates" onChange={() => update({ communityUpdateNotifications: !settings.communityUpdateNotifications })} />
          <ToggleRow checked={settings.eventReminderNotifications} description="Show local event reminder preference for calendar-ready flows." icon={<CalendarDays size={18} />} label="Event reminders" onChange={() => update({ eventReminderNotifications: !settings.eventReminderNotifications })} />
          <ToggleRow checked={settings.mentionNotifications} description="Surface mentions and replies in social surfaces." icon={<AtSign size={18} />} label="Mentions" onChange={() => update({ mentionNotifications: !settings.mentionNotifications })} />
          <ToggleRow checked={settings.likesCommentsNotifications} description="Show local preference for likes and comment activity." icon={<Heart size={18} />} label="Likes/comments" onChange={() => update({ likesCommentsNotifications: !settings.likesCommentsNotifications })} />
          <ToggleRow checked={settings.safetyAlertNotifications} description="Keep safety alerts enabled for global social flows." icon={<ShieldCheck size={18} />} label="Safety alerts" onChange={() => update({ safetyAlertNotifications: !settings.safetyAlertNotifications })} />
          <ToggleRow checked={settings.notificationPreview} description="Allow richer preview text in the local notification UI." icon={<Bell size={18} />} label="Notification previews" onChange={() => update({ notificationPreview: !settings.notificationPreview })} />
        </SettingsSection>

        <SettingsSection
          eyebrow="Safety"
          title="Privacy & Safety"
          description="Local safety controls for privacy, discovery, and safer global conversations."
          icon={<ShieldCheck size={20} />}
        >
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Who can message me</p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {messagePrivacyOptions.map((privacy) => (
                <OptionButton key={privacy} active={settings.messagePrivacy === privacy} label={messagePrivacyCopy[privacy]} onClick={() => update({ messagePrivacy: privacy })} />
              ))}
            </div>
          </div>
          <ToggleRow checked={settings.showOnlineStatus} description="Show whether you are online in social surfaces." icon={<Eye size={18} />} label="Show online status" onChange={() => update({ showOnlineStatus: !settings.showOnlineStatus })} />
          <ToggleRow checked={settings.showCountry} description="Show your country or region badge." icon={<MapPin size={18} />} label="Show country" onChange={() => update({ showCountry: !settings.showCountry })} />
          <ToggleRow checked={settings.showLocalTime} description="Show local time hints on global identity surfaces." icon={<Globe2 size={18} />} label="Show local time" onChange={() => update({ showLocalTime: !settings.showLocalTime })} />
          <ToggleRow checked={settings.showLanguages} description="Show languages spoken and learning." icon={<Languages size={18} />} label="Show languages" onChange={() => update({ showLanguages: !settings.showLanguages })} />
          <ToggleRow checked={settings.showProfileInGlobalMatch} description="Let your profile appear in Global Match discovery." icon={<Globe2 size={18} />} label="Show profile in Global Match" onChange={() => update({ showProfileInGlobalMatch: !settings.showProfileInGlobalMatch })} />
          <ToggleRow checked={settings.allowCommunityInvites} description="Allow local UI for community invite prompts." icon={<UsersRound size={18} />} label="Allow community invites" onChange={() => update({ allowCommunityInvites: !settings.allowCommunityInvites })} />
          <ToggleRow checked={settings.safetyReminders} description="Show local reminders around safer global conversations." icon={<ShieldCheck size={18} />} label="Safety reminders" onChange={() => update({ safetyReminders: !settings.safetyReminders })} />
          <div className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
            <p className="font-bold text-white">Safety reminder</p>
            <p className="mt-2 text-sm leading-6 text-frost/55">Keep first conversations inside Ace Domain, protect private codes, and report pressure, scams, or harassment.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-500"
              aria-label="Blocked users"
            >
              Blocked users / Coming soon
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-500"
              aria-label="Report history"
            >
              Report history / Coming soon
            </button>
          </div>
          <SettingsRow label="Global safety page" description="Open the existing privacy, stranger messaging, and accessibility controls.">
            <button type="button" onClick={onOpenGlobalSafety} className="rounded-full bg-white px-3 py-2 text-xs font-black text-black">
              Open
            </button>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          eyebrow="World"
          title="Language & Region"
          description="Organized global preferences for local display only. No translation API is connected."
          icon={<Languages size={20} />}
        >
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Preferred app language</p>
            <div className="flex flex-wrap gap-2">
              {appLanguageOptions.map((language) => (
                <SmallOptionButton key={language} active={settings.preferredAppLanguage === language} label={language} onClick={() => update({ preferredAppLanguage: language })} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Country/region</p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {countryRegionOptions.map((region) => (
                <OptionButton key={region} active={settings.countryRegion === region} label={region} onClick={() => update({ countryRegion: region })} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Time zone</p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {timeZoneOptions.map((timeZone) => (
                <OptionButton key={timeZone} active={settings.timeZonePreference === timeZone} label={timeZone} onClick={() => update({ timeZonePreference: timeZone })} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Languages spoken</p>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((language) => (
                <SmallOptionButton key={language} active={settings.languagesSpoken.includes(language)} label={language} onClick={() => toggleLanguage('languagesSpoken', language)} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Languages learning</p>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((language) => (
                <SmallOptionButton key={language} active={settings.languageLearning.includes(language)} label={language} onClick={() => toggleLanguage('languageLearning', language)} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {regionalFormatOptions.map((format) => (
              <OptionButton key={format} active={settings.regionalFormat === format} label={regionalCopy[format]} onClick={() => update({ regionalFormat: format })} />
            ))}
          </div>
          <ToggleRow checked={settings.translationPreview} description="Keep local translation preview affordances visible." icon={<Languages size={18} />} label="Translation preview" onChange={() => update({ translationPreview: !settings.translationPreview })} />
          <ToggleRow checked={settings.autoTranslate} description="Preview automatic translation controls for future multilingual conversations." icon={<Sparkles size={18} />} label="Auto-translate" onChange={() => update({ autoTranslate: !settings.autoTranslate })} />
          <ToggleRow checked={settings.showOriginalLanguage} description="Show original-language controls when translation previews are active." icon={<Globe2 size={18} />} label="Show original language" onChange={() => update({ showOriginalLanguage: !settings.showOriginalLanguage })} />
        </SettingsSection>

        <SettingsSection
          eyebrow="Comfort"
          title="Accessibility"
          description="Readable, calmer display modes that apply immediately on this device."
          icon={<Lock size={20} />}
        >
          <ToggleRow checked={settings.biggerText} description="Slightly increases app text size where safe." icon={<Type size={18} />} label="Bigger text" onChange={() => update({ biggerText: !settings.biggerText })} />
          <ToggleRow checked={settings.reduceAnimations} description="Reduces animated motion without changing navigation." icon={<Gauge size={18} />} label="Reduced motion" onChange={() => update({ reduceAnimations: !settings.reduceAnimations })} />
          <ToggleRow checked={settings.highContrast} description="Boost panel contrast for readability across dark and light shells." icon={<ShieldCheck size={18} />} label="High contrast" onChange={() => update({ highContrast: !settings.highContrast })} />
          <ToggleRow checked={settings.buttonLabels} description="Keep helpful labels visible on key controls." icon={<Type size={18} />} label="Button labels" onChange={() => update({ buttonLabels: !settings.buttonLabels })} />
          <ToggleRow checked={settings.compactMode} description="Tightens some local spacing on dense mobile screens." icon={<MonitorSmartphone size={18} />} label="Compact mode" onChange={() => update({ compactMode: !settings.compactMode })} />
          <ToggleRow checked={settings.screenReaderLabels} description="Keep explicit accessible labels on key controls." icon={<Lock size={18} />} label="Screen-reader friendly labels" onChange={() => update({ screenReaderLabels: !settings.screenReaderLabels })} />
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Animation intensity</p>
            <div className="grid grid-cols-3 gap-2">
              {animationIntensityOptions.map((intensity) => (
                <OptionButton key={intensity} active={settings.animationIntensity === intensity} label={animationIntensityCopy[intensity]} onClick={() => update({ animationIntensity: intensity })} />
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection eyebrow="Network" title="Data Saver" description="A local mode for lighter motion and network-conscious presentation." icon={<Gauge size={20} />}>
          <ToggleRow checked={settings.dataSaverMode} description="Enables a broader low-data presentation mode." icon={<Gauge size={18} />} label="Low-data mode" onChange={() => update({ dataSaverMode: !settings.dataSaverMode })} />
          <ToggleRow checked={settings.reduceAnimations} description="Reduce animation-heavy feedback for expensive or unstable networks." icon={<Gauge size={18} />} label="Reduce animations" onChange={() => update({ reduceAnimations: !settings.reduceAnimations })} />
          <ToggleRow checked={settings.compactCards} description="Tighten card padding where safe." icon={<MonitorSmartphone size={18} />} label="Compact cards" onChange={() => update({ compactCards: !settings.compactCards })} />
          <ToggleRow checked={settings.disableHeavyEffects} description="Disable the heaviest glow and background effects." icon={<Sparkles size={18} />} label="Disable heavy visual effects" onChange={() => update({ disableHeavyEffects: !settings.disableHeavyEffects })} />
          <ToggleRow checked={settings.textFirstCards} description="Prefer clearer text-first card presentation." icon={<Type size={18} />} label="Prefer text-first cards" onChange={() => update({ textFirstCards: !settings.textFirstCards })} />
          <ToggleRow checked={settings.reduceAutoRefresh} description="Reduce live-style refresh motion cues where safe." icon={<Gauge size={18} />} label="Reduce live effects" onChange={() => update({ reduceAutoRefresh: !settings.reduceAutoRefresh })} />
        </SettingsSection>

        <SettingsSection eyebrow="Product" title="About Ace Domain" description="Ace Domain is still local-first for settings and ready for future modules later." icon={<Info size={20} />}>
          <SettingsRow label="App name" description="Ace Domain" />
          <SettingsRow label="Tagline" description="Meet the World" />
          <SettingsRow label="Mission" description="Ace Domain is a global social app for chatting, culture, gaming, discovery, and connection." />
          <SettingsRow label="Version" description="Mobile foundation" />
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-frost/40">Coming later</p>
            <div className="flex flex-wrap gap-2">
              {comingLater.map((item) => (
                <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-frost/65">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-center gap-3">
              <Gamepad2 size={18} className="text-[color:var(--ad-accent)]" />
              <p className="text-sm font-bold text-white">Future modules are reserved in the roadmap and kept separate from the current social foundation.</p>
            </div>
          </div>
        </SettingsSection>
      </div>
    </section>
  );
}
