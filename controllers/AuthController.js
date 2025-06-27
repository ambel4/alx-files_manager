import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AuthController {
  static async getConnect(req, res) {
    const Authorization = req.header('Authorization') || '';
    const b64auth = Authorization.split(' ')[1];
    if (!b64auth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedAuth = Buffer.from(b64auth, 'base64').toString('utf8');
    const [email, password] = decodedAuth.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const hashedPassword = sha1(password);
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60); // 24 hours

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const xToken = req.header('X-Token') || '';
    if (!xToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${xToken}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${xToken}`);
    return res.status(204).send();
  }
}

export default AuthController;


