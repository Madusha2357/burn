import { Component, OnDestroy } from '@angular/core';
import { CountdownTimer } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';
import {
  Observable,
  Subject,
  interval,
  map,
  mergeMap,
  shareReplay,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { getCountdownTimer } from '../../../_utils/count-down';
import { PATH_QUIZ } from '../../../app-routing.conts';
import { GetCurrentUser, GetCurretQuize } from '../../_state/site.actions';
import { SiteState } from '../../_state/site.state';
import { ThankYouDialogComponent } from '../thank-you-dialog/thank-you-dialog.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RegistrationDialogComponent } from '../registration-dialog/registration-dialog.component';

enum Status {
  WAITING = 'WAITING',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
}

@Component({
  selector: 'damen-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnDestroy {
  timeLeft$: Observable<CountdownTimer>;
  status: Status = Status.WAITING;
  statuses = Status;
  private isMobile = false;

  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private store: Store,
    public dialog: MatDialog,
    public mediaMatcher: MediaMatcher,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(new GetCurretQuize());
    moment.tz.names();
    const offset = moment.utc().tz('GMT+0').utcOffset();

    this.timeLeft$ = interval(1000).pipe(
      mergeMap(() => this.store.selectOnce(SiteState.quizStartTime)),
      map((timer) => new Date(timer ?? '').getTime()),
      map((distance) => getCountdownTimer(distance, offset)),
      shareReplay(1)
    );

    const haveQuizeComleted = this.store.dispatch(new GetCurrentUser()).pipe(
      take(1),
      mergeMap(() => this.store.selectOnce(SiteState.hasQuizCompleted)),
      tap((complated) => {
        if (complated == true) {
          this.status = Status.ENDED;
        }
      })
    );

    this.route.queryParams
      .pipe(
        take(1),
        tap((queryParams) => {
          if (queryParams['updates']) {
            this.openDialog();
          }
        })
      )
      .subscribe();

    this.timeLeft$
      .pipe(
        takeUntil(this.notifier),
        mergeMap((x) => {
          if (x.minutesToDday == 0 && x.secondsToDday == 0) {
            this.status = Status.STARTED;
            this.notifier.next();
            this.notifier.complete();
          }
          return haveQuizeComleted;
        })
      )
      .subscribe();

    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public startQuiz() {
    this.store.dispatch(new Navigate([PATH_QUIZ]));
  }

  openDialog() {
    if (this.isMobile == false) {
      this.dialog.open(ThankYouDialogComponent, {
        width: '420px',
        panelClass: 'my-custom-dialog-class',
      });
    } else {
      this.dialog.open(ThankYouDialogComponent, { width: '100%' });
    }
  }

  openRegDialog() {
    if (this.isMobile == false) {
      this.dialog.open(RegistrationDialogComponent, {
        width: '420px',
      });
    } else {
      this.dialog.open(RegistrationDialogComponent, { width: '100%' });
    }
  }
}
