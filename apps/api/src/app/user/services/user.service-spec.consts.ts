import {
  AuthorizedRequest,
  ICreateUserDto,
  Page,
  Role,
  UpdateUserDto,
  UserStatus,
} from '@damen/models';
import { DECODED_PAYLOAD_STUB } from '@damen/stubs';
import { User, UserDocument } from '../schema/user.schema';
import { UserService } from './user.service';

export const AUTH_ADMIN_REQUEST = {
  user: {
    id: '63ae9271a3dd5d9a7966feb3',
    sub: 'user@gmail.com',
    status: UserStatus.ACTIVE,
    firstName: 'FirstName',
    lastName: 'LastName',
    roles: [Role.ADMIN],
  },
} as AuthorizedRequest;

export const AUTH_USER_REQUEST = {
  user: {
    id: '63ae9271a3dd5d9a7966feb3',
    sub: 'user@gmail.com',
    status: UserStatus.ACTIVE,
    firstName: 'FirstName',
    lastName: 'LastName',
    roles: [Role.USER],
  },
} as AuthorizedRequest;

export const CREATE_USER_DTO: ICreateUserDto = {
  email: 'user@gmail.com',
  password: 'abc@123',
  status: UserStatus.ACTIVE,
  registerCode: 'a123456',
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: [Role.USER],
};

export const CREATE_ADMIN_USER_DTO: ICreateUserDto = {
  email: 'admin@obmdigitalfactory.com',
  password: 'abc@123',
  status: UserStatus.ACTIVE,
  registerCode: '123456',
  firstName: 'Super',
  lastName: 'Admin',
  roles: [Role.ADMIN],
};

export const UPDATE_USER_DTO: UpdateUserDto = CREATE_USER_DTO;

export const UPDATE_USER_DTO_2: UpdateUserDto = {
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: [Role.USER, Role.ADMIN],
  status: UserStatus.REGISTERED,
};

export const USER_MODEL: ICreateUserDto = {
  email: 'user@gmail.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  registerCode: '123457',
  password: 'abc@123',
  roles: [Role.USER],
  status: UserStatus.ACTIVE,
};

export const RESULT_ONE = { status: UserStatus.INACTIVE } as User;

export const USER_MODEL_2 = {
  id: '63ac3586d622ac81311f37b4',
  email: 'example@test.com',
  password: '$2b$10$Dy0CrKeWYSh6sFcx8.0wmu8IUh7MCNYb3AZBi21stlvGQV4zie3E6',
  status: UserStatus.ACTIVE,
  firstName: 'Example',
  lastName: 'Name',
  roles: ['USER', 'ADMIN'],
} as UserDocument;

export const USER_MODEL_3 = {
  id: '63aca658d622ac81311f37b7',
  email: 'user@gmail.com',
  password: '$2b$10$Dy0CrKeWYSh6sFcx8.0wmu8IUh7MCNYb3AZBi21stlvGQV4zie3E6',
  status: UserStatus.ACTIVE,
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: ['USER', 'ADMIN'],
} as UserDocument;

export const OBJECT_ID = '63a941d754198eb05af90288';

export const USER_PAGE_1_DATA: Page<UserDocument> = {
  data: [USER_MODEL_2, USER_MODEL_3],
  page: {
    length: 7,
    pageIndex: 1,
    pageSize: 5,
  },
};

export async function createMockUsers(count: number, service: UserService) {
  const createUserDto = this.CREATE_USER_DTO;
  for (let index = 0; index < count; index++) {
    createUserDto.email = index.toString() + createUserDto.email;
    await service.create(createUserDto, DECODED_PAYLOAD_STUB);
  }
}
