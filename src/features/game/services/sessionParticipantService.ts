import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type SessionParticipant } from '@/types';

function participantDocId(sessionId: string, uid: string): string {
  return `${sessionId}_${uid}`;
}

export async function getSessionParticipant(
  sessionId: string,
  uid: string,
): Promise<SessionParticipant | null> {
  const ref = doc(
    db,
    COLLECTIONS.SESSION_PARTICIPANTS,
    participantDocId(sessionId, uid),
  );
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...(snap.data() as Omit<SessionParticipant, 'id'>),
  };
}

export async function canChangeSessionTeam(
  sessionId: string,
  uid: string,
): Promise<boolean> {
  const submissionsQuery = query(
    collection(db, COLLECTIONS.SUBMISSIONS),
    where('sessionId', '==', sessionId),
    where('uid', '==', uid),
    limit(1),
  );
  const submissionsSnap = await getDocs(submissionsQuery);
  return submissionsSnap.empty;
}

export async function upsertSessionTeamStrict(
  sessionId: string,
  uid: string,
  teamId: string,
): Promise<void> {
  const isAllowed = await canChangeSessionTeam(sessionId, uid);
  if (!isAllowed) {
    throw new Error(
      'Team changes are locked after your first answer in this session.',
    );
  }

  const ref = doc(
    db,
    COLLECTIONS.SESSION_PARTICIPANTS,
    participantDocId(sessionId, uid),
  );
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    {
      sessionId,
      uid,
      teamId,
      joinedAt: existing.exists() ? existing.data().joinedAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function resolveSessionTeamForAnswer(
  sessionId: string,
  uid: string,
  fallbackTeamId: string | null,
): Promise<string> {
  const participant = await getSessionParticipant(sessionId, uid);
  if (participant?.teamId) return participant.teamId;
  if (!fallbackTeamId) {
    throw new Error('Pick a team before submitting an answer.');
  }

  await upsertSessionTeamStrict(sessionId, uid, fallbackTeamId);
  return fallbackTeamId;
}
