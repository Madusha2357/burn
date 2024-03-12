import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { UserState } from '../_state/user.state';

@Injectable({ providedIn: 'root' })
export class UserDataResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.paramMap.get('id');
    if (id) return this.store.selectOnce(UserState.getUser(id));
    else return of(null);
  }
}
