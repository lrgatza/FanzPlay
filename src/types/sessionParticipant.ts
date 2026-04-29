import { Timestamp } from 'firebase/firestore';

export interface SessionParticipant {
  id: string;
  sessionId: string;
  uid: string;
  teamId: string;
  joinedAt: Timestamp;
  updatedAt?: Timestamp;
}
