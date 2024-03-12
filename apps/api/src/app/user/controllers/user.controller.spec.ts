import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UserService } from '../services/user.service';
import * as userUtil from '../services/user.service-spec.consts';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: { Symbol: jest.fn() },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return page of users', async () => {
      jest
        .spyOn(userService, 'findAll')
        .mockResolvedValue(userUtil.USER_PAGE_1_DATA);
      expect(await controller.findAll({ skip: 1, limit: 5 })).toBe(
        userUtil.USER_PAGE_1_DATA
      );
    });
  });

  describe('findOne', () => {
    it('should return findOne user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(userUtil.RESULT_ONE);
      expect(
        await controller.findOne(userUtil.OBJECT_ID, userUtil.AUTH_USER_REQUEST)
      ).toBe(userUtil.RESULT_ONE);
    });
  });

  describe('update', () => {
    it('should return update user', async () => {
      const userDocument: UserDocument = { id: Types.ObjectId } as UserDocument;
      jest.spyOn(userService, 'update').mockResolvedValue(userDocument);
      expect(
        await controller.update(
          userUtil.OBJECT_ID,
          userUtil.UPDATE_USER_DTO,
          userUtil.AUTH_USER_REQUEST
        )
      ).toBe(userDocument);
    });
  });

  describe('create', () => {
    it('should return created user', async () => {
      const userDocument: UserDocument = { id: Types.ObjectId } as UserDocument;
      jest.spyOn(userService, 'create').mockResolvedValue(userDocument);
      expect(
        await controller.create(
          userUtil.CREATE_USER_DTO,
          userUtil.AUTH_USER_REQUEST
        )
      ).toBe(userDocument);
    });
  });

  describe('changePassword', () => {
    it('should return password changed user', async () => {
      const userDto = userUtil.CREATE_USER_DTO;
      const userDocument: UserDocument = { id: Types.ObjectId } as UserDocument;
      jest.spyOn(userService, 'changePassword').mockResolvedValue(userDocument);
      expect(
        await controller.changePassword(
          { username: userDto.email, password: userDto.password },
          userUtil.AUTH_USER_REQUEST
        )
      ).toBe(userDocument);
    });
  });
});
