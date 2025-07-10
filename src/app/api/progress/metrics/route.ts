import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserMetrics, addUserMetric } from '@/lib/aws/progress';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userMetrics = await getUserMetrics(session.user.sub);
    return NextResponse.json(userMetrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const newMetric = { ...body, userId: session.user.sub, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
    await addUserMetric(session.user.sub, newMetric);
    return NextResponse.json(newMetric);
  } catch (error) {
    console.error('Error adding metric:', error);
    return NextResponse.json({ error: 'Failed to add metric' }, { status: 500 });
  }
} 