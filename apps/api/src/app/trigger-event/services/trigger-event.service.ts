import {
  DefaultQueryParams,
  DEFAULT_PROJECTION,
  EventType,
  Page,
  PageData,
  ProjectionEventDataTable,
  ProjectionEventDataTableQuery,
} from '@damen/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Subject } from 'rxjs';
import {
  checkForNoRecordFound,
  createTriggerEvent,
} from '../../_functions/common-functions';
import { CreateTriggerEventDto } from '../models/create-trigger-event.dto';
import { DecodedPayload } from '../models/decoded-payload.dto';
import {
  TriggerEvent,
  TriggerEventDocument,
} from '../schema/trigger-event.schema';
import { TriggerEventFindAllPromise } from '../types/trigger-events.types';
import { ITriggerEventService } from './trigger-event-service.interface';

@Injectable()
export class TriggerEventService implements ITriggerEventService {
  private events = new Subject();
  private device = '';
  private browser = '';

  constructor(
    @InjectModel(TriggerEvent.name)
    private readonly repository: Model<TriggerEvent>
  ) {}

  updates(): import('rxjs').Observable<unknown> {
    return this.events.asObservable();
  }

  getDeviceName(deviceName: string, browserName: string) {
    this.device = deviceName;
    this.browser = browserName;
  }

  generateThenCreate(req: Request, res: Response, type: EventType): void {
    res.on('close', () => {
      const eventUserCreate = createTriggerEvent(
        type,
        '',
        res.statusMessage,
        req.body,
        req.ip,
        req.user as DecodedPayload,
        req.url,
        res.statusCode,
        req.method,
        this.device,
        this.browser
      );

      this.create(eventUserCreate);
    });
  }

  create(
    createTriggerEventDto: CreateTriggerEventDto
  ): Promise<TriggerEventDocument> {
    if (this.events === undefined) {
      return;
    } else {
      this.events.next('createTriggerEventDto');
    }
    return this.repository.create(createTriggerEventDto);
  }

  async findAll(
    queryParams: DefaultQueryParams,
    dto: ProjectionEventDataTable
  ): TriggerEventFindAllPromise {
    const { order, sortByField, limit, skip, projection } = queryParams;

    let length: number;
    const findQuery = this.repository.find();
    if (dto) {
      findQuery.find(dto);
      length = await this.repository.find(dto).count();
    } else {
      length = await this.repository.count();
    }
    findQuery
      .sort({ [sortByField]: order })
      .skip(skip * limit)
      .limit(limit);

    switch (projection) {
      case DEFAULT_PROJECTION: {
        findQuery.projection(new ProjectionEventDataTableQuery());
        break;
      }
    }

    const data = await findQuery;
    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return <Page<TriggerEventDocument>>{ data, page };
  }

  findOne(id: string): Promise<TriggerEventDocument> {
    const triggerEvent = this.repository
      .findOne({ _id: new ObjectId(id) })
      .exec()
      .then((d) => checkForNoRecordFound<TriggerEventDocument>(d));
    return triggerEvent;
  }
}
