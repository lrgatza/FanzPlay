import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGameSessions } from '@/features/game/hooks/useGameSessions';
import { type GameSession } from '@/types';

function SessionCard({
  session,
  onPress,
}: {
  session: GameSession;
  onPress: () => void;
}) {
  const isLive = session.status === 'active';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.sessionCard, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={styles.sessionCardRow}>
        <View style={styles.sessionCardInfo}>
          <Text style={styles.sessionTitle}>
            {session.title?.trim() || 'Game Session'}
          </Text>
          <Text style={styles.sessionMeta}>
            {session.teamIds?.length ?? 0} teams •{' '}
            {session.questionOrder?.length ?? 0} questions
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            isLive ? styles.badgeLive : styles.badgeLobby,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isLive ? styles.statusLiveText : styles.statusLobbyText,
            ]}
          >
            {isLive ? 'LIVE' : 'LOBBY'}
          </Text>
        </View>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Pressable>
  );
}

export function GameSelectionScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { sessions, isLoading, error } = useGameSessions();

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  function handleSelectSession(session: GameSession) {
    if (!user) return;

    if (!user.teamId) {
      router.push({
        pathname: '/(fan)/team-selection',
        params: { sessionId: session.id },
      });
    } else {
      router.push({
        pathname: '/(fan)/[sessionId]/lobby',
        params: { sessionId: session.id },
      });
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>FanzPlay</Text>
          <Text style={styles.subtitle}>
            Welcome, {user?.displayName ?? 'Fan'}
          </Text>
        </View>
        <Button
          label="Sign Out"
          variant="ghost"
          fullWidth={false}
          onPress={handleSignOut}
        />
      </View>

      {isLoading ? (
        <LoadingState message="Loading games…" />
      ) : error ? (
        <ErrorState message={error} />
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🏟️</Text>
          <Text style={styles.emptyTitle}>No active games</Text>
          <Text style={styles.emptyBody}>
            Check back soon — a game is coming up!
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={() => handleSelectSession(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerText: {
    gap: Spacing.xs,
  },
  title: {
    ...Typography.headingXL,
    color: AppColors.accent,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  emptyBody: {
    ...Typography.body,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  list: {
    paddingBottom: Spacing.lg,
  },
  separator: {
    height: Spacing.sm,
  },
  sessionCard: {
    backgroundColor: AppColors.bgElevated,
    borderRadius: 14,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  sessionCardRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sessionCardInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  sessionTitle: {
    ...Typography.headingM,
    color: AppColors.textPrimary,
  },
  sessionMeta: {
    ...Typography.bodySmall,
    color: AppColors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  badgeLive: {
    backgroundColor: 'rgba(255, 59, 48, 0.18)',
  },
  badgeLobby: {
    backgroundColor: AppColors.accentSoft,
  },
  statusText: {
    ...Typography.label,
    fontWeight: '700',
  },
  statusLiveText: {
    color: '#ff3b30',
  },
  statusLobbyText: {
    color: AppColors.accent,
  },
  arrow: {
    paddingLeft: Spacing.sm,
  },
  arrowText: {
    fontSize: 24,
    color: AppColors.textMuted,
    lineHeight: 28,
  },
});
