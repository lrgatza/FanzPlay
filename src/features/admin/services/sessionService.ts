import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type GameSession } from '@/types';

export interface CreateSessionInput {
  teamIds: string[];
  questionOrder: string[];
  sponsorId: string;
  settings: {
    showTeamScores: boolean;
    allowLateJoin: boolean;
  };
}

export async function createSession(data: CreateSessionInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.GAME_SESSIONS), {
    status: 'lobby',
    currentQuestionId: null,
    questionActive: false,
    questionStartTime: null,
    sponsorId: data.sponsorId,
    settings: data.settings,
    currentQuestion: null,
    correctOptionId: null,
    teamIds: data.teamIds,
    questionOrder: data.questionOrder,
    currentQuestionIndex: -1,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToSessions(
  cb: (sessions: GameSession[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.GAME_SESSIONS),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    const sessions = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GameSession, 'id'>),
    }));
    cb(sessions);
  });
}
