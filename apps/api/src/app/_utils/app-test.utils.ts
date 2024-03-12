import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestModule } from '../app-test.module';
import { rootModule } from './mongo-test.utils';

export async function getApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppTestModule, rootModule()],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  return app;
}
