import { useState, type FormEvent } from 'react';
import { ArrowLeft, Bot, Loader2, Send, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { sendAiChatMessage } from '../../services/aiChatService';

type AiChatScreenProps = {
  onBack: () => void;
};

type AiMessage = {
  content: string;
  id: string;
  role: 'assistant' | 'user';
};

const aiUseCases = [
  {
    description: 'Turn a match, country, or shared interest into a natural first message.',
    icon: <UsersRound size={18} />,
    title: 'Better openers'
  },
  {
    description: 'Find community ideas, story prompts, and respectful culture questions.',
    icon: <Sparkles size={18} />,
    title: 'Discovery help'
  },
  {
    description: 'Ace AI is separate from private user chats and only replies to what you type here.',
    icon: <ShieldCheck size={18} />,
    title: 'Separate space'
  }
];

const suggestedPrompts = [
  {
    label: 'Meet the world',
    prompt: 'Suggest three practical ways to meet people worldwide on Ace Domain.'
  },
  {
    label: 'Global opener',
    prompt: 'Give me a friendly opener for a global match who likes music, games, and travel.'
  },
  {
    label: 'Community idea',
    prompt: 'Help me create a community idea around gaming, culture, and learning languages.'
  },
  {
    label: 'Profile polish',
    prompt: 'Rewrite my profile bio so it feels confident, friendly, and not too serious.'
  }
];

function createMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AiChatScreen({ onBack }: AiChatScreenProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);

  const sendMessage = async (event?: FormEvent<HTMLFormElement>, prompt?: string) => {
    event?.preventDefault();
    const text = (prompt ?? draft).trim();

    if (!text || isLoading) {
      return;
    }

    const userMessage: AiMessage = {
      content: text,
      id: createMessageId(),
      role: 'user'
    };

    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setError('');
    setIsLoading(true);

    const result = await sendAiChatMessage(text);

    if (result.ok) {
      setMessages((current) => [
        ...current,
        {
          content: result.reply,
          id: createMessageId(),
          role: 'assistant'
        }
      ]);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <section className="flex min-h-[100dvh] flex-col">
      <header className="ad-safe-header-loose sticky top-0 z-20 border-b border-white/10 bg-black/95 px-5 pb-4 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to home">
            <ArrowLeft size={20} />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-white">
            <Bot size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">Ace Domain</p>
            <h1 className="truncate text-2xl font-black text-white">Ace AI</h1>
            <p className="truncate text-xs text-frost/50">Prompt help for social discovery, culture, and profile ideas.</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 px-5 py-5 pb-[calc(var(--ad-bottom-nav-height)+5.5rem)]">
        {messages.length === 0 && (
          <div className="border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-white">
                <Bot size={22} />
              </div>
              <div className="min-w-0">
                <h2 className="font-black text-white">Ask Ace AI</h2>
                <p className="mt-1 text-sm leading-6 text-frost/55">Use it as a quick creative layer for meeting people, not as your private chat inbox.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {aiUseCases.map((useCase) => (
                <div key={useCase.title} className="flex items-start gap-3 border-b border-white/10 py-3 last:border-b-0">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white">{useCase.icon}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white">{useCase.title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-600">Start fast</p>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Local prompt
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => {
                    void sendMessage(undefined, prompt.prompt);
                  }}
                  className="rounded-2xl border border-white/10 px-4 py-3 text-left transition hover:bg-white/5"
                  aria-label={`Send suggested prompt: ${prompt.prompt}`}
                  disabled={isLoading}
                >
                  <span className="block text-sm font-black text-white">{prompt.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">{prompt.prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const mine = message.role === 'user';

          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`ad-safe-break max-w-[82%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
                  mine
                    ? 'rounded-br-md bg-white text-black'
                    : 'rounded-bl-md border border-white/10 bg-zinc-900 text-zinc-100'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start" aria-live="polite">
            <div className="flex items-center gap-2 rounded-[24px] rounded-bl-md border border-white/10 bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-400">
              <Loader2 className="animate-spin text-zinc-400" size={17} />
              Ace AI is thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-[24px] border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6 text-red-200" role="status">
            <p className="font-bold">Ace AI could not reply.</p>
            <p className="mt-1">{error}</p>
          </div>
        )}
      </div>

      <form
        className="ad-floating-composer fixed left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black p-2"
        onSubmit={sendMessage}
      >
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-frost/35"
          placeholder="Ask Ace AI..."
          aria-label="Message Ace AI"
          autoComplete="off"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="grid h-11 w-11 place-items-center rounded-full disabled:opacity-50"
          style={{ background: '#ffffff', color: '#000000' }}
          aria-label="Send message to Ace AI"
          disabled={isLoading || !draft.trim()}
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </section>
  );
}
