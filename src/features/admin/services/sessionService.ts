import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { resetSessionScores } from '@/features/teams/services/teamService';
import { type GameSession, type Question } from '@/types';

export interface CreateSessionInput {
  title: string;
  teamIds: string[];
  questionOrder: string[];
  sponsorIds: string[];
  settings: {
    showTeamScores: boolean;
    allowLateJoin: boolean;
  };
}

export async function createSession(data: CreateSessionInput): Promise<string> {
  const [ref] = await Promise.all([
    addDoc(collection(db, COLLECTIONS.GAME_SESSIONS), {
      title: data.title,
      status: 'lobby',
      currentQuestionId: null,
      questionActive: false,
      questionStartTime: null,
      sponsorIds: data.sponsorIds,
      settings: data.settings,
      currentQuestion: null,
      correctOptionId: null,
      teamIds: data.teamIds,
      questionOrder: data.questionOrder,
      currentQuestionIndex: -1,
      scoredQuestionIds: [],
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
  const sessionRef = doc(db, COLLECTIONS.GAME_SESSIONS, sessionId);
  const questionRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
  const [sessionSnap, questionSnap] = await Promise.all([
    getDoc(sessionRef),
    getDoc(questionRef),
  ]);
  if (!sessionSnap.exists()) {
    throw new Error(`Session ${sessionId} not found.`);
  }
  if (!questionSnap.exists()) {
    throw new Error(`Question ${questionId} not found.`);
  }
  const sessionData = sessionSnap.data() as Omit<GameSession, 'id'> & {
    scoredQuestionIds?: string[];
  };
  const { correctOptionId } = questionSnap.data() as Pick<Question, 'correctOptionId'>;
  const questionPoints = sessionData.currentQuestion?.points ?? 0;

  // Idempotency guard: if this question was already scored, do not increment
  // team points a second time.
  if (sessionData.scoredQuestionIds?.includes(questionId)) {
    await updateDoc(sessionRef, {
      questionActive: false,
      correctOptionId,
    });
    return;
  }

  const submissionsQuery = query(
    collection(db, COLLECTIONS.SUBMISSIONS),
    where('sessionId', '==', sessionId),
    where('questionId', '==', questionId),
  );
  const submissionsSnap = await getDocs(submissionsQuery);

  const totalsByTeam = new Map<string, number>();
  const correctByTeam = new Map<string, number>();
  const batch = writeBatch(db);

  submissionsSnap.docs.forEach((submissionDoc) => {
    const data = submissionDoc.data() as {
      teamId?: string;
      selectedOptionId?: string;
    };
    const teamId = data.teamId;
    const selectedOptionId = data.selectedOptionId;
    if (!teamId || !selectedOptionId) return;

    const isCorrect = selectedOptionId === correctOptionId;
    const pointsEarned = isCorrect ? questionPoints : 0;
    totalsByTeam.set(teamId, (totalsByTeam.get(teamId) ?? 0) + 1);
    if (isCorrect) {
      correctByTeam.set(teamId, (correctByTeam.get(teamId) ?? 0) + 1);
    }

    batch.update(submissionDoc.ref, {
      isCorrect,
      pointsEarned,
    });
  });

  const sessionTeamIds = sessionData.teamIds ?? [];
  sessionTeamIds.forEach((teamId) => {
    const totalAnswers = totalsByTeam.get(teamId) ?? 0;
    const correctAnswers = correctByTeam.get(teamId) ?? 0;
    if (totalAnswers === 0) return;

    const awardedPoints = Math.round((correctAnswers / totalAnswers) * questionPoints);
    if (awardedPoints <= 0) return;

    batch.update(doc(db, COLLECTIONS.TEAMS, teamId), {
      currentSessionScore: increment(awardedPoints),
    });
  });

  batch.update(sessionRef, {
    questionActive: false,
    correctOptionId,
    scoredQuestionIds: arrayUnion(questionId),
  });

  await batch.commit();
}

export async function endSession(
  sessionId: string,
  options?: { scoreActiveQuestion?: boolean },
): Promise<void> {
  if (options?.scoreActiveQuestion) {
    const sessionRef = doc(db, COLLECTIONS.GAME_SESSIONS, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
      throw new Error(`Session ${sessionId} not found.`);
    }
    const sessionData = sessionSnap.data() as Omit<GameSession, 'id'>;
    if (sessionData.questionActive && sessionData.currentQuestionId) {
      await closeQuestion(sessionId, sessionData.currentQuestionId);
    }
  }

  await updateDoc(doc(db, COLLECTIONS.GAME_SESSIONS, sessionId), {
    status: 'completed',
    questionActive: false,
  });
}
