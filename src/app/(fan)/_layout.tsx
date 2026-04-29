import { Stack } from 'expo-router';
import React from 'react';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function FanLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="game-selection" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="team-selection" />
        <Stack.Screen name="[sessionId]" />
      </Stack>
    </ErrorBoundary>
  );
}
