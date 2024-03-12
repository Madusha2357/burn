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
  ICreateQuizDto,
  Page,
  ProjectionQuizDataTable,
  URL_PATH_QUIZZES_BY_USER,
  URL_QUIZ,
  URL_QUIZ_RESPONSE,
  URL_QUIZ_PATH_GET,
  ProjectionQuizResponseOverview,
  URL_PATH_RESULTS,
  UpdateQuizResponseDto,
  URL_DOWNLOAD,
} from '@damen/models';
import { catchError, Observable, take, tap } from 'rxjs';
import { snackBarErrorThrow } from '../../../_utils/snack-bar.utils';
import { QuizService } from './quiz-service.abstract';

@Injectable({ providedIn: 'root' })
export class QuizHttpService extends QuizService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    super();
  }

  findAll(data: [Sort, PageEvent]): Observable<Page<ProjectionQuizDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);

    return this.httpClient
      .post<Page<ProjectionQuizDataTable>>(`${URL_QUIZ}/${URL_QUIZ_PATH_GET}`, {
        params,
      })
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }

  save(dto: ICreateQuizDto): Observable<ProjectionQuizDataTable> {
    return this.httpClient
      .post<ProjectionQuizDataTable>(`${URL_QUIZ}`, dto)
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }

  update(
    id: string,
    updateQuizDto: ProjectionQuizDataTable
  ): Observable<ProjectionQuizDataTable> {
    return this.httpClient
      .patch<ProjectionQuizDataTable>(`${URL_QUIZ}/${id}`, updateQuizDto)
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }

  updateQuizResponse(
    id: string,
    updateQuizResDto: UpdateQuizResponseDto
  ): Observable<ProjectionQuizResponseOverview> {
    return this.httpClient
      .patch<ProjectionQuizResponseOverview>(
        `${URL_QUIZ_RESPONSE}/${id}`,
        updateQuizResDto
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }

  findAllByUserId(
    data: [Sort, PageEvent],
    userId: string
  ): Observable<Page<ProjectionQuizDataTable>> {
    const { active, direction } = data[0];
    const { pageIndex, pageSize } = data[1];

    let params = new HttpParams();
    params = params.append('skip', `${pageIndex}`);
    params = params.append('limit', `${pageSize}`);
    params = params.append('sortByField', active);
    params = params.append('order', direction);
    params = params.append('userId', userId);

    return this.httpClient
      .get<Page<ProjectionQuizDataTable>>(
        `${URL_QUIZ_RESPONSE}/${URL_PATH_QUIZZES_BY_USER}`,
        {
          params,
        }
      )
      .pipe(
        take(1),
        catchError((e: string) =>
          snackBarErrorThrow(
            new Error('Not attemped any quiz yet'),
            this.matSnackBar
          )
        )
      );
  }

  findResultsByQuiz(
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]> {
    let params = new HttpParams();
    params = params.append('quizId', `${quizId}`);

    return this.httpClient
      .get<ProjectionQuizResponseOverview[]>(
        `${URL_QUIZ_RESPONSE}/${URL_PATH_RESULTS}`,
        {
          params,
        }
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) =>
          snackBarErrorThrow(e, this.matSnackBar)
        )
      );
  }

  downloadQuizResults(quizId: string) {
    this.httpClient
      .post(
        `${URL_QUIZ_RESPONSE}/${URL_DOWNLOAD}/${quizId}`,
        {},
        { responseType: 'blob' }
      )
      .pipe(
        tap((data) => {
          const blob: Blob = new Blob([data], { type: 'text/csv' });
          const fileName = 'quiz-results.csv';
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
}
