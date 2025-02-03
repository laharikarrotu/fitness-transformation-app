// src/app/api/activities/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Mock activities data
  const activities = [
    {
      id: '1',
      type: 'workout',
      title: 'Upper Body Strength',
      duration: 45,
      caloriesBurned: 320,
      date: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'run',
      title: 'Morning Run',
      duration: 30,
      caloriesBurned: 280,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    },
    {
      id: '3',
      type: 'swim',
      title: 'Pool Laps',
      duration: 40,
      caloriesBurned: 400,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: '4',
      type: 'bike',
      title: 'Evening Ride',
      duration: 60,
      caloriesBurned: 450,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ];

  return NextResponse.json(activities);
}