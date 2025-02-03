// src/components/nutrition/NutritionStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pizza, Apple, Beef, Fish } from 'lucide-react';

export default function NutritionStats() {
  const stats = {
    calories: {
      current: 1850,
      target: 2200,
      progress: (1850 / 2200) * 100
    },
    macros: {
      protein: { current: 95, target: 120 },
      carbs: { current: 210, target: 250 },
      fats: { current: 55, target: 70 }
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Calories</p>
                <p className="text-2xl font-bold">
                  {stats.calories.current} / {stats.calories.target}
                </p>
              </div>
              <Pizza className="w-8 h-8 text-orange-500" />
            </div>
            <Progress value={stats.calories.progress} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Beef className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Protein</p>
                  <p className="text-lg">{stats.macros.protein.current}g</p>
                </div>
              </div>
              <Progress 
                value={(stats.macros.protein.current / stats.macros.protein.target) * 100} 
                className="w-24 mt-2"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Apple className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Carbs</p>
                  <p className="text-lg">{stats.macros.carbs.current}g</p>
                </div>
              </div>
              <Progress 
                value={(stats.macros.carbs.current / stats.macros.carbs.target) * 100} 
                className="w-24 mt-2"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Fish className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Fats</p>
                  <p className="text-lg">{stats.macros.fats.current}g</p>
                </div>
              </div>
              <Progress 
                value={(stats.macros.fats.current / stats.macros.fats.target) * 100} 
                className="w-24 mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}