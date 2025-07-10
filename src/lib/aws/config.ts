import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

// DynamoDB Client
export const dynamoClient = new DynamoDBClient(awsConfig);
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 Client
export const s3Client = new S3Client(awsConfig);

// Table Names from Environment Variables
export const TABLE_NAMES = {
  USERS: process.env.AWS_DYNAMODB_USERS_TABLE || 'Users',
  WORKOUTS: process.env.AWS_DYNAMODB_WORKOUTS_TABLE || 'Workouts',
  PROGRESS: 'fitness-progress',
  NUTRITION: 'fitness-nutrition',
  GOALS: 'fitness-goals',
  // Trainer-related tables
  TRAINER_PROFILES: process.env.AWS_DYNAMODB_TRAINER_PROFILES_TABLE || 'TrainerProfiles',
  CLIENTS: process.env.AWS_DYNAMODB_CLIENTS_TABLE || 'Clients',
  SESSIONS: process.env.AWS_DYNAMODB_SESSIONS_TABLE || 'Sessions',
  TRAINER_CONNECTIONS: process.env.AWS_DYNAMODB_TRAINER_CONNECTIONS_TABLE || 'TrainerConnections',
  COMMUNITY_POSTS: process.env.AWS_DYNAMODB_COMMUNITY_POSTS_TABLE || 'CommunityPosts',
  RESOURCES: process.env.AWS_DYNAMODB_RESOURCES_TABLE || 'Resources',
} as const;

// S3 Bucket Names
export const BUCKET_NAMES = {
  PROGRESS_PHOTOS: process.env.AWS_S3_BUCKET_NAME || 'fitness-progress-photos',
  WORKOUT_VIDEOS: process.env.AWS_S3_BUCKET_NAME || 'fitness-workout-videos',
  PROFILE_AVATARS: process.env.AWS_S3_BUCKET_NAME || 'fitness-profile-avatars',
} as const;

// Environment check
export const isAWSConfigured = () => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  );
};

// Export the config for use in other files
export { awsConfig }; 