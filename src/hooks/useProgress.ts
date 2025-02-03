// src/hooks/useProgress.ts
import { useState, useEffect } from 'react';
import type { ProgressLog } from '@/types/progress';

export function useProgress(timeframe: 'week' | 'month' | 'year' = 'month') {
  const [progress, setProgress] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [timeframe]);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/progress?timeframe=${timeframe}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setIsLoading(false);
    }
  };

  const addProgressEntry = async (entry: Omit<ProgressLog, 'id'>) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error('Failed to add progress entry');
      fetchProgress(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add progress entry');
      throw err;
    }
  };

  return {
    progress,
    isLoading,
    error,
    addProgressEntry,
    refreshProgress: fetchProgress,
  };
}