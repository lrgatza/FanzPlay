import { Timestamp } from 'firebase/firestore';

export interface Submission {
  id: string;
  uid: string;
  sessionId: string;
  questionId: string;
  teamId: string;
  selectedOptionId: string;
  isCorrect: boolean | null;
  pointsEarned: number | null;
  answeredAt: Timestamp;
}
