import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { exportRewardClaimsAsCsv } from '@/features/admin/services/exportService';
import {
  closeQuestion,
  endSession,
  pushNextQuestion,
} from '@/features/admin/services/sessionService';
import { subscribeToSession } from '@/features/game/services/gameService';
import { type GameSession } from '@/types';

function confirmAction(message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) onConfirm();
  } else {
    Alert.alert('Confirm', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);
  }
}

export function LiveControlScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToSession(sessionId, (s) => {
      setSession(s);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [sessionId]);

  async function handlePushNextQuestion() {
    if (!session) return;
    setIsPushing(true);
    setActionError(null);
    try {
      await pushNextQuestion(
        sessionId,
        session.questionOrder,
        session.currentQuestionIndex,
      );
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : 'Failed to push question.',
      );
    } finally {
      setIsPushing(false);
    }
  }

  async function handleCloseQuestion() {
    if (!session?.currentQuestionId) return;
    setIsClosing(true);
    setActionError(null);
    try {
      await closeQuestion(sessionId, session.currentQuestionId);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : 'Failed to close question.',
      );
    } finally {
      setIsClosing(false);
    }
  }

  async function finalizeEndSession(scoreActiveQuestion: boolean) {
    setIsEnding(true);
    setActionError(null);
    setShowEndSessionModal(false);
    try {
      await endSession(sessionId, { scoreActiveQuestion });
      router.replace('/(admin)/dashboard');
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to end session.');
      setIsEnding(false);
    }
  }

  function handleEndSession() {

    const hasActiveQuestion = session?.questionActive ?? false;
    if (hasActiveQuestion) {
      if (Platform.OS === 'web') {
        setShowEndSessionModal(true);
        return;
      }

      Alert.alert(
        'End session',
        'A question is currently active. Choose how to end this session.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'End Without Scoring',
            style: 'destructive',
            onPress: () => {
              void finalizeEndSession(false);
            },
          },
          {
            text: 'Score & End',
            onPress: () => {
              void finalizeEndSession(true);
            },
          },
        ],
      );
      return;
    }

    confirmAction('End this session? Fans will see the results screen.', () => {
      void finalizeEndSession(false);
    });
  }

  async function handleExportCsv() {
    setIsExporting(true);
    setExportError(null);
    try {
      await exportRewardClaimsAsCsv(sessionId);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Failed to export CSV.');
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading || !session) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.accent} size="large" />
        </View>
      </ScreenContainer>
    );
  }

  const totalQuestions = session.questionOrder.length;
  const currentIndex = session.currentQuestionIndex;
  const hasNextQuestion = currentIndex + 1 < totalQuestions;
  const isSessionCompleted = session.status === 'completed';

  const canPush =
    !session.questionActive && hasNextQuestion && !isSessionCompleted;
  const canClose = session.questionActive && !!session.currentQuestionId;
  const canEnd = !isSessionCompleted;

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Button
            label="← Dashboard"
            variant="ghost"
            fullWidth={false}
            onPress={() => router.replace('/(admin)/dashboard')}
          />
        </View>
        <Chip
          label={
            isSessionCompleted
              ? 'COMPLETED'
              : session.questionActive
                ? 'LIVE'
                : 'LOBBY'
          }
          variant={
            isSessionCompleted
              ? 'muted'
              : session.questionActive
                ? 'danger'
                : 'accent'
          }
        />
      </View>

      <Text style={styles.title}>Live Control</Text>
      <Text style={styles.subtitle}>Session ID: {sessionId}</Text>

      {/* Progress */}
      <Card style={styles.progressCard}>
        <Text style={styles.cardLabel}>Question Progress</Text>
        <Text style={styles.progressText}>
          {currentIndex < 0
            ? 'Not started'
            : `${currentIndex + 1} / ${totalQuestions}`}
        </Text>
        {session.currentQuestion && (
          <View style={styles.currentQuestionBox}>
            <Text style={styles.currentQuestionLabel}>Current question</Text>
            <Text style={styles.currentQuestionText} numberOfLines={2}>
              {session.currentQuestion.text}
            </Text>
            <View style={styles.questionMeta}>
              <Text style={styles.metaText}>
                {session.currentQuestion.timerSeconds}s timer
              </Text>
              <Text style={styles.metaText}>
                {session.currentQuestion.points} pts
              </Text>
            </View>
          </View>
        )}
        {hasNextQuestion && (
          <Text style={styles.nextHint}>
            Next: question {currentIndex + 2} of {totalQuestions}
          </Text>
        )}
        {!hasNextQuestion && currentIndex >= 0 && (
          <Text style={styles.nextHint}>All questions have been pushed.</Text>
        )}
      </Card>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        <Text style={styles.cardLabel}>Controls</Text>

        <View style={styles.controlsStack}>
          <Button
            label={
              isPushing
                ? 'Pushing…'
                : currentIndex < 0
                  ? 'Start Game — Push Question 1'
                  : `Push Question ${currentIndex + 2}`
            }
            onPress={handlePushNextQuestion}
            disabled={!canPush}
            loading={isPushing}
          />

          <Button
            label={isClosing ? 'Closing…' : 'Close Question & Reveal Answer'}
            variant="secondary"
            onPress={handleCloseQuestion}
            disabled={!canClose}
            loading={isClosing}
          />

          <Button
            label={isEnding ? 'Ending…' : 'End Session'}
            variant="ghost"
            onPress={handleEndSession}
            disabled={!canEnd}
            loading={isEnding}
          />
        </View>
      </Card>

      {actionError ? <Text style={styles.errorText}>{actionError}</Text> : null}

      {isSessionCompleted && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedText}>
            Session is complete. Fans are on the results screen.
          </Text>
          <Button
            label={isExporting ? 'Exporting…' : 'Export Winners CSV'}
            variant="secondary"
            onPress={handleExportCsv}
            loading={isExporting}
            disabled={isExporting}
            style={styles.exportBtn}
          />
          {exportError ? (
            <Text style={styles.exportErrorText}>{exportError}</Text>
          ) : null}
        </View>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={showEndSessionModal}
        onRequestClose={() => setShowEndSessionModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>End session</Text>
            <Text style={styles.modalBody}>
              A question is currently active. Choose how to end this session.
            </Text>
            <View style={styles.modalActions}>
              <Button
                label="Score & End"
                onPress={() => {
                  void finalizeEndSession(true);
                }}
              />
              <Button
                label="End Without Scoring"
                variant="secondary"
                onPress={() => {
                  void finalizeEndSession(false);
                }}
              />
              <Button
                label="Cancel"
                variant="ghost"
                onPress={() => setShowEndSessionModal(false)}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexShrink: 1,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    fontVariant: ['tabular-nums'],
    marginBottom: Spacing.lg,
  },
  progressCard: {
    backgroundColor: AppColors.bgElevated,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  cardLabel: {
    ...Typography.label,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressText: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  currentQuestionBox: {
    borderLeftWidth: 3,
    borderLeftColor: AppColors.accent,
    paddingLeft: Spacing.sm,
    gap: Spacing.xs,
  },
  currentQuestionLabel: {
    ...Typography.label,
    color: AppColors.textMuted,
  },
  currentQuestionText: {
    ...Typography.body,
    color: AppColors.textPrimary,
  },
  questionMeta: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  metaText: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
  },
  nextHint: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },
  controlsCard: {
    backgroundColor: AppColors.bgElevated,
    marginBottom: Spacing.base,
    gap: Spacing.base,
  },
  controlsStack: {
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySmall,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  completedBanner: {
    backgroundColor: AppColors.accentSoft,
    borderRadius: 10,
    padding: Spacing.base,
    marginTop: Spacing.base,
  },
  completedText: {
    ...Typography.body,
    color: AppColors.accent,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  exportBtn: {
    marginTop: Spacing.xs,
  },
  exportErrorText: {
    ...Typography.bodySmall,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: Spacing.base,
  },
  modalCard: {
    backgroundColor: AppColors.bgElevated,
    gap: Spacing.sm,
  },
  modalTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  modalBody: {
    ...Typography.body,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  modalActions: {
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
});
