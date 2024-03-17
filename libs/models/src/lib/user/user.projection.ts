import { BaseId, BaseTime, BaseUser } from '../_base/base';
import { Address } from './user-address';
import { Role } from './user-role.enum';
import { UserStatus } from './user.enum';

export class ProjectionUserDataTableQuery {
  _id = true;
  email = true;
  firstName = true;
  lastName = true;
  phoneNumber = true;
  registerCode = true;
  status = true;
  roles = true;
  createdBy = true;
  modifiedBy = true;
  createdAt = true;
  modifiedAt = true;
  address = true;
  isUpdate = true;
  allowMarketingMails = true;
  isDeleted = true;
  company = true;
  notification = true;
  role = true;
}

export interface ProjectionUserDataTable extends BaseUser, BaseTime, BaseId {
  email?: string;
  status?: UserStatus;
  roles?: Role[];
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: Address;
  registerCode?: string;
  isDeleted?: boolean;
}

export class ProjectionUserBasic {
  _id = true;
  firstName = true;
  lastName = true;
  address = true;
  status = true;
}
