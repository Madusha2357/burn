import { AuthorizedRequest, Role, UserStatus } from '@damen/models';

export const AUTH_USER_REQUEST = {
  user: {
    id: '63ae9271a3dd5d9a7966feb3',
    sub: 'user@example.com',
    status: UserStatus.ACTIVE,
    firstName: 'FirstName',
    lastName: 'LastName',
    roles: [Role.USER],
  },
} as AuthorizedRequest;

export const AUTH_ADMIN_REQUEST = {
  user: {
    id: '63ae9271a3dd5d9a7966feb3',
    sub: 'user@example.com',
    status: UserStatus.ACTIVE,
    firstName: 'FirstName',
    lastName: 'LastName',
    roles: [Role.ADMIN],
  },
} as AuthorizedRequest;

export const OBJECT_ID = '63a941d754198eb05af90288';
