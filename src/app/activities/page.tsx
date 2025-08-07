"use client";
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ActivityCalendar from '@/components/activities/ActivityCalender';
import ActivityList from '@/components/activities/ActivityList';
import { Container } from '@/components/layout/Container';

export default function ActivitiesPage() {
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