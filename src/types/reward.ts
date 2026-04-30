import { Timestamp } from 'firebase/firestore';

export type ClaimStatus = 'pending' | 'fulfilled' | 'rejected';

export interface RewardClaim {
  id: string;
  uid: string;
  sessionId: string;
  sponsorId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string | null;
  status: ClaimStatus;
  createdAt: Timestamp;
}
