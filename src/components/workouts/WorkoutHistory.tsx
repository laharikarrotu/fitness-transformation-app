// src/components/workouts/WorkoutHistory.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Dumbbell, Timer, Flame } from 'lucide-react';
import type { WorkoutLog } from '@/types/workout';

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workouts/history');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No workout history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{workout.workoutType}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(workout.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    {workout.duration} min
                  </span>
                  <span className="flex items-center">
                    <Flame className="w-4 h-4 mr-1" />
                    {workout.caloriesBurned} cal
                  </span>
                </div>
                {workout.notes && (
                  <p className="mt-2 text-sm text-gray-600">{workout.notes}</p>
                )}
              </div>
              <Dumbbell className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}