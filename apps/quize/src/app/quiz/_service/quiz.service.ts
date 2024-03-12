import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ICreateQuizResponseDto,
  ProjectionQuizResponseDataTable,
  ProjectionUserDataTable,
  QuestionDataTable,
  QuizResponseResult,
  UpdateUserDto,
  URL_PATH_APPEND,
  URL_PATH_QUESTION_BY_QUIZ_ID,
  URL_QUESTION,
  URL_QUIZ_RESPONSE,
  URL_USER,
} from '@damen/models';
import { catchError, Observable, take, throwError } from 'rxjs';
import {
  snackBarError,
  snackBarErrorThrow,
} from '../../_utils/snack-bar.utils';
import { QuizService } from './quiz.service.abstract';

@Injectable({
  providedIn: 'root',
})
export class QuizHttpService extends QuizService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    super();
  }

  /**
   * Return the Question data table
   * @param order getting order number from component
   */
  getQuestionByOrder(id: string, order: number): Observable<QuestionDataTable> {
    let params = new HttpParams();
    params = params.append('displayOrder', `${order}`);

    return this.httpClient
      .get<QuestionDataTable>(
        `${URL_QUESTION}/${URL_PATH_QUESTION_BY_QUIZ_ID}/${id}`,
        { params }
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          if (e.error.statusCode == 429)
            snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  /**
   * @param id getting question id from component
   * @param answer getting answer from component
   */
  patchAnswer(
    id: string,
    quizResponse: QuizResponseResult
  ): Observable<string> {
    return this.httpClient
      .patch<string>(
        `${URL_QUIZ_RESPONSE}/${URL_PATH_APPEND}/${id}`,
        quizResponse
      )
      .pipe(
        take(1),
        catchError((response: HttpErrorResponse) => {
          this.matSnackBar.open(response.error.message, undefined, {
            panelClass: 'error',
          });
          return throwError(() => response);
        })
      );
  }

  /**
   *
   * @param createQuizResponse
   * @returns
   */
  createQuestionResponse(
    dto: ICreateQuizResponseDto
  ): Observable<ProjectionQuizResponseDataTable> {
    return this.httpClient
      .post<ProjectionQuizResponseDataTable>(`${URL_QUIZ_RESPONSE}`, dto)
      .pipe(take(1));
  }

  /**
   * After getting user address,
   * Back-end update the user values (address)
   */
  updateUserAddress(
    id: string,
    updateUserDto: UpdateUserDto
  ): Observable<ProjectionUserDataTable> {
    return this.httpClient
      .patch<ProjectionUserDataTable>(`${URL_USER}/${id}`, updateUserDto)
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }
}
