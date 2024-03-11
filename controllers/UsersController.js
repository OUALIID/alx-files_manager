import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';
const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email || !password) return response.status(400).send({ error: !email ? 'Missing email' : 'Missing password' });

    const userExists = await DBClient.db.collection('users').findOne({ email });
    if (userExists) return response.status(400).send({ error: 'Already exist' });

    const hashedPassword = sha1(password);
    const { insertedId } = await DBClient.db.collection('users').insertOne({ email, password: hashedPassword });

    return response.status(201).send({ id: insertedId, email });
  }

  static async getMe(request, response) {
    const token = request.header('X-Token') || null;
    if (!token) return response.status(401).send({ error: 'Unauthorized' });

    const userToken = await RedisClient.get(`auth_${token}`);
    if (!userToken) return response.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.db.collection('users').findOne({ _id: ObjectId(userToken) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    delete user.password;
    return response.status(200).send({ id: user._id, email: user.email });
  }
}

export default UsersController;
