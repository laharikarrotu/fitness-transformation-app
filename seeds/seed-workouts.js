const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    userId: { S: '1' },
    name: { S: 'Full Body Blast' },
    date: { S: new Date().toISOString() },
    exercises: { S: JSON.stringify(['Push-ups', 'Squats', 'Burpees']) },
    duration: { N: '45' },
    notes: { S: 'Great workout session!' }
  },
  {
    id: { S: '2' },
    userId: { S: '2' },
    name: { S: 'Cardio Burn' },
    date: { S: new Date().toISOString() },
    exercises: { S: JSON.stringify(['Running', 'Jump Rope']) },
    duration: { N: '30' },
    notes: { S: 'Felt energized.' }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'Workouts',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded:', item.name.S);
  }
}

seed().catch(console.error); 