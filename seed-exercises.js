const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' }); // Change if your region is different
const dynamodb = new AWS.DynamoDB.DocumentClient();
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
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        category: exercise.category,
        equipment: exercise.equipment,
        muscles: exercise.muscles,
        muscles_secondary: exercise.muscles_secondary,
      }
    };
    try {
      await dynamodb.put(params).promise();
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