import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateUserMarketingOptIn } from '@/features/auth/services/authService';

export function FanSettingsScreen() {
  const router = useRouter();
  const { user, setUserMarketingOptIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggleMarketing(nextValue: boolean) {
    if (!user || isSaving) return;
    const prevValue = user.marketingOptIn;
    setError(null);
    setIsSaving(true);
    setUserMarketingOptIn(nextValue);
    try {
      await updateUserMarketingOptIn(user.uid, nextValue);
    } catch {
      setUserMarketingOptIn(prevValue);
      setError('Failed to update your preference. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>

      <Text style={styles.title}>Fan Settings</Text>
      <Text style={styles.subtitle}>Update your preferences anytime.</Text>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.label}>Marketing Opt-In</Text>
            <Text style={styles.hint}>
              Enable this to stay eligible for sponsor rewards.
            </Text>
          </View>
          <Switch
            value={user?.marketingOptIn ?? false}
            onValueChange={handleToggleMarketing}
            disabled={!user || isSaving}
            trackColor={{
              false: AppColors.borderSubtle,
              true: AppColors.accent,
            }}
            thumbColor={AppColors.bgSecondary}
          />
        </View>
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label="Back to Games"
        variant="secondary"
        onPress={() => router.replace('/(fan)/game-selection')}
        style={styles.cta}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  backText: {
    ...Typography.body,
    color: AppColors.accent,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: AppColors.bgElevated,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.base,
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  hint: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
  },
  error: {
    ...Typography.bodySmall,
    color: AppColors.danger,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  cta: {
    marginTop: Spacing.lg,
  },
});
