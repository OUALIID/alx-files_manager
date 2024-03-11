import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Extracting environment variables or using defaults
    const {
      DB_HOST = 'localhost',
      DB_PORT = 27017,
      DB_DATABASE = 'files_manager',
    } = process.env;

    // Constructing the MongoDB connection URI
    this.uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

    // Creating a new MongoClient instance with the constructed URI
    this.client = new MongoClient(this.uri, { useUnifiedTopology: true });
  }

  // Method to check if the MongoDB connection is alive
  async isAlive() {
    try {
      // Attempting to connect to the MongoDB server
      await this.client.connect();
      return true; // Return true if connection is successful
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return false; // Return false if connection fails
    }
  }

  // Method to get the count of documents in a specified collection
  async getCollectionCount(collectionName) {
    // Ensuring the client is connected to the MongoDB server
    await this.client.connect();

    // Getting the specified collection from the database
    const collection = this.client.db().collection(collectionName);

    // Returning the count of documents in the collection
    return collection.countDocuments();
  }

  // Method to get the number of users in the 'users' collection
  async nbUsers() {
    return this.getCollectionCount('users');
  }

  // Method to get the number of files in the 'files' collection
  async nbFiles() {
    return this.getCollectionCount('files');
  }
}

// Exporting a new instance of the DBClient class
export default new DBClient();
