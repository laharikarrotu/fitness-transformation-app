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
  const [error, setError] = useState<string | null>(null);

  const fetchCalorieData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/nutrition/calories');
      if (!response.ok) throw new Error('Failed to fetch calorie data');
      const data = await response.json();
      setCalorieData(data.history || []);
    } catch (error: any) {
      setError(error.message || 'Failed to load calorie data');
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

  if (isLoading) {
    return <div className="flex justify-center py-8 animate-pulse text-fitness-blue">Loading calorie data...</div>;
  }
  if (error) {
    return <div className="flex justify-center py-8 text-red-500">{error}</div>;
  }
  if (!calorieData.length) {
    return <div className="flex justify-center py-8 text-gray-500">No calorie data available.</div>;
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Calorie Tracking</CardTitle>
      </CardHeader>
      <CardContent>
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
                isAnimationActive={true}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="goal"
                stroke="#82ca9d"
                name="Daily Goal"
                strokeDasharray="5 5"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
            <p className="text-sm text-blue-600">Today&apos;s Calories</p>
            <p className="text-2xl font-bold">
              {today.calories} / {today.goal}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
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