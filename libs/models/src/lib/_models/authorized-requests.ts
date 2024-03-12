import { Request } from 'express';
import { DecodedPayload } from '../token/decode-token';

export interface AuthorizedRequest extends Request {
  user: DecodedPayload;
}
