import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenUser } from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { SignOut } from '../../../_state/app.actions';
import { AppState } from '../../../_state/app.state';
import { MatIconModule } from '@angular/material/icon';
import { fadeIn, fadeOut } from './navigation-bar.animation';
import { Navigate } from '@ngxs/router-plugin';

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

  constructor(private store: Store) {
    this.user$ = this.store.select(AppState.tokenUser);
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
}
