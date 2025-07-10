import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  QueryCommand,
  DeleteCommand,
  ScanCommand 
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, TABLE_NAMES } from './config';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const VIDEOS_TABLE = process.env.WORKOUT_VIDEOS_TABLE || 'WorkoutVideos';

export async function getWorkoutVideos() {
  const params = { TableName: VIDEOS_TABLE };
  const data = await dynamoDocClient.send(new ScanCommand(params));
  return (data.Items || []).map(item => unmarshall(item));
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface WorkoutSet {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in weeks
  exercises: WorkoutSet[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string;
  date: string;
  duration: number; // in minutes
  exercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight?: number;
      duration?: number;
      completed: boolean;
    }[];
  }[];
  notes?: string;
  rating?: number; // 1-5 stars
  createdAt: string;
}

// Create workout plan
export async function createWorkoutPlan(workoutPlan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutPlan> {
  const id = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const newWorkoutPlan: WorkoutPlan = {
    ...workoutPlan,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await dynamoDocClient.send(
    new PutCommand({
      TableName: TABLE_NAMES.WORKOUTS,
      Item: newWorkoutPlan,
    })
  );

  return newWorkoutPlan;
}

// Get workout plans for user
export async function getUserWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
  try {
    const result = await dynamoDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAMES.WORKOUTS,
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: 'begins_with(id, :workoutPrefix)',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':workoutPrefix': 'workout_',
        },
      })
    );

    return result.Items as WorkoutPlan[] || [];
  } catch (error) {
    console.error('Error getting user workout plans:', error);
    return [];
  }
}

// Get workout plan by ID
export async function getWorkoutPlanById(workoutPlanId: string): Promise<WorkoutPlan | null> {
  try {
    const result = await dynamoDocClient.send(
      new GetCommand({
        TableName: TABLE_NAMES.WORKOUTS,
        Key: { id: workoutPlanId },
      })
    );

    return result.Item as WorkoutPlan || null;
  } catch (error) {
    console.error('Error getting workout plan:', error);
    return null;
  }
}

// Update workout plan
export async function updateWorkoutPlan(
  workoutPlanId: string, 
  updates: Partial<Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt'>>
): Promise<WorkoutPlan | null> {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      const attrName = `#${key}`;
      const attrValue = `:${key}`;
      
      updateExpressions.push(`${attrName} = ${attrValue}`);
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = value;
    });

    // Add updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await dynamoDocClient.send(
      new UpdateCommand({
        TableName: TABLE_NAMES.WORKOUTS,
        Key: { id: workoutPlanId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as WorkoutPlan || null;
  } catch (error) {
    console.error('Error updating workout plan:', error);
    return null;
  }
}

// Create workout session
export async function createWorkoutSession(workoutSession: Omit<WorkoutSession, 'id' | 'createdAt'>): Promise<WorkoutSession> {
  const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const newWorkoutSession: WorkoutSession = {
    ...workoutSession,
    id,
    createdAt: now,
  };

  await dynamoDocClient.send(
    new PutCommand({
      TableName: TABLE_NAMES.WORKOUTS,
      Item: newWorkoutSession,
    })
  );

  return newWorkoutSession;
}

// Get workout sessions for user
export async function getUserWorkoutSessions(userId: string, limit = 10): Promise<WorkoutSession[]> {
  try {
    const result = await dynamoDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAMES.WORKOUTS,
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: 'begins_with(id, :sessionPrefix)',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':sessionPrefix': 'session_',
        },
        ScanIndexForward: false, // Most recent first
        Limit: limit,
      })
    );

    return result.Items as WorkoutSession[] || [];
  } catch (error) {
    console.error('Error getting user workout sessions:', error);
    return [];
  }
}

// Delete workout plan
export async function deleteWorkoutPlan(workoutPlanId: string): Promise<boolean> {
  try {
    await dynamoDocClient.send(
      new DeleteCommand({
        TableName: TABLE_NAMES.WORKOUTS,
        Key: { id: workoutPlanId },
      })
    );
    return true;
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    return false;
  }
} 