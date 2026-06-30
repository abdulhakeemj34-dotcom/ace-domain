import { Plus, UsersRound } from 'lucide-react';
import { chats } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';

type ChatsScreenProps = {
  onOpenChat: (chatId: string) => void;
};

export function ChatsScreen({ onOpenChat }: ChatsScreenProps) {
  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow="Private and groups"
        title="Chats"
        action={
          <button type="button" onClick={() => onOpenChat('c4')} className="grid h-11 w-11 place-items-center rounded-full bg-white text-void" aria-label="Start new chat">
            <Plus size={20} />
          </button>
        }
      />
      <SearchBar placeholder="Search chats or ask Ace AI for introductions..." />
      <div className="px-5 py-5">
        <div className="mb-5 rounded-[30px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Group rooms</h2>
              <p className="mt-1 text-sm text-frost/55">Live rooms with members, previews, and quick jump-in.</p>
            </div>
            <span className="rounded-full bg-aurora/15 px-3 py-1 text-xs font-bold text-aurora">Live</span>
          </div>
          <div className="mt-4 grid gap-3">
            {chats.filter((chat) => chat.kind === 'group').map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => onOpenChat(chat.id)}
                className="flex items-center gap-3 rounded-3xl bg-white/[0.06] p-3 text-left"
                aria-label={`Open ${chat.name} group room`}
              >
                <Avatar label={chat.avatar} active={chat.online} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{chat.name}</h3>
                  <p className="truncate text-xs text-frost/50">{chat.members} members / {chat.message}</p>
                </div>
                <div className="flex -space-x-2">
                  {(chat.avatars ?? []).map((avatar) => (
                    <span key={avatar} className="grid h-7 w-7 place-items-center rounded-full border border-obsidian bg-gradient-to-br from-aurora to-signal text-[10px] font-black text-void">
                      {avatar}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 flex gap-3 overflow-x-auto [scrollbar-width:none]">
          {chats.slice(0, 3).map((chat) => (
            <div key={chat.id} className="w-28 shrink-0 rounded-3xl bg-white/[0.06] p-3 text-center">
              <Avatar label={chat.avatar} active={chat.unread > 0} />
              <p className="mt-2 truncate text-xs font-bold text-white">{chat.name}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onOpenChat(chat.id)}
              className="glass-panel flex w-full items-center gap-3 rounded-[26px] p-4 text-left"
              aria-label={`Open ${chat.name} chat`}
            >
              <Avatar label={chat.avatar} active={chat.unread > 0} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-bold text-white">{chat.name}</h2>
                  {chat.kind === 'group' && <UsersRound size={14} className="text-aurora" />}
                </div>
                <p className="truncate text-sm text-frost/55">{chat.message}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-frost/45">{chat.time}</p>
                {chat.unread > 0 && (
                  <span className="mt-2 inline-grid h-6 min-w-6 place-items-center rounded-full bg-aurora px-2 text-xs font-bold text-void">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
