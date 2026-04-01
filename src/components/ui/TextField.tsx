import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { AppColors, Spacing, Typography } from '@/constants/theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helper?: string;
}

export function TextField({
  label,
  error,
  helper,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        placeholderTextColor={AppColors.textMuted}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!error && !!helper && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.base,
  },
  label: {
    ...Typography.label,
    color: AppColors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    minHeight: 44,
    backgroundColor: AppColors.bgElevated,
    borderWidth: 1.5,
    borderColor: AppColors.borderSubtle,
    borderRadius: 10,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    color: AppColors.textPrimary,
    ...Typography.body,
  },
  inputFocused: {
    borderColor: AppColors.accent,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    ...Typography.bodySmall,
    color: '#ff6b6b',
    marginTop: Spacing.xs,
  },
  helperText: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    marginTop: Spacing.xs,
  },
});
