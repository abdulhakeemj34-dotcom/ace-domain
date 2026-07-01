import { Plus, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar } from '../../components/Avatar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import { useChatThreads } from './useChatThreads';

type ChatsScreenProps = {
  onOpenChat: (chatId: string) => void;
};

type ChatFilter = 'all' | 'direct' | 'group';

const filters: Array<{ label: string; value: ChatFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'People', value: 'direct' },
  { label: 'Groups', value: 'group' }
];

export function ChatsScreen({ onOpenChat }: ChatsScreenProps) {
  const { error, isLoading, refresh, threads, usingFallback } = useChatThreads();
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');
  const firstDirectThread = threads.find((chat) => chat.kind === 'direct');
  const startThreadId = firstDirectThread?.id ?? threads[0]?.id ?? (usingFallback ? 'c4' : '');
  const filteredThreads = useMemo(
    () => activeFilter === 'all' ? threads : threads.filter((chat) => chat.kind === activeFilter),
    [activeFilter, threads]
  );

  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow={usingFallback ? 'Local inbox' : 'Messages'}
        title="Chats"
        action={
          <button
            type="button"
            onClick={() => startThreadId && onOpenChat(startThreadId)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-black disabled:opacity-50"
            aria-label="Start new chat"
            disabled={!startThreadId}
          >
            <Plus size={20} />
          </button>
        }
      />
      <SearchBar placeholder="Search chats..." />

      <div className="mt-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {filters.map((filter) => {
          const active = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${active ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
          <p>{error}</p>
          <button type="button" onClick={refresh} className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
            Retry
          </button>
        </div>
      )}

      <div className="mt-3 divide-y divide-white/10">
        {isLoading && threads.length === 0 && <div className="px-4 py-4 text-sm text-frost/55">Loading chat rooms...</div>}
        {!isLoading && filteredThreads.length === 0 && (
          <div className="px-4 py-6 text-center">
            <h2 className="font-bold text-white">No chats here yet</h2>
            <p className="mt-2 text-sm leading-6 text-frost/55">Threads will appear when messages or memberships are ready.</p>
          </div>
        )}
        {filteredThreads.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onOpenChat(chat.id)}
            className="flex w-full min-w-0 items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.04]"
            aria-label={`Open ${chat.name} chat`}
          >
            <Avatar label={chat.avatar} active={chat.unread > 0 || chat.online} />
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate font-bold text-white">{chat.name}</h2>
                {chat.kind === 'group' && <UsersRound size={14} className="shrink-0 text-zinc-500" />}
              </div>
              <p className="line-clamp-1 break-words text-sm leading-5 text-frost/55 [overflow-wrap:anywhere]">{chat.message}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-frost/45">{chat.time}</p>
              {chat.unread > 0 && (
                <span className="mt-2 inline-grid h-6 min-w-6 place-items-center rounded-full bg-[#1d9bf0] px-2 text-xs font-bold text-white">
                  {chat.unread}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
