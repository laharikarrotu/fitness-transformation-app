import { DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.ACTIVITIES_TABLE || 'Activities';

export async function getUserActivities(userId: string) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: {
      ':uid': { S: userId }
    }
  };
  const data = await client.send(new QueryCommand(params));
  return (data.Items || []).map(item => unmarshall(item));
}

export async function addUserActivity(userId: string, activity: any) {
  const item = {
    userId: { S: userId },
    id: { S: activity.id },
    type: { S: activity.type },
    title: { S: activity.title },
    duration: { N: activity.duration.toString() },
    caloriesBurned: { N: activity.caloriesBurned.toString() },
    date: { S: activity.date }
  };
  await client.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));
  return activity;
} 