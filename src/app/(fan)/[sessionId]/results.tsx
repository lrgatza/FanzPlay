import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';

export default function ResultsRoute() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Text style={styles.icon}>🏆</Text>
        <Text style={styles.title}>Game Over!</Text>
        <Text style={styles.body}>
          Results and rewards are coming in Phase 5.
        </Text>
        <Text style={styles.meta}>Session: {sessionId}</Text>
        <Button
          label="Back to Games"
          variant="secondary"
          onPress={() => router.replace('/(fan)/game-selection')}
          style={styles.btn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  meta: {
    ...Typography.label,
    color: AppColors.textMuted,
  },
  btn: {
    marginTop: Spacing.lg,
  },
});
