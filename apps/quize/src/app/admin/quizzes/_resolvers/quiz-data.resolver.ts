import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { QuizState } from '../_state/quiz.state';

@Injectable({ providedIn: 'root' })
export class QuizDataResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    if (id) return this.store.selectOnce(QuizState.getQuiz(id));
    else return of(null);
  }
}
