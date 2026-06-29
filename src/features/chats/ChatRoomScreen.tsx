import { ArrowLeft, Gamepad2, Mic, Send } from 'lucide-react';
import { chatMessages } from '../../app/data';
import { Avatar } from '../../components/Avatar';

type ChatRoomScreenProps = {
  onBack: () => void;
};

export function ChatRoomScreen({ onBack }: ChatRoomScreenProps) {
  return (
    <section className="flex min-h-screen flex-col animate-rise">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-void/85 px-5 pb-4 pt-8 backdrop-blur-2xl">
        <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white">
          <ArrowLeft size={20} />
        </button>
        <Avatar label="GF" active />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-white">Global Founders</h1>
          <p className="truncate text-xs text-aurora">28 online / group chat</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 px-5 py-5 pb-32">
        {chatMessages.map((message) => {
          const mine = message.author === 'me';
          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
                  mine ? 'bg-white text-void' : 'border border-white/10 bg-white/[0.08] text-frost/80'
                }`}
              >
                <p>{message.text}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'text-void/50' : 'text-frost/40'}`}>{message.time}</p>
              </div>
            </div>
          );
        })}
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
