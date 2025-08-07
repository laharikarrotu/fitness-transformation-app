import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { generateResponse } from '@/gemini';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { command } = body;

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Context for the AI about its role
    const context = `You are a fitness assistant AI. Help the user with:
    1. Exercise recommendations and form guidance
    2. Nutrition advice and meal planning
    3. Workout scheduling and tracking
    4. Progress monitoring and motivation
    5. Health and wellness tips
    Keep responses concise, encouraging, and actionable.`;

    const prompt = `${context}\n\nUser: ${command}\nAssistant:`;
    
    try {
      const aiResponse = await generateResponse(prompt);
      return NextResponse.json({ 
        response: aiResponse,
        success: true 
      });
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      return NextResponse.json({ 
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        success: false 
      });
    }
  } catch (error) {
    console.error('Error processing voice command:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 