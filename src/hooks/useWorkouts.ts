// src/hooks/useWorkouts.ts
import { useState, useEffect } from 'react';
import type { WorkoutLog } from '@/types/workout';

export function useWorkouts(timeframe: 'week' | 'month' | 'all' = 'week') {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, [timeframe]);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workouts?timeframe=${timeframe}`);
      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<WorkoutLog, 'id'>) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });
      if (!response.ok) throw new Error('Failed to add workout');
      fetchWorkouts(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add workout');
      throw err;
    }
  };

  return { workouts, isLoading, error, addWorkout, refreshWorkouts: fetchWorkouts };
}