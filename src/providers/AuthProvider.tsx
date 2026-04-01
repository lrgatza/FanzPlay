import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { auth, db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';
import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
} from '@/features/auth/services/authService';
import { type AppUser } from '@/types';

export interface AuthContextValue {
  user: AppUser | null;
  firebaseUser: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    marketingOptIn: boolean,
    teamId: string | null,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, COLLECTIONS.USERS, fbUser.uid));
        if (snap.exists()) {
          setUser({ ...(snap.data() as AppUser), uid: fbUser.uid });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await authSignIn(email, password);
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      marketingOptIn: boolean,
      teamId: string | null,
    ) => {
      await authSignUp(email, password, displayName, marketingOptIn, teamId);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, firebaseUser, isLoading, signIn, signUp, signOut }),
    [user, firebaseUser, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
