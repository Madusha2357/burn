import {
  ICreateUserDto,
  DecodedPayload,
  DecodeJwtToken,
  Role,
  UserStatus,
} from '@damen/models';
import { Types } from 'mongoose';
import { UserDocument } from '../../user/schema/user.schema';

export const VALID_BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInN0YXR1cyI6IkFjdGl2ZSIsImZpcnN0TmFtZSI6IkZpcnN0TmFtZSIsImxhc3ROYW1lIjoiTGFzdE5hbWUiLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iXSwiaWF0IjoxNjcyMjU5MTg4LCJleHAiOjE2NzIyNjI3ODh9.PrYdSaDr3WA6PhfRhoN6b4cVb7JvUw2VSz1JlSRuEH0';

export const INVALID_BEARER_TOKEN = 'nice';

export const INVALID_BEARER_TOKEN2 = 'Bearer wrongpayload';

export const USER_MODEL: ICreateUserDto = {
  email: 'user@gmail.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  registerCode: '123456',
  password: '$2b$10$Dy0CrKeWYSh6sFcx8.0wmu8IUh7MCNYb3AZBi21stlvGQV4zie3E6',
  roles: [Role.USER],
  status: UserStatus.ACTIVE,
};

export const USER_MODEL_2 = {
  id: '63ac3586d622ac81311f37b4',
  email: 'example@test.com',
  password: '$2b$10$Dy0CrKeWYSh6sFcx8.0wmu8IUh7MCNYb3AZBi21stlvGQV4zie3E6',
  status: UserStatus.ACTIVE,
  firstName: 'Example',
  lastName: 'Name',
  roles: ['USER', 'ADMIN'],
} as UserDocument;

export const USER_DOCUMENT_MODEL = {
  id: '63ae9271a3dd5d9a7966feb3',
  email: 'user@gmail.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  password: '$2b$10$Dy0CrKeWYSh6sFcx8.0wmu8IUh7MCNYb3AZBi21stlvGQV4zie3E6',
  roles: [Role.USER],
  status: UserStatus.ACTIVE,
} as UserDocument;

export const USER_DOCUMENT_MODEL_RESPONSE = {
  _id: new Types.ObjectId('63ae9271a3dd5d9a7966feb3'),
  email: 'user@gmail.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  password: '$2b$10$Dy0CrKeWYSh6sFcx8.0wmu8IUh7MCNYb3AZBi21stlvGQV4zie3E6',
  roles: [Role.USER],
  status: UserStatus.ACTIVE,
} as UserDocument;

export const CREATE_USER_DTO: ICreateUserDto = {
  email: 'user@gmail.com',
  password: 'abc@123',
  status: UserStatus.ACTIVE,
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: [Role.USER],
  registerCode: '123456',
};

export const PAYLOAD: DecodedPayload = {
  id: '63ae9271a3dd5d9a7966feb3',
  sub: 'user@gmail.com',
  status: UserStatus.ACTIVE,
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: [Role.USER],
};

export const JSON_PAYLOAD: DecodeJwtToken = {
  id: '63ae9271a3dd5d9a7966feb3',
  sub: 'user@gmail.com',
  status: UserStatus.ACTIVE,
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: ['USER', 'ADMIN'],
  iat: 1672230558,
  exp: 1672234158,
};

export const JSON_PAYLOAD_WITHOUT_ROLES: DecodeJwtToken = {
  id: '63ae9271a3dd5d9a7966feb3',
  sub: 'user@gmail.com',
  status: UserStatus.ACTIVE,
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: [],
  iat: 1672230558,
  exp: 1672234158,
};

export const VALID_MOCK_CONTEXT = {
  switchToHttp: () => ({
    getRequest: () => ({
      rawHeaders: [VALID_BEARER_TOKEN],
      headers: {},
      body: {},
      youGetTheIdea: {},
    }),
    getResponse: () => ({}),
  }),
};

export const INVALID_MOCK_CONTEXT = {
  switchToHttp: () => ({
    getRequest: () => ({
      rawHeaders: [],
      headers: {},
      body: {},
      youGetTheIdea: {},
    }),
    getResponse: () => ({}),
  }),
};

export const INVALID_MOCK_CONTEXT2 = {
  switchToHttp: () => ({
    getRequest: () => ({
      rawHeaders: ['test'],
      headers: {},
      body: {},
      youGetTheIdea: {},
    }),
    getResponse: () => ({}),
  }),
};
