import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setFormError('');

    if (!displayName.trim()) {
      setNameError('Display name is required.');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      valid = false;
    }

    return valid;
  }

  async function handleSignUp() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signUp(
        email.trim().toLowerCase(),
        password,
        displayName.trim(),
        marketingOptIn,
        null,
      );
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setFormError('An account with this email already exists.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer scrollable keyboardAvoiding>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join FanzPlay and start playing.</Text>

      <Card style={styles.card}>
        <TextField
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          autoComplete="name"
          error={nameError}
          placeholder="Your name"
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          error={emailError}
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          error={passwordError}
          placeholder="Min. 6 characters"
        />
        <TextField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
          error={confirmError}
          placeholder="Repeat your password"
        />

        <Pressable
          onPress={() => setMarketingOptIn((v) => !v)}
          style={styles.checkboxRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: marketingOptIn }}
        >
          <View
            style={[styles.checkbox, marketingOptIn && styles.checkboxChecked]}
          >
            {marketingOptIn && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to receive promotional emails and offers from FanzPlay.
          </Text>
        </Pressable>

        {!!formError && <Text style={styles.formError}>{formError}</Text>}

        <Button
          label="Create Account"
          onPress={handleSignUp}
          loading={isLoading}
          style={styles.ctaButton}
        />
      </Card>

      <Button
        label="Already have an account? Sign In"
        onPress={() => router.back()}
        variant="ghost"
        style={styles.ghostButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderSubtle,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: AppColors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: AppColors.accent,
    borderColor: AppColors.accent,
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },
  checkboxLabel: {
    ...Typography.bodySmall,
    color: AppColors.textSecondary,
    flex: 1,
  },
  ctaButton: {
    marginTop: Spacing.sm,
  },
  formError: {
    ...Typography.bodySmall,
    color: '#ff6b6b',
    marginBottom: Spacing.sm,
  },
  ghostButton: {
    marginTop: Spacing.base,
  },
});
