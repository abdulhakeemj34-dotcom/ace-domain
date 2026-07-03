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
    <nav className="ad-bottom-nav pointer-events-auto fixed bottom-0 left-1/2 z-30 w-full max-w-[min(var(--ad-shell-max-width),100vw)] -translate-x-1/2 select-none border-t border-white/10 bg-black/95 px-2 pt-1.5 backdrop-blur-xl">
      <div className="grid grid-cols-5">
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
              className={`relative flex min-h-14 w-full min-w-0 touch-manipulation flex-col items-center justify-center gap-1 text-[10px] font-semibold transition duration-200 ${
                active ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
              aria-label={`Open ${item.label}`}
            >
              <span className="pointer-events-none grid h-7 w-7 place-items-center">
                <Icon className="shrink-0" size={19} strokeWidth={active ? 2.6 : 2.1} />
              </span>
              <span className="pointer-events-none max-w-full truncate px-1">{item.label}</span>
              {active && <span className="pointer-events-none absolute top-1 h-1 w-1 rounded-full bg-[#1d9bf0]" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
