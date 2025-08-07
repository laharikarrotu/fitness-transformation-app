const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    clientId: { S: '1' },
    trainerId: { S: '1' },
    date: { S: new Date().toISOString() },
    type: { S: 'Personal Training' },
    notes: { S: 'Great effort today!' }
  },
  {
    id: { S: '2' },
    clientId: { S: '2' },
    trainerId: { S: '2' },
    date: { S: new Date().toISOString() },
    type: { S: 'Group Session' },
    notes: { S: 'Fun group workout.' }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'Sessions',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded:', item.type.S, 'for client', item.clientId.S);
  }
}

seed().catch(console.error); 