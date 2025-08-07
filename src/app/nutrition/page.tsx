"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MealPlanner from '@/components/nutrition/MealPlanner';
import RecipeSearch from '@/components/nutrition/RecipeSearch';
import CalorieTracker from '@/components/nutrition/CalorieTracker';
import NutritionStats from '@/components/nutrition/NutritionStats';
import NutritionTracker from '@/components/nutrition/NutritionTracker';

export default function NutritionPage() {
  return (
    <>
      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
        </TabsList>
        <TabsContent value="tracker">
          <NutritionTracker />
        </TabsContent>
        <TabsContent value="planner">
          <MealPlanner />
        </TabsContent>
        <TabsContent value="recipes">
          <RecipeSearch />
        </TabsContent>
      </Tabs>
      <CalorieTracker />
      <NutritionStats />
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Add Meal
      </Button>
    </>
  );
}