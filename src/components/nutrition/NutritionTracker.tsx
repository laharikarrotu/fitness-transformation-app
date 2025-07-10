'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Apple, 
  Plus, 
  Search, 
  Calculator,
  Target,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth0 } from '@/hooks/useAuth0';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealLog {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    foodId: string;
    food: FoodItem;
    quantity: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const SAMPLE_FOODS: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    servingSize: '100g',
    category: 'lunch'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    servingSize: '100g',
    category: 'lunch'
  },
  {
    id: '3',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    servingSize: '100g',
    category: 'lunch'
  },
  {
    id: '4',
    name: 'Oatmeal',
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    servingSize: '100g',
    category: 'breakfast'
  },
  {
    id: '5',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    servingSize: '1 medium',
    category: 'snack'
  }
];

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  fiber: 25
};

export default function NutritionTracker() {
  const { user } = useAuth0();
  const [goals, setGoals] = useState<NutritionGoals>(DEFAULT_GOALS);
  const [todayLog, setTodayLog] = useState<MealLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function fetchMeals() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/nutrition/meals');
        if (!res.ok) throw new Error('Failed to fetch meals');
        const data = await res.json();
        setTodayLog(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load meals');
      } finally {
        setLoading(false);
      }
    }
    fetchMeals();
  }, []);

  const handleAddMeal = async (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', foods: any[]) => {
    setSaving(true);
    setError(null);
    try {
      const totalCalories = foods.reduce((sum, f) => sum + f.calories * f.quantity, 0);
      const totalProtein = foods.reduce((sum, f) => sum + f.protein * f.quantity, 0);
      const totalCarbs = foods.reduce((sum, f) => sum + f.carbs * f.quantity, 0);
      const totalFat = foods.reduce((sum, f) => sum + f.fat * f.quantity, 0);
      const newMeal = {
        mealType,
        foods,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
      };
      const res = await fetch('/api/nutrition/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeal)
      });
      if (!res.ok) throw new Error('Failed to log meal');
      const saved = await res.json();
      setTodayLog((prev) => [...prev, saved]);
      setShowAddFood(false);
      setSelectedFood(null);
      setQuantity(1);
    } catch (err: any) {
      setError(err.message || 'Failed to log meal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading meals...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!todayLog.length) return <div className="p-6 text-center text-lg text-gray-500">No meals logged today.</div>;
  
  const filteredFoods = SAMPLE_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayTotals = todayLog.reduce((acc, meal) => ({
    calories: acc.calories + meal.totalCalories,
    protein: acc.protein + meal.totalProtein,
    carbs: acc.carbs + meal.totalCarbs,
    fat: acc.fat + meal.totalFat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const addFoodToMeal = () => {
    if (!selectedFood) return;

    const existingMeal = todayLog.find(meal => meal.mealType === selectedMeal);
    const foodEntry = {
      foodId: selectedFood.id,
      food: selectedFood,
      quantity
    };

    if (existingMeal) {
      // Add to existing meal
      const updatedMeal = {
        ...existingMeal,
        foods: [...existingMeal.foods, foodEntry],
        totalCalories: existingMeal.totalCalories + (selectedFood.calories * quantity),
        totalProtein: existingMeal.totalProtein + (selectedFood.protein * quantity),
        totalCarbs: existingMeal.totalCarbs + (selectedFood.carbs * quantity),
        totalFat: existingMeal.totalFat + (selectedFood.fat * quantity)
      };
      setTodayLog(todayLog.map(meal => meal.id === existingMeal.id ? updatedMeal : meal));
    } else {
      // Create new meal
      const newMeal: MealLog = {
        id: Date.now().toString(),
        date: today,
        mealType: selectedMeal,
        foods: [foodEntry],
        totalCalories: selectedFood.calories * quantity,
        totalProtein: selectedFood.protein * quantity,
        totalCarbs: selectedFood.carbs * quantity,
        totalFat: selectedFood.fat * quantity
      };
      setTodayLog([...todayLog, newMeal]);
    }

    setSelectedFood(null);
    setQuantity(1);
    setShowAddFood(false);
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    const meal = todayLog.find(m => m.id === mealId);
    if (!meal) return;

    const foodToRemove = meal.foods.find(f => f.foodId === foodId);
    if (!foodToRemove) return;

    const updatedMeal = {
      ...meal,
      foods: meal.foods.filter(f => f.foodId !== foodId),
      totalCalories: meal.totalCalories - (foodToRemove.food.calories * foodToRemove.quantity),
      totalProtein: meal.totalProtein - (foodToRemove.food.protein * foodToRemove.quantity),
      totalCarbs: meal.totalCarbs - (foodToRemove.food.carbs * foodToRemove.quantity),
      totalFat: meal.totalFat - (foodToRemove.food.fat * foodToRemove.quantity)
    };

    if (updatedMeal.foods.length === 0) {
      setTodayLog(todayLog.filter(m => m.id !== mealId));
    } else {
      setTodayLog(todayLog.map(m => m.id === mealId ? updatedMeal : m));
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Nutrition Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
          <CardDescription>Track your daily nutrition goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{todayTotals.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
              <Progress 
                value={getProgressPercentage(todayTotals.calories, goals.calories)} 
                className="mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(todayTotals.calories, goals.calories))}% of {goals.calories}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{todayTotals.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
              <Progress 
                value={getProgressPercentage(todayTotals.protein, goals.protein)} 
                className="mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(todayTotals.protein, goals.protein))}% of {goals.protein}g
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{todayTotals.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
              <Progress 
                value={getProgressPercentage(todayTotals.carbs, goals.carbs)} 
                className="mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(todayTotals.carbs, goals.carbs))}% of {goals.carbs}g
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{todayTotals.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
              <Progress 
                value={getProgressPercentage(todayTotals.fat, goals.fat)} 
                className="mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(todayTotals.fat, goals.fat))}% of {goals.fat}g
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Search and Add */}
        <Card>
          <CardHeader>
            <CardTitle>Add Food</CardTitle>
            <CardDescription>Search and add foods to your meals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Search Foods</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Meal Type</Label>
              <Select value={selectedMeal} onValueChange={(value: any) => setSelectedMeal(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedFood(food);
                    setShowAddFood(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{food.name}</h4>
                      <p className="text-sm text-gray-600">
                        {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                      </p>
                      <p className="text-xs text-gray-500">{food.servingSize}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Meals */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
            <CardDescription>Your food intake for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayLog.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No meals logged today. Add some foods to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                  const meal = todayLog.find(m => m.mealType === mealType);
                  if (!meal) return null;

                  return (
                    <div key={meal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium capitalize">{mealType}</h4>
                        <div className="text-sm text-gray-600">
                          {meal.totalCalories} cal
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {meal.foods.map((foodEntry) => (
                          <div key={foodEntry.foodId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{foodEntry.food.name}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({foodEntry.quantity}x {foodEntry.food.servingSize})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                {foodEntry.food.calories * foodEntry.quantity} cal
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFoodFromMeal(meal.id, foodEntry.foodId)}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                        <div className="grid grid-cols-3 gap-2">
                          <span>Protein: {meal.totalProtein}g</span>
                          <span>Carbs: {meal.totalCarbs}g</span>
                          <span>Fat: {meal.totalFat}g</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Food Modal */}
      {showAddFood && selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 bg-white rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add {selectedFood.name}</h3>
            <div className="space-y-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">Nutrition Info</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Calories: {selectedFood.calories * quantity}</span>
                  <span>Protein: {selectedFood.protein * quantity}g</span>
                  <span>Carbs: {selectedFood.carbs * quantity}g</span>
                  <span>Fat: {selectedFood.fat * quantity}g</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={addFoodToMeal} className="flex-1">Add to {selectedMeal}</Button>
                <Button variant="outline" onClick={() => setShowAddFood(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 