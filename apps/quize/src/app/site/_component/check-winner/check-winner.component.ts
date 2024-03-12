import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subject, map, takeUntil, tap, zip } from 'rxjs';
import { AppState } from '../../../_state/app.state';
import { PATH_CHECK_ANSWERS, PATH_SITE } from '../../../app-routing.conts';
import { LoginState } from '../../../login/_state/login.state';
import { FooterComponent } from '../../_design-components/footer/footer.component';
import {
  CheckWinnerQuizId,
  UpdateQuizId,
} from '../../../login/_state/login.actions';
import { NavigationBarComponent } from '../../_design-components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'damen-check-winner',
  standalone: true,
  templateUrl: './check-winner.component.html',
  styleUrls: ['./check-winner.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FooterComponent,
    NavigationBarComponent,
  ],
})
export class CheckWinnerComponent implements OnDestroy {
  winner?: number;
  total?: number;
  correctCount?: number;
  quizId?: string;

  notifier$ = new Subject<void>();

  constructor(private store: Store) {
    const user = this.store
      .select(AppState.tokenUser)
      .pipe(map((user) => user?.id));
    const quizeId = this.store.select(LoginState.quizId);

    zip(user, quizeId)
      .pipe(
        takeUntil(this.notifier$),
        tap((d) => {
          const userId = d[0];
          const quizId = d[1];
          if (userId && quizId) {
            store.dispatch(new CheckWinnerQuizId(userId, quizId));
          }
        })
      )
      .subscribe();

    store
      .select(LoginState.winner)
      .pipe(
        takeUntil(this.notifier$),
        tap((winner) => {
          if (winner == true) {
            this.winner = 0;
          } else if (winner == false) {
            this.winner = 1;
          }
        })
      )
      .subscribe();

    store
      .select(LoginState.questionResponse)
      .pipe(
        takeUntil(this.notifier$),
        tap((res) => {
          this.total = res?.length;
          res?.forEach((x) => {
            const filtered = res.filter((x) => x.responseStatus === 'CORRECT');
            this.correctCount = filtered.length;
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
    this.store.dispatch(new UpdateQuizId(undefined));
  }

  viewAnswers() {
    this.store.dispatch(new Navigate([`${PATH_SITE}/${PATH_CHECK_ANSWERS}`]));
  }
}
