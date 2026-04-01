import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type Question, type QuestionOption } from '@/types';

export interface CreateQuestionInput {
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
  timerSeconds: number;
}

export async function createQuestion(
  data: CreateQuestionInput,
): Promise<Question> {
  const ref = await addDoc(collection(db, COLLECTIONS.QUESTIONS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    ...data,
    createdAt: serverTimestamp() as unknown as Question['createdAt'],
  };
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.QUESTIONS, id));
}

export function subscribeToQuestions(
  cb: (questions: Question[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.QUESTIONS),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    const questions = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Question, 'id'>),
    }));
    cb(questions);
  });
}
