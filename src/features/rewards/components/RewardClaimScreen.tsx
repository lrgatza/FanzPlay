import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRewardClaim } from '@/features/rewards/hooks/useRewardClaim';
import { useGameState } from '@/providers/GameStateProvider';

export function RewardClaimScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { session } = useGameState();

  const { submit, isSubmitting, error, success } = useRewardClaim();

  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');

  function validateEmail(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  }

  async function handleSubmit() {
    if (!validateEmail(email)) return;
    if (!user?.uid || !session?.sponsorId) return;

    await submit(
      user.uid,
      sessionId,
      session.sponsorId,
      email,
      phone.trim() || null,
    );
  }

  if (success) {
    return (
      <ScreenContainer>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Claim Submitted!</Text>
          <Text style={styles.successBody}>
            Your reward claim has been received. The sponsor will be in touch
            using the contact info you provided.
          </Text>
          <Button
            label="Back to Games"
            variant="secondary"
            onPress={() => router.replace('/(fan)/game-selection')}
            style={styles.backBtn}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable keyboardAvoiding>
      <Button
        label="← Back to Results"
        variant="ghost"
        fullWidth={false}
        onPress={() => router.back()}
        style={styles.backLink}
      />

      <Text style={styles.title}>Claim Your Reward</Text>
      <Text style={styles.subtitle}>
        Confirm your contact details so the sponsor can reach you.
      </Text>

      <Card style={styles.formCard}>
        <TextField
          label="Email Address"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (emailError) validateEmail(v);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={emailError}
          placeholder="you@example.com"
        />

        <TextField
          label="Phone Number (optional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="+1 555 000 0000"
        />

        <Text style={styles.privacyNote}>
          Your contact info will only be shared with the session sponsor for
          reward fulfilment.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          label={isSubmitting ? 'Submitting…' : 'Submit Claim'}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitBtn}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
    marginBottom: Spacing.lg,
  },
  formCard: {
    backgroundColor: AppColors.bgElevated,
    gap: Spacing.base,
  },
  privacyNote: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    lineHeight: 18,
  },
  errorText: {
    ...Typography.bodySmall,
    color: '#ff6b6b',
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.base,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  successTitle: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  successBody: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  backBtn: {
    marginTop: Spacing.lg,
    width: '100%',
  },
});
