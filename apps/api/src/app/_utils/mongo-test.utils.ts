import { INestApplication } from '@nestjs/common';
import {
  getConnectionToken,
  MongooseModule,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connection, disconnect } from 'mongoose';

let mongoMemoryServer: MongoMemoryServer;

export const rootModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongoMemoryServer = await MongoMemoryServer.create({
        binary: { version: '6.0.3' },
      });
      const uri = mongoMemoryServer.getUri();
      return { uri, ...options };
    },
  });

export const clean = async (module: TestingModule) => {
  const connection = module.get(getConnectionToken());
  const collections = connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const cleanApp = async (app: INestApplication) => {
  const connection = await app.get(getConnectionToken());
  const collections = connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const close = async () => {
  setTimeout(async () => {
    try {
      if (mongoMemoryServer) {
        await connection.close();
        await mongoMemoryServer.stop();
        await disconnect();
      }
    } catch (error) {
      console.error(error);
    }
  }, 900);
};
