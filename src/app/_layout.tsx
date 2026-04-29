import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useRouter, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/providers/AuthProvider';
import { useAuth } from '@/features/auth/hooks/useAuth';

function RoleGatekeeper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const topSegment = segments[0];

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      if (topSegment !== '(auth)') {
        router.replace('/(auth)/login');
      }
    } else if (user.role === 'admin') {
      if (topSegment !== '(admin)') {
        router.replace('/(admin)/dashboard');
      }
    } else {
      if (topSegment !== '(fan)') {
        router.replace('/(fan)/game-selection');
      }
    }
  }, [user, isLoading, router, topSegment]);

  return <>{children}</>;
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(fan)" />
        <Stack.Screen name="(admin)" />
      </Stack>
      <RoleGatekeeper>{null}</RoleGatekeeper>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
