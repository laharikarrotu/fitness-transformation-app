"use client";
import { useAuth0 } from '@/hooks/useAuth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
// src/app/dashboard/page.tsx
import EnhancedDashboard from '@/components/dashboard/EnhancedDashboard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <EnhancedDashboard />
    </div>
  );
}