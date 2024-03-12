import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, ProjectionEventDataTable } from '@damen/models';
import { Observable } from 'rxjs';
import { EventService } from './trigger-event-service.abstract';

@Injectable({ providedIn: 'root' })
export class EventMockService extends EventService {
  constructor() {
    super();
  }

  getSse(): Observable<MessageEvent<any>> {
    throw new Error('Method not implemented.');
  }

  triggerEvent(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionEventDataTable>> {
    throw new Error('Method not implemented.');
  }
}
