const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    title: { S: 'Healthy Eating Guide' },
    url: { S: 'https://example.com/healthy-eating' },
    type: { S: 'article' },
    createdAt: { S: new Date().toISOString() }
  },
  {
    id: { S: '2' },
    title: { S: 'Beginner Workout Video' },
    url: { S: 'https://example.com/beginner-workout' },
    type: { S: 'video' },
    createdAt: { S: new Date().toISOString() }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'Resources',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded resource:', item.title.S);
  }
}

seed().catch(console.error); 