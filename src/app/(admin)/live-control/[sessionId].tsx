import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';

export default function LiveControlRoute() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Chip label="PHASE 4" variant="muted" style={styles.chip} />
        <Text style={styles.title}>Live Control</Text>
        <Text style={styles.subtitle}>Session ID: {sessionId}</Text>
        <Text style={styles.body}>
          Live game controls (trigger questions, close questions, end session)
          are implemented in Phase 4.
        </Text>
        <Button
          label="← Back to Dashboard"
          variant="ghost"
          onPress={() => router.replace('/(admin)/dashboard')}
          style={styles.backBtn}
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
    paddingHorizontal: Spacing.base,
  },
  chip: {
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  body: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  backBtn: {
    marginTop: Spacing.lg,
  },
});
