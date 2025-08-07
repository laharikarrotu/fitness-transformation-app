const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    name: { S: 'Push-up' },
    category: { S: 'Strength' },
    description: { S: 'A basic upper body exercise.' },
    muscles: { S: JSON.stringify(['chest', 'triceps', 'shoulders']) }
  },
  {
    id: { S: '2' },
    name: { S: 'Squat' },
    category: { S: 'Strength' },
    description: { S: 'A fundamental lower body exercise.' },
    muscles: { S: JSON.stringify(['quadriceps', 'glutes', 'hamstrings']) }
  },
  {
    id: { S: '3' },
    name: { S: 'Running' },
    category: { S: 'Cardio' },
    description: { S: 'A cardiovascular endurance exercise.' },
    muscles: { S: JSON.stringify(['legs', 'core']) }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'Exercises',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded exercise:', item.name.S);
  }
}

seed().catch(console.error);