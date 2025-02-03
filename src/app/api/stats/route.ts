// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = {
      workouts: {
        total: 0,
        thisWeek: 0,
        trend: 0
      },
      calories: {
        average: 0,
        thisWeek: 0,
        trend: 0
      },
      weight: {
        current: 0,
        change: 0,
        trend: 0
      },
      goals: {
        completed: 0,
        inProgress: 0,
        completion: 0
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}