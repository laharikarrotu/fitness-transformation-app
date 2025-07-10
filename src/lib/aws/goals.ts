import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, TABLE_NAMES } from './config';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  [key: string]: any;
}

export async function getUserGoals(userId: string): Promise<Goal[]> {
  const params = {
    TableName: TABLE_NAMES.GOALS,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: { '#userId': 'userId' },
    ExpressionAttributeValues: { ':userId': userId },
  };
  const result = await dynamoDocClient.send(new QueryCommand(params));
  return (result.Items as Goal[]) || [];
}

export async function addUserGoal(userId: string, goal: Goal) {
  await dynamoDocClient.send(
    new PutCommand({
      TableName: TABLE_NAMES.GOALS,
      Item: { ...goal, userId },
    })
  );
  return goal;
} 