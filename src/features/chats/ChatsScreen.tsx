import { Plus, UsersRound } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import { useChatThreads } from './useChatThreads';

type ChatsScreenProps = {
  onOpenChat: (chatId: string) => void;
};

export function ChatsScreen({ onOpenChat }: ChatsScreenProps) {
  const { error, isLoading, refresh, threads, usingFallback } = useChatThreads();
  const groupThreads = threads.filter((chat) => chat.kind === 'group');
  const firstDirectThread = threads.find((chat) => chat.kind === 'direct');
  const startThreadId = firstDirectThread?.id ?? threads[0]?.id ?? (usingFallback ? 'c4' : '');

  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow="Private and groups"
        title="Chats"
        action={
          <button
            type="button"
            onClick={() => startThreadId && onOpenChat(startThreadId)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-void disabled:opacity-50"
            aria-label="Start new chat"
            disabled={!startThreadId}
          >
            <Plus size={20} />
          </button>
        }
      />
      <SearchBar placeholder="Search chats or ask Ace AI for introductions..." />
      <div className="px-5 py-5">
        <div className="mb-5 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-bold text-white">Group rooms</h2>
              <p className="mt-1 text-sm text-frost/55">Live rooms with members, previews, and quick jump-in.</p>
            </div>
            <span className="shrink-0 rounded-full bg-aurora/15 px-3 py-1 text-xs font-bold text-aurora">
              {usingFallback ? 'Demo' : 'Live'}
            </span>
          </div>
          {error && (
            <div className="mt-4 rounded-3xl border border-plasma/20 bg-plasma/10 p-3 text-sm text-plasma">
              <p>{error}</p>
              <button type="button" onClick={refresh} className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                Retry
              </button>
            </div>
          )}
          <div className="mt-4 grid gap-3">
            {isLoading && threads.length === 0 && (
              <div className="rounded-3xl bg-white/[0.06] p-4 text-sm text-frost/55">Loading chat rooms...</div>
            )}
            {!isLoading && groupThreads.length === 0 && (
              <div className="rounded-3xl bg-white/[0.06] p-4 text-sm text-frost/55">No group rooms yet. Real rooms will appear here after membership is created.</div>
            )}
            {groupThreads.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => onOpenChat(chat.id)}
                className="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-3xl bg-white/[0.06] p-3 text-left"
                aria-label={`Open ${chat.name} group room`}
              >
                <Avatar label={chat.avatar} active={chat.online} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{chat.name}</h3>
                  <p className="line-clamp-2 break-words text-xs leading-5 text-frost/50 [overflow-wrap:anywhere]">{chat.members} members / {chat.message}</p>
                </div>
                <div className="flex shrink-0 -space-x-2">
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
        {threads.length > 0 && (
          <div className="mb-4 flex gap-3 overflow-x-auto [scrollbar-width:none]">
            {threads.slice(0, 3).map((chat) => (
            <div key={chat.id} className="w-28 shrink-0 rounded-3xl bg-white/[0.06] p-3 text-center">
              <Avatar label={chat.avatar} active={chat.unread > 0} />
              <p className="mt-2 truncate text-xs font-bold text-white">{chat.name}</p>
            </div>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {!isLoading && threads.length === 0 && (
            <div className="glass-panel rounded-[26px] p-5 text-center">
              <h2 className="font-bold text-white">No chat threads yet</h2>
              <p className="mt-2 text-sm leading-6 text-frost/55">When Supabase has chat thread memberships for this account, they will appear here.</p>
            </div>
          )}
          {threads.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onOpenChat(chat.id)}
              className="glass-panel flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-[26px] p-4 text-left"
              aria-label={`Open ${chat.name} chat`}
            >
              <Avatar label={chat.avatar} active={chat.unread > 0} />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate font-bold text-white">{chat.name}</h2>
                  {chat.kind === 'group' && <UsersRound size={14} className="shrink-0 text-aurora" />}
                </div>
                <p className="line-clamp-2 break-words text-sm leading-5 text-frost/55 [overflow-wrap:anywhere]">{chat.message}</p>
              </div>
              <div className="shrink-0 text-right">
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
