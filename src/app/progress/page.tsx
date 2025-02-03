// src/app/progress/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProgressChart from '@/components/progress/ProgressChart';
import PhotoProgress from '@/components/progress/PhotoProgress';
import MeasurementsLog from '@/components/progress/MeasurementsLog';
import GoalTracking from '@/components/progress/GoalTracking';

export default function ProgressPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log Progress
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

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