import { useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowLeft, Gamepad2, Mic, Send, ShieldCheck, UsersRound } from 'lucide-react';
import { chats as mockChats } from '../../app/data';
import type { Chat } from '../../app/types';
import { Avatar } from '../../components/Avatar';
import { TranslationToggle } from '../../components/language/TranslationToggle';
import { defaultAppSettings } from '../settings/defaultSettings';
import type { ChatPersonalizationSettings, ReceivedBubbleStyle, SentBubbleTone } from '../settings/settingsTypes';
import { useChatMessages } from './useChatMessages';
import { useChatThreads } from './useChatThreads';

type ChatRoomScreenProps = {
  chatSettings?: ChatPersonalizationSettings;
  chatId: string;
  onBack: () => void;
};

function fallbackChat(chatId: string): Chat {
  return {
    avatar: 'AD',
    id: chatId,
    kind: 'direct',
    message: 'Realtime chat room is preparing.',
    name: 'Ace Domain Chat',
    online: true,
    time: 'Now',
    unread: 0
  };
}

const chatPersonalizationDefaults: ChatPersonalizationSettings = {
  chatBubbleShape: defaultAppSettings.chatBubbleShape,
  chatWallpaper: defaultAppSettings.chatWallpaper,
  messageDensity: defaultAppSettings.messageDensity,
  receivedBubbleStyle: defaultAppSettings.receivedBubbleStyle,
  sentBubbleTone: defaultAppSettings.sentBubbleTone,
  showTimestamps: defaultAppSettings.showTimestamps,
  showTypingIndicator: defaultAppSettings.showTypingIndicator
};

const bubbleShapeClasses = {
  rounded: 'rounded-[24px]',
  sharp: 'rounded-lg',
  soft: 'rounded-2xl'
} satisfies Record<ChatPersonalizationSettings['chatBubbleShape'], string>;

const densityClasses = {
  comfortable: 'px-4 py-3 text-sm leading-6',
  compact: 'px-3 py-2 text-[13px] leading-5'
} satisfies Record<ChatPersonalizationSettings['messageDensity'], string>;

const receivedBubbleClasses = {
  glass: 'border border-white/10 bg-zinc-900 text-zinc-100',
  outlined: 'border border-white/10 bg-black text-zinc-100',
  solid: 'border border-white/10 bg-zinc-900 text-zinc-100'
} satisfies Record<ReceivedBubbleStyle, string>;

const sentBubbleStyles: Record<SentBubbleTone, CSSProperties> = {
  blue: { background: '#1d9bf0', boxShadow: 'none', color: '#ffffff' },
  gold: { background: '#f4c95d', boxShadow: 'none', color: '#090909' },
  silver: { background: '#e5e7eb', boxShadow: 'none', color: '#090909' },
  theme: { background: 'var(--ad-accent)', boxShadow: 'none', color: 'var(--ad-accent-contrast)' },
  violet: { background: '#7c3aed', boxShadow: 'none', color: '#ffffff' }
};

function getChatPersonalization(settings?: ChatPersonalizationSettings): ChatPersonalizationSettings {
  return { ...chatPersonalizationDefaults, ...settings };
}

export function ChatRoomScreen({ chatId, chatSettings, onBack }: ChatRoomScreenProps) {
  const { threads, usingFallback: threadsUsingFallback } = useChatThreads();
  const { error, isLoading, messages, realtimeStatus, refresh, sendMessage: sendChatMessage, usingFallback: messagesUsingFallback } = useChatMessages(chatId);
  const chat = threads.find((item) => item.id === chatId) ?? mockChats.find((item) => item.id === chatId) ?? fallbackChat(chatId);
  const [draft, setDraft] = useState('');
  const [roomNotice, setRoomNotice] = useState<string | null>(null);
  const isGroup = chat.kind === 'group';
  const isFallback = threadsUsingFallback || messagesUsingFallback;
  const isSending = messages.some((message) => message.status === 'sending');
  const participantLabel = isGroup
    ? `${chat.members ?? 2} members`
    : chat.online
      ? 'Online now'
      : 'Recently active';

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text) {
      setRoomNotice('Type a message first.');
      return;
    }

    const result = await sendChatMessage(text);

    if (result.ok) {
      setDraft('');
      setRoomNotice(result.usingFallback ? 'Message added locally.' : 'Message sent.');
      return;
    }

    setRoomNotice(result.error ?? 'Message could not be sent.');
  };

  const realtimeLabel = isFallback
    ? 'Demo chat'
    : realtimeStatus === 'connected'
      ? 'Realtime connected'
      : realtimeStatus === 'connecting'
        ? 'Realtime connecting'
        : realtimeStatus === 'error'
          ? 'Realtime needs attention'
          : 'Realtime ready';
  const personalization = getChatPersonalization(chatSettings);
  const bubbleShapeClass = bubbleShapeClasses[personalization.chatBubbleShape];
  const densityClass = densityClasses[personalization.messageDensity];
  const messageStackClass = personalization.messageDensity === 'compact' ? 'space-y-2 px-4 py-3.5' : 'space-y-2.5 px-4 py-4';
  const sentCornerClass = personalization.chatBubbleShape === 'sharp' ? 'rounded-br-sm' : 'rounded-br-md';
  const receivedCornerClass = personalization.chatBubbleShape === 'sharp' ? 'rounded-bl-sm' : 'rounded-bl-md';
  const wallpaperClass = `chat-wallpaper-${personalization.chatWallpaper}`;

  return (
    <section className={`flex min-h-[100dvh] flex-col ${wallpaperClass}`}>
      <header className="ad-safe-header sticky top-0 z-20 border-b border-white/10 bg-black/95 px-4 pb-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to chats">
            <ArrowLeft size={20} />
          </button>
          <Avatar label={chat.avatar} active={chat.online} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-white">{chat.name}</h1>
            <p className="truncate text-xs text-zinc-400">
              {chat.activity ?? (isGroup ? `${participantLabel} / ${chat.online ? 'live now' : 'quiet room'}` : `${participantLabel} / ${chat.country ?? 'Global'}`)}
            </p>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-frost/40">{realtimeLabel}</p>
          </div>
        </div>

        {isGroup && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <div className="flex -space-x-2">
              {(chat.avatars ?? []).map((avatar) => (
                <span key={avatar} className="grid h-8 w-8 place-items-center rounded-full border border-black bg-zinc-900 text-[10px] font-black text-white">
                  {avatar}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">Room members</p>
              <p className="line-clamp-1 text-xs text-frost/45">Active people and shared chat tools.</p>
            </div>
            <UsersRound className="text-zinc-400" size={18} />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2">
          <ShieldCheck size={16} className="shrink-0 text-zinc-500" />
          <p className="min-w-0 flex-1 truncate text-xs text-zinc-500">
            {isFallback ? 'Demo-safe conversation. Messages stay local when Supabase is unavailable.' : 'Live Supabase chat. Realtime stays separate from Ace AI.'}
          </p>
        </div>
      </header>

      <div className={`flex-1 ${messageStackClass} pb-[calc(var(--ad-bottom-nav-height)+5.25rem)]`}>
        <div className="flex justify-center">
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Today
          </span>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
            <p>{error}</p>
            <button type="button" onClick={refresh} className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
              Retry messages
            </button>
          </div>
        )}

        {isLoading && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-500">
            Loading messages...
          </div>
        )}

        {!isLoading && messages.length === 0 && !error && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center">
            <h2 className="font-bold text-white">Start the room</h2>
            <p className="mt-2 text-sm leading-6 text-frost/55">No messages yet. Send the first hello and this thread is ready for realtime updates.</p>
          </div>
        )}

        {messages.map((message) => {
          const mine = message.author === 'me';
          const statusLabel = message.status === 'sending' ? 'sending' : message.status === 'failed' ? 'failed' : '';
          const showMessageMeta = personalization.showTimestamps || Boolean(statusLabel);

          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              {!mine && <Avatar label={(message.authorName ?? chat.avatar).slice(0, 2).toUpperCase()} size="sm" />}
              <div className={`min-w-0 max-w-[82%] ${mine ? 'text-right' : 'ml-2 text-left'}`}>
                {!mine && <p className="mb-1 ml-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{isGroup ? message.authorName : chat.name}</p>}
                <div
                  className={`${bubbleShapeClass} ${densityClass} break-words shadow-none [overflow-wrap:anywhere] ${
                    mine
                      ? sentCornerClass
                      : `${receivedCornerClass} ${receivedBubbleClasses[personalization.receivedBubbleStyle]}`
                  }`}
                  style={mine ? sentBubbleStyles[personalization.sentBubbleTone] : undefined}
                >
                  <TranslationToggle
                    compact
                    text={message.text}
                    tone={mine ? 'light' : 'dark'}
                    translatedText={`Translation preview: ${message.text}`}
                  />
                  {showMessageMeta && (
                    <p className={`mt-1 text-[10px] ${mine ? 'text-black/50' : 'text-zinc-500'}`}>
                      {personalization.showTimestamps && message.time}
                      {personalization.showTimestamps && statusLabel && ' / '}
                      {statusLabel}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {personalization.showTypingIndicator && (
        <div className="flex justify-start">
          <div className="rounded-[24px] rounded-bl-md border border-white/10 bg-zinc-900 px-4 py-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-2 w-2 rounded-full bg-zinc-500 animate-pulseGlow" style={{ animationDelay: `${dot * 160}ms` }} />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-frost/45">
              {isFallback ? 'Typing status is available in this room.' : isGroup ? 'Someone may be typing soon.' : `${chat.name} may be typing soon.`}
            </p>
          </div>
        </div>
        )}

        {roomNotice && (
          <p className="mx-auto w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-zinc-500" role="status">
            {roomNotice}
          </p>
        )}
      </div>

      <form
        className="ad-floating-composer fixed left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black p-1.5"
        onSubmit={sendMessage}
      >
        <button
          type="button"
          className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-full opacity-50"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
          aria-label="Game room tools coming soon"
          disabled
        >
          <Gamepad2 size={19} />
        </button>
        <button
          type="button"
          className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-full bg-white/10 text-white opacity-50"
          aria-label="Voice messages coming soon"
          disabled
        >
          <Mic size={19} />
        </button>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-frost/35"
          placeholder={isGroup ? 'Message the room...' : `Message ${chat.name}...`}
          aria-label="Message input"
          autoComplete="off"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="grid h-11 w-11 place-items-center rounded-full disabled:opacity-50"
          style={{ background: '#ffffff', color: '#000000' }}
          aria-label="Send message"
          disabled={isSending}
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
