import {
  collection,
  doc,
  onSnapshot,
  query,
  type DocumentSnapshot,
  type Unsubscribe,
  where,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type GameSession } from '@/types';

export function subscribeToActiveSessions(
  cb: (sessions: GameSession[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.GAME_SESSIONS),
    where('status', 'in', ['lobby', 'active']),
  );
  return onSnapshot(
    q,
    (snap) => {
      const sessions = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GameSession, 'id'>),
      }));
      cb(sessions);
    },
    onError,
  );
}

export function subscribeToSession(
  sessionId: string,
  cb: (session: GameSession | null) => void,
): Unsubscribe {
  const ref = doc(db, COLLECTIONS.GAME_SESSIONS, sessionId);
  return onSnapshot(ref, (snap: DocumentSnapshot) => {
    if (!snap.exists()) {
      cb(null);
    } else {
      cb({ id: snap.id, ...(snap.data() as Omit<GameSession, 'id'>) });
    }
  });
}
