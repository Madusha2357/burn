import { Injectable } from '@angular/core';
import { Credentials } from '@damen/models';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { AddAccessToken } from '../../../_state/app.actions';
import { LoginService } from '../../_service/login.service.abstract';
import { RegisterCode } from './register-code.actions';

@State<void>({ name: 'registerCode' })
@Injectable({ providedIn: 'root' })
export class RegisterCodeState {
  constructor(private loginService: LoginService) {}

  /**
   *
   * @param param0 user email
   * @param param1 user register code
   * @returns calling to login method in service
   */
  @Action(RegisterCode)
  registerCode(
    { dispatch }: StateContext<void>,
    { email, registerCode }: RegisterCode
  ) {
    const user: Credentials = {
      username: email,
      password: registerCode,
    };
    return this.loginService
      .login(user)
      .pipe(tap((res) => dispatch(new AddAccessToken(res.accessToken))));
  }
}
