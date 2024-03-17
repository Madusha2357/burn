import { IDoctorNotificatoin } from '../user/user';
import { UserStatus } from '../user/user.enum';

export interface DecodedPayload {
  id: string;
  status: UserStatus;
  sub: string;
  firstName: string;
  lastName: string;
  roles: string[];
  notifications?: IDoctorNotificatoin[];
}

/***
 * This type is used to store in the app state of the frontend application.
 */
export type TokenUser = DecodedPayload;

export interface DecodeJwtToken extends DecodedPayload {
  exp: number;
  iat: number;
}
