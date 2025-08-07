const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    name: { S: 'Alice Johnson' },
    trainerId: { S: '1' },
    goals: { S: JSON.stringify(['lose weight', 'improve stamina']) },
    progress: { S: JSON.stringify({ weightLost: 5, sessionsCompleted: 10 }) }
  },
  {
    id: { S: '2' },
    name: { S: 'Bob Lee' },
    trainerId: { S: '2' },
    goals: { S: JSON.stringify(['build muscle', 'increase flexibility']) },
    progress: { S: JSON.stringify({ weightGained: 3, sessionsCompleted: 8 }) }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'Clients',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded:', item.name.S);
  }
}

seed().catch(console.error); 