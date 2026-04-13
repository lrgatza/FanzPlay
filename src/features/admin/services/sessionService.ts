import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { resetSessionScores } from '@/features/teams/services/teamService';
import { type GameSession, type Question } from '@/types';

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
  const [ref] = await Promise.all([
    addDoc(collection(db, COLLECTIONS.GAME_SESSIONS), {
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
    }),
    resetSessionScores(data.teamIds),
  ]);
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

export async function pushNextQuestion(
  sessionId: string,
  questionOrder: string[],
  currentIndex: number,
): Promise<void> {
  const nextIndex = currentIndex + 1;
  const nextQuestionId = questionOrder[nextIndex];
  if (!nextQuestionId) {
    throw new Error('No more questions in the queue.');
  }

  const questionSnap = await getDoc(
    doc(db, COLLECTIONS.QUESTIONS, nextQuestionId),
  );
  if (!questionSnap.exists()) {
    throw new Error(`Question ${nextQuestionId} not found.`);
  }
  const q = questionSnap.data() as Omit<Question, 'id'>;

  await updateDoc(doc(db, COLLECTIONS.GAME_SESSIONS, sessionId), {
    status: 'active',
    questionActive: true,
    questionStartTime: serverTimestamp(),
    currentQuestionId: nextQuestionId,
    currentQuestionIndex: increment(1),
    currentQuestion: {
      text: q.text,
      options: q.options,
      points: q.points,
      timerSeconds: q.timerSeconds,
    },
    correctOptionId: null,
  });
}

export async function closeQuestion(
  sessionId: string,
  questionId: string,
): Promise<void> {
  const questionSnap = await getDoc(doc(db, COLLECTIONS.QUESTIONS, questionId));
  if (!questionSnap.exists()) {
    throw new Error(`Question ${questionId} not found.`);
  }
  const { correctOptionId } = questionSnap.data() as Pick<
    Question,
    'correctOptionId'
  >;

  await updateDoc(doc(db, COLLECTIONS.GAME_SESSIONS, sessionId), {
    questionActive: false,
    correctOptionId,
  });
}

export async function endSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.GAME_SESSIONS, sessionId), {
    status: 'completed',
    questionActive: false,
  });
}
