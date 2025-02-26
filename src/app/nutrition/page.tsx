// src/app/nutrition/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MealPlanner from '@/components/nutrition/MealPlanner';
import RecipeSearch from '@/components/nutrition/RecipeSearch';
import CalorieTracker from '@/components/nutrition/CalorieTracker';
import NutritionStats from '@/components/nutrition/NutritionStats';

export default function NutritionPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log Meal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <NutritionStats />
      </div>

      <Tabs defaultValue="planner" className="space-y-6">
        <TabsList>
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="tracker">Calorie Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="planner">
          <MealPlanner />
        </TabsContent>

        <TabsContent value="recipes">
          <RecipeSearch />
        </TabsContent>

        <TabsContent value="tracker">
          <CalorieTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}