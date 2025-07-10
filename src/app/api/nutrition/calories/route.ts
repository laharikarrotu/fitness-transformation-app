import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserMealsForRange } from '@/lib/aws/nutrition';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10);
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const startDate = start.toISOString().slice(0, 10);
    const meals = await getUserMealsForRange(session.user.sub, startDate, endDate);
    // Aggregate calories
    let todayCalories = 0;
    let weekCalories = 0;
    const recentMeals = [];
    const history: { date: string, calories: number, goal: number }[] = [];
    const goal = 2200; // TODO: fetch from user preferences
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayMeals = meals.filter(m => m.date === dateStr);
      const dayCalories = dayMeals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
      history.push({ date: dateStr, calories: dayCalories, goal });
      weekCalories += dayCalories;
      if (dateStr === endDate) todayCalories = dayCalories;
      if (dayMeals.length) {
        for (const m of dayMeals) {
          recentMeals.push({ id: m.id, name: m.mealType, calories: m.totalCalories, time: m.date });
        }
      }
    }
    return NextResponse.json({ today: todayCalories, week: weekCalories, recentMeals, history });
  } catch (error) {
    console.error('Error fetching calories:', error);
    return NextResponse.json({ error: 'Failed to fetch calories' }, { status: 500 });
  }
} 