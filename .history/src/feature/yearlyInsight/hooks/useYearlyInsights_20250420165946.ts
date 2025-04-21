import { useState, useEffect } from 'react';
import { AccountInsight } from '@/types/accountInsight';

export const useYearlyInsights = (selectedDate: Date) => {
  const [insights, setInsights] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const year = selectedDate.getFullYear();
        const response = await fetch(`/api/yearlyInsights?year=${year}`);
        
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        
        const data = await response.json();
        setInsights(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedDate]);

  return { insights, isLoading, error };
}; 