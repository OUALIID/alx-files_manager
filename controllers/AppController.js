// controllers/AppController.js
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  async getStatus(req, res) {
    try {
      const redisStatus = await redisClient.isAlive();
      const dbStatus = await dbClient.isAlive();

      console.log('Redis status:', redisStatus);
      console.log('DB status:', dbStatus);

      if (redisStatus && dbStatus) {
        return res.status(200).json({ redis: true, db: true });
      }
      throw new Error('Internal Server Error');
    } catch (error) {
      console.error('Error in getStatus:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      return res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      console.error('Error in getStats:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default AppController;
