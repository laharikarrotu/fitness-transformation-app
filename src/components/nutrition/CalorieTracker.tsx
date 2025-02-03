// src/components/nutrition/CalorieTracker.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CalorieData {
  date: string;
  calories: number;
  goal: number;
}

export default function CalorieTracker() {
  const [calorieData, setCalorieData] = useState<CalorieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalorieData = useCallback(async () => {
    try {
      const response = await fetch('/api/nutrition/calories');
      if (!response.ok) throw new Error('Failed to fetch calorie data');
      const data = await response.json();
      setCalorieData(data);
    } catch (error) {
      console.error('Error fetching calorie data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalorieData();
  }, [fetchCalorieData]);

  const today = calorieData[calorieData.length - 1] || {
    calories: 0,
    goal: 2200
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorie Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#8884d8"
                  name="Calories Consumed"
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="#82ca9d"
                  name="Daily Goal"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Today&apos;s Calories</p>
            <p className="text-2xl font-bold">
              {today.calories} / {today.goal}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Weekly Average</p>
            <p className="text-2xl font-bold">
              {Math.round(
                calorieData
                  .slice(-7)
                  .reduce((sum, day) => sum + day.calories, 0) / 7
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}