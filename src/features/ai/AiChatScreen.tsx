import { useState, type FormEvent } from 'react';
import { ArrowLeft, Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { sendAiChatMessage } from '../../services/aiChatService';

type AiChatScreenProps = {
  onBack: () => void;
};

type AiMessage = {
  content: string;
  id: string;
  role: 'assistant' | 'user';
};

const suggestedPrompts = [
  'Suggest three ways to meet people worldwide on Ace Domain.',
  'Give me a friendly opener for a global match.',
  'Help me find community ideas around gaming and culture.'
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
    <section className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-void/90 px-5 pb-4 pt-8 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to home">
            <ArrowLeft size={20} />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl ad-accent-bg ad-accent-ring">
            <Bot size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[color:var(--ad-accent)]">Ace Domain</p>
            <h1 className="truncate text-2xl font-black text-white">Ace AI</h1>
            <p className="truncate text-xs text-frost/50">AI assistant for culture, discovery, prompts, and social ideas.</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 px-5 py-5 pb-40">
        {messages.length === 0 && (
          <div className="glass-panel rounded-[32px] p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: 'var(--ad-accent-soft)', color: 'var(--ad-accent)' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="font-black text-white">Ask Ace AI</h2>
                <p className="mt-1 text-sm leading-6 text-frost/55">Start with a global social idea, a match opener, or a community prompt.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    void sendMessage(undefined, prompt);
                  }}
                  className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm font-bold leading-6 text-white transition hover:border-white/20"
                  aria-label={`Send suggested prompt: ${prompt}`}
                  disabled={isLoading}
                >
                  {prompt}
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
                className={`max-w-[82%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-glow ${
                  mine
                    ? 'rounded-br-md text-[color:var(--ad-accent-contrast)]'
                    : 'rounded-bl-md border border-white/10 bg-white/[0.08] text-frost/85'
                }`}
                style={mine ? { background: 'linear-gradient(135deg, var(--ad-accent-strong), var(--ad-accent))' } : undefined}
              >
                <p>{message.content}</p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start" aria-live="polite">
            <div className="flex items-center gap-2 rounded-[24px] rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-bold text-frost/70">
              <Loader2 className="animate-spin text-[color:var(--ad-accent)]" size={17} />
              Ace AI is thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-[24px] border border-plasma/20 bg-plasma/10 p-4 text-sm leading-6 text-plasma" role="status">
            <p className="font-bold">Ace AI could not reply.</p>
            <p className="mt-1">{error}</p>
          </div>
        )}
      </div>

      <form
        className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-[28px] border border-white/10 bg-obsidian/95 p-2 shadow-panel backdrop-blur-2xl"
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
          style={{ background: 'linear-gradient(135deg, var(--ad-accent-strong), var(--ad-accent))', color: 'var(--ad-accent-contrast)' }}
          aria-label="Send message to Ace AI"
          disabled={isLoading || !draft.trim()}
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </section>
  );
}
