import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage } from '../../app/types';
import { getChatMessages, sendChatMessage, subscribeToChatMessages, type ChatRealtimeStatus } from '../../services/chatService';

export type ChatMessageView = ChatMessage & {
  clientId?: string;
  status?: 'failed' | 'sending' | 'sent';
};

type SendMessageResult = {
  error?: string;
  ok: boolean;
  usingFallback?: boolean;
};

type ChatMessagesState = {
  error: string;
  isLoading: boolean;
  messages: ChatMessageView[];
  realtimeStatus: ChatRealtimeStatus;
  refresh: () => void;
  sendMessage: (text: string) => Promise<SendMessageResult>;
  usingFallback: boolean;
};

function nowLabel() {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

function mergeMessage(current: ChatMessageView[], incoming: ChatMessage): ChatMessageView[] {
  if (current.some((message) => message.id === incoming.id)) {
    return current;
  }

  const optimisticIndex = current.findIndex(
    (message) => message.status === 'sending' && message.author === incoming.author && message.text === incoming.text
  );

  if (optimisticIndex >= 0) {
    return current.map((message, index) => (index === optimisticIndex ? { ...incoming, status: 'sent' } : message));
  }

  return [...current, { ...incoming, status: 'sent' }];
}

export function useChatMessages(threadId: string): ChatMessagesState {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessageView[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState<ChatRealtimeStatus>('idle');
  const [refreshKey, setRefreshKey] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError('');
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const subscription = subscribeToChatMessages(threadId, {
      onError: (message) => {
        if (isMounted) {
          setError(message);
        }
      },
      onMessage: (message) => {
        if (isMounted) {
          setMessages((current) => mergeMessage(current, message));
        }
      },
      onStatus: (status) => {
        if (isMounted) {
          setRealtimeStatus(status);
        }
      }
    });

    getChatMessages(threadId).then((result) => {
      if (!isMounted) {
        return;
      }

      setMessages(result.data.map((message) => ({ ...message, status: 'sent' })));
      setUsingFallback(result.usingFallback);
      setError(result.error ?? '');
      setIsLoading(false);

      if (result.usingFallback) {
        setRealtimeStatus('idle');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshKey, threadId]);

  const sendMessage = useCallback(
    async (text: string): Promise<SendMessageResult> => {
      const trimmed = text.trim();

      if (!trimmed) {
        return { error: 'Type a message first.', ok: false };
      }

      const optimisticId = `local-${threadId}-${Date.now()}`;
      const optimisticMessage: ChatMessageView = {
        author: 'me',
        clientId: optimisticId,
        id: optimisticId,
        status: 'sending',
        text: trimmed,
        time: nowLabel()
      };

      setMessages((current) => [...current, optimisticMessage]);

      const result = await sendChatMessage(threadId, trimmed);

      if (result.usingFallback) {
        setMessages((current) =>
          current.map((message) => (message.id === optimisticId ? { ...message, status: 'sent' } : message))
        );
        return { ok: true, usingFallback: true };
      }

      if (result.error) {
        setMessages((current) =>
          current.map((message) => (message.id === optimisticId ? { ...message, status: 'failed' } : message))
        );
        setError(result.error);
        return { error: result.error, ok: false };
      }

      const sentMessage = result.data;

      if (sentMessage) {
        setMessages((current) =>
          current.map((message) => (message.id === optimisticId ? { ...sentMessage, status: 'sent' } : message))
        );
      } else {
        setMessages((current) =>
          current.map((message) => (message.id === optimisticId ? { ...message, status: 'sent' } : message))
        );
      }

      return { ok: true };
    },
    [threadId]
  );

  return {
    error,
    isLoading,
    messages,
    realtimeStatus,
    refresh,
    sendMessage,
    usingFallback
  };
}
