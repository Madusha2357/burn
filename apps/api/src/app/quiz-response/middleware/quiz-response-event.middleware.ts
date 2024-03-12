import { Injectable, NestMiddleware } from '@nestjs/common';
import { TriggerEventService } from '../../trigger-event/services/trigger-event.service';
import { NextFunction, Request, Response } from 'express';
import { EventType } from '@damen/models';

@Injectable()
export class QuizResponseEventMiddleware implements NestMiddleware {
  constructor(private eventService: TriggerEventService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.eventService.generateThenCreate(req, res, EventType.QUIZ_RESPONSE);
    next();
  }
}
