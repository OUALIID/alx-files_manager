import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.mongoURI = `mongodb://${this.host}:${this.port}`;

    this.client = new MongoClient(this.mongoURI, { useUnifiedTopology: true });
    this.client.connect();
    this.db = this.client.db(this.database);
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.db.collection('users');
    const documentsCount = await usersCollection.countDocuments();
    return documentsCount;
  }

  async nbFiles() {
    const filesCollection = this.db.collection('files');
    const documentsCount = await filesCollection.countDocuments();
    return documentsCount;
  }
}

const redisClient = new DBClient();
export default redisClient;
