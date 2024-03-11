const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    this.db = null;
    MongoClient.connect(`mongodb://${DB_HOST}:${DB_PORT}`, { useUnifiedTopology: true })
      .then((client) => {
        this.db = client.db(DB_DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
      });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.users ? this.users.countDocuments() : -1;
  }

  async nbFiles() {
    return this.files ? this.files.countDocuments() : -1;
  }

  async getUser(query) {
    return this.users ? this.users.findOne(query) : null;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
