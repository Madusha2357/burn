import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Page,
  ProjectionQuizDataTable,
  ProjectionUserDataTable,
  URL_PATH_ACTIVE,
  URL_QUIZ,
  URL_USER,
} from '@damen/models';
import { catchError, Observable, take, throwError } from 'rxjs';
import {
  snackBarError,
  snackBarErrorThrow,
} from '../../_utils/snack-bar.utils';
import { SiteService } from './site.service.abstract';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Injectable({ providedIn: 'root' })
export class SiteHttpService extends SiteService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    super();
  }

  /**
   * calling to httpClient in back-end and it returns (Countdown Timer)
   */
  getTimer(): Observable<ProjectionQuizDataTable> {
    return this.httpClient
      .get<ProjectionQuizDataTable>(`${URL_QUIZ}/${URL_PATH_ACTIVE}`)
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          // snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  override findUserById(id: string): Observable<ProjectionUserDataTable> {
    return this.httpClient.get<ProjectionUserDataTable>(`${URL_USER}/${id}`);
  }

  findRegisteredUsers(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);
    params = params.append('event', event);

    return this.httpClient
      .get<Page<ProjectionUserDataTable>>(`${URL_USER}`, { params })
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }
}
