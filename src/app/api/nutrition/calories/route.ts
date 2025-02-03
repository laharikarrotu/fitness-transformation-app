// src/app/api/nutrition/calories/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Generate last 7 days of mock data
  const calorieData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    
    return {
      date: date.toISOString().split('T')[0],
      calories: Math.floor(Math.random() * (2400 - 1800 + 1) + 1800),
      goal: 2200
    };
  });

  return NextResponse.json(calorieData);
}