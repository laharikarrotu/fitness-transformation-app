"use client";
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VideoFeed from '@/components/workouts/VideoFeed';
import WorkoutBuilder from '@/components/workouts/WorkoutBuilder';
import { Container } from '@/components/layout/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function WorkoutsPage() {
  return (
    <>
      <PageHeader title="Workouts">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Workout
        </Button>
      </PageHeader>
      <Container>
        <div className="py-6">
          <Tabs defaultValue="videos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos">Workout Videos</TabsTrigger>
              <TabsTrigger value="builder">Workout Builder</TabsTrigger>
            </TabsList>
            <TabsContent value="videos">
              <VideoFeed />
            </TabsContent>
            <TabsContent value="builder">
              <WorkoutBuilder />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
}
