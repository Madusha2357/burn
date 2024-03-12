import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as models from '@damen/models';
import {
  ProjectionQuizResponseOverview,
  URL_QUIZ_RESPONSE,
  URL_PATH_BY_KEY,
} from '@damen/models';
import { catchError, Observable, take, throwError } from 'rxjs';
import {
  snackBarError,
  snackBarErrorThrow,
} from '../../_utils/snack-bar.utils';
import { LoginService } from './login.service.abstract';
import { VerifyOpt } from '../_state/login.actions';

@Injectable({ providedIn: 'root' })
export class LoginHttpService extends LoginService {
  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    super();
  }

  /**
   * After getting credentials from state,
   * calling to httpClient in back-end and it returns (Access Token)
   */
  login(credentials: models.Credentials): Observable<models.AccessToken> {
    console.log('servise', credentials);

    return (
      this.httpClient
        .post<models.AccessToken>(models.URL_SIGN_IN, credentials)
        // DO NOT SHOW THE ERROR using snackbar since its goes against design.11
        .pipe(
          take(1),
          catchError((e: HttpErrorResponse) => {
            if (e.error.statusCode == 429)
              snackBarError(e.error.message, this.matSnackBar);
            return throwError(() => e);
          })
        )
    );
  }

  /**
   * After getting user details,
   * Back-end update the user values (first name, password)
   */
  userUpdate(
    id: string,
    updateUserDto: models.ICreateUserDto
  ): Observable<models.ProjectionUserDataTable> {
    return this.httpClient
      .patch<models.ProjectionUserDataTable>(
        `${models.URL_USER}/${id}`,
        updateUserDto
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  /**
   * After getting user new password,
   * Back-end update user password as new password
   */
  changePassword(
    credentials: models.ChangePasswordDto
  ): Observable<models.ProjectionUserDataTable> {
    const url = `${models.URL_USER}/${models.URL_CHANGE_PASSWORD}`;
    return this.httpClient
      .post<models.ProjectionUserDataTable>(url, credentials)
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  checkWinner(
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
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  override sendOpt(phoneNumber: models.SendOtpDto): Observable<void> {
    return this.httpClient
      .post<void>(
        `${models.URL_SIGN_IN}/${models.URL_PATH_SEND_OTP}`,
        phoneNumber
      )
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          snackBarError(e.error.message, this.matSnackBar);
          return throwError(() => e);
        })
      );
  }

  override verifyOtp(payload: VerifyOpt): Observable<models.AccessToken> {
    const url = `${models.URL_SIGN_IN}/${models.URL_PATH_SEND_OTP}/${models.URL_PATH_VERIFY_OTP}`;
    return this.httpClient.post<models.AccessToken>(url, payload).pipe(
      take(1),
      catchError((e: HttpErrorResponse) => {
        snackBarError(e.error.message, this.matSnackBar);
        return throwError(() => e);
      })
    );
  }

  create(
    data: models.ICreateUserDto
  ): Observable<models.ProjectionUserDataTable> {
    return this.httpClient
      .post<models.ProjectionUserDataTable>(models.URL_USER, data)
      .pipe(
        take(1),
        catchError((res: HttpErrorResponse) =>
          snackBarErrorThrow(res, this.matSnackBar)
        )
      );
  }
}
