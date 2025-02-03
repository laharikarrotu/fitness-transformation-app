// src/components/nutrition/MealPlanner.tsx
'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import type { MealLog } from '@/types/nutrition';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealPlannerProps {
  initialDate?: Date;
}

export default function MealPlanner({ initialDate = new Date() }: MealPlannerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMeals = useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/nutrition/meals?date=${date.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch meals');
      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddMeal = async (mealType: MealType) => {
    try {
      const response = await fetch('/api/nutrition/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          mealType,
          foods: []
        }),
      });

      if (!response.ok) throw new Error('Failed to add meal');
      
      // Refresh meals
      fetchMeals(selectedDate);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Date selector */}
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setSelectedDate(newDate);
                fetchMeals(newDate);
              }}
              className="border rounded-md p-2"
            />
          </div>

          {/* Meal sections */}
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
            <div key={type} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="capitalize font-medium">{type}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddMeal(type)}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Food
                </Button>
              </div>

              {/* Meal items */}
              <div className="bg-gray-50 rounded-lg p-4">
                {meals.filter(meal => meal.mealType === type).length > 0 ? (
                  meals
                    .filter(meal => meal.mealType === type)
                    .map(meal => (
                      <div key={meal.id} className="space-y-2">
                        {meal.foods.map((food, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{food.name}</span>
                            <span>{food.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No items added yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}