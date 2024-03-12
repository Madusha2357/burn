import {
  ICreateUserDto,
  Role,
  UpdateUserDto,
  UserStatus,
  Credentials,
  ProjectionUserDataTable,
} from '@damen/models';

export const USER_ADMIN: ICreateUserDto = {
  email: 'admin@example.com',
  password: 'abc@123',
  status: UserStatus.ACTIVE,
  registerCode: '123456',
  firstName: 'Super',
  lastName: 'Admin',
  roles: [Role.ADMIN],
};

export const STANDARD_USER: ICreateUserDto = {
  email: 'user@obmdigitalfactory.com',
  password: 'abc@123',
  status: UserStatus.ACTIVE,
  registerCode: '123456',
  firstName: 'Standard',
  lastName: 'User',
  roles: [Role.USER],
};

export const FIRST_LAST_NAME: UpdateUserDto = {
  firstName: 'FirstName',
  lastName: 'LastName',
};

export const PATCH_ROLE_ADMIN: UpdateUserDto = {
  roles: [Role.ADMIN],
};

export const CHANGE_PASSWORD_DTO: Credentials = {
  username: '',
  password: 'hello@123',
};

export function createMockUsers(userCount: number) {
  const users: ICreateUserDto[] = [];
  for (let index = 0; index < userCount; index++) {
    const user = { ...STANDARD_USER };
    user.email = `${user.email}${index}`;
    user.registerCode = `${user.registerCode}${index}`;
    users.push(user);
  }
  return users;
}

export const USER_PAYLOARD: ICreateUserDto = {
  email: 'user@example.com',
  firstName: 'user1',
  lastName: 'user2',
  password: 'password123',
  registerCode: '123456',
};

export const USER_ERROR_PAYLOARD: ICreateUserDto = {
  email: 'user@example.com',
  firstName: '',
  lastName: 'user2',
  password: 'password123',
  registerCode: '123456',
};

export const USER_DATA_TABLE: ProjectionUserDataTable = {
  _id: 'id',
  email: 'user@example.com',
  firstName: 'first',
  lastName: 'last',
  registerCode: '123456',
};
