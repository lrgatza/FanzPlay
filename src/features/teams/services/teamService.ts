import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
  writeBatch,
  doc,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import { type Team } from '@/types';

export async function createTeam(name: string): Promise<Team> {
  const ref = await addDoc(collection(db, COLLECTIONS.TEAMS), {
    name,
    logoUrl: null,
    currentSessionScore: 0,
    allTimeScore: 0,
    createdAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    name,
    logoUrl: null,
    currentSessionScore: 0,
    allTimeScore: 0,
    createdAt: serverTimestamp() as unknown as Team['createdAt'],
  };
}

export function subscribeToTeams(cb: (teams: Team[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.TEAMS), orderBy('name', 'asc'));
  return onSnapshot(q, (snap) => {
    const teams = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Team, 'id'>),
    }));
    cb(teams);
  });
}

export async function resetSessionScores(teamIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  for (const id of teamIds) {
    batch.update(doc(db, COLLECTIONS.TEAMS, id), { currentSessionScore: 0 });
  }
  await batch.commit();
}
