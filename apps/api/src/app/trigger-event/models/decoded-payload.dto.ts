import { UserStatus } from '@damen/models';

export class DecodedPayload {
  id: string;
  status: UserStatus;
  sub: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
