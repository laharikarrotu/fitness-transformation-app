import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserGoals, addUserGoal } from '@/lib/aws/goals';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const goals = await getUserGoals(session.user.sub);
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const newGoal = { ...body, id: Date.now().toString(), userId: session.user.sub };
    await addUserGoal(session.user.sub, newGoal);
    return NextResponse.json(newGoal);
  } catch (error) {
    console.error('Error adding goal:', error);
    return NextResponse.json({ error: 'Failed to add goal' }, { status: 500 });
  }
} 