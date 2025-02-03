// src/app/api/voice/process/route.ts
import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    // Add context for the AI about its role
    const context = `You are a fitness assistant. Help the user with:
    1. Workout recommendations
    2. Nutrition advice
    3. Progress tracking
    4. Exercise form guidance
    Keep responses concise and actionable.`;

    const prompt = `${context}\n\nUser: ${command}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error processing voice command:', error);
    return NextResponse.json(
      { error: 'Failed to process command' },
      { status: 500 }
    );
  }
}