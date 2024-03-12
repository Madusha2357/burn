import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, ProjectionEventDataTable } from '@damen/models';
import { Observable } from 'rxjs';

export abstract class EventService {
  abstract triggerEvent(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionEventDataTable>>;

  abstract getSse(): Observable<MessageEvent>;
}
