"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProgressChart from '@/components/progress/ProgressChart';
import PhotoProgress from '@/components/progress/PhotoProgress';
import MeasurementsLog from '@/components/progress/MeasurementsLog';
import GoalTracking from '@/components/progress/GoalTracking';
import ProgressDashboard from '@/components/progress/ProgressDashboard';

export default function ProgressPage() {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="chart">Chart</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <ProgressDashboard />
      </TabsContent>
      <TabsContent value="chart">
        <ProgressChart />
      </TabsContent>
      <TabsContent value="photos">
        <PhotoProgress />
      </TabsContent>
      <GoalTracking />
      <MeasurementsLog />
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Add Progress
      </Button>
    </Tabs>
  );
}