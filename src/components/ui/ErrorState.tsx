import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppColors, Spacing, Typography } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button label="Try Again" onPress={onRetry} style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  message: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  btn: {
    marginTop: Spacing.base,
    width: '100%',
  },
});
