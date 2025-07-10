import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Exercise } from '@/types/exercise';

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.EXERCISES_TABLE || 'Exercises';

export async function getExercises({
  search = '',
  muscleGroup = '',
  equipment = '',
  difficulty = '',
  limit = 20
}: {
  search?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  limit?: number;
}): Promise<Exercise[]> {
  const params: any = {
    TableName: TABLE_NAME,
    Limit: limit
  };
  // For now, use Scan and filter in-memory (for demo/small scale)
  const data = await client.send(new ScanCommand(params));
  let items = (data.Items || []).map((item) => unmarshall(item) as Exercise);
  if (search) {
    const s = search.toLowerCase();
    items = items.filter((ex) => ex.name.toLowerCase().includes(s) || (ex.description?.toLowerCase().includes(s)));
  }
  if (muscleGroup) items = items.filter((ex) => ex.muscleGroup === muscleGroup);
  if (equipment) items = items.filter((ex) => ex.equipment === equipment);
  if (difficulty) items = items.filter((ex) => ex.difficulty === difficulty);
  return items;
} 