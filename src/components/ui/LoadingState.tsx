import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppColors, Spacing, Typography } from '@/constants/theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={AppColors.accent} size="large" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  message: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
});
