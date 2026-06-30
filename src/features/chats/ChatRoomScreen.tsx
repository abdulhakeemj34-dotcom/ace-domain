import { ArrowLeft, Gamepad2, Mic, Send, UsersRound } from 'lucide-react';
import { chats, chatMessagesByChatId } from '../../app/data';
import { Avatar } from '../../components/Avatar';

type ChatRoomScreenProps = {
  chatId: string;
  onBack: () => void;
};

export function ChatRoomScreen({ chatId, onBack }: ChatRoomScreenProps) {
  const chat = chats.find((item) => item.id === chatId) ?? chats[0];
  const messages = chatMessagesByChatId[chat.id] ?? chatMessagesByChatId.c1;
  const isGroup = chat.kind === 'group';

  return (
    <section className="flex min-h-screen flex-col animate-rise">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-void/90 px-5 pb-4 pt-8 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white">
            <ArrowLeft size={20} />
          </button>
          <Avatar label={chat.avatar} active={chat.online} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-white">{chat.name}</h1>
            <p className="truncate text-xs text-aurora">
              {isGroup ? `${chat.members} members / ${chat.online ? 'live now' : 'quiet room'}` : `${chat.online ? 'Online' : 'Recently active'} / ${chat.country ?? 'Global'}`}
            </p>
          </div>
        </div>

        {isGroup && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-white/[0.06] p-3">
            <div className="flex -space-x-2">
              {(chat.avatars ?? []).map((avatar) => (
                <span key={avatar} className="grid h-8 w-8 place-items-center rounded-full border border-obsidian bg-gradient-to-br from-aurora to-signal text-[10px] font-black text-void">
                  {avatar}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">Group chat layout</p>
              <p className="truncate text-xs text-frost/45">Member previews, live status, and game-ready room tools.</p>
            </div>
            <UsersRound className="text-aurora" size={18} />
          </div>
        )}
      </header>

      <div className="flex-1 space-y-3 px-5 py-5 pb-40">
        {messages.map((message) => {
          const mine = message.author === 'me';
          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] ${mine ? 'text-right' : 'text-left'}`}>
                {!mine && isGroup && <p className="mb-1 ml-2 text-[10px] font-bold uppercase tracking-[0.18em] text-aurora/80">{message.authorName}</p>}
                <div
                  className={`rounded-[24px] px-4 py-3 text-sm leading-6 shadow-glow ${
                    mine
                      ? 'rounded-br-md bg-white text-void'
                      : 'rounded-bl-md border border-white/10 bg-white/[0.08] text-frost/80'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-void/50' : 'text-frost/40'}`}>{message.time}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-start">
          <div className="rounded-[24px] rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-2 w-2 rounded-full bg-aurora animate-pulseGlow" style={{ animationDelay: `${dot * 160}ms` }} />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-frost/45">{isGroup ? 'The room is typing...' : `${chat.name} is typing...`}</p>
          </div>
        </div>
      </div>

      <form
        className="fixed bottom-24 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-[28px] border border-white/10 bg-obsidian/95 p-2 shadow-panel backdrop-blur-2xl"
        onSubmit={(event) => event.preventDefault()}
      >
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-aurora/15 text-aurora" aria-label="Open game options">
          <Gamepad2 size={19} />
        </button>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Start voice message">
          <Mic size={19} />
        </button>
        <input className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-frost/35" placeholder="Message the world..." />
        <button type="submit" className="grid h-11 w-11 place-items-center rounded-full bg-white text-void" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
