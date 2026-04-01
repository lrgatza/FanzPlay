import { useEffect, useState } from 'react';

import { subscribeToQuestions } from '@/features/admin/services/questionService';
import { type Question } from '@/types';

interface UseQuestionsResult {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuestions((data) => {
      setQuestions(data);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return { questions, isLoading, error };
}
