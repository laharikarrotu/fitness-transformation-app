'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar,
  Clock,
  Flame,
  Dumbbell,
  Apple,
  Trophy,
  Award,
  Play,
  Plus
} from 'lucide-react';
import { useAuth0 } from '@/hooks/useAuth0';

interface DashboardStats {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  totalCaloriesBurned: number;
  thisWeekCalories: number;
  currentStreak: number;
  longestStreak: number;
  weightLost: number;
  goalsCompleted: number;
  totalGoals: number;
}

interface RecentActivity {
  id: string;
  type: 'workout' | 'meal' | 'progress' | 'goal';
  title: string;
  description: string;
  time: string;
  value?: string;
}

export default function EnhancedDashboard() {
  const { user } = useAuth0();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [workoutsRes, userRes, photosRes, caloriesRes, goalsRes] = await Promise.all([
          fetch('/api/workouts?type=sessions&limit=10'),
          fetch('/api/users'),
          fetch('/api/progress/photos'),
          fetch('/api/nutrition/calories'),
          fetch('/api/goals'),
        ]);
        if (!workoutsRes.ok || !userRes.ok || !photosRes.ok || !caloriesRes.ok || !goalsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const workouts = await workoutsRes.json();
        const userData = await userRes.json();
        const photos = await photosRes.json();
        const calories = await caloriesRes.json();
        const goals = await goalsRes.json();

        // Compute stats
        const thisWeekWorkouts = workouts.filter((w: any) => {
          const date = new Date(w.date || w.createdAt);
          const now = new Date();
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return date >= weekAgo && date <= now;
        });
        const totalWorkouts = workouts.length;
        const totalCaloriesBurned = workouts.reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0);
        const thisWeekCalories = thisWeekWorkouts.reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0);
        // Streaks (simplified: count consecutive days with a workout)
        let currentStreak = 0, longestStreak = 0;
        let streak = 0;
        let lastDate: Date | null = null;
        const sortedWorkouts = [...workouts].sort((a: any, b: any) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
        for (const w of sortedWorkouts) {
          const date = new Date(w.date || w.createdAt);
          if (!lastDate) {
            streak = 1;
          } else {
            const diff = (lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
            if (diff <= 1.5) {
              streak++;
            } else {
              break;
            }
          }
          lastDate = date;
        }
        currentStreak = streak;
        // Longest streak (naive, for demo)
        longestStreak = currentStreak; // TODO: improve with full streak scan
        // Weight lost (if userData has weight history)
        let weightLost = 0;
        if (userData.preferences?.weightHistory && userData.preferences.weightHistory.length > 1) {
          const wh = userData.preferences.weightHistory;
          weightLost = wh[0] - wh[wh.length - 1];
        }
        // Goals
        const goalsCompleted = goals.filter((g: any) => g.completed).length;
        const totalGoals = goals.length;
        setStats({
          totalWorkouts,
          thisWeekWorkouts: thisWeekWorkouts.length,
          totalCaloriesBurned,
          thisWeekCalories,
          currentStreak,
          longestStreak,
          weightLost,
          goalsCompleted,
          totalGoals,
        });

        // Build recent activities feed
        const activityFeed: RecentActivity[] = [];
        for (const w of workouts.slice(0, 3)) {
          activityFeed.push({
            id: w.id || w._id,
            type: 'workout',
            title: w.name || 'Workout',
            description: 'Completed workout session',
            time: w.date || w.createdAt,
            value: `${w.duration || 0} min • ${w.caloriesBurned || 0} cal`,
          });
        }
        for (const meal of calories.recentMeals?.slice(0, 2) || []) {
          activityFeed.push({
            id: meal.id,
            type: 'meal',
            title: meal.name,
            description: 'Logged meal',
            time: meal.time,
            value: `${meal.calories} cal`,
          });
        }
        for (const photo of photos.files?.slice(0, 1) || []) {
          activityFeed.push({
            id: photo.key,
            type: 'progress',
            title: 'Progress Photo',
            description: 'Uploaded a new progress photo',
            time: photo.lastModified,
            value: '',
          });
        }
        for (const g of goals.slice(0, 2)) {
          if (g.completed) {
            activityFeed.push({
              id: g.id,
              type: 'goal',
              title: 'Goal Achieved!',
              description: g.title,
              time: '',
              value: '',
            });
          }
        }
        // Sort by time (if available)
        activityFeed.sort((a, b) => {
          if (!a.time || !b.time) return 0;
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
        setActivities(activityFeed);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout': return <Dumbbell className="w-4 h-4 text-fitness-blue" />;
      case 'meal': return <Apple className="w-4 h-4 text-fitness-green" />;
      case 'progress': return <TrendingUp className="w-4 h-4 text-fitness-orange" />;
      case 'goal': return <Trophy className="w-4 h-4 text-fitness-accent" />;
      default: return <Activity className="w-4 h-4 text-fitness-green" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'workout': return 'bg-fitness-blue/10';
      case 'meal': return 'bg-fitness-green/10';
      case 'progress': return 'bg-fitness-orange/10';
      case 'goal': return 'bg-fitness-accent/10';
      default: return 'bg-fitness-green/10';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-lg text-fitness-blue animate-pulse">Loading your dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-lg text-red-500">{error}</div>;
  }
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Motivational Banner */}
      <div className="w-full rounded-xl bg-gradient-to-r from-fitness-green to-fitness-blue p-6 flex items-center justify-between shadow-fitness">
        <div className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Flame className="w-8 h-8 text-fitness-orange animate-pulse" />
          Welcome back, {user?.name || 'Fitness Warrior'}!
        </div>
        <div className="text-lg text-white font-semibold hidden md:block">
          "Every rep counts. Every day matters."
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-fitness-blue/10 rounded-lg">
                <Dumbbell className="w-6 h-6 text-fitness-blue" />
              </div>
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">This Week</p>
                <p className="text-2xl font-bold text-fitness-blue">{stats.thisWeekWorkouts} workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-fitness-orange/10 rounded-lg">
                <Flame className="w-6 h-6 text-fitness-orange" />
              </div>
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Calories Burned</p>
                <p className="text-2xl font-bold text-fitness-orange">{stats.thisWeekCalories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-fitness-green/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-fitness-green" />
              </div>
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Weight Lost</p>
                <p className="text-2xl font-bold text-fitness-green">{stats.weightLost}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-fitness-accent/10 rounded-lg">
                <Target className="w-6 h-6 text-fitness-accent" />
              </div>
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Goals</p>
                <p className="text-2xl font-bold text-fitness-accent">{stats.goalsCompleted}/{stats.totalGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
          <CardHeader>
            <CardTitle className="text-fitness-green">Progress Overview</CardTitle>
            <CardDescription className="text-fitness-dark dark:text-fitness-light">Your journey at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="font-semibold text-fitness-blue">Current Streak:</span>
              <span className="ml-2 text-2xl font-bold text-fitness-green">{stats.currentStreak} days</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-fitness-orange">Longest Streak:</span>
              <span className="ml-2 text-xl font-bold text-fitness-orange">{stats.longestStreak} days</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-fitness-accent">Total Workouts:</span>
              <span className="ml-2 text-xl font-bold text-fitness-accent">{stats.totalWorkouts}</span>
            </div>
            <Progress value={Math.min((stats.goalsCompleted / stats.totalGoals) * 100, 100)} className="h-4 bg-fitness-green/10" />
            <div className="text-sm text-fitness-dark dark:text-fitness-light mt-2">{stats.goalsCompleted} of {stats.totalGoals} goals completed</div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
          <CardHeader>
            <CardTitle className="text-fitness-blue">Recent Activity</CardTitle>
            <CardDescription className="text-fitness-dark dark:text-fitness-light">Stay on track with your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.id} className={`flex items-center gap-4 p-3 rounded-lg ${getActivityColor(activity.type)}`}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-fitness">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-fitness-dark dark:text-fitness-light">{activity.title}</div>
                    <div className="text-xs text-fitness-dark dark:text-fitness-light">{activity.description}</div>
                  </div>
                  <div className="text-xs text-fitness-dark dark:text-fitness-light text-right">
                    <div>{activity.value}</div>
                    <div className="text-[10px] text-fitness-accent">{activity.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 