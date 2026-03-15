import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setFormError('');

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    return valid;
  }

  async function handleLogin() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setFormError('Invalid email or password.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer scrollable keyboardAvoiding>
      <Text style={styles.title}>Welcome to FanzPlay</Text>
      <Text style={styles.subtitle}>Sign in to join the game.</Text>

      <Card style={styles.card}>
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
          autoComplete="password"
          error={passwordError}
          placeholder="••••••••"
        />
        {!!formError && <Text style={styles.formError}>{formError}</Text>}

        <Button
          label="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.ctaButton}
        />
      </Card>

      <Button
        label="Don't have an account? Sign Up"
        onPress={() => router.push('/(auth)/signup')}
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
