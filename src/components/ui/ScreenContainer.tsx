import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppColors, Spacing } from '@/constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function ScreenContainer({
  children,
  scrollable = false,
  keyboardAvoiding = false,
  style,
  contentStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const inner = (
    <View
      style={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.base,
          paddingBottom: insets.bottom + Spacing.base,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  ) : (
    inner
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return <View style={[styles.root, style]}>{wrapped}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.base,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
