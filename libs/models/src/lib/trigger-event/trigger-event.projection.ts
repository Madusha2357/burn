import { DecodedPayload } from '../token/decode-token';
import { BaseId, BaseTime } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';
import { EventType } from './event-type.enum';

export class ProjectionEventDataTableQuery {
  _id = true;
  type = true;
  name = true;
  description = true;
  payload = true;
  ip = true;
  user = true;
  url = true;
  statusCode = true;
  method = true;
  status = true;
  createdAt = true;
  modifiedAt = true;
  device = true;
  browser = true;
}

export interface ProjectionEventDataTable extends BaseTime, BaseId {
  type: EventType;
  name: string;
  description: string;
  payload: unknown;
  ip: string;
  user: DecodedPayload;
  url: string;
  statusCode: number;
  method: string;
  status?: RecordStatus;
  device: string;
  browser: string;
}
