import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.db = null;
    this.users = null;
    this.files = null;
    this.connectToMongoDB();
  }

  async connectToMongoDB() {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = client.db(DB_DATABASE);
      this.users = this.db.collection('users');
      this.files = this.db.collection('files');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    try {
      return await this.users.countDocuments();
    } catch (error) {
      console.error('Error counting users:', error.message);
      return 0;
    }
  }

  async nbFiles() {
    try {
      return await this.files.countDocuments();
    } catch (error) {
      console.error('Error counting files:', error.message);
      return 0;
    }
  }

  async getUser(query) {
    try {
      return await this.db.collection('users').findOne(query);
    } catch (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
