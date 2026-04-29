import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useTeams } from '@/features/teams/hooks/useTeams';
import { createTeam } from '@/features/teams/services/teamService';
import { useSponsors } from '@/features/admin/hooks/useSponsors';
import { useQuestions } from '@/features/admin/hooks/useQuestions';
import { createSponsor } from '@/features/admin/services/sponsorService';
import { createSession } from '@/features/admin/services/sessionService';
import { type Question, type Sponsor, type Team } from '@/types';

export function SessionSetupScreen() {
  const router = useRouter();
  const { teams, isLoading: teamsLoading } = useTeams();
  const { sponsors, isLoading: sponsorsLoading } = useSponsors();
  const { questions, isLoading: questionsLoading } = useQuestions();
  const [sessionTitle, setSessionTitle] = useState('Game Session');

  // Team selection (exactly 2)
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamError, setNewTeamError] = useState('');
  const [addingTeam, setAddingTeam] = useState(false);

  // Question selection (ordered list)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Sponsor selection (one or more)
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<string[]>([]);
  const [showNewSponsor, setShowNewSponsor] = useState(false);
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorReward, setNewSponsorReward] = useState('');
  const [newSponsorError, setNewSponsorError] = useState('');
  const [addingSponsor, setAddingSponsor] = useState(false);

  // Settings
  const [showTeamScores, setShowTeamScores] = useState(true);
  const [allowLateJoin, setAllowLateJoin] = useState(true);

  // Submit
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Team helpers ──
  function toggleTeam(id: string) {
    setSelectedTeamIds((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, id];
    });
  }

  async function handleAddTeam() {
    if (!newTeamName.trim()) {
      setNewTeamError('Team name is required.');
      return;
    }
    setAddingTeam(true);
    setNewTeamError('');
    try {
      const created = await createTeam(newTeamName.trim());
      setSelectedTeamIds((prev) => {
        if (prev.length < 2) return [...prev, created.id];
        return prev;
      });
      setNewTeamName('');
      setShowNewTeam(false);
    } catch {
      setNewTeamError('Failed to create team. Try again.');
    } finally {
      setAddingTeam(false);
    }
  }

  // ── Question helpers ──
  function toggleQuestion(id: string) {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  }

  // ── Sponsor helpers ──
  function toggleSponsor(id: string) {
    setSelectedSponsorIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  async function handleAddSponsor() {
    if (!newSponsorName.trim()) {
      setNewSponsorError('Sponsor name is required.');
      return;
    }
    setAddingSponsor(true);
    setNewSponsorError('');
    try {
      const created = await createSponsor(
        newSponsorName.trim(),
        newSponsorReward.trim(),
      );
      setSelectedSponsorIds((prev) =>
        prev.includes(created.id) ? prev : [...prev, created.id],
      );
      setNewSponsorName('');
      setNewSponsorReward('');
      setShowNewSponsor(false);
    } catch {
      setNewSponsorError('Failed to create sponsor. Try again.');
    } finally {
      setAddingSponsor(false);
    }
  }

  // ── Submit ──
  function validate(): string | null {
    if (!sessionTitle.trim()) return 'Session title is required.';
    if (selectedTeamIds.length !== 2) return 'Select exactly 2 teams.';
    if (selectedQuestionIds.length === 0) return 'Select at least 1 question.';
    if (selectedSponsorIds.length === 0) return 'Select at least 1 sponsor.';
    return null;
  }

  async function handleCreateSession() {
    const err = validate();
    if (err) {
      setSubmitError(err);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await createSession({
        title: sessionTitle.trim(),
        teamIds: selectedTeamIds,
        questionOrder: selectedQuestionIds,
        sponsorIds: selectedSponsorIds,
        settings: { showTeamScores, allowLateJoin },
      });
      router.replace('/(admin)/dashboard');
    } catch {
      setSubmitError('Failed to create session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable keyboardAvoiding>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>New Session</Text>
        <Text style={styles.subtitle}>
          Configure teams, questions, sponsors, and settings.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Details</Text>
        <TextField
          label="Game Title"
          value={sessionTitle}
          onChangeText={setSessionTitle}
          placeholder="e.g. Knicks Halftime Trivia"
          maxLength={60}
        />
      </View>

      {/* ── Section 1: Teams ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Teams</Text>
        <Text style={styles.sectionHint}>Choose exactly 2 teams.</Text>

        {teamsLoading ? (
          <ActivityIndicator color={AppColors.accent} style={styles.spinner} />
        ) : (
          teams.map((team: Team) => {
            const selected = selectedTeamIds.includes(team.id);
            const disabled = !selected && selectedTeamIds.length >= 2;
            return (
              <Pressable
                key={team.id}
                onPress={() => !disabled && toggleTeam(team.id)}
                style={({ pressed }) =>
                  pressed && !disabled ? styles.pressed : undefined
                }
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <Card
                  style={[
                    styles.selectableCard,
                    selected ? styles.selectedCard : null,
                    disabled ? styles.disabledCard : null,
                  ]}
                >
                  <View style={styles.selectableRow}>
                    <Text
                      style={[
                        styles.selectableName,
                        selected && styles.selectedText,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {team.name}
                    </Text>
                    {selected && (
                      <Chip
                        label={`#${selectedTeamIds.indexOf(team.id) + 1}`}
                        variant="accent"
                      />
                    )}
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}

        {showNewTeam ? (
          <Card style={styles.inlineForm}>
            <TextField
              label="Team Name"
              value={newTeamName}
              onChangeText={setNewTeamName}
              placeholder="e.g. Blue Devils"
              error={newTeamError}
              autoFocus
            />
            <View style={styles.inlineFormActions}>
              <Button
                label="Cancel"
                variant="ghost"
                onPress={() => {
                  setShowNewTeam(false);
                  setNewTeamName('');
                  setNewTeamError('');
                }}
                fullWidth={false}
                style={styles.smallBtn}
              />
              <Button
                label="Add Team"
                onPress={handleAddTeam}
                loading={addingTeam}
                fullWidth={false}
                style={styles.smallBtn}
              />
            </View>
          </Card>
        ) : (
          <Button
            label="+ New Team"
            variant="ghost"
            onPress={() => setShowNewTeam(true)}
            style={styles.addInlineBtn}
          />
        )}
      </View>

      {/* ── Section 2: Questions ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Questions</Text>
        <Text style={styles.sectionHint}>
          Questions will be asked in the order you select them.
        </Text>

        {questionsLoading ? (
          <ActivityIndicator color={AppColors.accent} style={styles.spinner} />
        ) : questions.length === 0 ? (
          <Text style={styles.emptyText}>
            No questions in the bank yet. Add questions from the Dashboard
            first.
          </Text>
        ) : (
          questions.map((q: Question) => {
            const selected = selectedQuestionIds.includes(q.id);
            const order = selectedQuestionIds.indexOf(q.id) + 1;
            return (
              <Pressable
                key={q.id}
                onPress={() => toggleQuestion(q.id)}
                style={({ pressed }) => (pressed ? styles.pressed : undefined)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <Card
                  style={[
                    styles.selectableCard,
                    selected ? styles.selectedCard : null,
                  ]}
                >
                  <View style={styles.selectableRow}>
                    <View style={styles.questionInfo}>
                      <Text
                        style={[
                          styles.selectableName,
                          selected && styles.selectedText,
                        ]}
                        numberOfLines={2}
                      >
                        {q.text}
                      </Text>
                      <Text style={styles.questionMeta}>
                        {q.points} pts · {q.timerSeconds}s
                      </Text>
                    </View>
                    {selected && <Chip label={`${order}`} variant="accent" />}
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}
      </View>

      {/* ── Section 3: Sponsors ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Sponsors</Text>
        <Text style={styles.sectionHint}>
          Winners can choose from these rewards at the end.
        </Text>

        {sponsorsLoading ? (
          <ActivityIndicator color={AppColors.accent} style={styles.spinner} />
        ) : (
          sponsors.map((sponsor: Sponsor) => {
            const selected = selectedSponsorIds.includes(sponsor.id);
            return (
              <Pressable
                key={sponsor.id}
                onPress={() => toggleSponsor(sponsor.id)}
                style={({ pressed }) => (pressed ? styles.pressed : undefined)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <Card
                  style={[
                    styles.selectableCard,
                    selected ? styles.selectedCard : null,
                  ]}
                >
                  <View style={styles.selectableRow}>
                    <View>
                      <Text
                        style={[
                          styles.selectableName,
                          selected && styles.selectedText,
                        ]}
                      >
                        {sponsor.name}
                      </Text>
                      {!!sponsor.rewardDescription && (
                        <Text style={styles.questionMeta}>
                          {sponsor.rewardDescription}
                        </Text>
                      )}
                    </View>
                    {selected && <Chip label="Selected" variant="accent" />}
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}

        {showNewSponsor ? (
          <Card style={styles.inlineForm}>
            <TextField
              label="Sponsor Name"
              value={newSponsorName}
              onChangeText={setNewSponsorName}
              placeholder="e.g. Acme Corp"
              error={newSponsorError}
              autoFocus
            />
            <TextField
              label="Reward Description"
              value={newSponsorReward}
              onChangeText={setNewSponsorReward}
              placeholder="e.g. Win a $100 gift card"
            />
            <View style={styles.inlineFormActions}>
              <Button
                label="Cancel"
                variant="ghost"
                onPress={() => {
                  setShowNewSponsor(false);
                  setNewSponsorName('');
                  setNewSponsorReward('');
                  setNewSponsorError('');
                }}
                fullWidth={false}
                style={styles.smallBtn}
              />
              <Button
                label="Add Sponsor"
                onPress={handleAddSponsor}
                loading={addingSponsor}
                fullWidth={false}
                style={styles.smallBtn}
              />
            </View>
          </Card>
        ) : (
          <Button
            label="+ New Sponsor"
            variant="ghost"
            onPress={() => setShowNewSponsor(true)}
            style={styles.addInlineBtn}
          />
        )}
      </View>

      {/* ── Section 4: Settings ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Show Team Scores</Text>
              <Text style={styles.settingHint}>
                Display live standings in the lobby.
              </Text>
            </View>
            <Switch
              value={showTeamScores}
              onValueChange={setShowTeamScores}
              trackColor={{
                false: AppColors.borderSubtle,
                true: AppColors.accent,
              }}
              thumbColor={AppColors.bgSecondary}
            />
          </View>
          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Allow Late Join</Text>
              <Text style={styles.settingHint}>
                Fans can join after the session starts.
              </Text>
            </View>
            <Switch
              value={allowLateJoin}
              onValueChange={setAllowLateJoin}
              trackColor={{
                false: AppColors.borderSubtle,
                true: AppColors.accent,
              }}
              thumbColor={AppColors.bgSecondary}
            />
          </View>
        </Card>
      </View>

      {/* ── Submit ── */}
      {!!submitError && <Text style={styles.submitError}>{submitError}</Text>}
      <Button
        label="Create Session"
        onPress={handleCreateSession}
        loading={submitting}
        style={styles.submitBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  backBtn: {
    marginBottom: Spacing.base,
    alignSelf: 'flex-start',
  },
  backText: {
    ...Typography.body,
    color: AppColors.accent,
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionHint: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    marginBottom: Spacing.base,
  },
  spinner: {
    marginVertical: Spacing.lg,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },
  selectableCard: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderSubtle,
    marginBottom: Spacing.sm,
    padding: Spacing.base,
  },
  selectedCard: {
    borderColor: AppColors.accent,
    borderWidth: 2,
    backgroundColor: AppColors.accentSoft,
  },
  disabledCard: {
    opacity: 0.4,
  },
  selectableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectableName: {
    ...Typography.body,
    color: AppColors.textSecondary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  selectedText: {
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  disabledText: {
    color: AppColors.textMuted,
  },
  questionInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  questionMeta: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    marginTop: Spacing.xs,
  },
  inlineForm: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderStrong,
    marginBottom: Spacing.sm,
  },
  inlineFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  smallBtn: {
    paddingHorizontal: Spacing.base,
    minHeight: 40,
  },
  addInlineBtn: {
    marginTop: Spacing.xs,
  },
  settingsCard: {
    backgroundColor: AppColors.bgElevated,
    borderColor: AppColors.borderSubtle,
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderSubtle,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.base,
  },
  settingLabel: {
    ...Typography.body,
    color: AppColors.textPrimary,
  },
  settingHint: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  submitError: {
    ...Typography.bodySmall,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  submitBtn: {
    marginBottom: Spacing.xl,
  },
});
