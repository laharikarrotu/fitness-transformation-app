"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrainerProfile from '@/components/trainers/TrainerProfile';
import ClientManagement from '@/components/trainers/ClientManagement';
import TrainerNetworking from '@/components/trainers/TrainerNetworking';

export default function TrainersPage() {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="clients">Clients</TabsTrigger>
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
  );
} 