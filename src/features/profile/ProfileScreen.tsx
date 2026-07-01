import { BadgeCheck, Globe2, MapPin, Settings, X } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { futureModules } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { CountryBadge } from '../../components/global/CountryBadge';
import { WorldClockLabel } from '../../components/global/WorldClockLabel';
import { LanguageBadge } from '../../components/language/LanguageBadge';
import { TranslationToggle } from '../../components/language/TranslationToggle';
import { ScreenHeader } from '../../components/ScreenHeader';
import { countryProfiles } from '../../data/mockGlobalData';
import { profileAccentColors } from '../settings/defaultSettings';
import { supabaseConfig } from '../../lib/supabase';
import { getCurrentProfile, profileDisplayName, updateCurrentProfile, type BackendProfile } from '../../services/profileService';
import type { AppSettings } from '../settings/settingsTypes';
import type { GlobalOnboardingProfile, GlobalSafetySettings } from '../../types/global';

const stats = [
  { label: 'Friends', value: '18.2K' },
  { label: 'Posts', value: '248' },
  { label: 'Groups', value: '36' }
];

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
    <div className="fixed inset-0 z-40 flex items-end justify-center overflow-y-auto bg-void/80 px-4 py-4 backdrop-blur-2xl">
      <form
        className="max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/10 bg-obsidian p-4 shadow-panel animate-rise"
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
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-aurora">Profile editor</p>
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
              className="mt-2 w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Username
            <input
              value={draft.username}
              onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Bio
            <textarea
              value={draft.bio}
              onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
              className="mt-2 min-h-24 w-full resize-none rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm normal-case leading-6 tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Country badge
            <input
              value={draft.country}
              onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Interests
            <input
              value={draft.interestsText}
              onChange={(event) => setDraft((current) => ({ ...current, interestsText: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            />
          </label>
        </div>

        <button type="submit" className="mt-5 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-void">
          Save Profile
        </button>
      </form>
    </div>
  );
}

type ProfileScreenProps = {
  appSettings: AppSettings;
  globalProfile: GlobalOnboardingProfile;
  globalSettings: GlobalSafetySettings;
  onOpenSettingsCenter: () => void;
  onLogout?: () => void;
};

const badgeLabels = {
  founder: 'Founder badge',
  gamer: 'Gamer badge',
  traveler: 'Traveler badge',
  verified: 'Verified badge'
} satisfies Record<AppSettings['profileBadgeStyle'], string>;

function profileVisualStyle(settings: AppSettings) {
  const accent = profileAccentColors[settings.profileAccentColor];

  return {
    '--profile-accent': accent.accent,
    '--profile-accent-soft': accent.soft
  } as CSSProperties;
}

export function ProfileScreen({ appSettings, globalProfile, globalSettings, onLogout, onOpenSettingsCenter }: ProfileScreenProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  const profileCountry = countryProfiles.find((country) => country.name === globalProfile.country) ?? countryProfiles[0];
  const showCountry = !globalSettings.hideCountry && appSettings.showCountry;
  const showLocalTime = !globalSettings.hideLocalTime && appSettings.showLocalTime;
  const showLanguages = !globalSettings.hideLanguages && appSettings.showLanguages;
  const profileCardPadding = appSettings.compactMode || appSettings.compactCards ? 'p-4' : 'p-5';
  const profileCardClass = [
    'glass-panel profile-preview rounded-[28px] text-center',
    `profile-banner-${appSettings.profileBannerPreset}`,
    `profile-layout-${appSettings.profileDisplayLayout}`,
    appSettings.profileSpotlight ? 'ad-accent-ring' : '',
    profileCardPadding
  ].filter(Boolean).join(' ');

  useEffect(() => {
    let isMounted = true;

    getCurrentProfile().then((result) => {
      if (!isMounted) {
        return;
      }

      if (result.data) {
        setProfile(profileFromBackend(result.data));
        setProfileStatus('Live profile connected.');
      } else if (result.error) {
        setProfileStatus('Using local profile until Supabase profile data is ready.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveProfile = async (nextProfile: ProfileState) => {
    setProfile(nextProfile);
    setEditing(false);

    if (!supabaseConfig.isConfigured) {
      setProfileStatus('Profile saved locally. Add Supabase keys to sync it live.');
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
    <section className="pb-6">
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
      <div className="px-4 py-4">
        <div className={profileCardClass} style={profileVisualStyle(appSettings)}>
          <div className={`avatar-frame-${appSettings.avatarFrameStyle} mx-auto w-fit rounded-full`}>
            <Avatar label={profile.avatar} size="lg" active={appSettings.showOnlineStatus} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-white">{profile.username}</h2>
            <BadgeCheck size={20} style={{ color: 'var(--profile-accent)' }} />
          </div>
          <span className="mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ backgroundColor: 'var(--profile-accent-soft)', color: 'var(--profile-accent)' }}>
            {badgeLabels[appSettings.profileBadgeStyle]}
          </span>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-frost/55">
            <MapPin size={14} /> {profile.country}
          </p>
          {appSettings.translationPreview ? (
            <TranslationToggle
              className="mx-auto mt-4 max-w-xs text-sm leading-6"
              text={profile.bio}
              translatedText={`Translation preview: ${profile.bio}`}
            />
          ) : (
            <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-frost/70">{profile.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--profile-accent-soft)', color: 'var(--profile-accent)' }}>
                {interest}
              </span>
            ))}
          </div>
          {appSettings.profileDisplayLayout !== 'minimal' && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/[0.06] p-2.5">
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-xs text-frost/45">{stat.label}</p>
              </div>
            ))}
          </div>
          )}
          <p className="mt-4 text-xs font-bold text-frost/45">
            {appSettings.showProfileInGlobalMatch ? 'Visible in Global Match' : 'Hidden from Global Match'}
          </p>
          <button type="button" onClick={() => setEditing(true)} className="mt-4 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-void">
            Edit Profile
          </button>
          {onLogout && (
            <button type="button" onClick={onLogout} className="mt-3 w-full rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white">
              Logout
            </button>
          )}
          {profileStatus && <p className="mt-3 text-xs leading-5 text-frost/45">{profileStatus}</p>}
        </div>

        <div className={`mt-4 rounded-[24px] border border-white/10 bg-white/[0.06] ${appSettings.compactMode || appSettings.compactCards ? 'p-3.5' : 'p-4'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--profile-accent)' }}>Language identity</p>
              <h3 className="mt-2 text-xl font-black text-white">{globalProfile.focus}</h3>
              <p className="mt-1 text-sm text-frost/55">{globalProfile.region}</p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ backgroundColor: 'var(--profile-accent-soft)', color: 'var(--profile-accent)' }}>
              <Globe2 size={21} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {showCountry && <CountryBadge code={profileCountry.code} label={globalProfile.country} />}
            {showLocalTime && <WorldClockLabel timeZone={profileCountry.timeZone} />}
            <LanguageBadge label={globalProfile.appLanguage} tone="preferred" />
          </div>
          {showLanguages && (
            <div className="mt-3 grid gap-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-frost/45">Speaks</p>
                <div className="flex flex-wrap gap-2">
                  {globalProfile.languagesSpoken.map((language) => <LanguageBadge key={language} label={language} />)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-frost/45">Learning</p>
                <div className="flex flex-wrap gap-2">
                  {globalProfile.languagesLearning.map((language) => <LanguageBadge key={language} label={language} tone="learning" />)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-3.5">
          <h3 className="font-bold text-white">Future-ready architecture</h3>
          <p className="mt-2 text-sm leading-6 text-frost/55">
            These modules are reserved in the product roadmap, separate from the Version 1 social layer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {futureModules.map((module) => (
              <span key={module} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-frost/65">
                {module}
              </span>
            ))}
          </div>
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
