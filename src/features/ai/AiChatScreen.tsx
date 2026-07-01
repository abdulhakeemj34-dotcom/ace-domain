import { useState, type FormEvent } from 'react';
import { ArrowLeft, Bot, Loader2, Send } from 'lucide-react';
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
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/95 px-5 pb-4 pt-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to home">
            <ArrowLeft size={20} />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-white">
            <Bot size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">Ace Domain</p>
            <h1 className="truncate text-2xl font-black text-white">Ace AI</h1>
            <p className="truncate text-xs text-frost/50">AI assistant for culture, discovery, prompts, and social ideas.</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 px-5 py-5 pb-40">
        {messages.length === 0 && (
          <div className="border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-white">
                <Bot size={22} />
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
                  className="rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-bold leading-6 text-white transition hover:bg-white/5"
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
                className={`max-w-[82%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
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
        className="fixed bottom-[calc(4.9rem+env(safe-area-inset-bottom))] left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black p-2"
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
