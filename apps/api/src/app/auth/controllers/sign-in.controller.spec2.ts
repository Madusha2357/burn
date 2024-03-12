import { Role, URL_SIGN_IN, UserStatus } from '@damen/models';
import { DECODED_PAYLOAD_STUB } from '@damen/stubs';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from './../auth.module';
import { AuthService } from '../services/auth.service';
import { User, UserSchema } from '../../user/schema/user.schema';
import { UserService } from '../../user/services/user.service';
import { close, rootModule } from '../../_utils/mongo-test.utils';
import { SignInController } from './sign-in.controller';

describe('SignInController', () => {
  let controller: SignInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignInController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            signIn: jest.fn(),
            decodeJwt: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SignInController>(SignInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('SingIn controller integration tests', () => {
  let app: INestApplication;
  let service: UserService;

  const mongooseModule = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
  ]);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootModule(), AuthModule, mongooseModule],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = app.get<UserService>(UserService);
    await app.init();

    await service.create(
      {
        email: 'admin@obmdigitalfactory.com',
        registerCode: '123456',
        roles: [Role.ADMIN],
        status: UserStatus.REGISTERED,
        password: 'abc@123',
      },
      DECODED_PAYLOAD_STUB
    );
  });

  afterEach(async () => {
    await app.close();
    await close();
  });

  it(`should give 401 for no payload : (POST) ${URL_SIGN_IN}`, () => {
    return request(app.getHttpServer()).post(`/${URL_SIGN_IN}`).expect(401);
  });

  it(`should give 200 for payload : (POST) ${URL_SIGN_IN}`, () => {
    return request(app.getHttpServer())
      .post(`/${URL_SIGN_IN}`)
      .set('content-type', 'application/json')
      .send({
        username: 'admin@obmdigitalfactory.com',
        password: 'abc@123',
      })
      .expect(200);
  });

  it(`should give 401 for payload with wrong password: (POST) ${URL_SIGN_IN}`, () => {
    return request(app.getHttpServer())
      .post(`/${URL_SIGN_IN}`)
      .set('content-type', 'application/json')
      .send({
        username: 'admin@obmdigitalfactory.com',
        password: 'abc@123Wrong',
      })
      .expect(401);
  });
});

describe('SingIn controller integration tests', () => {
  let app: INestApplication;
  let service: UserService;

  const mongooseModule = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
  ]);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootModule(), AuthModule, mongooseModule],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = app.get<UserService>(UserService);
    await app.init();

    await service.create(
      {
        email: 'user@obmdigitalfactory.com',
        registerCode: '123456',
        roles: [Role.USER],
        status: UserStatus.INACTIVE,
        password: 'abc@123',
      },
      DECODED_PAYLOAD_STUB
    );
  });

  afterEach(async () => {
    await app.close();
    await close();
  });

  it(`should give 401 for payload with related to inactive user: (POST) ${URL_SIGN_IN}`, () => {
    return request(app.getHttpServer())
      .post(`/${URL_SIGN_IN}`)
      .set('content-type', 'application/json')
      .send({
        username: 'user@obmdigitalfactory.com',
        password: 'abc@123',
      })
      .expect(401);
  });
});
