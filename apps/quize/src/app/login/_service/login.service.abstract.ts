import {
  AccessToken,
  ChangePasswordDto,
  Credentials,
  ICreateUserDto,
  ProjectionQuizResponseOverview,
  ProjectionUserDataTable,
  SendOtpDto,
  UpdateUserDto,
} from '@damen/models';
import { Observable } from 'rxjs';
import { VerifyOpt } from '../_state/login.actions';

export abstract class LoginService {
  /**
   * Getting credintials from state and return access token.
   * @param credentials
   */

  abstract login(credentials: Credentials): Observable<AccessToken>;

  /**
   * Getting user details from state and return boolean value.
   * @param createUserDto
   */
  abstract userUpdate(
    id: string,
    updateUserDto: ICreateUserDto
  ): Observable<ProjectionUserDataTable>;

  /**
   * Getting user new password and update user current password
   * @param password
   */
  abstract changePassword(
    credentials: ChangePasswordDto
  ): Observable<ProjectionUserDataTable>;

  /**
   * Check winner
   * @param userId, @param quizId
   */
  abstract checkWinner(
    userId: string,
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]>;

  abstract sendOpt(phoneNumber: SendOtpDto): Observable<void>;
  abstract verifyOtp(payload: VerifyOpt): Observable<AccessToken>;

  abstract create(data: ICreateUserDto): Observable<ProjectionUserDataTable>;
}
