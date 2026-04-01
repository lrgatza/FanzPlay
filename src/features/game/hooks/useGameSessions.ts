import { useEffect, useState } from 'react';

import { subscribeToActiveSessions } from '@/features/game/services/gameService';
import { type GameSession } from '@/types';

export function useGameSessions() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToActiveSessions((data) => {
      setSessions(data);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { sessions, isLoading };
}
