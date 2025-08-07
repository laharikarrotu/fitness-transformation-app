// src/components/profile/UserProfile.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name || 'Profile'}
              className="w-20 h-20 rounded-full"
            />
          )}
          <div>
            <h3 className="font-medium">Name</h3>
            <p>{user.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p>{user.email}</p>
          </div>
          <Button
            onClick={() => window.location.href = '/api/auth/logout'}
            variant="outline"
          >
            Log Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}