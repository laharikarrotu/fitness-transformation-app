// src/app/dashboard/page.tsx
import { Dumbbell, Utensils, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RecentWorkouts from '@/components/workouts/RecentWorkouts';
import MealPlanner from '@/components/nutrition/MealPlanner';
import CalorieTracker from '@/components/nutrition/CalorieTracker';
import ProgressChart from '@/components/progress/ProgressChart';

export default function DashboardPage() {
  // This would typically fetch real data from your API
  const stats = {
    workoutsCompleted: 12,
    caloriesBurned: 3600,
    currentStreak: 5,
    monthlyGoalProgress: 65
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Workouts</p>
                <p className="text-2xl font-bold">{stats.workoutsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Utensils className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calories Burned</p>
                <p className="text-2xl font-bold">{stats.caloriesBurned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Goal</p>
                <div className="mt-2">
                  <Progress value={stats.monthlyGoalProgress} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentWorkouts />
          <CalorieTracker />
        </div>
        <div className="space-y-6">
          <MealPlanner />
          <ProgressChart />
        </div>
      </div>
    </div>
  );
}