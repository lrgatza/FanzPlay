import { Timestamp } from 'firebase/firestore';

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  rewardDescription: string | null;
  createdAt: Timestamp;
}
