import { Timestamp } from 'firebase/firestore';

export interface Team {
  id: string;
  name: string;
  logoUrl: string | null;
  currentSessionScore: number;
  createdAt: Timestamp;
}
