import { Stack } from 'expo-router';
import React from 'react';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function AdminLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="session-setup" />
        <Stack.Screen name="live-control/[sessionId]" />
      </Stack>
    </ErrorBoundary>
  );
}
