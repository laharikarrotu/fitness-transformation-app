// src/hooks/useNutrition.ts
import { useState, useEffect } from 'react';
import type { MealLog } from '@/types/nutrition';

export function useNutrition(date: Date) {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
  }, [date]);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/nutrition/meals?date=${date.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch meals');
      const data = await response.json();
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
    } finally {
      setIsLoading(false);
    }
  };

  const addMeal = async (meal: Omit<MealLog, 'id'>) => {
    try {
      const response = await fetch('/api/nutrition/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal),
      });
      if (!response.ok) throw new Error('Failed to add meal');
      fetchMeals(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add meal');
      throw err;
    }
  };

  return { meals, isLoading, error, addMeal, refreshMeals: fetchMeals };
}