import { Injectable, NgZone } from '@angular/core';
import { DecodeJwtToken, Role } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { mergeMap, Observable } from 'rxjs';
import { PATH_ADMIN, PATH_LOGIN } from '../app-routing.conts';
import {
  AddAccessToken,
  AddAccessTokenAndNavigate,
  RemoveAccessToken,
  ShowLoading,
  SignOut,
} from './app.actions';
import { decodeToken } from './app.state.utils';

export interface AppStateModel {
  loading: boolean;
  accessToken?: string;
  user?: DecodeJwtToken;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    loading: false,
    accessToken: undefined,
  },
})
@Injectable({ providedIn: 'root' })
export class AppState {
  @Selector() static loading(state: AppStateModel) {
    return state.loading;
  }

  @Selector() static accessToken(state: AppStateModel) {
    return state.accessToken;
  }

  @Selector() static tokenUser(
    state: AppStateModel
  ): DecodeJwtToken | undefined {
    return state.user;
  }

  constructor(private ngZone: NgZone) {}

  /**
   * Loading state
   */
  @Action(ShowLoading)
  showLoading(
    { patchState }: StateContext<AppStateModel>,
    { loading }: ShowLoading
  ) {
    return patchState({ loading });
  }

  /**
   * Add the access token
   */
  @Action(AddAccessToken)
  addAccessToken(
    { patchState }: StateContext<AppStateModel>,
    { accessToken }: AddAccessToken
  ) {
    const user: DecodeJwtToken = decodeToken(accessToken);
    return patchState({ accessToken, user });
  }

  @Action(AddAccessTokenAndNavigate)
  addAccessTokenAndNavigate(
    { dispatch }: StateContext<AppStateModel>,
    { accessToken }: AddAccessTokenAndNavigate
  ) {
    const { roles } = decodeToken(accessToken);
    dispatch(new AddAccessToken(accessToken));
    this.navigateOnRole(roles, dispatch);
  }

  /**
   * Remove the access token
   * When remove the access token, roles will be empt
   */
  @Action(RemoveAccessToken)
  removeAccessToken({ patchState }: StateContext<AppStateModel>) {
    patchState({ accessToken: undefined, user: undefined });
  }

  /**
   * SignOut action
   */
  @Action(SignOut)
  signOut({ dispatch }: StateContext<AppStateModel>) {
    return dispatch(new RemoveAccessToken()).pipe(
      mergeMap(() => dispatch(new Navigate([PATH_LOGIN])))
    );
  }

  /**
   * Navigate to admin panel and site
   */
  navigateOnRole(
    roles: string[],
    dispatch: (action: Navigate) => Observable<void>
  ) {
    this.ngZone.run(() => {
      if (roles.includes(Role.ADMIN)) dispatch(new Navigate([PATH_ADMIN]));
      else dispatch(new Navigate(['site']));
    });
  }
}
