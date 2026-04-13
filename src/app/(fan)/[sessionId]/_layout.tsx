import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';

import { GameStateProvider, useGameState } from '@/providers/GameStateProvider';

function GameStateMachine({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { isQuestionActive, correctOptionId, gameStatus, isLoading } =
    useGameState();

  const prevQuestionActiveRef = useRef<boolean | null>(null);
  // Track which correctOptionId we already navigated to waiting for so we
  // never replace the waiting screen with itself (which would remount it and
  // trigger double-scoring).
  const navigatedForRevealRef = useRef<string | null>(null);

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
      // New question started — reset the reveal-navigation guard.
      navigatedForRevealRef.current = null;
      router.replace({
        pathname: '/(fan)/[sessionId]/question',
        params: { sessionId },
      });
      return;
    }

    if (
      prev === true &&
      !isQuestionActive &&
      correctOptionId !== null &&
      navigatedForRevealRef.current !== correctOptionId
    ) {
      navigatedForRevealRef.current = correctOptionId;
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
        <Stack.Screen name="reward-claim" />
      </Stack>
      <GameStateMachine sessionId={sessionId} />
    </GameStateProvider>
  );
}
