import { useEffect, useState } from 'react';

import { subscribeToTeams } from '@/features/teams/services/teamService';
import { type Team } from '@/types';

interface UseTeamsResult {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
}

export function useTeams(): UseTeamsResult {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTeams((data) => {
      setTeams(data);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return { teams, isLoading, error };
}
