import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AppState } from './_state/app.state';
import { updateTitle } from './app-routing.conts';
@Component({
  selector: 'damen-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  loading$?: Observable<boolean>;
  private notifier$ = new Subject<void>();

  constructor(private store: Store) {
    updateTitle(this.notifier$);
    this.loading$ = this.store.select(AppState.loading);
  }

  ngOnDestroy(): void {
    this.notifier$.next();
  }
}
