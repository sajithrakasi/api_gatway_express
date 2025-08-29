import { createClient } from 'redis';
import redisclient from 'ioredis'

const client = new createClient({
  host: '127.0.0.1', 
  port: 6379, 
  db: 0, 
});

// Define the JSON object
const redisgroup = { 
  group1: [
    {
      customer_id:"101100",
      phone:"9172384712",
    },
    {
      customer_id:"261200",
      phone:"1124890",
    },
    {
      customer_id:"995501",
      phone:"1212345",
    }
  ],
  group2: [
    {
      customer_id:"979000",
      phone:"18762345",
    }
  ]
};

client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis and perform basic operations
client.connect().then(async () => {
    console.log('Connected to Redis!');

    // Set a key-value pair in Redis
    await client.set('redisgroup', JSON.stringify(redisgroup));

    // Get the value of the key from Redis
    const value = await client.get('redisgroup');
    console.log('Value from Redis:', value);

    // Close the Redis connection
    client.quit();
}).catch((err) => {
    console.error('Error connecting to Redis:', err);
}); 


