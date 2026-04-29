import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { resolveSessionTeamForAnswer } from '@/features/game/services/sessionParticipantService';
import { useCountdown } from '@/features/game/hooks/useCountdown';
import { submitAnswer } from '@/features/game/services/submissionService';
import { useGameState } from '@/providers/GameStateProvider';
import { type QuestionOption } from '@/types';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function OptionButton({
  option,
  index,
  isSelected,
  isDisabled,
  onPress,
}: {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.optionCard,
        isSelected && styles.optionSelected,
        isDisabled && !isSelected && styles.optionDisabled,
        pressed && !isDisabled && styles.optionPressed,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
    >
      <View
        style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
      >
        <Text
          style={[
            styles.optionLabelText,
            isSelected && styles.optionLabelTextSelected,
          ]}
        >
          {OPTION_LABELS[index] ?? String(index + 1)}
        </Text>
      </View>
      <Text
        style={[styles.optionText, isSelected && styles.optionTextSelected]}
        numberOfLines={3}
      >
        {option.text}
      </Text>
    </Pressable>
  );
}

export function QuestionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { session, currentQuestion, isQuestionActive } = useGameState();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { secondsLeft, isExpired } = useCountdown(
    session?.questionStartTime ?? null,
    currentQuestion?.timerSeconds ?? 30,
  );

  // Auto-navigate to waiting if timer expires without submission
  useEffect(() => {
    if (isExpired && !submitted) {
      router.replace({
        pathname: '/(fan)/[sessionId]/waiting',
        params: { sessionId },
      });
    }
  }, [isExpired, submitted, router, sessionId]);

  // If question becomes inactive while we're here (without submitting), go to waiting
  useEffect(() => {
    if (!isQuestionActive && !submitted) {
      router.replace({
        pathname: '/(fan)/[sessionId]/waiting',
        params: { sessionId },
      });
    }
  }, [isQuestionActive, submitted, router, sessionId]);

  async function handleSelectOption(optionId: string) {
    if (
      submitted ||
      isSubmitting ||
      !user ||
      !session?.currentQuestionId
    )
      return;
    setSelectedOptionId(optionId);
    setIsSubmitting(true);
    setError(null);

    try {
      const teamId = await resolveSessionTeamForAnswer(
        sessionId,
        user.uid,
        user.teamId,
      );
      await submitAnswer(
        sessionId,
        session.currentQuestionId,
        user.uid,
        teamId,
        optionId,
      );
      setSubmitted(true);
      router.replace({
        pathname: '/(fan)/[sessionId]/waiting',
        params: { sessionId },
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to submit answer. Please try again.',
      );
      setSelectedOptionId(null);
      setIsSubmitting(false);
    }
  }

  if (!currentQuestion) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.accent} size="large" />
        </View>
      </ScreenContainer>
    );
  }

  const timerWarning = secondsLeft <= 5;

  return (
    <ScreenContainer scrollable>
      {/* Timer bar */}
      <View style={styles.timerRow}>
        <View style={styles.timerBarTrack}>
          <View
            style={[
              styles.timerBarFill,
              timerWarning && styles.timerBarWarning,
              {
                width: `${Math.round((secondsLeft / currentQuestion.timerSeconds) * 100)}%`,
              },
            ]}
          />
        </View>
        <Text
          style={[styles.timerText, timerWarning && styles.timerTextWarning]}
        >
          {secondsLeft}s
        </Text>
      </View>

      {/* Points badge */}
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>{currentQuestion.points} pts</Text>
      </View>

      {/* Question text */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>

      {/* Options */}
      <View style={styles.options}>
        {currentQuestion.options.map((option, idx) => (
          <OptionButton
            key={option.id}
            option={option}
            index={idx}
            isSelected={selectedOptionId === option.id}
            isDisabled={submitted || isSubmitting || isExpired}
            onPress={() => handleSelectOption(option.id)}
          />
        ))}
      </View>

      {isSubmitting && !submitted && (
        <View style={styles.statusRow}>
          <ActivityIndicator color={AppColors.accent} size="small" />
          <Text style={styles.statusText}>Submitting…</Text>
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  timerBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: AppColors.borderSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    backgroundColor: AppColors.accent,
    borderRadius: 4,
  },
  timerBarWarning: {
    backgroundColor: '#ff3b30',
  },
  timerText: {
    ...Typography.label,
    color: AppColors.accent,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'right',
  },
  timerTextWarning: {
    color: '#ff3b30',
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accentSoft,
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  pointsText: {
    ...Typography.label,
    color: AppColors.accent,
    fontWeight: '700',
  },
  questionCard: {
    backgroundColor: AppColors.bgElevated,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
    marginBottom: Spacing.lg,
  },
  questionText: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
    lineHeight: 30,
  },
  options: {
    gap: Spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.bgElevated,
    borderRadius: 12,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: AppColors.borderSubtle,
    minHeight: 56,
    gap: Spacing.sm,
  },
  optionSelected: {
    borderColor: AppColors.accent,
    backgroundColor: AppColors.accentSoft,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionPressed: {
    opacity: 0.75,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionLabelSelected: {
    backgroundColor: AppColors.accent,
  },
  optionLabelText: {
    ...Typography.label,
    color: AppColors.textMuted,
    fontWeight: '700',
  },
  optionLabelTextSelected: {
    color: AppColors.primary,
  },
  optionText: {
    ...Typography.body,
    color: AppColors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: AppColors.accent,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.base,
    justifyContent: 'center',
  },
  statusText: {
    ...Typography.body,
    color: AppColors.textMuted,
  },
  errorText: {
    ...Typography.bodySmall,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
