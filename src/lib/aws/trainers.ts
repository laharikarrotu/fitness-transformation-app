import { DynamoDB } from 'aws-sdk';
import { awsConfig } from './config';

const dynamodb = new DynamoDB.DocumentClient(awsConfig);

// Trainer Profile Management
export interface TrainerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  experience: number;
  certifications: Certification[];
  specialties: string[];
  location: string;
  hourlyRate: number;
  availability: Availability[];
  rating: number;
  totalReviews: number;
  clients: number;
  isVerified: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  dateObtained: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Client Management
export interface Client {
  id: string;
  trainerId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastSession: string;
  totalSessions: number;
  status: 'active' | 'inactive' | 'pending';
  goals: string[];
  progress: ClientProgress;
  nextSession?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProgress {
  weight: number;
  weightGoal: number;
  bodyFat: number;
  bodyFatGoal: number;
  strength: {
    benchPress: number;
    squat: number;
    deadlift: number;
  };
  measurements: {
    chest: number;
    waist: number;
    arms: number;
    legs: number;
  };
}

// Session Management
export interface Session {
  id: string;
  trainerId: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'strength' | 'cardio' | 'flexibility' | 'nutrition' | 'assessment';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  exercises: SessionExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

// Networking
export interface TrainerConnection {
  id: string;
  trainerId: string;
  connectedTrainerId: string;
  status: 'pending' | 'connected' | 'blocked';
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  trainerId: string;
  trainerName: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  type: 'workout' | 'nutrition' | 'motivation' | 'education' | 'achievement';
  createdAt: string;
}

export interface Resource {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'education' | 'template';
  fileUrl?: string;
  downloads: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Trainer Profile Functions
export async function createTrainerProfile(userId: string, profileData: Partial<TrainerProfile>): Promise<TrainerProfile> {
  const now = new Date().toISOString();
  const profile: TrainerProfile = {
    id: `trainer_${userId}`,
    userId,
    name: profileData.name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    bio: profileData.bio || '',
    experience: profileData.experience || 0,
    certifications: profileData.certifications || [],
    specialties: profileData.specialties || [],
    location: profileData.location || '',
    hourlyRate: profileData.hourlyRate || 0,
    availability: profileData.availability || [],
    rating: 0,
    totalReviews: 0,
    clients: 0,
    isVerified: false,
    createdAt: now,
    updatedAt: now,
    ...profileData
  };

  await dynamodb.put({
    TableName: 'TrainerProfiles',
    Item: profile
  }).promise();

  return profile;
}

export async function getTrainerProfile(userId: string): Promise<TrainerProfile | null> {
  try {
    const result = await dynamodb.get({
      TableName: 'TrainerProfiles',
      Key: { id: `trainer_${userId}` }
    }).promise();

    return result.Item as TrainerProfile || null;
  } catch (error) {
    console.error('Error getting trainer profile:', error);
    return null;
  }
}

export async function updateTrainerProfile(userId: string, updates: Partial<TrainerProfile>): Promise<TrainerProfile> {
  const updateExpression = [];
  const expressionAttributeNames: any = {};
  const expressionAttributeValues: any = {};

  Object.keys(updates).forEach(key => {
    if (key !== 'id' && key !== 'userId' && key !== 'createdAt') {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = updates[key as keyof TrainerProfile];
    }
  });

  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const result = await dynamodb.update({
    TableName: 'TrainerProfiles',
    Key: { id: `trainer_${userId}` },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }).promise();

  return result.Attributes as TrainerProfile;
}

export async function getAllTrainers(): Promise<TrainerProfile[]> {
  try {
    const result = await dynamodb.scan({
      TableName: 'TrainerProfiles',
      FilterExpression: '#isVerified = :isVerified',
      ExpressionAttributeNames: { '#isVerified': 'isVerified' },
      ExpressionAttributeValues: { ':isVerified': true }
    }).promise();

    return result.Items as TrainerProfile[] || [];
  } catch (error) {
    console.error('Error getting all trainers:', error);
    return [];
  }
}

// Client Management Functions
export async function createClient(trainerId: string, clientData: Partial<Client>): Promise<Client> {
  const now = new Date().toISOString();
  const client: Client = {
    id: `client_${Date.now()}`,
    trainerId,
    name: clientData.name || '',
    email: clientData.email || '',
    phone: clientData.phone || '',
    joinDate: now,
    lastSession: '',
    totalSessions: 0,
    status: 'active',
    goals: clientData.goals || [],
    progress: clientData.progress || {
      weight: 0,
      weightGoal: 0,
      bodyFat: 0,
      bodyFatGoal: 0,
      strength: { benchPress: 0, squat: 0, deadlift: 0 },
      measurements: { chest: 0, waist: 0, arms: 0, legs: 0 }
    },
    notes: clientData.notes || '',
    createdAt: now,
    updatedAt: now
  };

  await dynamodb.put({
    TableName: 'Clients',
    Item: client
  }).promise();

  return client;
}

export async function getTrainerClients(trainerId: string): Promise<Client[]> {
  try {
    const result = await dynamodb.query({
      TableName: 'Clients',
      KeyConditionExpression: 'trainerId = :trainerId',
      ExpressionAttributeValues: { ':trainerId': trainerId }
    }).promise();

    return result.Items as Client[] || [];
  } catch (error) {
    console.error('Error getting trainer clients:', error);
    return [];
  }
}

export async function updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
  const updateExpression = [];
  const expressionAttributeNames: any = {};
  const expressionAttributeValues: any = {};

  Object.keys(updates).forEach(key => {
    if (key !== 'id' && key !== 'trainerId' && key !== 'createdAt') {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = updates[key as keyof Client];
    }
  });

  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const result = await dynamodb.update({
    TableName: 'Clients',
    Key: { id: clientId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }).promise();

  return result.Attributes as Client;
}

// Session Management Functions
export async function createSession(sessionData: Partial<Session>): Promise<Session> {
  const now = new Date().toISOString();
  const session: Session = {
    id: `session_${Date.now()}`,
    trainerId: sessionData.trainerId || '',
    clientId: sessionData.clientId || '',
    clientName: sessionData.clientName || '',
    date: sessionData.date || '',
    time: sessionData.time || '',
    duration: sessionData.duration || 60,
    type: sessionData.type || 'strength',
    status: 'scheduled',
    notes: sessionData.notes || '',
    exercises: sessionData.exercises || [],
    createdAt: now,
    updatedAt: now
  };

  await dynamodb.put({
    TableName: 'Sessions',
    Item: session
  }).promise();

  return session;
}

export async function getTrainerSessions(trainerId: string, date?: string): Promise<Session[]> {
  try {
    let params: any = {
      TableName: 'Sessions',
      KeyConditionExpression: 'trainerId = :trainerId',
      ExpressionAttributeValues: { ':trainerId': trainerId }
    };

    if (date) {
      params.FilterExpression = '#date = :date';
      params.ExpressionAttributeNames = { '#date': 'date' };
      params.ExpressionAttributeValues[':date'] = date;
    }

    const result = await dynamodb.query(params).promise();
    return result.Items as Session[] || [];
  } catch (error) {
    console.error('Error getting trainer sessions:', error);
    return [];
  }
}

export async function updateSession(sessionId: string, updates: Partial<Session>): Promise<Session> {
  const updateExpression = [];
  const expressionAttributeNames: any = {};
  const expressionAttributeValues: any = {};

  Object.keys(updates).forEach(key => {
    if (key !== 'id' && key !== 'trainerId' && key !== 'createdAt') {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = updates[key as keyof Session];
    }
  });

  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const result = await dynamodb.update({
    TableName: 'Sessions',
    Key: { id: sessionId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }).promise();

  return result.Attributes as Session;
}

// Networking Functions
export async function createConnection(trainerId: string, connectedTrainerId: string): Promise<TrainerConnection> {
  const now = new Date().toISOString();
  const connection: TrainerConnection = {
    id: `connection_${Date.now()}`,
    trainerId,
    connectedTrainerId,
    status: 'pending',
    createdAt: now
  };

  await dynamodb.put({
    TableName: 'TrainerConnections',
    Item: connection
  }).promise();

  return connection;
}

export async function getTrainerConnections(trainerId: string): Promise<TrainerConnection[]> {
  try {
    const result = await dynamodb.query({
      TableName: 'TrainerConnections',
      KeyConditionExpression: 'trainerId = :trainerId',
      ExpressionAttributeValues: { ':trainerId': trainerId }
    }).promise();

    return result.Items as TrainerConnection[] || [];
  } catch (error) {
    console.error('Error getting trainer connections:', error);
    return [];
  }
}

export async function createPost(postData: Partial<CommunityPost>): Promise<CommunityPost> {
  const now = new Date().toISOString();
  const post: CommunityPost = {
    id: `post_${Date.now()}`,
    trainerId: postData.trainerId || '',
    trainerName: postData.trainerName || '',
    content: postData.content || '',
    image: postData.image,
    likes: 0,
    comments: 0,
    shares: 0,
    tags: postData.tags || [],
    type: postData.type || 'motivation',
    createdAt: now
  };

  await dynamodb.put({
    TableName: 'CommunityPosts',
    Item: post
  }).promise();

  return post;
}

export async function getCommunityPosts(limit = 20): Promise<CommunityPost[]> {
  try {
    const result = await dynamodb.scan({
      TableName: 'CommunityPosts',
      Limit: limit
    }).promise();

    return (result.Items as CommunityPost[] || []).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting community posts:', error);
    return [];
  }
}

export async function createResource(resourceData: Partial<Resource>): Promise<Resource> {
  const now = new Date().toISOString();
  const resource: Resource = {
    id: `resource_${Date.now()}`,
    trainerId: resourceData.trainerId || '',
    title: resourceData.title || '',
    description: resourceData.description || '',
    type: resourceData.type || 'workout',
    fileUrl: resourceData.fileUrl,
    downloads: 0,
    rating: 0,
    tags: resourceData.tags || [],
    isPublic: resourceData.isPublic || false,
    createdAt: now,
    updatedAt: now
  };

  await dynamodb.put({
    TableName: 'Resources',
    Item: resource
  }).promise();

  return resource;
}

export async function getPublicResources(): Promise<Resource[]> {
  try {
    const result = await dynamodb.scan({
      TableName: 'Resources',
      FilterExpression: '#isPublic = :isPublic',
      ExpressionAttributeNames: { '#isPublic': 'isPublic' },
      ExpressionAttributeValues: { ':isPublic': true }
    }).promise();

    return result.Items as Resource[] || [];
  } catch (error) {
    console.error('Error getting public resources:', error);
    return [];
  }
} 