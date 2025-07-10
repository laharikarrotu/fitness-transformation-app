"use client";
import { useAuth0 } from '@/hooks/useAuth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
// src/app/progress/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProgressChart from '@/components/progress/ProgressChart';
import PhotoProgress from '@/components/progress/PhotoProgress';
import MeasurementsLog from '@/components/progress/MeasurementsLog';
import GoalTracking from '@/components/progress/GoalTracking';
import ProgressDashboard from '@/components/progress/ProgressDashboard';

export default function ProgressPage() {
  const { user, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-blue/10 via-fitness-green/10 to-fitness-accent/10 space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-4xl font-extrabold text-fitness-blue drop-shadow-sm">Progress Tracking</h1>
          <p className="text-fitness-dark dark:text-fitness-light text-lg mt-1 font-medium">Every step counts. Track your journey and celebrate your wins!</p>
        </div>
        <Button className="bg-fitness-green hover:bg-fitness-blue text-white shadow-fitness px-6 py-2 rounded-full font-bold flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Log Progress
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProgressDashboard />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressChart />
            <GoalTracking />
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <PhotoProgress />
        </TabsContent>

        <TabsContent value="measurements">
          <MeasurementsLog />
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            <GoalTracking />
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}