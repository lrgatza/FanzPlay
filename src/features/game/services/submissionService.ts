import {
  doc,
  increment,
  runTransaction,
  serverTimestamp,
  setDoc,
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
  await runTransaction(db, async (transaction) => {
    const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, submissionId);
    const submissionSnap = await transaction.get(submissionRef);

    if (!submissionSnap.exists()) return;

    // Idempotency guard: if a previous call already scored this submission,
    // do not apply increments a second time.
    if (submissionSnap.data().isCorrect !== null) return;

    const isCorrect = selectedOptionId === correctOptionId;

    transaction.update(submissionRef, {
      isCorrect,
      pointsEarned: isCorrect ? points : 0,
    });

    if (isCorrect) {
      transaction.update(doc(db, COLLECTIONS.USERS, uid), {
        totalPoints: increment(points),
      });
      transaction.update(doc(db, COLLECTIONS.TEAMS, teamId), {
        currentSessionScore: increment(points),
      });
    }
  });
}
