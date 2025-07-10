import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, TABLE_NAMES } from './config';

export interface Meal {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: string;
  foods: Array<{
    foodId: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    quantity: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Add a meal for a user
export async function addUserMeal(userId: string, meal: Meal) {
  await dynamoDocClient.send(
    new PutCommand({
      TableName: TABLE_NAMES.NUTRITION,
      Item: { ...meal, userId },
    })
  );
  return meal;
}

// Get all meals for a user for a specific date (YYYY-MM-DD)
export async function getUserMeals(userId: string, date?: string): Promise<Meal[]> {
  const params: any = {
    TableName: TABLE_NAMES.NUTRITION,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: { '#userId': 'userId' },
    ExpressionAttributeValues: { ':userId': userId },
  };
  if (date) {
    params.KeyConditionExpression += ' AND #date = :date';
    params.ExpressionAttributeNames['#date'] = 'date';
    params.ExpressionAttributeValues[':date'] = date;
  }
  const result = await dynamoDocClient.send(new QueryCommand(params));
  return (result.Items as Meal[]) || [];
}

// Get all meals for a user in a date range (inclusive)
export async function getUserMealsForRange(userId: string, startDate: string, endDate: string): Promise<Meal[]> {
  const params = {
    TableName: TABLE_NAMES.NUTRITION,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: { '#userId': 'userId', '#date': 'date' },
    ExpressionAttributeValues: { ':userId': userId, ':start': startDate, ':end': endDate },
    FilterExpression: '#date BETWEEN :start AND :end',
  };
  const result = await dynamoDocClient.send(new QueryCommand(params));
  return (result.Items as Meal[]) || [];
} 