import { ChangePasswordDto } from '../login/credentials';
import { BaseUser } from '../_base/base';
import { Address } from './user-address';
import { ContactMethod } from './user-contact-method';
import { Role } from './user-role.enum';
import { UserStatus } from './user.enum';

export interface ICreateUserDto extends BaseUser {
  /**
   *  Unique email address for user
   * */
  email?: string;

  registerCode?: string;

  status?: UserStatus;
  roles?: Role[]; //by default when saving USER role is assigned
  password?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  time?: string;
  location?: ILocation;
  notification?: IDoctorNotificatoin[];
}

export interface UpdateUserDto extends BaseUser {
  status?: UserStatus;
  roles?: Role[];
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  company?: Company;
  address?: Address;
  contactMethod?: ContactMethod;
  isUpdate?: boolean;
  allowMarketingMails?: boolean;
  isDeleted?: boolean;
  role?: string;
  time?: string;
  location?: ILocation;
  email?: string;
  __v?: number;
  notification?: IDoctorNotificatoin[];
}

export class Company {
  name?: string;
  title?: string;
}

export interface UserRegistrationDto extends ChangePasswordDto {
  firstName: string;
  lastName: string;
  status: UserStatus;
  role?: string;
  time?: string;
  location?: ILocation;
}

export interface ILocation {
  lat: number;
  lon: number;
}

export interface IDoctorNotificatoin {
  level: string;
  name: string;
  url?: string;
}
