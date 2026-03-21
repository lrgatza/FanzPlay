import { useEffect, useState } from 'react';

import { subscribeToTeamsByIds } from '@/features/teams/services/teamService';
import { type Team } from '@/types';

export function useTeamScores(teamIds: string[]) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToTeamsByIds(teamIds, (data) => {
      const sorted = [...data].sort(
        (a, b) => b.currentSessionScore - a.currentSessionScore,
      );
      setTeams(sorted);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [teamIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { teams, isLoading };
}
