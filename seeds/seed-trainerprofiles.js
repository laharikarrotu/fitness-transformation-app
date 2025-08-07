const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    name: { S: 'Coach Mike' },
    specialty: { S: 'Strength Training' },
    bio: { S: 'Certified personal trainer with 10 years of experience.' },
    clients: { S: JSON.stringify(['2']) },
    rating: { N: '4.8' }
  },
  {
    id: { S: '2' },
    name: { S: 'Coach Lisa' },
    specialty: { S: 'Cardio & Endurance' },
    bio: { S: 'Passionate about helping people achieve their fitness goals.' },
    clients: { S: JSON.stringify(['1']) },
    rating: { N: '4.9' }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'TrainerProfiles',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded:', item.name.S);
  }
}

seed().catch(console.error); 