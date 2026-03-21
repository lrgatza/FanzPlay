import { Stack, useGlobalSearchParams } from 'expo-router';
import React from 'react';

import { GameStateProvider } from '@/providers/GameStateProvider';

function FanLayoutInner() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="game-selection" />
      <Stack.Screen name="team-selection" />
      <Stack.Screen name="lobby/[sessionId]" />
    </Stack>
  );
}

export default function FanLayout() {
  const { sessionId } = useGlobalSearchParams<{ sessionId?: string }>();

  if (!sessionId) {
    return <FanLayoutInner />;
  }

  return (
    <GameStateProvider sessionId={sessionId}>
      <FanLayoutInner />
    </GameStateProvider>
  );
}
