import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  uid: string,
  teamId: string,
  selectedOptionId: string,
): Promise<void> {
  const docId = `${sessionId}_${questionId}_${uid}`;
  const ref = doc(db, COLLECTIONS.SUBMISSIONS, docId);
  await setDoc(ref, {
    uid,
    sessionId,
    questionId,
    teamId,
    selectedOptionId,
    isCorrect: null,
    answeredAt: serverTimestamp(),
  });
}

export async function computeAndRecordScore(
  submissionId: string,
  selectedOptionId: string,
  correctOptionId: string,
  points: number,
  uid: string,
  teamId: string,
): Promise<void> {
  const isCorrect = selectedOptionId === correctOptionId;
  const batch = writeBatch(db);

  batch.update(doc(db, COLLECTIONS.SUBMISSIONS, submissionId), {
    isCorrect,
    pointsEarned: isCorrect ? points : 0,
  });

  if (isCorrect) {
    batch.update(doc(db, COLLECTIONS.USERS, uid), {
      totalPoints: increment(points),
    });
    batch.update(doc(db, COLLECTIONS.TEAMS, teamId), {
      currentSessionScore: increment(points),
    });
  }

  await batch.commit();
}
