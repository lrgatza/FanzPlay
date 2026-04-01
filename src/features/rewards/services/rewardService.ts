import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';

export async function createRewardClaim(
  uid: string,
  sessionId: string,
  sponsorId: string,
  email: string,
  phone: string | null,
): Promise<void> {
  const docId = `${uid}_${sessionId}`;
  const ref = doc(db, COLLECTIONS.REWARD_CLAIMS, docId);
  await setDoc(ref, {
    id: docId,
    uid,
    sessionId,
    sponsorId,
    email: email.trim(),
    phone: phone?.trim() ?? null,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function hasExistingClaim(
  uid: string,
  sessionId: string,
): Promise<boolean> {
  const docId = `${uid}_${sessionId}`;
  const snap = await getDoc(doc(db, COLLECTIONS.REWARD_CLAIMS, docId));
  return snap.exists();
}
