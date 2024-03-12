import {
  applyDefaultPage,
  DefaultQueryParams,
  ProjectionEventDataTable,
  Role,
  URL_EVENT_PATH_GET,
  URL_TRIGGER_EVENT,
} from '@damen/models';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { Roles } from '../../auth/roles/role.decorator';
import { CreateTriggerEventDto } from '../models/create-trigger-event.dto';
import { TriggerEventService } from '../services/trigger-event.service';
import { ITriggerEventController } from './trigger-event-controller.interface';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller(`${URL_TRIGGER_EVENT}`)
export class TriggerEventController implements ITriggerEventController {
  constructor(private readonly triggerEventService: TriggerEventService) {}

  @Post()
  create(@Body() createTriggerEventDto: CreateTriggerEventDto) {
    return this.triggerEventService.create(createTriggerEventDto);
  }

  @Post(`/${URL_EVENT_PATH_GET}`)
  @Roles(Role.ADMIN)
  findAll(
    @Query()
    query: DefaultQueryParams,
    @Body() dto: ProjectionEventDataTable
  ) {
    query = applyDefaultPage(query);
    return this.triggerEventService.findAll(query, dto);
  }

  // @Sse('sse')
  // @Public()
  // //@Roles(Role.ADMIN)
  // sse(): Observable<unknown> {
  //   return this.triggerEventService.updates();
  // }
}
