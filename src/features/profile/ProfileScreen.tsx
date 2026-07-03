import { BadgeCheck, ChevronRight, Globe2, LogOut, MapPin, Settings, X } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Avatar } from '../../components/Avatar';
import { CountryBadge } from '../../components/global/CountryBadge';
import { WorldClockLabel } from '../../components/global/WorldClockLabel';
import { LanguageBadge } from '../../components/language/LanguageBadge';
import { TranslationToggle } from '../../components/language/TranslationToggle';
import { ScreenHeader } from '../../components/ScreenHeader';
import { countryProfiles } from '../../data/mockGlobalData';
import { supabaseConfig } from '../../lib/supabase';
import { getCurrentProfile, profileDisplayName, updateCurrentProfile, type BackendProfile } from '../../services/profileService';
import type { GlobalOnboardingProfile, GlobalSafetySettings } from '../../types/global';
import { profileAccentColors } from '../settings/defaultSettings';
import type { AppSettings } from '../settings/settingsTypes';

const stats = [
  { label: 'Friends', value: '18.2K' },
  { label: 'Posts', value: '248' },
  { label: 'Groups', value: '36' }
];

const profileTabs = ['Posts', 'Replies', 'World'] as const;

type ProfileTab = (typeof profileTabs)[number];

type ProfileState = {
  avatar: string;
  bio: string;
  country: string;
  interests: string[];
  username: string;
};

const initialProfile: ProfileState = {
  avatar: 'AD',
  bio: 'Building friendships, communities, and opportunities across borders.',
  country: 'Lagos / Worldwide',
  interests: ['Gaming', 'Music', 'Coding', 'Travel', 'Anime'],
  username: 'Ace Explorer'
};

function profileFromBackend(profile: BackendProfile): ProfileState {
  const displayName = profileDisplayName(profile);

  return {
    avatar: displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 3)
      .toUpperCase() || 'AD',
    bio: profile.bio || initialProfile.bio,
    country: profile.country || initialProfile.country,
    interests: profile.interests?.length ? profile.interests : initialProfile.interests,
    username: displayName
  };
}

type EditProfileModalProps = {
  profile: ProfileState;
  onClose: () => void;
  onSave: (profile: ProfileState) => void;
};

function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const [draft, setDraft] = useState({
    ...profile,
    interestsText: profile.interests.join(', ')
  });

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center overflow-y-auto bg-black/80 px-4 py-4 backdrop-blur-xl">
      <form
        className="max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/10 bg-black p-4 animate-rise"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            avatar: draft.avatar.trim().slice(0, 3).toUpperCase() || 'AD',
            bio: draft.bio.trim() || initialProfile.bio,
            country: draft.country.trim() || initialProfile.country,
            interests: draft.interestsText
              .split(',')
              .map((interest) => interest.trim())
              .filter(Boolean)
              .slice(0, 8),
            username: draft.username.trim() || initialProfile.username
          });
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Profile editor</p>
            <h2 className="mt-1 text-2xl font-black text-white">Edit World ID</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Close edit profile">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Avatar initials
            <input
              value={draft.avatar}
              onChange={(event) => setDraft((current) => ({ ...current, avatar: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Username
            <input
              value={draft.username}
              onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Bio
            <textarea
              value={draft.bio}
              onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
              className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm normal-case leading-6 tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Country badge
            <input
              value={draft.country}
              onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Interests
            <input
              value={draft.interestsText}
              onChange={(event) => setDraft((current) => ({ ...current, interestsText: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
        </div>

        <button type="submit" className="mt-5 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-black">
          Save Profile
        </button>
      </form>
    </div>
  );
}

type ProfileScreenProps = {
  appSettings: AppSettings;
  canSyncProfile: boolean;
  globalProfile: GlobalOnboardingProfile;
  globalSettings: GlobalSafetySettings;
  onOpenSettingsCenter: () => void;
  onLogout?: () => void;
};

type ProfileRowProps = {
  children?: ReactNode;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  title: string;
};

const badgeLabels = {
  founder: 'Founder',
  gamer: 'Gamer',
  traveler: 'Traveler',
  verified: 'Verified'
} satisfies Record<AppSettings['profileBadgeStyle'], string>;

function profileVisualStyle(settings: AppSettings) {
  const accent = profileAccentColors[settings.profileAccentColor];

  return {
    '--profile-accent': accent.accent,
    '--profile-accent-soft': accent.soft
  } as CSSProperties;
}

function ProfileRow({ children, description, icon, onClick, title }: ProfileRowProps) {
  const className = 'flex w-full min-w-0 items-center gap-3 px-3 py-3.5 text-left';
  const content = (
    <>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-white">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-zinc-500">{description}</p>
        {children}
      </div>
      {onClick && <ChevronRight size={18} className="shrink-0 text-frost/25" />}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} transition hover:bg-white/[0.04]`}>
        {content}
      </button>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}

export function ProfileScreen({ appSettings, canSyncProfile, globalProfile, globalSettings, onLogout, onOpenSettingsCenter }: ProfileScreenProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState<ProfileTab>('Posts');
  const [editing, setEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  const visibleProfileStatus = profileStatus || (!canSyncProfile ? 'Profile is saved locally in demo mode.' : '');
  const profileCountry = countryProfiles.find((country) => country.name === globalProfile.country) ?? countryProfiles[0];
  const showCountry = !globalSettings.hideCountry && appSettings.showCountry;
  const showLocalTime = !globalSettings.hideLocalTime && appSettings.showLocalTime;
  const showLanguages = !globalSettings.hideLanguages && appSettings.showLanguages;
  const profileHandle = profile.username.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 24) || 'ace_explorer';
  const profileSignals = [
    { label: 'Mode', value: globalProfile.focus },
    { label: 'Region', value: globalProfile.region },
    { label: 'Badge', value: badgeLabels[appSettings.profileBadgeStyle] }
  ];
  const profilePostItems = [
    {
      eyebrow: 'Pinned',
      body: `${profile.username} is building a cleaner global circle: meet people, trade culture, and keep the feed useful.`,
      meta: `${profile.interests.slice(0, 2).join(' + ') || 'Global culture'} / ${globalProfile.region}`,
      stats: '428 views'
    },
    {
      eyebrow: 'Now',
      body: 'Looking for people who like thoughtful chats, games, music drops, and new cities.',
      meta: 'Open to Global Match',
      stats: '36 saves'
    }
  ];
  const profileReplyItems = [
    {
      body: 'Replying to a community thread about building safe friend groups across countries.',
      meta: 'Culture Club / 12 replies'
    },
    {
      body: 'Shared a quick opener for starting a respectful first chat with someone new.',
      meta: 'Social skills / 8 likes'
    }
  ];

  useEffect(() => {
    let isMounted = true;

    if (!canSyncProfile) {
      return () => {
        isMounted = false;
      };
    }

    getCurrentProfile().then((result) => {
      if (!isMounted) {
        return;
      }

      if (result.data) {
        setProfile(profileFromBackend(result.data));
        setProfileStatus('Live profile connected.');
      } else if (result.error) {
        setProfileStatus('Using local profile until live profile data is ready.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [canSyncProfile]);

  const saveProfile = async (nextProfile: ProfileState) => {
    setProfile(nextProfile);
    setEditing(false);

    if (!canSyncProfile || !supabaseConfig.isConfigured) {
      setProfileStatus(canSyncProfile ? 'Profile saved locally. Add Supabase keys to sync it live.' : 'Profile saved locally in demo mode.');
      return;
    }

    const result = await updateCurrentProfile({
      bio: nextProfile.bio,
      country: nextProfile.country,
      displayName: nextProfile.username,
      interests: nextProfile.interests,
      username: nextProfile.username.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 24)
    });

    setProfileStatus(result.error ? 'Profile saved locally; live sync is waiting on Supabase.' : 'Profile synced to Supabase.');
  };

  return (
    <section className="pb-6" style={profileVisualStyle(appSettings)}>
      <ScreenHeader
        eyebrow="World ID"
        title="Profile"
        action={
          <button
            type="button"
            onClick={onOpenSettingsCenter}
            className={`flex h-11 items-center justify-center rounded-full bg-white/10 text-white ${appSettings.buttonLabels ? 'gap-2 px-4' : 'w-11'}`}
            aria-label="Open Settings Center"
          >
            <Settings size={20} />
            {appSettings.buttonLabels && <span className="text-xs font-bold">Settings</span>}
          </button>
        }
      />

      <div className="px-4 pt-3">
        <div className={`profile-preview profile-banner-${appSettings.profileBannerPreset} profile-layout-${appSettings.profileDisplayLayout} border-b border-white/10 p-3 pb-5`}>
          <div className="flex items-start gap-4">
            <div className={`avatar-frame-${appSettings.avatarFrameStyle} w-fit rounded-full`}>
              <Avatar label={profile.avatar} size="lg" active={appSettings.showOnlineStatus} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate text-2xl font-black text-white">{profile.username}</h2>
                <BadgeCheck size={20} className="text-[#1d9bf0]" />
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-zinc-500">@{profileHandle}</p>
              <p className="mt-1 flex min-w-0 items-center gap-1 text-sm text-frost/55">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">{profile.country}</span>
              </p>
              <span
                className="mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                style={{ backgroundColor: 'var(--profile-accent-soft)', color: 'var(--profile-accent)' }}
              >
                {badgeLabels[appSettings.profileBadgeStyle]}
              </span>
            </div>
          </div>

          {appSettings.translationPreview ? (
            <TranslationToggle
              className="mt-4 text-sm leading-6"
              text={profile.bio}
              translatedText={`Translation preview: ${profile.bio}`}
            />
          ) : (
            <p className="mt-4 text-sm leading-6 text-frost/70">{profile.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa' }}
              >
                {interest}
              </span>
            ))}
          </div>

          {appSettings.profileDisplayLayout !== 'minimal' && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-black text-white">{stat.value}</p>
                  <p className="text-xs text-frost/45">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-3">
            {profileSignals.map((signal) => (
              <div key={signal.label} className="min-w-0 px-2 text-center">
                <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">{signal.label}</p>
                <p className="mt-1 truncate text-xs font-bold text-zinc-200">{signal.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setEditing(true)} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black">
              Edit profile
            </button>
            <button
              type="button"
              onClick={onOpenSettingsCenter}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white"
            >
              Settings
            </button>
          </div>

          {onLogout && (
            <button type="button" onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white">
              <LogOut size={17} />
              Logout
            </button>
          )}

          {visibleProfileStatus && <p className="mt-3 text-xs leading-5 text-frost/45">{visibleProfileStatus}</p>}
        </div>

        <div className="mt-4 grid grid-cols-3 border-b border-white/10 text-center">
          {profileTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative min-h-11 text-sm font-bold ${activeTab === tab ? 'text-white' : 'text-zinc-500'}`}
              aria-pressed={activeTab === tab}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />}
            </button>
          ))}
        </div>

        <div className="mt-2 border-b border-white/10">
          {activeTab === 'Posts' && (
            <div>
              {profilePostItems.map((item) => (
                <article key={item.eyebrow} className="border-b border-white/10 py-4 last:border-b-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">{item.eyebrow}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-zinc-100">{item.body}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
                    <span className="min-w-0 truncate">{item.meta}</span>
                    <span className="shrink-0">{item.stats}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'Replies' && (
            <div>
              {profileReplyItems.map((item) => (
                <article key={item.body} className="border-b border-white/10 py-4 last:border-b-0">
                  <p className="text-sm font-semibold leading-6 text-zinc-100">{item.body}</p>
                  <p className="mt-2 text-xs text-zinc-500">{item.meta}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'World' && (
            <div className="overflow-hidden">
              <ProfileRow
                icon={<Globe2 size={19} />}
                title="World identity"
                description={`${globalProfile.focus} / ${globalProfile.region}`}
              >
                <div className="mt-2 flex flex-wrap gap-2">
                  {showCountry && <CountryBadge code={profileCountry.code} label={globalProfile.country} />}
                  {showLocalTime && <WorldClockLabel timeZone={profileCountry.timeZone} />}
                  <LanguageBadge label={globalProfile.appLanguage} tone="preferred" />
                </div>
              </ProfileRow>

              {showLanguages && (
                <ProfileRow
                  icon={<Globe2 size={19} />}
                  title="Languages"
                  description={`Speaks ${globalProfile.languagesSpoken.join(', ')}. Learning ${globalProfile.languagesLearning.join(', ')}.`}
                >
                  <div className="mt-2 flex flex-wrap gap-2">
                    {globalProfile.languagesSpoken.slice(0, 3).map((language) => <LanguageBadge key={language} label={language} />)}
                    {globalProfile.languagesLearning.slice(0, 2).map((language) => <LanguageBadge key={language} label={language} tone="learning" />)}
                  </div>
                </ProfileRow>
              )}

              <ProfileRow
                icon={<BadgeCheck size={19} />}
                title="Global Match visibility"
                description={appSettings.showProfileInGlobalMatch ? 'Your profile can appear in discovery.' : 'Your profile is hidden from Global Match discovery.'}
              />
            </div>
          )}
        </div>

        <div className="mt-4 overflow-hidden border-y border-white/10">
          <ProfileRow
            icon={<Settings size={19} />}
            title="Settings and privacy"
            description="Personalization, safety, notifications, language, and account controls."
            onClick={onOpenSettingsCenter}
          />
        </div>
      </div>

      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(nextProfile) => {
            void saveProfile(nextProfile);
          }}
        />
      )}
    </section>
  );
}
