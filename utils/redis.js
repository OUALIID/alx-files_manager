const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Event listener for handling errors from the Redis client
    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.connected; // Return the connection status
  }

  async get(key) {
    // Return a Promise that resolves with the value retrieved from Redis
    return new Promise((resolve) => {
      this.client.get(key, (err, reply) => {
        resolve(reply); // Resolve the Promise with the reply from Redis
      });
    });
  }

  // Method to asynchronously set a key-value pair in Redis with expiration
  async set(key, val, duration) {
    this.client.set(key, val, 'EX', duration); // Set the key-value pair with expiration
  }

  // Method to asynchronously delete a key from Redis
  async del(key) {
    this.client.del(key); // Delete the key from Redis
  }
}

// Create an instance of RedisClient and export it
const redisClient = new RedisClient();
module.exports = redisClient;
