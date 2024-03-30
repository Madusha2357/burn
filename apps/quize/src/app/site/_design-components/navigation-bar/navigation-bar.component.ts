import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenUser } from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable, Subject, tap } from 'rxjs';
import { SignOut } from '../../../_state/app.actions';
import { AppState } from '../../../_state/app.state';
import { MatIconModule } from '@angular/material/icon';
import { fadeIn, fadeOut } from './navigation-bar.animation';
import { Navigate } from '@ngxs/router-plugin';
import { MapState } from '../../../map/_state/map.state';
import { GetCurrentUser } from '../../_state/site.actions';
import { UserState } from '../../../admin/users/_state/user.state';
import { GetUser } from '../../../admin/users/_state/user.actions';
import { GetUserM } from '../../../map/_state/map.actions';

@Component({
  selector: 'damen-navigation-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  animations: [fadeIn, fadeOut],
})
export class NavigationBarComponent implements OnDestroy {
  showSideNav = false;
  private notifier$ = new Subject<void>();
  user$: Observable<TokenUser | undefined>;
  status?: string;

  isDoctor?: boolean = false;

  constructor(private store: Store) {
    this.user$ = this.store.select(AppState.tokenUser);
  }

  ngOnInit() {
    this.store
      .select(AppState.tokenUser)
      .pipe(
        tap((s) => {
          if (s) {
            this.store
              .dispatch(new GetCurrentUser())
              .pipe(
                tap((state) => {
                  if (state) {
                    if (state.site.user.role == 'hospital') {
                      this.isDoctor = false;
                      this.status = 'hospital';
                    } else {
                      this.isDoctor = true;
                      this.status = 'doctor';
                    }
                  }
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }

  onSignOut() {
    this.store.dispatch(new SignOut());
  }
  onClickLink(link: string) {
    this.store.dispatch(new Navigate([link]));
    this.showSideNav = false;
  }

  update(id: string) {
    const status = this.status;
    this.store
      .dispatch(new GetUserM(id))
      .pipe(
        tap(() =>
          this.store.dispatch(
            new Navigate([`login/user-update/${id}/${status}`])
          )
        )
      )
      .subscribe();
  }
}
