import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { AppState } from '../_state/app.state';
import { Navigate } from '@ngxs/router-plugin';
import { PATH_LOGIN } from '../app-routing.conts';

@Injectable({ providedIn: 'root' })
export class AppGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.selectOnce(AppState.tokenUser).pipe(
      map((token) => {
        if (token) {
          const expires = new Date(token.exp * 1000);
          const timeout = expires.getTime() - Date.now();
          if (timeout < 0) this.store.dispatch(new Navigate([PATH_LOGIN]));
          return timeout >= 0;
        } else return false;
      })
    );
  }
}
