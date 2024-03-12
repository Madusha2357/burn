import {
  Credentials,
  DecodedPayload,
  DEFAULT_LIMIT,
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
  DEFAULT_SKIP,
  DEFAULT_SORT_BY_FIELD,
  Role,
  UpdateUserDto,
} from '@damen/models';
import { createMockUsers, DECODED_PAYLOAD_STUB } from '@damen/stubs';
import {
  ConflictException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { use } from 'passport';
import { clean, close, rootModule } from '../../_utils/mongo-test.utils';
import { User, UserDocument, UserSchema } from '../schema/user.schema';
import { UserService } from './user.service';
import * as utils from './user.service-spec.consts';

const mongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

export async function getModule() {
  return await Test.createTestingModule({
    imports: [rootModule(), mongooseModule],
    providers: [UserService],
  }).compile();
}

// describe('User Service : create', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(async () => await clean(module));
//   afterAll(async () => await close());

//   it('should create a user', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     expect(user.id).toBeDefined();
//   });

//   it('should throw an error for the same email', async () => {
//     await service.create(utils.CREATE_USER_DTO);
//     await expect(
//       async () => await service.create({ ...utils.CREATE_USER_DTO })
//     ).rejects.toThrowError(ConflictException);
//   });

//   it('should hash the password if exists', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     expect(user.password).not.toEqual(utils.CREATE_USER_DTO.password);
//   });

//   it('should create user with Role.USER only', async () => {
//     const user = await service.create(utils.CREATE_ADMIN_USER_DTO);
//     expect(user.roles).toEqual([Role.USER]);
//   });
// });

// describe('User Service : findAll', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(async () => await clean(module));
//   afterAll(async () => await close());

//   it('should return a page of users with default page options => check total data count', async () => {
//     await service.createAll(createMockUsers(10));
//     const page = await service.findAll(
//       DEFAULT_SKIP,
//       DEFAULT_LIMIT,
//       DEFAULT_SORT_BY_FIELD,
//       DEFAULT_ORDER,
//       DEFAULT_PROJECTION
//     );
//     expect(page.page.length).toBe(10);
//   });

//   it('should return a page of users with default page options => check data length with page limit', async () => {
//     await service.createAll(createMockUsers(10));
//     const page = await service.findAll(
//       DEFAULT_SKIP,
//       DEFAULT_LIMIT,
//       DEFAULT_SORT_BY_FIELD,
//       DEFAULT_ORDER,
//       DEFAULT_PROJECTION
//     );
//     expect(page.data.length).toBe(DEFAULT_LIMIT);
//   });

//   it('should return the second page of users with parameterized page options', async () => {
//     await service.createAll(createMockUsers(10));
//     const page = await service.findAll(
//       1,
//       DEFAULT_LIMIT,
//       DEFAULT_SORT_BY_FIELD,
//       DEFAULT_ORDER,
//       DEFAULT_PROJECTION
//     );
//     expect(page.page.pageIndex).toBe(1);
//   });

//   it('should return an empty page of users with not in range page options', async () => {
//     await service.createAll(createMockUsers(1));
//     const page = await service.findAll(
//       2,
//       DEFAULT_LIMIT,
//       DEFAULT_SORT_BY_FIELD,
//       DEFAULT_ORDER,
//       DEFAULT_PROJECTION
//     );
//     expect(page.data.length).toBe(0);
//   });
// });

describe('User Service : findOne', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<UserService>(UserService);
  });

  afterEach(async () => await clean(module));
  afterAll(async () => {
    await close();
    await module.close();
  });

  it('should return a user with valid id, and requested user is an ADMIN role', async () => {
    const user = await service.create(
      { ...utils.CREATE_USER_DTO },
      DECODED_PAYLOAD_STUB
    );
    // const oneUser = await service.findOne(
    //   user.id,
    //   utils.AUTH_ADMIN_REQUEST.user
    // );
    // expect(oneUser.email).toBe(user.email);
  });
  // it('should return the requested user when the requested user is an USER role', async () => {
  //   const user = await service.create(utils.CREATE_ADMIN_USER_DTO);
  //   const user2 = await service.create(utils.CREATE_USER_DTO);
  //   const decodedPayload: DecodedPayload = {
  //     id: user2.id.toString(),
  //     status: user2.status,
  //     sub: user2.email,
  //     firstName: user2.firstName,
  //     lastName: user2.lastName,
  //     roles: user2.roles,
  //   };
  //   const oneUser = (await service.findOne(
  //     user.id,
  //     decodedPayload
  //   )) as UserDocument;
  //   expect(oneUser.id.toString()).not.toEqual(user.id);
  // });
  // it('should return the UnauthorizedException error when the requested user id is invalid', async () => {
  //   await expect(
  //     async () =>
  //       await service.findOne(utils.OBJECT_ID, utils.AUTH_ADMIN_REQUEST.user)
  //   ).rejects.toThrow(UnauthorizedException);
  // });
});

// describe('User Service : findOneByEmail', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(async () => await clean(module));
//   afterAll(async () => await close());

//   it('should return a user with valid email', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const oneUser = await service.findOneByEmail('user@gmail.com');
//     expect(oneUser.email).toBe(user.email);
//   });

//   it('should return a user with invalid email', async () => {
//     expect(
//       async () => await service.findOneByEmail('user@unknown.com')
//     ).rejects.toThrow(UnauthorizedException);
//   });

//   it('should return a user with null email', async () => {
//     const email = null;
//     expect(async () => await service.findOneByEmail(email)).rejects.toThrow(
//       UnauthorizedException
//     );
//   });
//   it('should return a user with empty email', async () => {
//     const email = '';
//     expect(async () => await service.findOneByEmail(email)).rejects.toThrow(
//       UnauthorizedException
//     );
//   });
// });

// describe('User Service : update', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(async () => await clean(module));
//   afterAll(async () => await close());

//   it('should update the roles to the document; when the USER is ADMIN', async () => {
//     const adminUser = await service.create(utils.CREATE_ADMIN_USER_DTO);
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: adminUser.id.toString(),
//       status: adminUser.status,
//       sub: adminUser.email,
//       firstName: adminUser.firstName,
//       lastName: adminUser.lastName,
//       roles: [Role.ADMIN],
//     };
//     const updateUser: UpdateUserDto = { roles: [Role.ADMIN] };
//     const updatedUser = await service.update(
//       user.id.toString(),
//       updateUser,
//       decodedPayload
//     );
//     expect(updatedUser.roles).toEqual(updateUser.roles);
//   });
//   it('should update the firstName to the document; when the USER is ADMIN', async () => {
//     const adminUser = await service.create(utils.CREATE_ADMIN_USER_DTO);
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: adminUser.id.toString(),
//       status: adminUser.status,
//       sub: adminUser.email,
//       firstName: adminUser.firstName,
//       lastName: adminUser.lastName,
//       roles: [Role.ADMIN],
//     };
//     const updateUser: UpdateUserDto = { firstName: 'TestName' };
//     const updatedUser = await service.update(
//       user.id.toString(),
//       updateUser,
//       decodedPayload
//     );
//     expect(updatedUser.firstName).toEqual(updateUser.firstName);
//   });
//   it('should update the firstname in the requested same user document; when the USER has only USER role access', async () => {
//     const adminUser = await service.create(utils.CREATE_ADMIN_USER_DTO);
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: user.id.toString(),
//       status: user.status,
//       sub: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       roles: user.roles,
//     };
//     const updateUser: UpdateUserDto = { firstName: 'hello' };
//     const updatedUser = await service.update(
//       adminUser.id.toString(),
//       updateUser,
//       decodedPayload
//     );
//     expect(updatedUser.id.toString()).toEqual(decodedPayload.id.toString());
//   });
//   it('should not update the roles in the requested document; when the USER has only USER role access', async () => {
//     const adminUser = await service.create(utils.CREATE_ADMIN_USER_DTO);
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: user.id.toString(),
//       status: user.status,
//       sub: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       roles: user.roles,
//     };
//     const updateUser: UpdateUserDto = { roles: [Role.USER] };
//     const updatedUser = await service.update(
//       adminUser.id.toString(),
//       updateUser,
//       decodedPayload
//     );
//     expect(updatedUser.roles).not.toEqual(updateUser.roles);
//   });
// });

// describe('User Service : remove', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(async () => await clean(module));
//   afterAll(async () => await close());
//   it('should delete the requested document', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const deletedUser = await service.remove(user.id.toString());
//     expect(deletedUser.email).toEqual(user.email);
//   });
// });

// describe('User Service : changePassword', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(async () => await clean(module));
//   afterAll(async () => await close());
//   it('should return NotAcceptableException for empty password:=> USER Role same user', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: user.id.toString(),
//       status: user.status,
//       sub: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       roles: user.roles,
//     };
//     const credentials: Credentials = {
//       password: '',
//       username: '',
//     };
//     expect(
//       async () => await service.changePassword(credentials, decodedPayload)
//     ).rejects.toThrow(NotAcceptableException);
//   });
//   it('should return NotAcceptableException for same old password & new password:=> USER Role same user', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: user.id.toString(),
//       status: user.status,
//       sub: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       roles: user.roles,
//     };
//     const changePassword: Credentials = {
//       password: utils.CREATE_USER_DTO.password,
//       username: '',
//     };
//     expect(
//       async () => await service.changePassword(changePassword, decodedPayload)
//     ).rejects.toThrow(Error);
//   });
//   it('should return NotAcceptableException for invalid credentials:=> USER Role same user', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: utils.OBJECT_ID,
//       status: user.status,
//       sub: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       roles: user.roles,
//     };
//     const changePassword: Credentials = {
//       password: utils.CREATE_USER_DTO.password,
//       username: '',
//     };
//     expect(
//       async () => await service.changePassword(changePassword, decodedPayload)
//     ).rejects.toThrow(Error);
//   });
//   it('should change the password for a valid credentials:=> USER Role same user', async () => {
//     const user = await service.create(utils.CREATE_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: user.id.toString(),
//       status: user.status,
//       sub: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       roles: user.roles,
//     };
//     const changePassword: Credentials = {
//       password: 'abc@1234',
//       username: '',
//     };
//     const passwordChangedUser = await service.changePassword(
//       changePassword,
//       decodedPayload
//     );
//     expect(passwordChangedUser.password).not.toEqual(user.password);
//   });
//   it('should change the password for a valid credentials:=> ADMIN Role same user', async () => {
//     const userAdmin = await service.create(utils.CREATE_ADMIN_USER_DTO);
//     const decodedPayload: DecodedPayload = {
//       id: userAdmin.id.toString(),
//       status: userAdmin.status,
//       sub: userAdmin.email,
//       firstName: userAdmin.firstName,
//       lastName: userAdmin.lastName,
//       roles: userAdmin.roles,
//     };
//     const changePassword: Credentials = {
//       password: 'abc@1234',
//       username: '',
//     };
//     const passwordChangedUser = await service.changePassword(
//       changePassword,
//       decodedPayload
//     );
//     const oneUser = (await service.findOne(
//       passwordChangedUser.id.toString(),
//       decodedPayload
//     )) as UserDocument;
//     expect(oneUser.password).not.toEqual(userAdmin.password);
//   });
// });

// describe('User Service', () => {
//   let service: UserService;
//   let module: TestingModule;

//   beforeAll(async () => {
//     module = await getModule();
//     service = module.get<UserService>(UserService);
//   });

//   afterAll(async () => await close());

//   it('should be defined', () => expect(service).toBeDefined());
// });
