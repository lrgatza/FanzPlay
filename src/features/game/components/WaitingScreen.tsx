import { doc, onSnapshot } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { db } from '@/api/firebase';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { COLLECTIONS } from '@/constants/firestore';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGameState } from '@/providers/GameStateProvider';
import { type Team } from '@/types';

export function WaitingScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { correctOptionId, currentQuestion, session, teams } = useGameState();

  const lockedQuestionIdRef = useRef<string | null>(
    session?.currentQuestionId ?? null,
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (
      !correctOptionId ||
      !lockedQuestionIdRef.current ||
      !user?.uid ||
      !currentQuestion
    ) {
      return;
    }

    const questionId = lockedQuestionIdRef.current;
    const submissionId = `${sessionId}_${questionId}_${user.uid}`;
    const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, submissionId);
    const unsubscribe = onSnapshot(submissionRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as { isCorrect?: boolean | null };
      if (typeof data.isCorrect === 'boolean') {
        setIsCorrect(data.isCorrect);
      }
    });

    return unsubscribe;
  }, [correctOptionId, user, sessionId, currentQuestion]);

  const sortedTeams: Team[] = [...teams].sort(
    (a, b) => b.currentSessionScore - a.currentSessionScore,
  );

  const hasReveal = correctOptionId !== null;

  return (
    <ScreenContainer scrollable>
      {!hasReveal ? (
        <View style={styles.waitingSection}>
          <ActivityIndicator
            color={AppColors.accent}
            size="large"
            style={styles.spinner}
          />
          <Text style={styles.waitingTitle}>Answer Recorded!</Text>
          <Text style={styles.waitingBody}>Waiting for results…</Text>
        </View>
      ) : (
        <>
          <View style={styles.resultSection}>
            {isCorrect === null ? (
              <ActivityIndicator color={AppColors.accent} size="small" />
            ) : isCorrect ? (
              <>
                <Text style={styles.resultIcon}>✅</Text>
                <Text style={styles.resultCorrect}>Correct!</Text>
                <Text style={styles.resultPoints}>
                  +{currentQuestion?.points ?? 0} pts
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.resultIcon}>❌</Text>
                <Text style={styles.resultWrong}>Not quite!</Text>
              </>
            )}
          </View>

          <Card style={styles.answerCard}>
            <Text style={styles.answerLabel}>Correct Answer</Text>
            <Text style={styles.answerText}>
              {currentQuestion?.options.find((o) => o.id === correctOptionId)
                ?.text ?? correctOptionId}
            </Text>
          </Card>

          {session?.settings.showTeamScores && sortedTeams.length > 0 && (
            <View style={styles.standingsSection}>
              <Text style={styles.sectionTitle}>Standings</Text>
              <Card style={styles.standingsCard}>
                {sortedTeams.map((team, idx) => (
                  <View key={team.id}>
                    <View
                      style={[
                        styles.standingRow,
                        team.id === user?.teamId &&
                          styles.standingRowHighlighted,
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
                          team.id === user?.teamId && styles.standingNameAccent,
                        ]}
                        numberOfLines={1}
                      >
                        {team.name}
                        {team.id === user?.teamId ? '  (you)' : ''}
                      </Text>
                      <Text style={styles.standingScore}>
                        {team.currentSessionScore} pts
                      </Text>
                    </View>
                    {idx < sortedTeams.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </Card>
            </View>
          )}

          <Text style={styles.nextHint}>Next question coming up…</Text>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  waitingSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  spinner: {
    marginBottom: Spacing.base,
  },
  waitingTitle: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  waitingBody: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  resultSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  resultIcon: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  resultCorrect: {
    ...Typography.headingL,
    color: '#34c759',
  },
  resultWrong: {
    ...Typography.headingL,
    color: '#ff3b30',
  },
  resultPoints: {
    ...Typography.headingM,
    color: AppColors.accent,
  },
  answerCard: {
    backgroundColor: AppColors.bgElevated,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  answerLabel: {
    ...Typography.label,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  answerText: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
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
  nextHint: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
});
