import { type Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface CountdownResult {
  secondsLeft: number;
  isExpired: boolean;
}

export function useCountdown(
  startTime: Timestamp | null,
  durationSeconds: number,
): CountdownResult {
  function computeSecondsLeft(): number {
    if (!startTime) return durationSeconds;
    const elapsed = (Date.now() - startTime.toMillis()) / 1000;
    return Math.max(0, durationSeconds - elapsed);
  }

  const [secondsLeft, setSecondsLeft] = useState<number>(computeSecondsLeft);

  useEffect(() => {
    if (!startTime) {
      setSecondsLeft(durationSeconds);
      return;
    }

    setSecondsLeft(computeSecondsLeft());

    const interval = setInterval(() => {
      const remaining = computeSecondsLeft();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, durationSeconds]);

  return { secondsLeft: Math.ceil(secondsLeft), isExpired: secondsLeft <= 0 };
}
