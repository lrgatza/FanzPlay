import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';

import { GameStateProvider, useGameState } from '@/providers/GameStateProvider';

function GameStateMachine({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { isQuestionActive, correctOptionId, gameStatus, isLoading } =
    useGameState();

  const prevQuestionActiveRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const prev = prevQuestionActiveRef.current;
    prevQuestionActiveRef.current = isQuestionActive;

    if (gameStatus === 'completed') {
      router.replace({
        pathname: '/(fan)/[sessionId]/results',
        params: { sessionId },
      });
      return;
    }

    if (isQuestionActive) {
      router.replace({
        pathname: '/(fan)/[sessionId]/question',
        params: { sessionId },
      });
      return;
    }

    if (prev === true && !isQuestionActive && correctOptionId !== null) {
      router.replace({
        pathname: '/(fan)/[sessionId]/waiting',
        params: { sessionId },
      });
    }
  }, [
    isQuestionActive,
    correctOptionId,
    gameStatus,
    isLoading,
    sessionId,
    router,
  ]);

  return null;
}

export default function SessionLayout() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return (
    <GameStateProvider sessionId={sessionId}>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="lobby" />
        <Stack.Screen name="question" />
        <Stack.Screen name="waiting" />
        <Stack.Screen name="results" />
      </Stack>
      <GameStateMachine sessionId={sessionId} />
    </GameStateProvider>
  );
}
