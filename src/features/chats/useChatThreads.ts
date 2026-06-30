import { useCallback, useEffect, useState } from 'react';
import type { Chat } from '../../app/types';
import { getChatThreads } from '../../services/chatService';

type ChatThreadsState = {
  error: string;
  isLoading: boolean;
  refresh: () => void;
  threads: Chat[];
  usingFallback: boolean;
};

export function useChatThreads(): ChatThreadsState {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [threads, setThreads] = useState<Chat[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError('');
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    getChatThreads().then((result) => {
      if (!isMounted) {
        return;
      }

      setThreads(result.data);
      setUsingFallback(result.usingFallback);
      setError(result.error ?? '');
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return {
    error,
    isLoading,
    refresh,
    threads,
    usingFallback
  };
}
