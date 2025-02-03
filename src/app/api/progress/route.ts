// src/app/api/progress/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') || 'month';

  let days = 30;
  switch (timeframe) {
    case 'week':
      days = 7;
      break;
    case 'year':
      days = 365;
      break;
  }

  // Generate mock data
  const progressData = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    
    return {
      date: date.toISOString().split('T')[0],
      weight: 80 - (Math.random() * 5), // Random weight between 75-80 kg
      measurements: {
        chest: 95 + (Math.random() * 2),
        waist: 80 - (Math.random() * 2),
        hips: 100 + (Math.random() * 2)
      }
    };
  });

  return NextResponse.json(progressData);
}