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
    <nav className="pointer-events-auto fixed bottom-[calc(0.65rem+env(safe-area-inset-bottom))] left-1/2 z-30 w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 select-none rounded-[26px] border border-white/10 bg-[#080b12]/92 px-2 py-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
      <div className="grid grid-cols-5 gap-0.5">
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
              className={`relative flex min-h-14 w-full min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition duration-300 ${
                active ? 'bg-white/12 text-white' : 'text-frost/55 hover:bg-white/8 hover:text-white'
              }`}
              aria-label={`Open ${item.label}`}
            >
              <span className={`pointer-events-none grid h-7 w-7 place-items-center rounded-full ${active ? 'bg-white text-void' : ''}`}>
                <Icon className="shrink-0" size={19} strokeWidth={active ? 2.6 : 2.1} />
              </span>
              <span className="pointer-events-none max-w-full truncate px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
