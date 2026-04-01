import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  marketingOptIn: boolean,
  teamId: string | null,
): Promise<{ uid: string }> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await setDoc(doc(db, COLLECTIONS.USERS, credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName,
    role: 'fan',
    teamId,
    marketingOptIn,
    totalPoints: 0,
    createdAt: serverTimestamp(),
  });
  return { uid: credential.user.uid };
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function updateUserTeam(
  uid: string,
  teamId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), { teamId });
}
