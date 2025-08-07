import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { DynamoDB } from 'aws-sdk';
import { getTrainerProfile, updateTrainerProfile, createTrainerProfile } from '@/lib/aws/trainers';

const dynamodb = new DynamoDB.DocumentClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const profile = await getTrainerProfile(session.user.sub);
    if (!profile) {
      return NextResponse.json({ error: 'Trainer profile not found' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const profile = await createTrainerProfile(session.user.sub, body);
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating trainer profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const profile = await updateTrainerProfile(userId, profileData);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating trainer profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 