import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type Sponsor } from '@/types';

export async function createSponsor(
  name: string,
  rewardDescription: string,
): Promise<Sponsor> {
  const ref = await addDoc(collection(db, COLLECTIONS.SPONSORS), {
    name,
    logoUrl: null,
    primaryColor: null,
    rewardDescription,
    createdAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    name,
    logoUrl: null,
    primaryColor: null,
    rewardDescription,
    createdAt: serverTimestamp() as unknown as Sponsor['createdAt'],
  };
}

export function subscribeToSponsors(
  cb: (sponsors: Sponsor[]) => void,
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.SPONSORS), orderBy('name', 'asc'));
  return onSnapshot(q, (snap) => {
    const sponsors = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Sponsor, 'id'>),
    }));
    cb(sponsors);
  });
}
