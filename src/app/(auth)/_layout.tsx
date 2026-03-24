import { Stack } from 'expo-router';
import React from 'react';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function AuthLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </ErrorBoundary>
  );
}
