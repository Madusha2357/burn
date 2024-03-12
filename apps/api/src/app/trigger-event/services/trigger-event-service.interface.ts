import {
  DecodedPayload,
  DefaultQueryParams,
  EventType,
  ProjectionEventDataTable,
} from '@damen/models';
import { CreateTriggerEventDto } from '../models/create-trigger-event.dto';
import { TriggerEventDocument } from '../schema/trigger-event.schema';
import { TriggerEventFindAllPromise } from '../types/trigger-events.types';
import { Request, Response } from 'express';

export interface ITriggerEventService {
  /**
   * endpoint to create a new TriggerEvent
   * @param CreateTriggerEventDto
   * @param DecodedPayload
   * @returns Promise<TriggerEventDocument>
   */
  create(
    dto: CreateTriggerEventDto,
    requestUser: DecodedPayload
  ): Promise<TriggerEventDocument>;

  /**
   * get a page of TriggerEvent in the descending order of the sort field,
   * with a page size and page index
   * @param DefaultQueryParams
   * @returns TriggerEventFindAllPromise
   */
  findAll(
    queryParams: DefaultQueryParams,
    dto: ProjectionEventDataTable
  ): TriggerEventFindAllPromise;

  /**
   * find TriggerEvent by id
   * @param string
   */
  findOne(id: string): Promise<TriggerEventDocument>;

  /**
   *generate a event object and create a document in event collection
   * @param Request
   * @param Response
   * @param EventType
   */
  generateThenCreate(req: Request, res: Response, type: EventType): void;

  updates(): import('rxjs').Observable<any>;
}
