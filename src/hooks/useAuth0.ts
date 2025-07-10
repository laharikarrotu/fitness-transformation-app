'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { FitnessUser, UserProfile } from '@/lib/auth0/config';

export function useAuth0() {
  const { user, error, isLoading } = useUser();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Convert Auth0 user to our FitnessUser format
  const fitnessUser: FitnessUser | null = user ? {
    id: user.sub || '',
    email: user.email || '',
    name: user.name || '',
    avatar: user.picture || undefined,
    preferences: {
      weight: (user as UserProfile)['https://fitness-app.com/preferences']?.weight || 0,
      height: (user as UserProfile)['https://fitness-app.com/preferences']?.height || 0,
      age: (user as UserProfile)['https://fitness-app.com/preferences']?.age || 0,
      fitnessLevel: (user as UserProfile)['https://fitness-app.com/preferences']?.fitnessLevel || 'beginner',
      goals: (user as UserProfile)['https://fitness-app.com/preferences']?.goals || []
    },
    createdAt: new Date(user.updated_at || Date.now()),
    updatedAt: new Date(user.updated_at || Date.now())
  } : null;

  // Update user profile preferences
  const updateProfile = async (preferences: Partial<FitnessUser['preferences']>) => {
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'https://fitness-app.com/preferences': {
            ...fitnessUser?.preferences,
            ...preferences
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh the page to get updated user data
      window.location.reload();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return {
    user: fitnessUser,
    auth0User: user,
    error,
    isLoading,
    isUpdatingProfile,
    updateProfile
  };
} 