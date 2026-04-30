import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRewardClaim } from '@/features/rewards/hooks/useRewardClaim';
import { useGameState } from '@/providers/GameStateProvider';
import { type Sponsor } from '@/types';

export function RewardClaimScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { session } = useGameState();

  const { submit, isSubmitting, error, success } = useRewardClaim();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(
    null,
  );
  const [sponsorError, setSponsorError] = useState('');
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true);

  useEffect(() => {
    const sponsorIds =
      session?.sponsorIds && session.sponsorIds.length > 0
        ? session.sponsorIds
        : session?.sponsorId
          ? [session.sponsorId]
          : [];

    if (sponsorIds.length === 0) {
      setSponsors([]);
      setSelectedSponsorId(null);
      setIsLoadingSponsors(false);
      return;
    }

    setIsLoadingSponsors(true);
    Promise.all(
      sponsorIds.map(async (sponsorId) => {
        const snap = await getDoc(doc(db, COLLECTIONS.SPONSORS, sponsorId));
        if (!snap.exists()) return null;
        return { id: snap.id, ...(snap.data() as Omit<Sponsor, 'id'>) };
      }),
    )
      .then((loadedSponsors) => {
        const nextSponsors = loadedSponsors.filter(
          (s): s is Sponsor => s !== null,
        );
        setSponsors(nextSponsors);
        setSelectedSponsorId((prev) =>
          prev && nextSponsors.some((sponsor) => sponsor.id === prev)
            ? prev
            : nextSponsors[0]?.id ?? null,
        );
      })
      .finally(() => setIsLoadingSponsors(false));
  }, [session?.sponsorId, session?.sponsorIds]);

  function validateFirstName(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) {
      setFirstNameError('First name is required.');
      return false;
    }
    setFirstNameError('');
    return true;
  }

  function validateLastName(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) {
      setLastNameError('Last name is required.');
      return false;
    }
    setLastNameError('');
    return true;
  }

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
    const okFirst = validateFirstName(firstName);
    const okLast = validateLastName(lastName);
    if (!okFirst || !okLast) return;
    if (!validateEmail(email)) return;
    if (!selectedSponsorId) {
      setSponsorError('Please select a reward first.');
      return;
    }
    if (!user?.uid) return;

    setSponsorError('');
    await submit(
      user.uid,
      sessionId,
      selectedSponsorId,
      firstName.trim(),
      lastName.trim(),
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
        Choose your reward, then confirm your contact details.
      </Text>

      <Card style={styles.formCard}>
        <Text style={styles.sectionLabel}>Choose a Sponsor Reward</Text>
        {isLoadingSponsors ? (
          <ActivityIndicator color={AppColors.accent} style={styles.spinner} />
        ) : sponsors.length === 0 ? (
          <Text style={styles.emptySponsors}>
            No sponsor rewards are configured for this session.
          </Text>
        ) : (
          sponsors.map((sponsor) => {
            const selected = selectedSponsorId === sponsor.id;
            return (
              <Pressable
                key={sponsor.id}
                onPress={() => {
                  setSelectedSponsorId(sponsor.id);
                  if (sponsorError) setSponsorError('');
                }}
                style={({ pressed }) => [pressed && styles.pressed]}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <Card
                  style={[
                    styles.sponsorOptionCard,
                    selected ? styles.sponsorOptionSelected : null,
                  ]}
                >
                  <Text style={styles.sponsorName}>{sponsor.name}</Text>
                  {!!sponsor.rewardDescription && (
                    <Text style={styles.sponsorRewardText}>
                      {sponsor.rewardDescription}
                    </Text>
                  )}
                </Card>
              </Pressable>
            );
          })
        )}
        {sponsorError ? <Text style={styles.errorText}>{sponsorError}</Text> : null}

        <Text style={styles.sectionLabel}>Your name</Text>
        <TextField
          label="First name"
          value={firstName}
          onChangeText={(v) => {
            setFirstName(v);
            if (firstNameError) validateFirstName(v);
          }}
          autoCapitalize="words"
          autoComplete="given-name"
          error={firstNameError}
          placeholder="Jane"
        />
        <TextField
          label="Last name"
          value={lastName}
          onChangeText={(v) => {
            setLastName(v);
            if (lastNameError) validateLastName(v);
          }}
          autoCapitalize="words"
          autoComplete="family-name"
          error={lastNameError}
          placeholder="Doe"
        />

        <Text style={styles.sectionLabel}>Contact</Text>
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
  sectionLabel: {
    ...Typography.label,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  spinner: {
    marginVertical: Spacing.xs,
  },
  emptySponsors: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },
  sponsorOptionCard: {
    backgroundColor: AppColors.bgPrimary,
    borderColor: AppColors.borderSubtle,
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  sponsorOptionSelected: {
    borderColor: AppColors.accent,
    borderWidth: 2,
    backgroundColor: AppColors.accentSoft,
  },
  pressed: {
    opacity: 0.8,
  },
  sponsorName: {
    ...Typography.body,
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  sponsorRewardText: {
    ...Typography.bodySmall,
    color: AppColors.textSecondary,
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
