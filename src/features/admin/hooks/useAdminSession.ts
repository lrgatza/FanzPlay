import { useEffect, useState } from 'react';

import { subscribeToSessions } from '@/features/admin/services/sessionService';
import { type GameSession } from '@/types';

interface UseAdminSessionResult {
  sessions: GameSession[];
  isLoading: boolean;
  error: string | null;
}

export function useAdminSession(): UseAdminSessionResult {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSessions((data) => {
      setSessions(data);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return { sessions, isLoading, error };
}
