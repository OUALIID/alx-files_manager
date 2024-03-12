import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setExAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    this.client.on('connect', () => {
      console.error('The Redis client is connected...');
    });

    this.client.on('error', () => {
      console.error('There has been an error connecting to Redis...');
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error: Failed to get the value for key: ${key}`);
    }
    return null;
  }

  async set(key, value, duration) {
    try {
      this.setExAsync(key, duration, value);
    } catch (error) {
      console.error(`Error: Failed to set the value for key: ${key}`);
    }
  }

  async del(key) {
    try {
      this.delAsync(key);
    } catch (error) {
      console.error(`Error: Failed to delete the value for key: ${key}`);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
