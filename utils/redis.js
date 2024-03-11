// utils/redis.js
import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', console.error);
  }

  isAlive() {
    return this.client.connected;
  }
}

const redisClient = new RedisClient();
export default redisClient;
