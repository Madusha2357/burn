import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import {
  Page,
  URL_TRIGGER_EVENT,
  ProjectionEventDataTable,
  URL_SSE,
  URL_EVENT_PATH_GET,
} from '@damen/models';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, take } from 'rxjs';
import { snackBarErrorThrow } from '../../../_utils/snack-bar.utils';
import { EventService } from './trigger-event-service.abstract';

@Injectable({ providedIn: 'root' })
export class EventHttpService extends EventService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar,
    private zone: NgZone
  ) {
    super();
  }

  triggerEvent(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionEventDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];
    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);

    return this.httpClient
      .post<Page<ProjectionEventDataTable>>(
        `${URL_TRIGGER_EVENT}/${URL_EVENT_PATH_GET}`,
        {
          params,
        }
      )
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }

  getSse(): Observable<MessageEvent> {
    return new Observable((ob) => {
      const eventSouce = new EventSource(
        `${environment.url}/${URL_TRIGGER_EVENT}/${URL_SSE}`
      );
      eventSouce.onmessage = (event) => {
        this.zone.run(() => ob.next(event));
      };
    });
  }
}
