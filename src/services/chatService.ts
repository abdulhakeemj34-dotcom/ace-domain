import { chats as mockChats, chatMessagesByChatId } from '../app/data';
import type { Chat, ChatMessage } from '../app/types';
import { asString, getStoredSession, isRecord, realtimeEndpoint, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

type ChatThreadRow = {
  created_by?: string | null;
  created_at?: string | null;
  id: string;
  title?: string | null;
  type?: string | null;
  updated_at?: string | null;
};

type ChatMessageRow = {
  content?: string | null;
  created_at?: string | null;
  id: string;
  sender_id?: string | null;
  thread_id?: string | null;
};

type ChatResult<T> = {
  data: T;
  error?: string;
  usingFallback: boolean;
};

type CreateChatThreadInput = {
  memberIds?: string[];
  title?: string;
  type: 'direct' | 'group';
};

type RealtimeHandlers = {
  onError?: (error: string) => void;
  onMessage: (message: ChatMessage) => void;
  onStatus?: (status: ChatRealtimeStatus) => void;
};

export type ChatRealtimeStatus = 'connected' | 'connecting' | 'disconnected' | 'error' | 'idle';

type RealtimeSubscription = {
  unsubscribe: () => void;
};

function timeLabel(value?: string | null) {
  if (!value) {
    return 'Now';
  }

  const createdAt = new Date(value).getTime();

  if (!Number.isFinite(createdAt)) {
    return 'Now';
  }

  const minutes = Math.max(1, Math.round((Date.now() - createdAt) / 60000));
  return minutes < 60 ? `${minutes}m` : `${Math.round(minutes / 60)}h`;
}

function mapThread(row: ChatThreadRow): Chat {
  const title = asString(row.title, row.type === 'group' ? 'Group Room' : 'Direct Chat');

  return {
    avatar: title
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    id: row.id,
    kind: row.type === 'group' ? 'group' : 'direct',
    members: row.type === 'group' ? 2 : undefined,
    message: 'Realtime foundation ready.',
    name: title,
    online: true,
    time: timeLabel(row.updated_at ?? row.created_at),
    unread: 0
  };
}

function messageTime(value?: string | null) {
  if (!value) {
    return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date());
  }

  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return timeLabel(value);
  }

  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(createdAt);
}

function mapMessage(row: ChatMessageRow, currentUserId: string): ChatMessage {
  return {
    author: row.sender_id === currentUserId ? 'me' : 'them',
    authorName: row.sender_id === currentUserId ? undefined : 'Member',
    id: row.id,
    text: asString(row.content),
    time: messageTime(row.created_at)
  };
}

function fallbackMessages(threadId: string) {
  return chatMessagesByChatId[threadId] ?? chatMessagesByChatId.c1;
}

function isDemoThread(threadId: string) {
  return Boolean(chatMessagesByChatId[threadId]);
}

function parseRealtimeRow(payload: unknown): ChatMessageRow | null {
  if (!isRecord(payload)) {
    return null;
  }

  const candidates = [
    payload.record,
    payload.new,
    isRecord(payload.data) ? payload.data.record : null,
    isRecord(payload.data) ? payload.data.new : null
  ];

  const row = candidates.find(isRecord);

  if (!row) {
    return null;
  }

  const id = asString(row.id);

  if (!id) {
    return null;
  }

  return {
    content: asString(row.content),
    created_at: asString(row.created_at) || null,
    id,
    sender_id: asString(row.sender_id) || null,
    thread_id: asString(row.thread_id) || null
  };
}

function sendPhoenixMessage(socket: WebSocket, topic: string, event: string, payload: Record<string, unknown>, ref: string, joinRef?: string) {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      event,
      join_ref: joinRef,
      payload,
      ref,
      topic
    })
  );
}

export function isLiveChatReady() {
  return Boolean(supabaseConfig.isConfigured && getStoredSession());
}

export async function getChatThreads(): Promise<ChatResult<Chat[]>> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: mockChats, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<ChatThreadRow[]>('chat_threads', {
      query: 'select=id,type,title,created_by,created_at,updated_at&order=updated_at.desc'
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: mockChats, usingFallback: true };
    }

    return { data: rows.map(mapThread), usingFallback: false };
  } catch (error) {
    return {
      data: mockChats,
      error: error instanceof Error ? error.message : 'Chat thread load failed.',
      usingFallback: true
    };
  }
}

export async function createChatThread({ memberIds = [], title, type }: CreateChatThreadInput): Promise<ChatResult<Chat | null>> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: null, error: 'Live chat threads need Supabase auth.', usingFallback: true };
  }

  try {
    const threadRows = await supabaseRestRequest<ChatThreadRow[]>('chat_threads', {
      body: {
        created_by: session.user.id,
        title: title ?? (type === 'group' ? 'New Group Room' : 'Direct Chat'),
        type
      },
      method: 'POST',
      prefer: 'return=representation',
      query: 'select=id,type,title,created_by,created_at,updated_at'
    });
    const thread = threadRows[0];

    if (!thread) {
      return { data: null, error: 'Supabase did not return a chat thread.', usingFallback: false };
    }

    const uniqueMemberIds = Array.from(new Set([session.user.id, ...memberIds.filter(Boolean)]));

    await supabaseRestRequest('chat_thread_members', {
      body: uniqueMemberIds.map((userId) => ({ thread_id: thread.id, user_id: userId })),
      method: 'POST',
      prefer: 'resolution=ignore-duplicates',
      query: 'on_conflict=thread_id,user_id'
    });

    return { data: mapThread(thread), usingFallback: false };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Chat thread creation failed.', usingFallback: false };
  }
}

export async function getChatMessages(threadId: string): Promise<ChatResult<ChatMessage[]>> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session || isDemoThread(threadId)) {
    return { data: fallbackMessages(threadId), usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<ChatMessageRow[]>('chat_messages', {
      query: `thread_id=eq.${encodeURIComponent(threadId)}&select=id,thread_id,sender_id,content,created_at&order=created_at.asc`
    });

    if (!Array.isArray(rows)) {
      return { data: fallbackMessages(threadId), usingFallback: true };
    }

    return { data: rows.map((row) => mapMessage(row, session.user.id)), usingFallback: false };
  } catch (error) {
    return {
      data: fallbackMessages(threadId),
      error: error instanceof Error ? error.message : 'Chat message load failed.',
      usingFallback: true
    };
  }
}

export async function sendChatMessage(threadId: string, content: string): Promise<ChatResult<ChatMessage | null>> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session || isDemoThread(threadId)) {
    return { data: null, error: 'Live chat needs Supabase auth.', usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<ChatMessageRow[]>('chat_messages', {
      body: {
        content,
        sender_id: session.user.id,
        thread_id: threadId
      },
      method: 'POST',
      prefer: 'return=representation',
      query: 'select=id,thread_id,sender_id,content,created_at'
    });
    const row = rows[0];
    return { data: row ? mapMessage(row, session.user.id) : null, usingFallback: false };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Message send failed.', usingFallback: false };
  }
}

export function subscribeToChatMessages(threadId: string, handlers: RealtimeHandlers): RealtimeSubscription {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session || isDemoThread(threadId) || typeof WebSocket === 'undefined') {
    handlers.onStatus?.('idle');
    return { unsubscribe: () => undefined };
  }

  let socket: WebSocket;
  let isClosed = false;
  let ref = 1;
  let heartbeat: number | undefined;
  const joinRef = `join-${Date.now()}`;
  const topic = `realtime:public:chat_messages:${threadId}`;

  try {
    socket = new WebSocket(realtimeEndpoint());
  } catch {
    handlers.onStatus?.('error');
    handlers.onError?.('Realtime chat could not open a connection.');
    return { unsubscribe: () => undefined };
  }

  const nextRef = () => String(ref++);
  const setStatus = (status: ChatRealtimeStatus) => handlers.onStatus?.(status);

  setStatus('connecting');

  socket.addEventListener('open', () => {
    if (isClosed) {
      return;
    }

    sendPhoenixMessage(
      socket,
      topic,
      'phx_join',
      {
        access_token: session.access_token,
        config: {
          broadcast: { self: false },
          postgres_changes: [
            {
              event: 'INSERT',
              filter: `thread_id=eq.${threadId}`,
              schema: 'public',
              table: 'chat_messages'
            }
          ],
          presence: { key: session.user.id }
        }
      },
      nextRef(),
      joinRef
    );

    heartbeat = window.setInterval(() => {
      sendPhoenixMessage(socket, 'phoenix', 'heartbeat', {}, nextRef());
    }, 25000);
  });

  socket.addEventListener('message', (event: MessageEvent<string>) => {
    if (typeof event.data !== 'string') {
      return;
    }

    try {
      const message: unknown = JSON.parse(event.data);

      if (!isRecord(message)) {
        return;
      }

      const eventName = asString(message.event);
      const payload = message.payload;

      if (eventName === 'phx_reply') {
        if (isRecord(payload) && payload.status === 'ok') {
          setStatus('connected');
        } else if (isRecord(payload) && payload.status === 'error') {
          setStatus('error');
          handlers.onError?.('Realtime chat subscription could not join this room.');
        }
        return;
      }

      if (eventName !== 'postgres_changes' && eventName !== 'INSERT') {
        return;
      }

      const row = parseRealtimeRow(payload);

      if (row?.thread_id === threadId) {
        handlers.onMessage(mapMessage(row, session.user.id));
      }
    } catch {
      handlers.onError?.('Realtime chat sent an unreadable message.');
    }
  });

  socket.addEventListener('error', () => {
    setStatus('error');
    handlers.onError?.('Realtime chat connection had a problem.');
  });

  socket.addEventListener('close', () => {
    if (!isClosed) {
      setStatus('disconnected');
    }
  });

  return {
    unsubscribe: () => {
      isClosed = true;
      setStatus('disconnected');

      if (heartbeat) {
        window.clearInterval(heartbeat);
      }

      if (socket.readyState === WebSocket.OPEN) {
        sendPhoenixMessage(socket, topic, 'phx_leave', {}, nextRef(), joinRef);
      }

      socket.close();
    }
  };
}
