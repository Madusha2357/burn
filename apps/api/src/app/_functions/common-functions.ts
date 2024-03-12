import { NotFoundException } from '@nestjs/common';
import { DecodedPayload, EventType, RecordStatus } from '@damen/models';
import { CreateTriggerEventDto } from '../trigger-event/models/create-trigger-event.dto';

/**
 * This function accepts an input of generic type T and checks if it is truthy (i.e. not null, undefined, false, etc.).
 * If the input is falsy, the function throws a NotFoundException.
 * This function can be used to check if a certain record exists in a database.
 */
export function checkForNoRecordFound<T>(input: T) {
  if (input) return input;
  else throw new NotFoundException('No Record found');
}

export function createTriggerEvent(
  type: EventType,
  name: string,
  description: string,
  payload: unknown,
  ip: string,
  user: DecodedPayload,
  url: string,
  statusCode: number,
  method: string,
  device: string,
  browser: string
) {
  const triggeredEvent = { ...new CreateTriggerEventDto() };
  triggeredEvent.type = type;
  triggeredEvent.name = name;
  triggeredEvent.description = description;
  triggeredEvent.payload = payload;
  triggeredEvent.ip = ip;
  triggeredEvent.user = user;
  triggeredEvent.url = url;
  triggeredEvent.statusCode = statusCode;
  triggeredEvent.method = method;
  triggeredEvent.status = RecordStatus.ACTIVE;
  triggeredEvent.device = device;
  triggeredEvent.browser = browser;

  return triggeredEvent;
}
