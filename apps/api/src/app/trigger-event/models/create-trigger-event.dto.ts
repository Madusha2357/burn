import { DecodedPayload, EventType, RecordStatus } from '@damen/models';

export class CreateTriggerEventDto {
  type: EventType;
  name: string;
  description: string;
  payload: unknown;
  ip: string;
  user: DecodedPayload;
  url: string;
  statusCode: number;
  method: string;
  status: RecordStatus;
  device: string;
  browser: string;
}
