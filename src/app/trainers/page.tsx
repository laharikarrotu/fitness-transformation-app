"use client";
import { useAuth0 } from '@/hooks/useAuth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrainerProfile from '@/components/trainers/TrainerProfile';
import ClientManagement from '@/components/trainers/ClientManagement';
import TrainerNetworking from '@/components/trainers/TrainerNetworking';

export default function TrainersPage() {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-fitness-blue drop-shadow-sm">Trainer Dashboard</h1>
          <p className="text-fitness-dark dark:text-fitness-light text-lg mt-1 font-medium">Connect, manage, and grow as a fitness professional!</p>
        </div>
      </div>
      <Tabs defaultValue="profile" className="space-y-6 animate-slide-up">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <TrainerProfile />
        </TabsContent>

        <TabsContent value="clients">
          <ClientManagement />
        </TabsContent>

        <TabsContent value="networking">
          <TrainerNetworking />
        </TabsContent>
      </Tabs>
    </div>
  );
} 