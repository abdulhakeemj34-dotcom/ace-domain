import { chats as mockChats, chatMessagesByChatId } from '../app/data';
import type { Chat, ChatMessage } from '../app/types';
import { asString, getStoredSession, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

type ChatThreadRow = {
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
    message: 'Live chat foundation ready.',
    name: title,
    online: true,
    time: timeLabel(row.updated_at ?? row.created_at),
    unread: 0
  };
}

function mapMessage(row: ChatMessageRow, currentUserId: string): ChatMessage {
  return {
    author: row.sender_id === currentUserId ? 'me' : 'them',
    authorName: row.sender_id === currentUserId ? undefined : 'Member',
    id: row.id,
    text: asString(row.content),
    time: timeLabel(row.created_at)
  };
}

export async function getChatThreads() {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: mockChats, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<ChatThreadRow[]>('chat_threads', {
      query: 'select=id,type,title,created_at,updated_at&order=updated_at.desc'
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: mockChats, usingFallback: true };
    }

    return { data: rows.map(mapThread), usingFallback: false };
  } catch (error) {
    return { data: mockChats, error: error instanceof Error ? error.message : 'Chat thread load failed.', usingFallback: true };
  }
}

export async function getChatMessages(threadId: string) {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: chatMessagesByChatId[threadId] ?? chatMessagesByChatId.c1, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<ChatMessageRow[]>('chat_messages', {
      query: `thread_id=eq.${encodeURIComponent(threadId)}&select=id,thread_id,sender_id,content,created_at&order=created_at.asc`
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: chatMessagesByChatId[threadId] ?? chatMessagesByChatId.c1, usingFallback: true };
    }

    return { data: rows.map((row) => mapMessage(row, session.user.id)), usingFallback: false };
  } catch (error) {
    return {
      data: chatMessagesByChatId[threadId] ?? chatMessagesByChatId.c1,
      error: error instanceof Error ? error.message : 'Chat message load failed.',
      usingFallback: true
    };
  }
}

export async function sendChatMessage(threadId: string, content: string) {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
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
      prefer: 'return=representation'
    });
    const row = rows[0];
    return { data: row ? mapMessage(row, session.user.id) : null, usingFallback: false };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Message send failed.', usingFallback: true };
  }
}
