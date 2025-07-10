"use client";
import { useAuth0 } from '@/hooks/useAuth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
// src/app/activities/page.tsx
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ActivityCalendar from '@/components/activities/ActivityCalender';
import ActivityList from '@/components/activities/ActivityList';
import { Container } from '@/components/layout/Container';

export default function ActivitiesPage() {
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
      <PageHeader title="Activities">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </PageHeader>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          <div className="lg:col-span-2">
            <ActivityList />
          </div>
          <div>
            <ActivityCalendar />
          </div>
        </div>
      </Container>
    </>
  );
}