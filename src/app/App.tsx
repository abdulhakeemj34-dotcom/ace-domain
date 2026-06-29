import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { StartupSplash } from '../components/logo/StartupSplash';
import { AuthScreen } from '../features/auth/AuthScreen';
import { ChatsScreen } from '../features/chats/ChatsScreen';
import { ChatRoomScreen } from '../features/chats/ChatRoomScreen';
import { CommunitiesScreen } from '../features/communities/CommunitiesScreen';
import { HomeScreen } from '../features/feed/HomeScreen';
import { NotificationsScreen } from '../features/notifications/NotificationsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { BottomNavigation } from '../navigation/BottomNavigation';
import type { AppScreen } from './types';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const showNav = isAuthenticated && !['welcome', 'auth'].includes(screen);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 1600);
    return () => window.clearTimeout(splashTimer);
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
        return <ChatsScreen onOpenChat={() => setScreen('chatRoom')} />;
      case 'chatRoom':
        return <ChatRoomScreen onBack={() => setScreen('chat')} />;
      case 'communities':
        return <CommunitiesScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'home':
      default:
        return <HomeScreen onOpenCommunities={() => setScreen('communities')} />;
    }
  }, [screen]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-frost">
      <div className="orbital-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[-14rem] h-96 w-96 -translate-x-1/2 rounded-full bg-aurora/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-[-7rem] h-72 w-72 rounded-full bg-plasma/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <div className="flex-1 pb-24">{page}</div>

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
      <StartupSplash isVisible={showSplash} />
    </main>
  );
}
