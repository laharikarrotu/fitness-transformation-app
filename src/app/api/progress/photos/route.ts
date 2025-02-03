// src/app/api/progress/photos/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const viewType = formData.get('viewType') as 'front' | 'side' | 'back';

    if (!photo || !viewType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
  // Here you would upload the photo and save metadata
  const photoUrl = await uploadPhoto(photo, viewType);

  return NextResponse.json({
    message: 'Photo uploaded successfully',
    photoUrl
  });
} catch (error) {
  console.error('Error uploading photo:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
}

// Mock function - replace with actual cloud storage upload
async function uploadPhoto(photo: File, viewType: string): Promise<string> {
return `/uploads/${viewType}/${photo.name}`;
}
