import { Bell, Home, MessageCircle, UserRound, UsersRound } from 'lucide-react';
import type { AppScreen } from '../app/types';

const navItems: Array<{ screen: AppScreen; label: string; icon: typeof Home }> = [
  { screen: 'home', label: 'Home', icon: Home },
  { screen: 'chat', label: 'Chat', icon: MessageCircle },
  { screen: 'communities', label: 'Communities', icon: UsersRound },
  { screen: 'notifications', label: 'Notifications', icon: Bell },
  { screen: 'profile', label: 'Profile', icon: UserRound }
];

type BottomNavigationProps = {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
};

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-[28px] border border-white/10 bg-obsidian/90 px-2 py-2 shadow-panel backdrop-blur-2xl">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            activeScreen === item.screen ||
            (activeScreen === 'chatRoom' && item.screen === 'chat') ||
            ((activeScreen === 'global' || activeScreen === 'calendar' || activeScreen === 'aiChat') && item.screen === 'home') ||
            ((activeScreen === 'settings' || activeScreen === 'settingsCenter') && item.screen === 'profile');
          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-3xl text-[10px] transition duration-300 ${
                active ? 'shadow-glow' : 'text-frost/60 hover:bg-white/10 hover:text-white'
              }`}
              style={active ? { background: 'linear-gradient(135deg, var(--ad-accent), var(--ad-accent-strong))', color: 'var(--ad-accent-contrast)', boxShadow: '0 0 26px var(--ad-glow)' } : undefined}
              aria-label={`Open ${item.label}`}
            >
              <Icon size={20} strokeWidth={active ? 2.7 : 2.1} />
              <span className="max-w-full truncate px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
