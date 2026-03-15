import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="session-setup" />
      <Stack.Screen name="live-control/[sessionId]" />
    </Stack>
  );
}
