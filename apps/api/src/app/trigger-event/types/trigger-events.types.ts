import { Page, ProjectionEventDataTable } from '@damen/models';
import { TriggerEventDocument } from '../schema/trigger-event.schema';

export type TriggerEventFindAllPromise = Promise<
  Page<TriggerEventDocument | ProjectionEventDataTable>
>;
