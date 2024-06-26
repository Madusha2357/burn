import {
  ICreateUserDto,
  IDoctorNotificatoin,
  ILocation,
  Role,
  UserStatus,
} from '@damen/models';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto implements ICreateUserDto {
  @IsEmail() @IsNotEmpty() email: string;
  @IsNotEmpty() registerCode: string;

  status?: UserStatus;
  roles?: Role[];
  location?: ILocation;
  time?: string[];
  phoneNumber?: string;
  timer?: string[];
  password?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  hospital?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  role?: string;
  notification?: IDoctorNotificatoin[];
}
