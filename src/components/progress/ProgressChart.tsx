// src/components/progress/ProgressChart.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { ProgressLog } from '@/types/progress';

type TimeFrame = 'week' | 'month' | 'year';

export default function ProgressChart() {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/progress/metrics');
        if (!response.ok) throw new Error('Failed to fetch progress data');
        const data = await response.json();
        // Filter for weight logs only
        const weightLogs = data.filter((m: any) => m.category === 'weight');
        // Sort by date ascending
        weightLogs.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        // Filter by timeframe
        const now = new Date();
        let filtered = weightLogs;
        if (timeframe === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          filtered = weightLogs.filter((m: any) => new Date(m.date) >= weekAgo);
        } else if (timeframe === 'month') {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          filtered = weightLogs.filter((m: any) => new Date(m.date) >= monthAgo);
        } else if (timeframe === 'year') {
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          filtered = weightLogs.filter((m: any) => new Date(m.date) >= yearAgo);
        }
        setProgressData(filtered);
      } catch (err: any) {
        setError(err.message || 'Failed to load progress data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, [timeframe]);

  const timeframes: { label: string; value: TimeFrame }[] = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Weight Progress</CardTitle>
        <div className="flex gap-2">
          {timeframes.map(({ label, value }) => (
            <Button
              key={value}
              variant={timeframe === value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(value)}
              className="transition-transform duration-200 hover:scale-105"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-fitness-blue animate-pulse">
              Loading weight progress...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : !progressData.length ? (
            <div className="flex items-center justify-center h-full text-gray-500">No weight logs found.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Weight (kg)"
                  dot={{ strokeWidth: 2 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
