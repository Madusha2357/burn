import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { PATH_SITE } from '../../../app-routing.conts';
import { LoginService } from '../../_service/login.service.abstract';
import { UserRegistration } from './user-registration.actions';
import { UserStatus } from '@damen/models';

export interface RegistrationStateModel {
  accessToken?: string;
  id: string;
}

@State<RegistrationStateModel>({
  name: 'userRegistration',
  defaults: { accessToken: undefined, id: '' },
})
@Injectable({ providedIn: 'root' })
export class RegistrationState {
  accessToken$?: Observable<string | undefined>;

  constructor(private loginService: LoginService, private store: Store) {}

  /**
   * User Registration action
   */
  @Action(UserRegistration)
  userRegistration(
    { dispatch }: StateContext<RegistrationStateModel>,
    { dto }: UserRegistration
  ) {
    dto.status = UserStatus.REGISTERED;
    return this.loginService
      .create(dto)
      .pipe(tap(() => dispatch(new Navigate([PATH_SITE]))));
  }
}
