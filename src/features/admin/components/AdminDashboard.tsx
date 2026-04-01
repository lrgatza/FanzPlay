import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAdminSession } from '@/features/admin/hooks/useAdminSession';
import { useQuestions } from '@/features/admin/hooks/useQuestions';
import {
  createQuestion,
  deleteQuestion,
  type CreateQuestionInput,
} from '@/features/admin/services/questionService';
import { type GameStatus, type QuestionOption } from '@/types';

const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;

function statusToChipVariant(status: GameStatus) {
  if (status === 'active') return 'success' as const;
  if (status === 'completed') return 'muted' as const;
  return 'accent' as const;
}

function formatDate(ts: { toDate?: () => Date } | null | undefined): string {
  if (!ts || typeof ts.toDate !== 'function') return '—';
  return ts.toDate().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface QuestionFormState {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOptionId: string;
  points: string;
  timerSeconds: string;
}

const EMPTY_FORM: QuestionFormState = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOptionId: '',
  points: '10',
  timerSeconds: '20',
};

export function AdminDashboard() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { sessions, isLoading: sessionsLoading } = useAdminSession();
  const { questions, isLoading: questionsLoading } = useQuestions();

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [form, setForm] = useState<QuestionFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<QuestionFormState>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  function validateForm(): boolean {
    const errors: Partial<QuestionFormState> = {};
    if (!form.text.trim()) errors.text = 'Question text is required.';
    if (!form.optionA.trim()) errors.optionA = 'Option A is required.';
    if (!form.optionB.trim()) errors.optionB = 'Option B is required.';
    if (!form.optionC.trim()) errors.optionC = 'Option C is required.';
    if (!form.optionD.trim()) errors.optionD = 'Option D is required.';
    if (!form.correctOptionId)
      errors.correctOptionId = 'Select the correct answer.';
    const pts = parseInt(form.points, 10);
    if (isNaN(pts) || pts < 1) errors.points = 'Enter a positive number.';
    const timer = parseInt(form.timerSeconds, 10);
    if (isNaN(timer) || timer < 5) errors.timerSeconds = 'Minimum 5 seconds.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSaveQuestion() {
    if (!validateForm()) return;
    setSaving(true);
    setSaveError('');
    try {
      const options: QuestionOption[] = OPTION_IDS.map((id) => ({
        id,
        text: form[`option${id}` as keyof QuestionFormState] as string,
      }));
      const input: CreateQuestionInput = {
        text: form.text.trim(),
        options,
        correctOptionId: form.correctOptionId,
        points: parseInt(form.points, 10),
        timerSeconds: parseInt(form.timerSeconds, 10),
      };
      await createQuestion(input);
      setForm(EMPTY_FORM);
      setFormErrors({});
      setShowQuestionForm(false);
    } catch {
      setSaveError('Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuestion(id: string) {
    try {
      await deleteQuestion(id);
    } catch {
      // silent — question list will not update
    }
  }

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>{user?.displayName ?? 'Admin'}</Text>
        </View>
        <Button
          label="Sign Out"
          variant="ghost"
          onPress={handleSignOut}
          fullWidth={false}
        />
      </View>

      {/* ── Sessions ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sessions</Text>
          <Button
            label="New Session"
            onPress={() => router.push('/(admin)/session-setup')}
            fullWidth={false}
            style={styles.sectionAction}
          />
        </View>

        {sessionsLoading ? (
          <ActivityIndicator color={AppColors.accent} style={styles.spinner} />
        ) : sessions.length === 0 ? (
          <Text style={styles.emptyText}>
            No sessions yet. Create one to get started.
          </Text>
        ) : (
          sessions.map((session) => (
            <Pressable
              key={session.id}
              onPress={() => router.push(`/(admin)/live-control/${session.id}`)}
              style={({ pressed }) => [
                styles.sessionCardWrapper,
                pressed && styles.pressed,
              ]}
            >
              <Card style={styles.sessionCard}>
                <View style={styles.sessionCardRow}>
                  <Chip
                    label={session.status.toUpperCase()}
                    variant={statusToChipVariant(session.status)}
                  />
                  <Text style={styles.sessionDate}>
                    {formatDate(
                      session.createdAt as unknown as { toDate: () => Date },
                    )}
                  </Text>
                </View>
                <Text style={styles.sessionMeta}>
                  {session.teamIds.length} team
                  {session.teamIds.length !== 1 ? 's' : ''} ·{' '}
                  {session.questionOrder.length} question
                  {session.questionOrder.length !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.sessionId} numberOfLines={1}>
                  ID: {session.id}
                </Text>
              </Card>
            </Pressable>
          ))
        )}
      </View>

      {/* ── Question Bank ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Question Bank</Text>
          {!showQuestionForm && (
            <Button
              label="New Question"
              variant="secondary"
              onPress={() => setShowQuestionForm(true)}
              fullWidth={false}
              style={styles.sectionAction}
            />
          )}
        </View>

        {/* Inline question creation form */}
        {showQuestionForm && (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>New Question</Text>

            <TextField
              label="Question Text"
              value={form.text}
              onChangeText={(v) => setForm((f) => ({ ...f, text: v }))}
              multiline
              numberOfLines={3}
              error={formErrors.text}
              placeholder="e.g. Which team won the 2023 championship?"
            />

            {OPTION_IDS.map((id) => (
              <TextField
                key={id}
                label={`Option ${id}`}
                value={form[`option${id}` as keyof QuestionFormState] as string}
                onChangeText={(v) =>
                  setForm((f) => ({ ...f, [`option${id}`]: v }))
                }
                error={formErrors[`option${id}` as keyof QuestionFormState]}
                placeholder={`Answer ${id}`}
              />
            ))}

            <Text style={styles.correctLabel}>Correct Answer</Text>
            <View style={styles.correctRow}>
              {OPTION_IDS.map((id) => (
                <Pressable
                  key={id}
                  onPress={() =>
                    setForm((f) => ({ ...f, correctOptionId: id }))
                  }
                  style={[
                    styles.correctOption,
                    form.correctOptionId === id && styles.correctOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.correctOptionText,
                      form.correctOptionId === id &&
                        styles.correctOptionTextSelected,
                    ]}
                  >
                    {id}
                  </Text>
                </Pressable>
              ))}
            </View>
            {!!formErrors.correctOptionId && (
              <Text style={styles.fieldError}>
                {formErrors.correctOptionId}
              </Text>
            )}

            <View style={styles.twoCol}>
              <View style={styles.halfCol}>
                <TextField
                  label="Points"
                  value={form.points}
                  onChangeText={(v) => setForm((f) => ({ ...f, points: v }))}
                  keyboardType="number-pad"
                  error={formErrors.points}
                  placeholder="10"
                />
              </View>
              <View style={styles.halfCol}>
                <TextField
                  label="Timer (sec)"
                  value={form.timerSeconds}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, timerSeconds: v }))
                  }
                  keyboardType="number-pad"
                  error={formErrors.timerSeconds}
                  placeholder="20"
                />
              </View>
            </View>

            {!!saveError && <Text style={styles.fieldError}>{saveError}</Text>}

            <View style={styles.formActions}>
              <Button
                label="Cancel"
                variant="ghost"
                onPress={() => {
                  setShowQuestionForm(false);
                  setForm(EMPTY_FORM);
                  setFormErrors({});
                  setSaveError('');
                }}
                fullWidth={false}
                style={styles.cancelBtn}
              />
              <Button
                label="Save Question"
                onPress={handleSaveQuestion}
                loading={saving}
                fullWidth={false}
                style={styles.saveBtn}
              />
            </View>
          </Card>
        )}

        {/* Question list */}
        {questionsLoading ? (
          <ActivityIndicator color={AppColors.accent} style={styles.spinner} />
        ) : questions.length === 0 && !showQuestionForm ? (
          <Text style={styles.emptyText}>No questions yet. Add one above.</Text>
        ) : (
          questions.map((q) => (
            <Card key={q.id} style={styles.questionCard}>
              <View style={styles.questionRow}>
                <Text style={styles.questionText} numberOfLines={2}>
                  {q.text}
                </Text>
                <View style={styles.questionMeta}>
                  <Chip label={`${q.points} pts`} variant="accent" />
                  <Button
                    label="Delete"
                    variant="ghost"
                    onPress={() => handleDeleteQuestion(q.id)}
                    fullWidth={false}
                    style={styles.deleteBtn}
                  />
                </View>
              </View>
              <Text style={styles.questionOptions}>
                {q.options.map((o) => `${o.id}: ${o.text}`).join(' · ')}
              </Text>
              <Text style={styles.correctAnswerLabel}>
                Correct: {q.correctOptionId} · {q.timerSeconds}s
              </Text>
            </Card>
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    marginTop: Spacing.base,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  sectionAction: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  spinner: {
    marginVertical: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  sessionCardWrapper: {
    marginBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  sessionCard: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderSubtle,
  },
  sessionCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sessionDate: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
  },
  sessionMeta: {
    ...Typography.body,
    color: AppColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sessionId: {
    ...Typography.label,
    color: AppColors.textMuted,
    fontFamily: 'monospace',
  },
  formCard: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderStrong,
    marginBottom: Spacing.base,
  },
  formTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
    marginBottom: Spacing.base,
  },
  correctLabel: {
    ...Typography.label,
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  correctRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  correctOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: AppColors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctOptionSelected: {
    backgroundColor: AppColors.accent,
    borderColor: AppColors.accent,
  },
  correctOptionText: {
    ...Typography.body,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
  correctOptionTextSelected: {
    color: AppColors.primary,
  },
  twoCol: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfCol: {
    flex: 1,
  },
  fieldError: {
    ...Typography.bodySmall,
    color: '#ff6b6b',
    marginBottom: Spacing.sm,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.base,
    minHeight: 40,
  },
  saveBtn: {
    paddingHorizontal: Spacing.lg,
    minHeight: 40,
  },
  questionCard: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderSubtle,
    marginBottom: Spacing.sm,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  questionText: {
    ...Typography.body,
    color: AppColors.textPrimary,
    flex: 1,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexShrink: 0,
  },
  deleteBtn: {
    paddingHorizontal: Spacing.sm,
    minHeight: 32,
  },
  questionOptions: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    marginBottom: Spacing.xs,
  },
  correctAnswerLabel: {
    ...Typography.label,
    color: AppColors.accent,
  },
});
