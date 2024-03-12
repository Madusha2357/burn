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
  ICreateUserDto,
  Page,
  URL_USER,
  ProjectionUserDataTable,
  UpdateUserDto,
  URL_TRIGGER_EVENT,
  ProjectionEventDataTable,
  URL_DOWNLOAD,
} from '@damen/models';
import { catchError, Observable, take, tap } from 'rxjs';
import { snackBarErrorThrow } from '../../../_utils/snack-bar.utils';
import { UserService } from './user-service.abstract';

@Injectable({ providedIn: 'root' })
export class UserHttpService extends UserService {
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
      .get<Page<ProjectionEventDataTable>>(URL_TRIGGER_EVENT, { params })
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }

  findAll(data: [Sort, PageEvent]): Observable<Page<ProjectionUserDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);

    return this.httpClient
      .get<Page<ProjectionUserDataTable>>(URL_USER, { params })
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }

  override getOne(id: string): Observable<ProjectionUserDataTable> {
    return this.httpClient.get<ProjectionUserDataTable>(`${URL_USER}/${id}`);
  }

  create(data: ICreateUserDto): Observable<ProjectionUserDataTable> {
    return this.httpClient.post<ProjectionUserDataTable>(URL_USER, data).pipe(
      take(1),
      catchError((res: HttpErrorResponse) =>
        snackBarErrorThrow(res, this.matSnackBar)
      )
    );
  }

  update(id: string, data: UpdateUserDto): Observable<ProjectionUserDataTable> {
    return this.httpClient
      .patch<ProjectionUserDataTable>(`${URL_USER}/${id}`, data)
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }

  delete(id: string, data: UpdateUserDto): Observable<ProjectionUserDataTable> {
    return this.httpClient
      .patch<ProjectionUserDataTable>(`${URL_USER}/delete/${id}`, data)
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }

  findRegisteredUsers(
    user: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);
    params = params.append('user', user);

    return this.httpClient
      .get<Page<ProjectionUserDataTable>>(`${URL_USER}/filter`, { params })
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }

  sendInvitationEmail(userId: string): Observable<void> {
    return this.httpClient.post<void>(
      `${URL_USER}/${userId}/send/invitation`,
      {}
    );
  }

  downloadCsv(quizId?: string) {
    if (quizId === undefined) {
      quizId = '';
    }
    let params = new HttpParams();
    params = params.append('quizId', quizId);

    this.httpClient
      .post(`${URL_USER}/${URL_DOWNLOAD}`, {}, { responseType: 'blob', params })
      .pipe(
        tap((data) => {
          const blob: Blob = new Blob([data], { type: 'text/csv' });
          const fileName = 'user.csv';
          const objectUrl: string = URL.createObjectURL(blob);
          const a: HTMLAnchorElement = document.createElement(
            'a'
          ) as HTMLAnchorElement;

          a.href = objectUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          URL.revokeObjectURL(objectUrl);
        })
      )
      .subscribe();
  }

  getUsersByQuiz(
    id: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);
    params = params.append('quizId', id);

    return this.httpClient
      .get<Page<ProjectionUserDataTable>>(`${URL_USER}/quiz/filter`, { params })
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }
}
