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
  Page,
  ProjectionQuestionDataTable,
  ProjectionQuizResponseOverview,
  URL_PATH_BY_KEY,
  URL_PATH_FIND_QUIZ_ID,
  URL_QUESTION,
  URL_QUIZ_RESPONSE,
} from '@damen/models';
import { catchError, Observable, take, throwError } from 'rxjs';
import {
  snackBarError,
  snackBarErrorThrow,
} from '../../../_utils/snack-bar.utils';
import { QuizResponseService } from './quiz-response.abstarct';

@Injectable({ providedIn: 'root' })
export class QuizResponseHttpService extends QuizResponseService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    super();
  }
  findOneByKey(
    userId: string,
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]> {
    let params = new HttpParams();
    params = params.append('userId', `${userId}`);
    params = params.append('quizId', `${quizId}`);
    return this.httpClient
      .get<ProjectionQuizResponseOverview[]>(
        `${URL_QUIZ_RESPONSE}/${URL_PATH_BY_KEY}`,
        { params }
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }

  findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionQuizResponseOverview>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);

    return this.httpClient
      .get<Page<ProjectionQuizResponseOverview>>(URL_QUIZ_RESPONSE, { params })
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
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
}
