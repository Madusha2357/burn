import { EventType } from '@damen/models';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TriggerEventService } from '../../trigger-event/services/trigger-event.service';

@Injectable()
export class UserEventMiddleware implements NestMiddleware {
  constructor(private eventService: TriggerEventService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.eventService.generateThenCreate(req, res, EventType.USER);
    next();
  }
}
