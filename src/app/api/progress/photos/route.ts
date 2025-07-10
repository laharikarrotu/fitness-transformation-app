import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { uploadFile, listFiles, deleteFile } from '@/lib/aws/s3';
import { isAWSConfigured, BUCKET_NAMES } from '@/lib/aws/config';

// GET: List user's progress photos
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAWSConfigured()) {
      return NextResponse.json({ error: 'AWS not configured' }, { status: 500 });
    }
    const prefix = `${session.user.sub}/`;
    const files = await listFiles('PROGRESS_PHOTOS', prefix);
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing progress photos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Upload a new progress photo
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAWSConfigured()) {
      return NextResponse.json({ error: 'AWS not configured' }, { status: 500 });
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `${session.user.sub}/${Date.now()}_${file.name}`;
    const url = await uploadFile('PROGRESS_PHOTOS', key, buffer, file.type);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading progress photo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove a progress photo
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAWSConfigured()) {
      return NextResponse.json({ error: 'AWS not configured' }, { status: 500 });
    }
    const { key } = await request.json();
    if (!key || !key.startsWith(session.user.sub)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }
    const success = await deleteFile('PROGRESS_PHOTOS', key);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting progress photo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 