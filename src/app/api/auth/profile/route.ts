import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { updateUserPreferences, getUserByAuth0Id } from '@/lib/aws/users';
import { isAWSConfigured } from '@/lib/aws/config';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAWSConfigured()) {
      return NextResponse.json({ error: 'AWS not configured' }, { status: 500 });
    }
    const body = await request.json();
    const { name, avatar, preferences } = body;
    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Only update specific fields
    const updatedUser = await updateUserPreferences(user.id, {
      ...(preferences && { ...preferences }),
      ...(name && { name }),
      ...(avatar && { avatar })
    });
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 