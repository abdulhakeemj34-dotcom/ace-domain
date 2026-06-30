import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { StartupSplash } from '../components/logo/StartupSplash';
import { defaultGlobalProfile, defaultGlobalSettings, focusOptions } from '../data/mockGlobalData';
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
import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { getCurrentSession, logout } from '../services/authService';
import type { AppScreen } from './types';
import type { GlobalOnboardingProfile, GlobalSafetySettings } from '../types/global';

const GLOBAL_PROFILE_KEY = 'ace-domain.global-profile';
const GLOBAL_ONBOARDING_KEY = 'ace-domain.global-onboarding-complete';
const GLOBAL_SETTINGS_KEY = 'ace-domain.global-settings';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeChatId, setActiveChatId] = useState('c1');
  const [globalProfile, setGlobalProfile] = useState<GlobalOnboardingProfile>(readGlobalProfile);
  const [globalSettings, setGlobalSettings] = useState<GlobalSafetySettings>(readGlobalSettings);
  const [showGlobalOnboarding, setShowGlobalOnboarding] = useState(() => !hasStoredFlag(GLOBAL_ONBOARDING_KEY));

  const showNav = isAuthenticated && !['welcome', 'auth'].includes(screen);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 2600);
    return () => window.clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCurrentSession().then((session) => {
      if (!isMounted || !session) {
        return;
      }

      setIsAuthenticated(true);
      setScreen('home');
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const page = useMemo(() => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStart={() => setScreen('auth')}
            onExploreDemo={() => {
              setIsAuthenticated(true);
              setScreen('home');
            }}
          />
        );
      case 'auth':
        return (
          <AuthScreen
            onComplete={() => {
              setIsAuthenticated(true);
              setScreen('home');
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
        return <ChatRoomScreen key={activeChatId} chatId={activeChatId} onBack={() => setScreen('chat')} />;
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
            onBack={() => setScreen('profile')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            globalProfile={globalProfile}
            globalSettings={globalSettings}
            onOpenGlobalSettings={() => setScreen('settings')}
            onLogout={() => {
              logout().then(() => {
                setIsAuthenticated(false);
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
  }, [activeChatId, globalProfile, globalSettings, screen]);

  const appModes = [
    globalSettings.lowDataMode ? 'low-data-mode' : '',
    globalSettings.reducedMotion ? 'reduced-motion-mode' : '',
    globalSettings.biggerText ? 'large-text-mode' : '',
    globalSettings.highContrast ? 'high-contrast-mode' : ''
  ].filter(Boolean).join(' ');

  return (
    <main className={`relative min-h-screen overflow-hidden bg-void text-frost ${appModes}`}>
      <div className="orbital-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[-14rem] h-96 w-96 -translate-x-1/2 rounded-full bg-aurora/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-[-7rem] h-72 w-72 rounded-full bg-plasma/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <div className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">{page}</div>

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

        <Sparkles className="pointer-events-none absolute right-6 top-8 text-aurora/50 animate-pulseGlow" size={20} />
      </div>
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
