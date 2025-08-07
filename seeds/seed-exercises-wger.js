const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = 'Exercises';

async function fetchExercises() {
  let url = 'https://wger.de/api/v2/exercise/?language=2&limit=1000';
  let allExercises = [];
  while (url) {
    const res = await fetch(url);
    const data = await res.json();
    allExercises = allExercises.concat(data.results);
    url = data.next; // pagination
  }
  return allExercises;
}

async function seedDynamoDB(exercises) {
  for (const exercise of exercises) {
    // Only add exercises with a name and description
    if (!exercise.name || !exercise.description) continue;
    const item = {
      id: { N: String(exercise.id) },
      name: { S: exercise.name },
      description: { S: exercise.description },
      category: { S: String(exercise.category) },
      muscles: { S: JSON.stringify(exercise.muscles) },
      muscles_secondary: { S: JSON.stringify(exercise.muscles_secondary) },
      equipment: { S: JSON.stringify(exercise.equipment) },
    };
    const command = new PutItemCommand({ TableName: TABLE_NAME, Item: item });
    try {
      await client.send(command);
      console.log(`Seeded: ${exercise.name}`);
    } catch (err) {
      console.error(`Failed to seed ${exercise.name}:`, err);
    }
  }
}

(async () => {
  const exercises = await fetchExercises();
  console.log(`Fetched ${exercises.length} exercises.`);
  await seedDynamoDB(exercises);
  console.log('Seeding complete!');
})(); 