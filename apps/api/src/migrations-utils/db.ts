import { MongoClient } from 'mongodb';
import { environment } from '../environments/environment';

export const getDb = async () => {
  const client = await MongoClient.connect(environment.MONGODB_URI);
  return client.db();
};
