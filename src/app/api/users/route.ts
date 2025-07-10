import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { createOrUpdateUser, getUserByAuth0Id, updateUserPreferences } from '@/lib/aws/users';
import { isAWSConfigured } from '@/lib/aws/config';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAWSConfigured()) {
      return NextResponse.json(
        { error: 'AWS not configured' },
        { status: 500 }
      );
    }

    const user = await getUserByAuth0Id(session.user.sub);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAWSConfigured()) {
      return NextResponse.json(
        { error: 'AWS not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { preferences } = body;

    // Create or update user in DynamoDB
    const user = await createOrUpdateUser(
      {
        id: session.user.sub,
        email: session.user.email || '',
        name: session.user.name || '',
        avatar: session.user.picture,
        preferences: session.user['https://fitness-app.com/preferences'] || {
          weight: 0,
          height: 0,
          age: 0,
          fitnessLevel: 'beginner',
          goals: []
        },
        createdAt: new Date(session.user.updated_at || Date.now()),
        updatedAt: new Date(session.user.updated_at || Date.now())
      },
      session.user.sub
    );

    // Update preferences if provided
    if (preferences) {
      await updateUserPreferences(user.id, preferences);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAWSConfigured()) {
      return NextResponse.json(
        { error: 'AWS not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { preferences } = body;

    const user = await getUserByAuth0Id(session.user.sub);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await updateUserPreferences(user.id, preferences);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 