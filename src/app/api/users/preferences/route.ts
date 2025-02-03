// src/app/api/user/preferences/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    workoutReminders: boolean;
    mealReminders: boolean;
    progressUpdates: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    distance: 'km' | 'mi';
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences: UserPreferences = {
      theme: 'system',
      notifications: {
        workoutReminders: true,
        mealReminders: true,
        progressUpdates: true
      },
      units: {
        weight: 'kg',
        height: 'cm',
        distance: 'km'
      }
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    // Here you would update the user preferences in your database
    const updatedPreferences: UserPreferences = {
      ...updates
    };

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}