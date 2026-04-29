import {
  doc,
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
