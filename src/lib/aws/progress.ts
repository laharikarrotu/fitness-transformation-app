import { DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PROGRESS_METRICS_TABLE || 'ProgressMetrics';

export async function getUserMetrics(userId: string) {
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

export async function addUserMetric(userId: string, metric: any) {
  const item = {
    userId: { S: userId },
    id: { S: metric.id },
    name: { S: metric.name },
    value: { N: metric.value.toString() },
    unit: { S: metric.unit },
    target: { N: metric.target.toString() },
    date: { S: metric.date },
    category: { S: metric.category }
  };
  await client.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));
  return metric;
} 