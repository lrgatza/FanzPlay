import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { COLLECTIONS } from '@/constants/firestore';
import { db } from '@/api/firebase';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGameState } from '@/providers/GameStateProvider';
import { type Sponsor, type Team } from '@/types';

function TeamScoreRow({
  team,
  rank,
  isUserTeam,
}: {
  team: Team;
  rank: number;
  isUserTeam: boolean;
}) {
  const medalEmoji =
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <View style={[styles.scoreRow, isUserTeam && styles.scoreRowHighlighted]}>
      <Text style={styles.scoreRank}>{medalEmoji ?? `${rank}`}</Text>
      <Text
        style={[styles.scoreTeamName, isUserTeam && styles.scoreTeamNameAccent]}
        numberOfLines={1}
      >
        {team.name}
        {isUserTeam ? '  (you)' : ''}
      </Text>
      <Text style={styles.scorePoints}>{team.currentSessionScore} pts</Text>
    </View>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Card style={styles.sponsorCard}>
      <Text style={styles.sponsorLabel}>Brought to you by</Text>
      <Text
        style={[
          styles.sponsorName,
          sponsor.primaryColor ? { color: sponsor.primaryColor } : null,
        ]}
      >
        {sponsor.name}
      </Text>
      {sponsor.rewardDescription ? (
        <View style={styles.rewardRow}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <Text style={styles.rewardText}>{sponsor.rewardDescription}</Text>
        </View>
      ) : null}
    </Card>
  );
}

export function LobbyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { session, teams, isLoading } = useGameState();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    if (!session?.sponsorId) return;
    getDoc(doc(db, COLLECTIONS.SPONSORS, session.sponsorId)).then((snap) => {
      if (snap.exists()) {
        setSponsor({ id: snap.id, ...(snap.data() as Omit<Sponsor, 'id'>) });
      }
    });
  }, [session?.sponsorId]);

  const sortedTeams = [...teams].sort(
    (a, b) => b.currentSessionScore - a.currentSessionScore,
  );

  if (isLoading || !session) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.accent} size="large" />
          <Text style={styles.loadingText}>Connecting to game…</Text>
        </View>
      </ScreenContainer>
    );
  }

  const isLive = session.status === 'active';

  return (
    <ScreenContainer scrollable>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.titleText}>Waiting Room</Text>
          <Chip
            label={isLive ? 'LIVE' : 'LOBBY'}
            variant={isLive ? 'danger' : 'accent'}
          />
        </View>
        <Button
          label="Leave"
          variant="ghost"
          fullWidth={false}
          onPress={() => router.replace('/(fan)/game-selection')}
        />
      </View>

      {sponsor ? <SponsorCard sponsor={sponsor} /> : null}

      {session.settings.showTeamScores && sortedTeams.length > 0 ? (
        <View style={styles.scoresSection}>
          <Text style={styles.sectionTitle}>Team Standings</Text>
          <Card style={styles.scoresCard}>
            {sortedTeams.map((team, index) => (
              <React.Fragment key={team.id}>
                <TeamScoreRow
                  team={team}
                  rank={index + 1}
                  isUserTeam={team.id === user?.teamId}
                />
                {index < sortedTeams.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Card>
        </View>
      ) : null}

      <View style={styles.waitingSection}>
        <Text style={styles.waitingIcon}>⏳</Text>
        <Text style={styles.waitingTitle}>
          {isLive ? 'Game in progress' : 'Waiting for the game to start…'}
        </Text>
        <Text style={styles.waitingBody}>
          {isLive
            ? 'Answer questions as they appear to earn points for your team.'
            : 'Hang tight — the host will start the game shortly.'}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.body,
    color: AppColors.textMuted,
    marginTop: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleText: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
  },
  sponsorCard: {
    backgroundColor: AppColors.bgElevated,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  sponsorLabel: {
    ...Typography.label,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sponsorName: {
    ...Typography.headingM,
    color: AppColors.accent,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  rewardIcon: {
    fontSize: 16,
    lineHeight: 22,
  },
  rewardText: {
    ...Typography.bodySmall,
    color: AppColors.textSecondary,
    flex: 1,
  },
  scoresSection: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  scoresCard: {
    backgroundColor: AppColors.bgElevated,
    padding: 0,
    overflow: 'hidden',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  scoreRowHighlighted: {
    backgroundColor: AppColors.accentSoft,
  },
  scoreRank: {
    ...Typography.body,
    color: AppColors.textMuted,
    width: 28,
    textAlign: 'center',
  },
  scoreTeamName: {
    ...Typography.body,
    color: AppColors.textPrimary,
    flex: 1,
  },
  scoreTeamNameAccent: {
    color: AppColors.accent,
    fontWeight: '600',
  },
  scorePoints: {
    ...Typography.body,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.borderSubtle,
    marginHorizontal: Spacing.base,
  },
  waitingSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  waitingIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  waitingTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  waitingBody: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});
