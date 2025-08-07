const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    email: { S: 'john@example.com' },
    name: { S: 'John Doe' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
    preferences: { S: JSON.stringify({ weight: 75, height: 180, age: 30, fitnessLevel: 'intermediate', goals: ['lose weight', 'build muscle'] }) }
  },
  {
    id: { S: '2' },
    email: { S: 'jane@example.com' },
    name: { S: 'Jane Smith' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
    preferences: { S: JSON.stringify({ weight: 65, height: 165, age: 28, fitnessLevel: 'beginner', goals: ['get fit', 'run a marathon'] }) }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'Users',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded:', item.email.S);
  }
}

seed().catch(console.error); 