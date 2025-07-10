import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getWorkoutVideos } from '@/lib/aws/workouts';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const videos = await getWorkoutVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching workout videos:', error);
    return NextResponse.json({ error: 'Failed to fetch workout videos' }, { status: 500 });
  }
} 