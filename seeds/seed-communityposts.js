const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const items = [
  {
    id: { S: '1' },
    userId: { S: '1' },
    content: { S: 'Just finished a great workout!' },
    createdAt: { S: new Date().toISOString() },
    likes: { N: '5' }
  },
  {
    id: { S: '2' },
    userId: { S: '2' },
    content: { S: 'Anyone up for a running challenge?' },
    createdAt: { S: new Date().toISOString() },
    likes: { N: '3' }
  }
];

async function seed() {
  for (const item of items) {
    const command = new PutItemCommand({
      TableName: 'CommunityPosts',
      Item: item,
    });
    await client.send(command);
    console.log('Seeded post:', item.id.S);
  }
}

seed().catch(console.error); 