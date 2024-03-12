import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { Store } from '@ngxs/store';
import { of, tap } from 'rxjs';
import { QuestionState } from '../_state/question.state';

@Injectable({ providedIn: 'root' })
export class QuestionDataResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.paramMap.get('id');
    if (id)
      return this.store.selectOnce(QuestionState.getQuestion(id)).pipe(
        tap((value) =>
          this.store.dispatch(
            new UpdateFormValue({
              path: 'question.form',
              value,
            })
          )
        )
      );
    else return of(null);
  }
}
