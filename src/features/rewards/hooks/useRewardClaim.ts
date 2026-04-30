import { useCallback, useState } from 'react';

import {
  createRewardClaim,
  hasExistingClaim,
} from '@/features/rewards/services/rewardService';

interface UseRewardClaimReturn {
  submit: (
    uid: string,
    sessionId: string,
    sponsorId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string | null,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export function useRewardClaim(): UseRewardClaimReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (
      uid: string,
      sessionId: string,
      sponsorId: string,
      firstName: string,
      lastName: string,
      email: string,
      phone: string | null,
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const alreadyClaimed = await hasExistingClaim(uid, sessionId);
        if (alreadyClaimed) {
          setSuccess(true);
          return;
        }
        await createRewardClaim(
          uid,
          sessionId,
          sponsorId,
          firstName,
          lastName,
          email,
          phone,
        );
        setSuccess(true);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Failed to submit claim. Please try again.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { submit, isSubmitting, error, success };
}
