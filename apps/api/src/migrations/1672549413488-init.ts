import { getDb } from '../migrations-utils/db';

const USER_COLLECTION = 'users';

export const up = async () => {
  const db = await getDb();
  const collection = db.collection(USER_COLLECTION);
  collection.insertOne({
    email: 'admin@obmdigitalfactory.com',
    password: '$2b$10$Qm2p5uXQjFuUvmriNaKHDOGZnRWIEz562qQ5Nm0BBY8J0OLl4/j0u',
    roles: ['ADMIN'],
    status: 'ACTIVE',
  });
};

export const down = async () => {
  const db = await getDb();
  db.dropCollection(USER_COLLECTION);
};
