import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import {
  ICreateQuestionDto,
  ImageUploaded,
  Page,
  ProjectionQuestionDataTable,
  URL_PATH_FIND_QUIZ_ID,
  URL_QUESTION,
} from '@damen/models';
import { catchError, Observable, take, throwError } from 'rxjs';
import {
  snackBarError,
  snackBarErrorThrow,
} from '../../../_utils/snack-bar.utils';
import { QuestionService } from './question-service.abstract';

@Injectable({ providedIn: 'root' })
export class QuestionHttpService extends QuestionService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    super();
  }

  findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionQuestionDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);

    return this.httpClient
      .get<Page<ProjectionQuestionDataTable>>(URL_QUESTION, { params })
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  findByQuizId(
    data: [Sort, PageEvent],
    quiz: string
  ): Observable<Page<ProjectionQuestionDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);
    params = params.append('quiz', quiz);

    return this.httpClient
      .get<Page<ProjectionQuestionDataTable>>(
        `${URL_QUESTION}/${URL_PATH_FIND_QUIZ_ID}`,
        {
          params,
        }
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  save(dto: ICreateQuestionDto): Observable<ProjectionQuestionDataTable> {
    return this.httpClient
      .post<ProjectionQuestionDataTable>(URL_QUESTION, dto)
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  uploadImage(formData: FormData) {
    return this.httpClient
      .post<ImageUploaded>(`${URL_QUESTION}/image`, formData)
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  update(
    id: string,
    updateQuestionDto: ProjectionQuestionDataTable
  ): Observable<ProjectionQuestionDataTable> {
    return this.httpClient
      .patch<ProjectionQuestionDataTable>(
        `${URL_QUESTION}/${id}`,
        updateQuestionDto
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }
}
