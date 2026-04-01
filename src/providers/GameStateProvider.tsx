import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { subscribeToSession } from '@/features/game/services/gameService';
import { subscribeToTeamsByIds } from '@/features/teams/services/teamService';
import {
  type CurrentQuestion,
  type GameSession,
  type GameStatus,
  type Team,
} from '@/types';

export interface GameStateContextValue {
  session: GameSession | null;
  teams: Team[];
  isLoading: boolean;
  // Derived convenience values
  isQuestionActive: boolean;
  currentQuestion: CurrentQuestion | null;
  correctOptionId: string | null;
  gameStatus: GameStatus;
}

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({
  sessionId,
  children,
}: {
  sessionId: string;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToSession(sessionId, (s) => {
      setSession(s);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [sessionId]);

  useEffect(() => {
    if (!session) return;
    const ids = session.teamIds ?? [];
    const unsubscribe = subscribeToTeamsByIds(ids, setTeams);
    return unsubscribe;
  }, [session]);

  const value = useMemo<GameStateContextValue>(
    () => ({
      session,
      teams,
      isLoading,
      isQuestionActive: session?.questionActive ?? false,
      currentQuestion: session?.currentQuestion ?? null,
      correctOptionId: session?.correctOptionId ?? null,
      gameStatus: session?.status ?? 'lobby',
    }),
    [session, teams, isLoading],
  );

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState(): GameStateContextValue {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error('useGameState must be used inside GameStateProvider');
  }
  return ctx;
}
