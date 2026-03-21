import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useTeams } from '@/features/teams/hooks/useTeams';
import { type Team } from '@/types';

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
  const { user } = useAuth();
  const { teams, isLoading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selectedTeamId || !user) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateUserTeam(user.uid, selectedTeamId);
      router.replace({
        pathname: '/(fan)/lobby/[sessionId]',
        params: { sessionId },
      });
    } catch {
      setError('Failed to save your team. Please try again.');
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
          Choose the team you want to cheer for. You can change this later.
        </Text>
      </View>

      {isLoading ? (
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
          label="Join Game"
          onPress={handleConfirm}
          disabled={!selectedTeamId}
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
