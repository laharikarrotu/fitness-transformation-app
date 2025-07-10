import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAMES } from './config';

// Upload file to S3
export async function uploadFile(
  bucket: keyof typeof BUCKET_NAMES,
  key: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAMES[bucket],
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAMES[bucket]}.s3.amazonaws.com/${key}`;
}

// Get signed URL for file upload
export async function getUploadUrl(
  bucket: keyof typeof BUCKET_NAMES,
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAMES[bucket],
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Get signed URL for file download
export async function getDownloadUrl(
  bucket: keyof typeof BUCKET_NAMES,
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAMES[bucket],
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Delete file from S3
export async function deleteFile(
  bucket: keyof typeof BUCKET_NAMES,
  key: string
): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAMES[bucket],
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
}

// List files in bucket with prefix
export async function listFiles(
  bucket: keyof typeof BUCKET_NAMES,
  prefix?: string,
  maxKeys = 100
): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAMES[bucket],
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    const result = await s3Client.send(command);
    return result.Contents?.map(obj => obj.Key || '') || [];
  } catch (error) {
    console.error('Error listing files from S3:', error);
    return [];
  }
}

// Generate unique file key
export function generateFileKey(
  userId: string,
  type: 'progress-photo' | 'workout-video' | 'profile-avatar',
  fileName: string
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  const extension = fileName.split('.').pop();
  
  return `${userId}/${type}/${timestamp}_${randomId}.${extension}`;
}

// Upload progress photo
export async function uploadProgressPhoto(
  userId: string,
  file: Buffer,
  fileName: string
): Promise<string> {
  const key = generateFileKey(userId, 'progress-photo', fileName);
  return await uploadFile('PROGRESS_PHOTOS', key, file, 'image/jpeg');
}

// Upload workout video
export async function uploadWorkoutVideo(
  userId: string,
  file: Buffer,
  fileName: string
): Promise<string> {
  const key = generateFileKey(userId, 'workout-video', fileName);
  return await uploadFile('WORKOUT_VIDEOS', key, file, 'video/mp4');
}

// Upload profile avatar
export async function uploadProfileAvatar(
  userId: string,
  file: Buffer,
  fileName: string
): Promise<string> {
  const key = generateFileKey(userId, 'profile-avatar', fileName);
  return await uploadFile('PROFILE_AVATARS', key, file, 'image/jpeg');
} 