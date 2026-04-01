import { Stack } from 'expo-router';
import React from 'react';

export default function FanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="game-selection" />
      <Stack.Screen name="team-selection" />
      <Stack.Screen name="[sessionId]" />
    </Stack>
  );
}
