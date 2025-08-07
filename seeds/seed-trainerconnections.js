const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    trainerId: { S: '1' },
    clientId: { S: '1' },
    status: { S: 'active' },
    startedAt: { S: new Date().toISOString() }
  },
  {
    id: { S: '2' },
    trainerId: { S: '2' },
    clientId: { S: '2' },
    status: { S: 'pending' },
    startedAt: { S: new Date().toISOString() }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'TrainerConnections',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded connection:', item.trainerId.S, '<->', item.clientId.S);
  }
}

seed().catch(console.error); 