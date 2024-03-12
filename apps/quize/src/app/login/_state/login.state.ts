import { Injectable } from '@angular/core';
import { QuizResponseResult } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { finalize, mergeMap, tap } from 'rxjs';
import {
  AddAccessToken,
  AddAccessTokenAndNavigate,
  ShowLoading,
} from '../../_state/app.actions';
import { PATH_CREATE_PASSOWORD, PATH_LOGIN } from '../../app-routing.conts';
import { LoginService } from '../_service/login.service.abstract';
import {
  ChangePassword,
  CheckWinnerQuizId,
  SendOpt,
  SignIn,
  SignInWithoutNav,
  UpdatePasswordChange,
  UpdateQuizId,
  UpdateSendOpt,
  VerifyOpt,
} from './login.actions';
import { RegisterCodeState } from './register-code/register-code.state';
import { RegistrationState } from './user-registration/user-registration.state';

export interface LoginStateModel {
  accessToken?: string;
  isWinner?: boolean;
  questionResponse?: QuizResponseResult[];
  optSent: boolean;
  passwordChanged: boolean;
  isUrlHasQuizId?: boolean;
  quizId?: string;
}

@State<LoginStateModel>({
  name: 'login',
  defaults: { accessToken: undefined, optSent: false, passwordChanged: false },
  children: [RegisterCodeState, RegistrationState],
})
@Injectable({ providedIn: 'root' })
export class LoginState {
  constructor(private loginService: LoginService) {}

  @Selector() static winner(state: LoginStateModel) {
    return state.isWinner;
  }

  @Selector() static quizId(state: LoginStateModel) {
    return state.quizId;
  }

  @Selector() static questionResponse(state: LoginStateModel) {
    return state.questionResponse;
  }

  @Selector() static otpSent(state: LoginStateModel) {
    return state.optSent;
  }

  @Selector() static passwordChanged(state: LoginStateModel) {
    return state.passwordChanged;
  }

  /**
   * SignIn action
   */
  @Action(SignIn)
  signIn({ dispatch }: StateContext<LoginStateModel>, action: SignIn) {
    dispatch(new ShowLoading(true));
    return this.loginService.login(action.credentials).pipe(
      mergeMap((res) =>
        dispatch(new AddAccessTokenAndNavigate(res.accessToken))
      ),
      finalize(() => dispatch(new ShowLoading(false)))
    );
  }

  @Action(SendOpt)
  sendOpt(
    { dispatch, patchState }: StateContext<LoginStateModel>,
    action: SendOpt
  ) {
    dispatch(new ShowLoading(true));
    return this.loginService.sendOpt(action.phoneNumber).pipe(
      tap(() => patchState({ optSent: true })),
      finalize(() => dispatch(new ShowLoading(false)))
    );
  }

  @Action(VerifyOpt)
  verifyOpt(
    { dispatch, patchState }: StateContext<LoginStateModel>,
    { payload }: VerifyOpt
  ) {
    dispatch(new ShowLoading(true));
    return this.loginService.verifyOtp(payload).pipe(
      tap(() => patchState({ optSent: true })),
      tap((res) => dispatch(new AddAccessToken(res.accessToken))),
      tap(() => dispatch(new Navigate([PATH_LOGIN, PATH_CREATE_PASSOWORD]))),
      finalize(() => dispatch(new ShowLoading(false)))
    );
  }

  @Action(UpdateSendOpt)
  updateSendOpt(
    { patchState }: StateContext<LoginStateModel>,
    action: UpdateSendOpt
  ) {
    return patchState({ optSent: action.update });
  }

  @Action(UpdatePasswordChange)
  passwordChanged(
    { patchState }: StateContext<LoginStateModel>,
    action: UpdatePasswordChange
  ) {
    return patchState({ passwordChanged: action.update });
  }

  @Action(ChangePassword)
  changePassword(
    { patchState, dispatch }: StateContext<LoginStateModel>,
    action: ChangePassword
  ) {
    dispatch(new ShowLoading(true));
    return this.loginService.changePassword(action.dto).pipe(
      tap(() => patchState({ passwordChanged: true })),
      finalize(() => dispatch(new ShowLoading(false)))
    );
  }

  /**
   * SignIn action
   */
  @Action(SignInWithoutNav)
  signInWithoutNavigate(
    { dispatch }: StateContext<LoginStateModel>,
    action: SignInWithoutNav
  ) {
    dispatch(new ShowLoading(true));
    return this.loginService.login(action.credentials).pipe(
      mergeMap((res) => dispatch(new AddAccessToken(res.accessToken))),
      finalize(() => dispatch(new ShowLoading(false)))
    );
  }

  /**
   * Check Winner
   */
  @Action(CheckWinnerQuizId)
  checkWinner(
    { patchState }: StateContext<LoginStateModel>,
    { userId, quizId }: CheckWinnerQuizId
  ) {
    return this.loginService.checkWinner(userId, quizId).pipe(
      tap((response) => {
        patchState({ questionResponse: response[0].responses });
        const isWinner = response[0].isWinner;
        if (isWinner == true) {
          patchState({ isWinner: true });
        } else {
          patchState({ isWinner: false });
        }
      })
    );
  }

  @Action(UpdateQuizId)
  isUrlHasQuizId(
    { patchState }: StateContext<LoginStateModel>,
    { quizId }: UpdateQuizId
  ) {
    return patchState({ quizId });
  }
}
