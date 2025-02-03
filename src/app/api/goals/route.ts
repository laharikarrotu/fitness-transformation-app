// src/app/api/goals/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Mock data - replace with actual database call
  const goals = [
    {
      id: '1',
      title: 'Weight Loss',
      target: 75,
      current: 80,
      unit: 'kg',
      deadline: new Date('2024-04-01')
    },
    {
      id: '2',
      title: 'Weekly Workouts',
      target: 5,
      current: 3,
      unit: 'sessions',
      deadline: new Date('2024-03-01')
    },
    {
      id: '3',
      title: 'Daily Steps',
      target: 10000,
      current: 7500,
      unit: 'steps',
      deadline: new Date('2024-03-01')
    }
  ];

  return NextResponse.json(goals);
}