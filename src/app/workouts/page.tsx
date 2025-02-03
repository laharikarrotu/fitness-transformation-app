// src/app/workouts/page.tsx
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VideoFeed from '@/components/workouts/VideoFeed';
import { Container } from '@/components/layout/Container';

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
          <VideoFeed />
        </div>
      </Container>
    </>
  );
}
