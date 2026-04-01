import { useEffect, useState } from 'react';

import { subscribeToActiveSessions } from '@/features/game/services/gameService';
import { type GameSession } from '@/types';

export function useGameSessions() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const unsubscribe = subscribeToActiveSessions(
      (data) => {
        setSessions(data);
        setIsLoading(false);
      },
      (e) => {
        setError(e.message ?? 'Failed to load sessions.');
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return { sessions, isLoading, error };
}
