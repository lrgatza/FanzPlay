import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { AppColors, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.bgSecondary,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
