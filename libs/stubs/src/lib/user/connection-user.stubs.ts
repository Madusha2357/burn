import { ICreateUserDto, Role, UserStatus } from '@damen/models';

export const ADMIN_USER_CON: ICreateUserDto = {
  email: 'admin@obmdigitalfactory.com',
  password: '$2b$10$Qm2p5uXQjFuUvmriNaKHDOGZnRWIEz562qQ5Nm0BBY8J0OLl4/j0u',
  registerCode: '987653',
  roles: [Role.ADMIN],
  status: UserStatus.ACTIVE,
};

export const STANDARD_USER_CON: ICreateUserDto = {
  email: 'standardUser@obmdigitalfactory.com',
  password: '$2b$10$Qm2p5uXQjFuUvmriNaKHDOGZnRWIEz562qQ5Nm0BBY8J0OLl4/j0u',
  roles: [Role.USER],
  registerCode: '987654',
  status: UserStatus.ACTIVE,
};

export const USER_PASSWORD_CON = 'abc@123';
