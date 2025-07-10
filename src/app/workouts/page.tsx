"use client";
import { useAuth0 } from '@/hooks/useAuth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
// src/app/workouts/page.tsx
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VideoFeed from '@/components/workouts/VideoFeed';
import WorkoutBuilder from '@/components/workouts/WorkoutBuilder';
import { Container } from '@/components/layout/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function WorkoutsPage() {
  const { user, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <LoadingSpinner />;

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
