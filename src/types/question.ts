import { Timestamp } from 'firebase/firestore';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
  timerSeconds: number;
  createdAt: Timestamp;
}

export interface CurrentQuestion {
  text: string;
  options: QuestionOption[];
  points: number;
  timerSeconds: number;
}
