import { useEffect, useState } from 'react';

import { subscribeToSponsors } from '@/features/admin/services/sponsorService';
import { type Sponsor } from '@/types';

interface UseSponsorsResult {
  sponsors: Sponsor[];
  isLoading: boolean;
  error: string | null;
}

export function useSponsors(): UseSponsorsResult {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSponsors((data) => {
      setSponsors(data);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return { sponsors, isLoading, error };
}
