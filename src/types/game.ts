import { Timestamp } from 'firebase/firestore';

import { CurrentQuestion } from './question';

export type GameStatus = 'lobby' | 'active' | 'completed';

export interface GameSession {
  id: string;
  status: GameStatus;
  currentQuestionId: string | null;
  questionActive: boolean;
  questionStartTime: Timestamp | null;
  sponsorId: string;
  settings: {
    showTeamScores: boolean;
    allowLateJoin: boolean;
  };
  currentQuestion: CurrentQuestion | null;
  correctOptionId: string | null;
  teamIds: string[];
  questionOrder: string[];
  currentQuestionIndex: number;
  createdAt: Timestamp;
}
