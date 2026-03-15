import { Timestamp } from 'firebase/firestore';

export type UserRole = 'fan' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  teamId: string | null;
  marketingOptIn: boolean;
  totalPoints: number;
  createdAt: Timestamp;
}
