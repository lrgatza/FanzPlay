import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/api/firebase';
import { COLLECTIONS } from '@/constants/firestore';

interface SessionResults {
  sessionScore: number;
  isLoading: boolean;
  error: string | null;
}

export function useSessionResults(
  sessionId: string,
  uid: string | null | undefined,
): SessionResults {
  const [sessionScore, setSessionScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const q = query(
      collection(db, COLLECTIONS.SUBMISSIONS),
      where('sessionId', '==', sessionId),
      where('uid', '==', uid),
    );

    getDocs(q)
      .then((snap) => {
        const total = snap.docs.reduce((sum, d) => {
          const points = d.data().pointsEarned as number | null;
          return sum + (points ?? 0);
        }, 0);
        setSessionScore(total);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load score.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sessionId, uid]);

  return { sessionScore, isLoading, error };
}
