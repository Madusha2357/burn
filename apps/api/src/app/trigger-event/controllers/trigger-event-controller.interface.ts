import { Observable } from 'rxjs';
import {
  AuthorizedRequest,
  DefaultQueryParams,
  ProjectionEventDataTable,
} from '@damen/models';
import { CreateTriggerEventDto } from '../models/create-trigger-event.dto';
import { TriggerEventDocument } from '../schema/trigger-event.schema';
import { TriggerEventFindAllPromise } from '../types/trigger-events.types';

export interface ITriggerEventController {
  /**
   * endpoint to create a new TriggerEvent
   * @param CreateTriggerEventDto
   * @param AuthorizedRequest
   * @returns Promise<TriggerEventDocument>
   */
  create(
    dto: CreateTriggerEventDto,
    req: AuthorizedRequest
  ): Promise<TriggerEventDocument>;

  /**
   * endpoint to retrive a page of TriggerEvent
   * @param DefaultQueryParams
   * consists of {skip => page no, limit => page size, sortByField => sort field, order => sort order projection => projection name },
   * @returns Promise<Page<TriggerEventDocument>>
   */
  findAll(
    query: DefaultQueryParams,
    dto: ProjectionEventDataTable
  ): TriggerEventFindAllPromise;

  /**
   * endpoint to retrive a TriggerEvent by id
   *  @param string
   * @returns Promise<TriggerEventDocument>
   */
  //findOne(id: string): Promise<TriggerEventDocument>;

  // sse(): Observable<any>;
}
