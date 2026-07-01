import { useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowLeft, Gamepad2, Mic, Send, UsersRound } from 'lucide-react';
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
  glass: 'border border-white/10 bg-white/[0.08] text-frost/80',
  outlined: 'border bg-white/[0.025] text-frost/85',
  solid: 'border border-white/10 bg-[#12182D] text-frost/85'
} satisfies Record<ReceivedBubbleStyle, string>;

const sentBubbleStyles: Record<SentBubbleTone, CSSProperties> = {
  blue: { background: 'linear-gradient(135deg, #9FD0FF, #5DA9FF)', boxShadow: '0 16px 36px rgba(93, 169, 255, 0.24)', color: '#06101E' },
  gold: { background: 'linear-gradient(135deg, #FFD978, #F4C95D)', boxShadow: '0 16px 36px rgba(244, 201, 93, 0.24)', color: '#070A16' },
  silver: { background: 'linear-gradient(135deg, #FFFFFF, #DDE7FF)', boxShadow: '0 16px 36px rgba(221, 231, 255, 0.2)', color: '#070A16' },
  theme: { background: 'linear-gradient(135deg, var(--ad-accent-strong), var(--ad-accent))', boxShadow: '0 16px 36px var(--ad-glow)', color: 'var(--ad-accent-contrast)' },
  violet: { background: 'linear-gradient(135deg, #D8B4FE, #A78BFA)', boxShadow: '0 16px 36px rgba(167, 139, 250, 0.24)', color: '#080513' }
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
    <section className={`flex min-h-screen flex-col ${wallpaperClass}`}>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-void/90 px-4 pb-3 pt-6 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to chats">
            <ArrowLeft size={20} />
          </button>
          <Avatar label={chat.avatar} active={chat.online} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-white">{chat.name}</h1>
            <p className="truncate text-xs text-aurora">
              {isGroup ? `${chat.members} members / ${chat.online ? 'live now' : 'quiet room'}` : `${chat.online ? 'Online' : 'Recently active'} / ${chat.country ?? 'Global'}`}
            </p>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-frost/40">{realtimeLabel}</p>
          </div>
        </div>

        {isGroup && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-[22px] bg-white/[0.06] p-2.5">
            <div className="flex -space-x-2">
              {(chat.avatars ?? []).map((avatar) => (
                <span key={avatar} className="grid h-8 w-8 place-items-center rounded-full border border-obsidian bg-gradient-to-br from-aurora to-signal text-[10px] font-black text-void">
                  {avatar}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">Room members</p>
              <p className="truncate text-xs text-frost/45">Active people and shared chat tools.</p>
            </div>
            <UsersRound className="text-aurora" size={18} />
          </div>
        )}
      </header>

      <div className={`flex-1 ${messageStackClass} pb-36`}>
        {error && (
          <div className="rounded-[24px] border border-plasma/20 bg-plasma/10 p-4 text-sm text-plasma">
            <p>{error}</p>
            <button type="button" onClick={refresh} className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
              Retry messages
            </button>
          </div>
        )}

        {isLoading && (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-sm text-frost/55">
            Loading messages...
          </div>
        )}

        {!isLoading && messages.length === 0 && !error && (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-center">
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
              <div className={`min-w-0 max-w-[78%] ${mine ? 'text-right' : 'text-left'}`}>
                {!mine && isGroup && <p className="mb-1 ml-2 text-[10px] font-bold uppercase tracking-[0.18em] text-aurora/80">{message.authorName}</p>}
                <div
                  className={`${bubbleShapeClass} ${densityClass} break-words shadow-glow [overflow-wrap:anywhere] ${
                    mine
                      ? sentCornerClass
                      : `${receivedCornerClass} ${receivedBubbleClasses[personalization.receivedBubbleStyle]}`
                  }`}
                  style={mine ? sentBubbleStyles[personalization.sentBubbleTone] : personalization.receivedBubbleStyle === 'outlined' ? { borderColor: 'var(--ad-accent-soft)' } : undefined}
                >
                  <TranslationToggle
                    compact
                    text={message.text}
                    tone={mine ? 'light' : 'dark'}
                    translatedText={`Translation preview: ${message.text}`}
                  />
                  {showMessageMeta && (
                    <p className={`mt-1 text-[10px] ${mine ? 'text-void/50' : 'text-frost/40'}`}>
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
          <div className="rounded-[24px] rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-2 w-2 rounded-full bg-aurora animate-pulseGlow" style={{ animationDelay: `${dot * 160}ms` }} />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-frost/45">
              {isFallback ? 'Typing status is available in this room.' : isGroup ? 'Someone may be typing soon.' : `${chat.name} may be typing soon.`}
            </p>
          </div>
        </div>
        )}

        {roomNotice && (
          <p className="mx-auto w-fit rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-bold text-frost/65" role="status">
            {roomNotice}
          </p>
        )}
      </div>

      <form
        className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-[24px] border border-white/10 bg-obsidian/95 p-1.5 shadow-panel backdrop-blur-2xl"
        onSubmit={sendMessage}
      >
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full"
          style={{ backgroundColor: 'var(--ad-accent-soft)', color: 'var(--ad-accent)' }}
          aria-label="Open game options"
          onClick={() => setRoomNotice('Game room tools will open from here.')}
        >
          <Gamepad2 size={19} />
        </button>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
          aria-label="Start voice message"
          onClick={() => setRoomNotice('Voice messages will open from here.')}
        >
          <Mic size={19} />
        </button>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-frost/35"
          placeholder="Message the world..."
          aria-label="Message input"
          autoComplete="off"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="grid h-11 w-11 place-items-center rounded-full disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--ad-accent-strong), var(--ad-accent))', color: 'var(--ad-accent-contrast)' }}
          aria-label="Send message"
          disabled={isSending}
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
