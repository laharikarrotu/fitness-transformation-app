import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserMeals, addUserMeal } from '@/lib/aws/nutrition';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const today = new Date().toISOString().slice(0, 10);
    const meals = await getUserMeals(session.user.sub, today);
    return NextResponse.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const newMeal = {
      ...body,
      id: Date.now().toString(),
      userId: session.user.sub,
      date: new Date().toISOString().slice(0, 10)
    };
    await addUserMeal(session.user.sub, newMeal);
    return NextResponse.json(newMeal);
  } catch (error) {
    console.error('Error logging meal:', error);
    return NextResponse.json({ error: 'Failed to log meal' }, { status: 500 });
  }
} 