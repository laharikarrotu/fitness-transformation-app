// src/hooks/useStats.ts
import { useState, useEffect } from 'react';

interface Stats {
  workouts: {
    total: number;
    thisWeek: number;
    trend: number;
  };
  calories: {
    average: number;
    thisWeek: number;
    trend: number;
  };
  weight: {
    current: number;
    change: number;
    trend: number;
  };
  goals: {
    completed: number;
    inProgress: number;
    completion: number;
  };
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, error, refreshStats: fetchStats };
}