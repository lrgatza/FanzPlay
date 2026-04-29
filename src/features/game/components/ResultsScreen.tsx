import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSessionResults } from '@/features/game/hooks/useSessionResults';
import { useGameState } from '@/providers/GameStateProvider';
import { type Team } from '@/types';

function WinnerCard({ team }: { team: Team }) {
  return (
    <Card style={styles.winnerCard}>
      <Text style={styles.trophyIcon}>🏆</Text>
      <Chip label="WINNER" variant="accent" />
      <Text style={styles.winnerName}>{team.name}</Text>
      <Text style={styles.winnerScore}>{team.currentSessionScore} pts</Text>
    </Card>
  );
}

function StandingsCard({
  teams,
  userTeamId,
}: {
  teams: Team[];
  userTeamId: string | null;
}) {
  const sorted = [...teams].sort(
    (a, b) => b.currentSessionScore - a.currentSessionScore,
  );

  return (
    <View style={styles.standingsSection}>
      <Text style={styles.sectionTitle}>Final Standings</Text>
      <Card style={styles.standingsCard}>
        {sorted.map((team, idx) => (
          <View key={team.id}>
            <View
              style={[
                styles.standingRow,
                team.id === userTeamId && styles.standingRowHighlighted,
              ]}
            >
              <Text style={styles.standingRank}>
                {idx === 0
                  ? '🥇'
                  : idx === 1
                    ? '🥈'
                    : idx === 2
                      ? '🥉'
                      : `${idx + 1}`}
              </Text>
              <Text
                style={[
                  styles.standingName,
                  team.id === userTeamId && styles.standingNameAccent,
                ]}
                numberOfLines={1}
              >
                {team.name}
                {team.id === userTeamId ? '  (you)' : ''}
              </Text>
              <Text style={styles.standingScore}>
                {team.currentSessionScore} pts
              </Text>
            </View>
            {idx < sorted.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Card>
    </View>
  );
}

export function ResultsScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { teams, session, isLoading: gameLoading } = useGameState();
  const {
    sessionScore,
    isLoading: scoreLoading,
    error: scoreError,
  } = useSessionResults(sessionId, user?.uid);

  const isLoading = gameLoading || scoreLoading;

  const sortedTeams = [...teams].sort(
    (a, b) => b.currentSessionScore - a.currentSessionScore,
  );
  const topScore = sortedTeams[0]?.currentSessionScore ?? 0;
  const hasScoredQuestions = (session?.scoredQuestionIds?.length ?? 0) > 0;
  const teamsAtTop = sortedTeams.filter((team) => team.currentSessionScore === topScore);
  const isTieForFirst = hasScoredQuestions && topScore > 0 && teamsAtTop.length > 1;
  const winningTeam =
    hasScoredQuestions && topScore > 0 && !isTieForFirst ? sortedTeams[0] : null;
  const sponsorCount =
    session?.sponsorIds && session.sponsorIds.length > 0
      ? session.sponsorIds.length
      : session?.sponsorId
        ? 1
        : 0;

  const isOnWinningTeam =
    winningTeam !== null && user?.teamId === winningTeam.id;
  const canClaimReward =
    isOnWinningTeam && user?.marketingOptIn === true && sponsorCount > 0;

  function handleClaimReward() {
    router.push({
      pathname: '/[sessionId]/reward-claim' as never,
      params: { sessionId },
    });
  }

  function handleBackToGames() {
    router.replace('/(fan)/game-selection');
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading results…" />
      </ScreenContainer>
    );
  }

  if (scoreError) {
    return (
      <ScreenContainer>
        <ErrorState message={scoreError} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.subtitle}>Here are the final results.</Text>

      {winningTeam ? (
        <WinnerCard team={winningTeam} />
      ) : (
        <Card style={styles.noResultsCard}>
          <Text style={styles.noResultsText}>
            {isTieForFirst
              ? 'Game ended in a tie for first place.'
              : 'No scored results were finalized.'}
          </Text>
        </Card>
      )}

      {teams.length > 1 && (
        <StandingsCard teams={teams} userTeamId={user?.teamId ?? null} />
      )}

      <Card style={styles.personalCard}>
        <Text style={styles.personalLabel}>Your Score This Game</Text>
        <Text style={styles.personalScore}>{sessionScore} pts</Text>
        {isOnWinningTeam && (
          <Text style={styles.winnerBadge}>You were on the winning team!</Text>
        )}
      </Card>

      {canClaimReward && (
        <View style={styles.rewardSection}>
          <Text style={styles.rewardHint}>
            You qualified for a sponsor reward. Choose your reward and claim it
            below!
          </Text>
          <Button
            label="Claim Your Reward"
            onPress={handleClaimReward}
            style={styles.claimBtn}
          />
        </View>
      )}

      {isOnWinningTeam && !user?.marketingOptIn && (
        <Card style={styles.optInCard}>
          <Text style={styles.optInText}>
            You won, but your account does not have marketing opt-in enabled.
            Rewards require opt-in at signup.
          </Text>
        </Card>
      )}

      {sponsorCount === 0 ? null : (
        <Text style={styles.sponsorLine}>
          Powered by {sponsorCount} sponsor{sponsorCount === 1 ? '' : 's'} ·
          Session {sessionId}
        </Text>
      )}

      <Button
        label="Back to Games"
        variant="ghost"
        onPress={handleBackToGames}
        style={styles.backBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    marginTop: Spacing.base,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  winnerCard: {
    backgroundColor: AppColors.bgElevated,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
    borderColor: AppColors.accent,
    borderWidth: 1,
  },
  trophyIcon: {
    fontSize: 56,
  },
  winnerName: {
    ...Typography.headingXL,
    color: AppColors.accent,
    textAlign: 'center',
  },
  winnerScore: {
    ...Typography.headingM,
    color: AppColors.textSecondary,
  },
  noResultsCard: {
    backgroundColor: AppColors.bgElevated,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  noResultsText: {
    ...Typography.body,
    color: AppColors.textMuted,
  },
  standingsSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  standingsCard: {
    backgroundColor: AppColors.bgElevated,
    padding: 0,
    overflow: 'hidden',
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  standingRowHighlighted: {
    backgroundColor: AppColors.accentSoft,
  },
  standingRank: {
    ...Typography.body,
    color: AppColors.textMuted,
    width: 28,
    textAlign: 'center',
  },
  standingName: {
    ...Typography.body,
    color: AppColors.textPrimary,
    flex: 1,
  },
  standingNameAccent: {
    color: AppColors.accent,
    fontWeight: '600',
  },
  standingScore: {
    ...Typography.body,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.borderSubtle,
    marginHorizontal: Spacing.base,
  },
  personalCard: {
    backgroundColor: AppColors.bgElevated,
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  personalLabel: {
    ...Typography.label,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  personalScore: {
    ...Typography.headingL,
    color: AppColors.accent,
  },
  winnerBadge: {
    ...Typography.bodySmall,
    color: AppColors.accent,
    fontWeight: '600',
    textAlign: 'center',
  },
  rewardSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.base,
    alignItems: 'center',
  },
  rewardHint: {
    ...Typography.body,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  claimBtn: {
    width: '100%',
  },
  optInCard: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderSubtle,
    marginBottom: Spacing.base,
  },
  optInText: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  sponsorLine: {
    ...Typography.label,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  backBtn: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
