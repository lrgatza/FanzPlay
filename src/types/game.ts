import { Timestamp } from 'firebase/firestore';

import { CurrentQuestion } from './question';

export type GameStatus = 'lobby' | 'active' | 'completed';

export interface GameSession {
  id: string;
  status: GameStatus;
  currentQuestionId: string | null;
  questionActive: boolean;
  questionStartTime: Timestamp | null;
  sponsorIds: string[];
  sponsorId?: string;
  settings: {
    showTeamScores: boolean;
    allowLateJoin: boolean;
  };
  currentQuestion: CurrentQuestion | null;
  correctOptionId: string | null;
  teamIds: string[];
  questionOrder: string[];
  currentQuestionIndex: number;
  scoredQuestionIds?: string[];
  createdAt: Timestamp;
}
