import { DecodedPayload, Role, UserStatus } from '@damen/models';

export const DECODED_PAYLOAD_STUB: DecodedPayload = {
  id: '63ae9271a3dd5d9a7966feb3',
  sub: 'user@example.com',
  status: UserStatus.ACTIVE,
  firstName: 'FirstName',
  lastName: 'LastName',
  roles: [Role.USER],
};
