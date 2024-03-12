import { Injectable } from '@angular/core';
import {
  AccessToken,
  Credentials,
  UpdateUserDto,
  ProjectionUserDataTable,
  ChangePasswordDto,
  ProjectionQuizResponseOverview,
  SendOtpDto,
  ICreateUserDto,
} from '@damen/models';
import { Observable, of, throwError } from 'rxjs';
import { LoginService } from './login.service.abstract';
import { VerifyOpt } from '../_state/login.actions';

const ACCESS_TOKEN: AccessToken = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hY2Ftb2RoYUBnbWFpbC5jb20iLCJzdGF0dXMiOiJBY3RpdmUiLCJmaXJzdE5hbWUiOiJDaHVsYW4iLCJsYXN0TmFtZSI6Ik1hZHVyYXBwZXJ1bWEiLCJyb2xlcyI6WyJBRE1JTiIsIlVTRVIiXSwiaWF0IjoxNjcyMDYzMDQxLCJleHAiOjE2NzIwNjM2NDF9.6s56s9hr5uZ18WPa7n0QQCiRLKb2JRxYIMn-LV9aIpc',
};

@Injectable({ providedIn: 'platform' })
export class LoginMockService extends LoginService {
  override create(data: ICreateUserDto): Observable<ProjectionUserDataTable> {
    throw new Error('Method not implemented.');
  }
  override verifyOtp(payload: VerifyOpt): Observable<AccessToken> {
    throw new Error('Method not implemented.');
  }
  override sendOpt(phoneNumber: SendOtpDto): Observable<void> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }

  checkWinner(
    userId: string,
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]> {
    throw new Error('Method not implemented.');
  }

  /**
   * After getting credentials from state,
   * calling to httpClient in back-end and it returns dummy(hard coded) Access Token,
   * This is only for testing.
   */
  login(credentials: Credentials): Observable<AccessToken> {
    if (credentials.username === 'user@example.com') {
      return throwError(() => new Error('Wrong Credentials'));
    } else {
      return of(ACCESS_TOKEN);
    }
  }

  /**
   *
   * @param createUserDto getting from state
   * @returns boolean for now
   */
  userUpdate(
    id: string,
    updateUserDto: ICreateUserDto
  ): Observable<ProjectionUserDataTable> {
    if (updateUserDto) {
      return of({} as ProjectionUserDataTable);
    } else {
      return of({} as ProjectionUserDataTable);
    }
  }

  changePassword(
    credentials: ChangePasswordDto
  ): Observable<ProjectionUserDataTable> {
    return of({} as ProjectionUserDataTable);
  }
}
