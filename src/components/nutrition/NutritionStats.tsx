"use client";
// src/components/nutrition/NutritionStats.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pizza, Apple, Beef, Fish } from 'lucide-react';

export default function NutritionStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/nutrition/calories');
        if (!res.ok) throw new Error('Failed to fetch nutrition stats');
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load nutrition stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading nutrition stats...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!stats) return <div className="p-6 text-center text-lg text-gray-500">No nutrition data available.</div>;

  // Fallbacks for macros if not present
  const macros = stats.macros || {
    protein: { current: 0, target: 100 },
    carbs: { current: 0, target: 200 },
    fats: { current: 0, target: 70 }
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0 animate-fade-in">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-fitness-orange">Calories</p>
                <p className="text-2xl font-bold text-fitness-orange">
                  {stats.today} / {stats.target || 2200}
                </p>
              </div>
              <Pizza className="w-8 h-8 text-fitness-orange animate-pulse" />
            </div>
            <Progress value={((stats.today || 0) / (stats.target || 2200)) * 100} className="h-3 bg-fitness-orange/10 transition-all duration-500" aria-label="Calories Progress" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0 animate-fade-in">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Beef className="w-4 h-4 text-fitness-green" />
                <div>
                  <p className="text-sm font-medium text-fitness-green">Protein</p>
                  <p className="text-lg text-fitness-green">{macros.protein.current}g</p>
                </div>
              </div>
              <Progress 
                value={(macros.protein.current / macros.protein.target) * 100} 
                className="w-24 mt-2 h-2 bg-fitness-green/10 transition-all duration-500"
                aria-label="Protein Progress"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Apple className="w-4 h-4 text-fitness-blue" />
                <div>
                  <p className="text-sm font-medium text-fitness-blue">Carbs</p>
                  <p className="text-lg text-fitness-blue">{macros.carbs.current}g</p>
                </div>
              </div>
              <Progress 
                value={(macros.carbs.current / macros.carbs.target) * 100} 
                className="w-24 mt-2 h-2 bg-fitness-blue/10 transition-all duration-500"
                aria-label="Carbs Progress"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Fish className="w-4 h-4 text-fitness-accent" />
                <div>
                  <p className="text-sm font-medium text-fitness-accent">Fats</p>
                  <p className="text-lg text-fitness-accent">{macros.fats.current}g</p>
                </div>
              </div>
              <Progress 
                value={(macros.fats.current / macros.fats.target) * 100} 
                className="w-24 mt-2 h-2 bg-fitness-accent/10 transition-all duration-500"
                aria-label="Fats Progress"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}