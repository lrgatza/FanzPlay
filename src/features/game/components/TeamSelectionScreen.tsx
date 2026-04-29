import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateUserTeam } from '@/features/auth/services/authService';
import { subscribeToSession } from '@/features/game/services/gameService';
import {
  canChangeSessionTeam,
  getSessionParticipant,
  upsertSessionTeamStrict,
} from '@/features/game/services/sessionParticipantService';
import { subscribeToTeamsByIds } from '@/features/teams/services/teamService';
import { type GameSession, type Team } from '@/types';

function TeamRow({
  team,
  isSelected,
  onPress,
}: {
  team: Team;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.teamRow,
        isSelected ? styles.teamRowSelected : null,
        pressed && styles.pressed,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
    >
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamScore}>All-time: {team.allTimeScore} pts</Text>
      </View>
      <View
        style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
      >
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </Pressable>
  );
}

export function TeamSelectionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user, setUserTeam } = useAuth();
  const [session, setSession] = useState<GameSession | null>(null);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsResolved, setTeamsResolved] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isCheckingLock, setIsCheckingLock] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionResolved(false);
    setSession(null);
    const unsub = subscribeToSession(sessionId, (s) => {
      setSession(s);
      setSessionResolved(true);
    });
    return unsub;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionResolved || !session?.teamIds?.length) {
      setTeams([]);
      setTeamsResolved(true);
      return;
    }
    setTeamsResolved(false);
    const unsub = subscribeToTeamsByIds(session.teamIds, (data) => {
      const sorted = [...data].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      );
      setTeams(sorted);
      setTeamsResolved(true);
    });
    return unsub;
  }, [sessionResolved, session?.teamIds]);

  useEffect(() => {
    if (!user || !teamsResolved || !sessionResolved) return;

    if (!session) {
      setIsCheckingLock(false);
      return;
    }

    if (!session.teamIds?.length) {
      setIsCheckingLock(false);
      return;
    }

    if (teams.length === 0) {
      setIsCheckingLock(false);
      return;
    }

    setIsCheckingLock(true);
    setError(null);
    Promise.all([
      getSessionParticipant(sessionId, user.uid),
      canChangeSessionTeam(sessionId, user.uid),
    ])
      .then(([participant, canChange]) => {
        const preferred = participant?.teamId ?? user.teamId ?? null;
        const valid =
          preferred && teams.some((t) => t.id === preferred)
            ? preferred
            : null;
        setSelectedTeamId(valid);
        setIsLocked(!canChange);
      })
      .catch(() => {
        setError('Failed to load your team selection. Please try again.');
      })
      .finally(() => {
        setIsCheckingLock(false);
      });
  }, [sessionId, user, session, sessionResolved, teams, teamsResolved]);

  const sessionMissing = sessionResolved && !session;
  const noSessionTeams =
    sessionResolved &&
    !!session &&
    (!session.teamIds || session.teamIds.length === 0);

  const teamsFetchEmpty =
    teamsResolved &&
    !!session?.teamIds?.length &&
    teams.length === 0;

  const isLoading =
    !sessionResolved || !teamsResolved || isCheckingLock;

  async function handleConfirm() {
    if (
      !selectedTeamId ||
      !user ||
      isLocked ||
      !session?.teamIds?.includes(selectedTeamId)
    )
      return;
    setIsSaving(true);
    setError(null);
    try {
      await upsertSessionTeamStrict(sessionId, user.uid, selectedTeamId);
      await updateUserTeam(user.uid, selectedTeamId);
      setUserTeam(selectedTeamId);
      router.replace({
        pathname: '/(fan)/[sessionId]/lobby',
        params: { sessionId },
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to save your team. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Pick Your Team</Text>
        <Text style={styles.subtitle}>
          Choose your team for this session. Team changes lock after your first
          answer.
        </Text>
      </View>

      {sessionMissing ? (
        <Text style={styles.errorText}>
          This game session could not be found.
        </Text>
      ) : noSessionTeams ? (
        <Text style={styles.errorText}>
          No teams are configured for this session yet.
        </Text>
      ) : teamsFetchEmpty ? (
        <Text style={styles.errorText}>
          Could not load teams for this session.
        </Text>
      ) : isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TeamRow
              team={item}
              isSelected={selectedTeamId === item.id}
              onPress={() => setSelectedTeamId(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.footer}>
        <Button
          label={isLocked ? 'Team Locked' : 'Save Team'}
          onPress={handleConfirm}
          disabled={!selectedTeamId || isLocked}
          loading={isSaving}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  backButton: {
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    ...Typography.body,
    color: AppColors.accent,
  },
  title: {
    ...Typography.headingL,
    color: AppColors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingBottom: Spacing.base,
  },
  separator: {
    height: Spacing.sm,
  },
  teamRow: {
    backgroundColor: AppColors.bgElevated,
    borderRadius: 12,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AppColors.borderSubtle,
  },
  teamRowSelected: {
    borderColor: AppColors.accent,
    backgroundColor: AppColors.accentSoft,
  },
  pressed: {
    opacity: 0.75,
  },
  teamInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  teamName: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  teamScore: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: AppColors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: AppColors.accent,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: AppColors.accent,
  },
  errorText: {
    ...Typography.bodySmall,
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  footer: {
    paddingTop: Spacing.base,
  },
});
