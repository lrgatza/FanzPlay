import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { AppColors, Spacing, Typography } from '@/constants/theme';

type ChipVariant = 'accent' | 'muted' | 'success' | 'warning' | 'danger';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  style?: ViewStyle;
}

export function Chip({ label, variant = 'muted', style }: ChipProps) {
  return (
    <View style={[styles.chip, styles[variant], style]}>
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 100,
  },
  accent: {
    backgroundColor: AppColors.accentSoft,
    borderWidth: 1,
    borderColor: AppColors.accent,
  },
  muted: {
    backgroundColor: AppColors.borderSubtle,
  },
  success: {
    backgroundColor: 'rgba(52, 199, 89, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.6)',
  },
  warning: {
    backgroundColor: 'rgba(255, 149, 0, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.6)',
  },
  danger: {
    backgroundColor: 'rgba(255, 59, 48, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  label: {
    ...Typography.label,
    fontWeight: '600',
  },
  accentLabel: {
    color: AppColors.accent,
  },
  mutedLabel: {
    color: AppColors.textMuted,
  },
  successLabel: {
    color: AppColors.success,
  },
  warningLabel: {
    color: AppColors.warning,
  },
  dangerLabel: {
    color: AppColors.danger,
  },
});
