import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { 
  createWorkoutPlan, 
  getUserWorkoutPlans, 
  createWorkoutSession,
  getUserWorkoutSessions 
} from '@/lib/aws/workouts';
import { isAWSConfigured } from '@/lib/aws/config';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAWSConfigured()) {
      return NextResponse.json(
        { error: 'AWS not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'plans' or 'sessions'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (type === 'sessions') {
      const sessions = await getUserWorkoutSessions(session.user.sub, limit);
      return NextResponse.json(sessions);
    } else {
      const plans = await getUserWorkoutPlans(session.user.sub);
      return NextResponse.json(plans);
    }
  } catch (error) {
    console.error('Error getting workouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAWSConfigured()) {
      return NextResponse.json(
        { error: 'AWS not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'session') {
      // Create workout session
      const workoutSession = await createWorkoutSession({
        userId: session.user.sub,
        ...data
      });
      return NextResponse.json(workoutSession);
    } else {
      // Create workout plan
      const plan = await createWorkoutPlan({
        userId: session.user.sub,
        ...data
      });
      return NextResponse.json(plan);
    }
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 