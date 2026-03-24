import { collection, getDocs, query, where } from 'firebase/firestore';
import { Linking, Platform } from 'react-native';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type RewardClaim } from '@/types';
import { buildCsv } from '@/utils/csv';

const CSV_HEADERS = [
  'Claim ID',
  'User ID',
  'Session ID',
  'Sponsor ID',
  'Email',
  'Phone',
  'Status',
  'Created At',
];

function formatTimestamp(ts: unknown): string {
  if (!ts) return '';
  if (typeof (ts as { toDate?: () => Date }).toDate === 'function') {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  return String(ts);
}

export async function exportRewardClaimsAsCsv(
  sessionId: string,
): Promise<void> {
  const q = query(
    collection(db, COLLECTIONS.REWARD_CLAIMS),
    where('sessionId', '==', sessionId),
  );

  const snap = await getDocs(q);
  const claims = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<RewardClaim, 'id'>),
  }));

  const rows = claims.map((c) => [
    c.id,
    c.uid,
    c.sessionId,
    c.sponsorId,
    c.email,
    c.phone ?? '',
    c.status,
    formatTimestamp(c.createdAt),
  ]);

  const csvString = buildCsv(CSV_HEADERS, rows);

  if (Platform.OS === 'web') {
    const encoded = encodeURIComponent(csvString);
    await Linking.openURL(`data:text/csv;charset=utf-8,${encoded}`);
  } else {
    const { File, Paths } = await import('expo-file-system');
    const Sharing = await import('expo-sharing');

    const file = new File(Paths.cache, `fanzplay_rewards_${sessionId}.csv`);
    file.write(csvString);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: `Reward Claims — ${sessionId}`,
        UTI: 'public.comma-separated-values-text',
      });
    }
  }
}
