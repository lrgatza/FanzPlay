import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function GameSelectionRoute() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Text style={styles.title}>Choose a Game</Text>
        <Text style={styles.subtitle}>
          Welcome, {user?.displayName ?? 'Fan'}! Games will appear here.
        </Text>
        <Button
          label="Sign Out"
          variant="ghost"
          onPress={handleSignOut}
          style={styles.signOut}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  signOut: {
    marginTop: Spacing.lg,
  },
});
