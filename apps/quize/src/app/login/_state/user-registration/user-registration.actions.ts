import { ICreateUserDto } from '@damen/models';

export class UserRegistration {
  public static readonly type = '[UserRegistration] UserRegistration';
  constructor(public dto: ICreateUserDto) {}
}
