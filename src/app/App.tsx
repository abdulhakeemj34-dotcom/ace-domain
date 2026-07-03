import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { StartupSplash } from '../components/logo/StartupSplash';
import { defaultGlobalProfile, defaultGlobalSettings, focusOptions } from '../data/mockGlobalData';
import { AiChatScreen } from '../features/ai/AiChatScreen';
import { AuthScreen } from '../features/auth/AuthScreen';
import { CalendarScreen } from '../features/calendar/CalendarScreen';
import { ChatsScreen } from '../features/chats/ChatsScreen';
import { ChatRoomScreen } from '../features/chats/ChatRoomScreen';
import { CommunitiesScreen } from '../features/communities/CommunitiesScreen';
import { HomeScreen } from '../features/feed/HomeScreen';
import { GlobalDiscoveryScreen } from '../features/global/GlobalDiscoveryScreen';
import { GlobalOnboarding } from '../features/global/GlobalOnboarding';
import { NotificationsScreen } from '../features/notifications/NotificationsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { GlobalSettingsScreen } from '../features/settings/GlobalSettingsScreen';
import { SettingsCenterScreen } from '../features/settings/SettingsCenterScreen';
import { themePresets } from '../features/settings/defaultSettings';
import { readAppSettings, readAppSettingsSavedAt, writeAppSettings } from '../features/settings/settingsStorage';
import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { subscribeToAuthChanges } from '../lib/supabase';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { getCurrentSession, logout } from '../services/authService';
import { loadCurrentUserSettings, upsertCurrentUserSettings } from '../services/settingsService';
import type { AppScreen } from './types';
import type { AppSettings } from '../features/settings/settingsTypes';
import type { GlobalOnboardingProfile, GlobalSafetySettings } from '../types/global';

const GLOBAL_PROFILE_KEY = 'ace-domain.global-profile';
const GLOBAL_ONBOARDING_KEY = 'ace-domain.global-onboarding-complete';
const GLOBAL_SETTINGS_KEY = 'ace-domain.global-settings';
type AuthMode = 'demo' | 'live' | 'signed-out';

function readStorageItem(key: string) {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : fallback;
}

function readRecord(key: string) {
  const raw = readStorageItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can be unavailable in some locked-down webviews; the app still works in memory.
  }
}

function hasStoredFlag(key: string) {
  return readStorageItem(key) === 'true';
}

function readGlobalProfile() {
  const stored = readRecord(GLOBAL_PROFILE_KEY);

  if (!stored) {
    return defaultGlobalProfile;
  }

  const focus = asString(stored.focus, defaultGlobalProfile.focus);

  return {
    appLanguage: asString(stored.appLanguage, defaultGlobalProfile.appLanguage),
    country: asString(stored.country, defaultGlobalProfile.country),
    focus: focusOptions.includes(focus as GlobalOnboardingProfile['focus']) ? focus as GlobalOnboardingProfile['focus'] : defaultGlobalProfile.focus,
    interests: asStringArray(stored.interests, defaultGlobalProfile.interests),
    languagesLearning: asStringArray(stored.languagesLearning, defaultGlobalProfile.languagesLearning),
    languagesSpoken: asStringArray(stored.languagesSpoken, defaultGlobalProfile.languagesSpoken),
    region: asString(stored.region, defaultGlobalProfile.region)
  };
}

function readGlobalSettings() {
  const stored = readRecord(GLOBAL_SETTINGS_KEY);

  if (!stored) {
    return defaultGlobalSettings;
  }

  const whoCanMessage = asString(stored.whoCanMessage, defaultGlobalSettings.whoCanMessage);
  const messageOptions: GlobalSafetySettings['whoCanMessage'][] = ['Everyone', 'Friends of friends', 'Only friends'];

  return {
    biggerText: typeof stored.biggerText === 'boolean' ? stored.biggerText : defaultGlobalSettings.biggerText,
    clearerLabels: typeof stored.clearerLabels === 'boolean' ? stored.clearerLabels : defaultGlobalSettings.clearerLabels,
    highContrast: typeof stored.highContrast === 'boolean' ? stored.highContrast : defaultGlobalSettings.highContrast,
    hideCountry: typeof stored.hideCountry === 'boolean' ? stored.hideCountry : defaultGlobalSettings.hideCountry,
    hideLanguages: typeof stored.hideLanguages === 'boolean' ? stored.hideLanguages : defaultGlobalSettings.hideLanguages,
    hideLocalTime: typeof stored.hideLocalTime === 'boolean' ? stored.hideLocalTime : defaultGlobalSettings.hideLocalTime,
    hideOnlineStatus: typeof stored.hideOnlineStatus === 'boolean' ? stored.hideOnlineStatus : defaultGlobalSettings.hideOnlineStatus,
    lowDataMode: typeof stored.lowDataMode === 'boolean' ? stored.lowDataMode : defaultGlobalSettings.lowDataMode,
    messageRequests: typeof stored.messageRequests === 'boolean' ? stored.messageRequests : defaultGlobalSettings.messageRequests,
    reducedMotion: typeof stored.reducedMotion === 'boolean' ? stored.reducedMotion : defaultGlobalSettings.reducedMotion,
    whoCanMessage: messageOptions.includes(whoCanMessage as GlobalSafetySettings['whoCanMessage'])
      ? whoCanMessage as GlobalSafetySettings['whoCanMessage']
      : defaultGlobalSettings.whoCanMessage
  };
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [authMode, setAuthMode] = useState<AuthMode>('signed-out');
  const [isAuthRestoring, setIsAuthRestoring] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeChatId, setActiveChatId] = useState('c1');
  const [appSettings, setAppSettings] = useState<AppSettings>(readAppSettings);
  const [settingsSyncStatus, setSettingsSyncStatus] = useState('Saved locally');
  const [globalProfile, setGlobalProfile] = useState<GlobalOnboardingProfile>(readGlobalProfile);
  const [globalSettings, setGlobalSettings] = useState<GlobalSafetySettings>(readGlobalSettings);
  const [showGlobalOnboarding, setShowGlobalOnboarding] = useState(() => !hasStoredFlag(GLOBAL_ONBOARDING_KEY));

  const isAuthenticated = authMode !== 'signed-out';
  const showNav = isAuthenticated && !['welcome', 'auth'].includes(screen);

  const syncRemoteAppSettings = useCallback(async (allowRemoteSync: boolean) => {
    if (!allowRemoteSync) {
      setSettingsSyncStatus('Saved locally');
      return;
    }

    const localSettings = readAppSettings();
    const localSavedAt = readAppSettingsSavedAt();
    setSettingsSyncStatus('Sync pending');
    const result = await loadCurrentUserSettings();

    if (result.data) {
      const remoteSavedAt = result.updatedAt ? new Date(result.updatedAt).getTime() : null;
      const remoteIsNewerOrEqual = !localSavedAt || !remoteSavedAt || remoteSavedAt >= localSavedAt;

      if (remoteIsNewerOrEqual) {
        setAppSettings(result.data);
        writeAppSettings(result.data);
        setSettingsSyncStatus('Synced');
        return;
      }

      const saveResult = await upsertCurrentUserSettings(localSettings);
      setSettingsSyncStatus(saveResult.error || saveResult.usingFallback ? 'Could not sync, saved on this device' : 'Synced');
      return;
    }

    if (!result.usingFallback) {
      const saveResult = await upsertCurrentUserSettings(localSettings);
      setSettingsSyncStatus(saveResult.error || saveResult.usingFallback ? 'Could not sync, saved on this device' : 'Synced');
      return;
    }

    setSettingsSyncStatus(result.error ? 'Could not sync, saved on this device' : 'Saved locally');
  }, []);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 2600);
    return () => window.clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCurrentSession().then((session) => {
      if (!isMounted) {
        return;
      }

      if (session) {
        setAuthMode('live');
        setScreen((current) => (['welcome', 'auth'].includes(current) ? 'home' : current));
        void syncRemoteAppSettings(true);
      }
    }).finally(() => {
      if (isMounted) {
        setIsAuthRestoring(false);
      }
    });

    const unsubscribe = subscribeToAuthChanges((event, session) => {
      if (!isMounted) {
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        setAuthMode('live');
        setScreen((current) => (['welcome', 'auth'].includes(current) ? 'home' : current));
        void syncRemoteAppSettings(true);
      }

      if (event === 'SIGNED_OUT') {
        setAuthMode('signed-out');
        setScreen((current) => (current === 'auth' ? current : 'welcome'));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [syncRemoteAppSettings]);

  const handleAppSettingsChange = useCallback((settings: AppSettings) => {
    setAppSettings(settings);
    writeAppSettings(settings);
    if (authMode !== 'live') {
      setSettingsSyncStatus('Saved locally');
      return;
    }

    setSettingsSyncStatus('Sync pending');
    void upsertCurrentUserSettings(settings).then((result) => {
      setSettingsSyncStatus(result.error || result.usingFallback ? 'Could not sync, saved on this device' : 'Synced');
    });
  }, [authMode]);

  const page = useMemo(() => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStart={() => setScreen('auth')}
            onExploreDemo={() => {
              setAuthMode('demo');
              setScreen('home');
            }}
          />
        );
      case 'auth':
        return (
          <AuthScreen
            onComplete={(mode) => {
              setAuthMode(mode);
              setScreen('home');
              if (mode === 'live') {
                void syncRemoteAppSettings(true);
              } else {
                setSettingsSyncStatus('Saved locally');
              }
            }}
          />
        );
      case 'chat':
        return (
          <ChatsScreen
            onOpenChat={(chatId) => {
              setActiveChatId(chatId);
              setScreen('chatRoom');
            }}
          />
        );
      case 'chatRoom':
        return <ChatRoomScreen key={activeChatId} chatId={activeChatId} chatSettings={appSettings} onBack={() => setScreen('chat')} />;
      case 'aiChat':
        return <AiChatScreen onBack={() => setScreen('home')} />;
      case 'global':
        return (
          <GlobalDiscoveryScreen
            onBack={() => setScreen('home')}
            onOpenCalendar={() => setScreen('calendar')}
            onStartChat={() => {
              setActiveChatId('c4');
              setScreen('chatRoom');
            }}
          />
        );
      case 'calendar':
        return <CalendarScreen onBack={() => setScreen('global')} />;
      case 'communities':
        return <CommunitiesScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return (
          <GlobalSettingsScreen
            settings={globalSettings}
            onChange={(settings) => {
              setGlobalSettings(settings);
              writeJson(GLOBAL_SETTINGS_KEY, settings);
            }}
            onBack={() => setScreen('settingsCenter')}
          />
        );
      case 'settingsCenter':
        return (
          <SettingsCenterScreen
            settings={appSettings}
            syncStatus={settingsSyncStatus}
            onChange={handleAppSettingsChange}
            onBack={() => setScreen('profile')}
            onOpenGlobalSafety={() => setScreen('settings')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            appSettings={appSettings}
            globalProfile={globalProfile}
            globalSettings={globalSettings}
            canSyncProfile={authMode === 'live'}
            onOpenSettingsCenter={() => setScreen('settingsCenter')}
            onLogout={() => {
              logout().then(() => {
                setAuthMode('signed-out');
                setScreen('welcome');
              });
            }}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            globalProfile={globalProfile}
            globalSettings={globalSettings}
            onOpenAiChat={() => setScreen('aiChat')}
            onOpenCommunities={() => setScreen('communities')}
            onOpenGlobal={() => setScreen('global')}
            onOpenCalendar={() => setScreen('calendar')}
            onStartChat={() => {
              setActiveChatId('c4');
              setScreen('chatRoom');
            }}
          />
        );
    }
  }, [activeChatId, appSettings, authMode, globalProfile, globalSettings, handleAppSettingsChange, screen, settingsSyncStatus, syncRemoteAppSettings]);

  const appModes = [
    `appearance-${appSettings.appearanceMode}`,
    globalSettings.lowDataMode || appSettings.dataSaverMode || appSettings.reduceAutoRefresh ? 'low-data-mode' : '',
    globalSettings.reducedMotion || appSettings.reduceAnimations || appSettings.animationIntensity !== 'normal' ? 'reduced-motion-mode' : '',
    globalSettings.biggerText || appSettings.biggerText ? 'large-text-mode' : '',
    globalSettings.highContrast || appSettings.highContrast ? 'high-contrast-mode' : '',
    appSettings.reducedGlow || appSettings.dataSaverMode || appSettings.disableHeavyEffects ? 'reduced-glow-mode' : '',
    appSettings.compactMode ? 'compact-mode' : '',
    appSettings.compactCards ? 'compact-cards-mode' : '',
    appSettings.disableHeavyEffects ? 'disable-heavy-effects-mode' : '',
    appSettings.textFirstCards ? 'text-first-mode' : '',
    appSettings.animationIntensity === 'minimal' ? 'minimal-animation-mode' : ''
  ].filter(Boolean).join(' ');

  const themeStyle = useMemo(() => {
    const theme = themePresets[appSettings.themePreset];

    return {
      '--ad-accent': theme.accent,
      '--ad-accent-contrast': theme.accentContrast,
      '--ad-accent-soft': theme.accentSoft,
      '--ad-accent-strong': theme.accentStrong,
      '--ad-glow': theme.glow
    } as CSSProperties;
  }, [appSettings.themePreset]);

  return (
    <main className={`ad-app-shell relative min-h-[100dvh] bg-black text-zinc-100 ${appModes}`} style={themeStyle}>
      <div className="ad-mobile-frame relative mx-auto flex w-full flex-col bg-black">
        <div className="ad-screen-content flex-1">{page}</div>

        {showNav && <BottomNavigation activeScreen={screen} onNavigate={setScreen} />}

        {!isAuthenticated && screen !== 'welcome' && (
          <button
            type="button"
            onClick={() => setScreen('welcome')}
            className="fixed left-5 top-5 z-30 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl"
          >
            Back
          </button>
        )}

      </div>
      {!isAuthenticated && isAuthRestoring && !showSplash && (
        <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-black px-4 py-2 text-xs font-bold text-zinc-400">
          Restoring session...
        </div>
      )}
      {isAuthenticated && showGlobalOnboarding && !showSplash && (
        <GlobalOnboarding
          onComplete={(profile) => {
            setGlobalProfile(profile);
            writeJson(GLOBAL_PROFILE_KEY, profile);
            writeJson(GLOBAL_ONBOARDING_KEY, true);
            setShowGlobalOnboarding(false);
          }}
          onSkip={() => {
            writeJson(GLOBAL_ONBOARDING_KEY, true);
            setShowGlobalOnboarding(false);
          }}
        />
      )}
      <StartupSplash isVisible={showSplash} />
    </main>
  );
}
