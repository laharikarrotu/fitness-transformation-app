// src/components/progress/GoalTracking.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

export default function GoalTracking() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/goals');
        if (!response.ok) throw new Error('Failed to fetch goals');
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
        setError('Failed to load goals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Loading goals...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!goals?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">No goals set yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{goal.title}</h3>
              <span className="text-sm text-gray-500">
                {goal.current} / {goal.target} {goal.unit}
              </span>
            </div>
            <Progress value={calculateProgress(goal.current, goal.target)} />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Current: {goal.current}{goal.unit}</span>
              <span>
                Target: {goal.target}{goal.unit} by{' '}
                {new Date(goal.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}