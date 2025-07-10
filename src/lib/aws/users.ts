import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  QueryCommand,
  DeleteCommand 
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, TABLE_NAMES } from './config';
import { FitnessUser } from '@/lib/auth0/config';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    weight: number;
    height: number;
    age: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
  };
  createdAt: string;
  updatedAt: string;
  auth0Id: string;
}

// Create or update user
export async function createOrUpdateUser(user: FitnessUser, auth0Id: string): Promise<UserRecord> {
  const userRecord: UserRecord = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    preferences: user.preferences,
    createdAt: user.createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    auth0Id,
  };

  await dynamoDocClient.send(
    new PutCommand({
      TableName: TABLE_NAMES.USERS,
      Item: userRecord,
    })
  );

  return userRecord;
}

// Get user by ID
export async function getUserById(userId: string): Promise<UserRecord | null> {
  try {
    const result = await dynamoDocClient.send(
      new GetCommand({
        TableName: TABLE_NAMES.USERS,
        Key: { id: userId },
      })
    );

    return result.Item as UserRecord || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Get user by Auth0 ID
export async function getUserByAuth0Id(auth0Id: string): Promise<UserRecord | null> {
  try {
    const result = await dynamoDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAMES.USERS,
        IndexName: 'auth0Id-index',
        KeyConditionExpression: 'auth0Id = :auth0Id',
        ExpressionAttributeValues: {
          ':auth0Id': auth0Id,
        },
      })
    );

    return result.Items?.[0] as UserRecord || null;
  } catch (error) {
    console.error('Error getting user by Auth0 ID:', error);
    return null;
  }
}

// Update user preferences
export async function updateUserPreferences(
  userId: string, 
  preferences: Partial<UserRecord['preferences']>
): Promise<UserRecord | null> {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build update expression for each preference field
    Object.entries(preferences).forEach(([key, value]) => {
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
        TableName: TABLE_NAMES.USERS,
        Key: { id: userId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as UserRecord || null;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await dynamoDocClient.send(
      new DeleteCommand({
        TableName: TABLE_NAMES.USERS,
        Key: { id: userId },
      })
    );
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
} 