import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SignOut } from '../_state/app.actions';
import { ToggleDrawer } from './_state/admin.actions';
import { AdminState } from './_state/admin.state';

@Component({
  selector: 'damen-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  public opened$: Observable<boolean>;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private store: Store, private router: Router) {
    this.opened$ = this.store.select(AdminState.drawerOpen);
    // TODO have a breadcoumb
    // router.events
    //   .pipe(filter((e) => e instanceof ActivationStart))
    //   .subscribe((e) => {
    //     console.log(e);
    //   });
  }

  onMenuButton() {
    this.store.dispatch(new ToggleDrawer());
  }

  onLogout() {
    // this.store.reset({ app: { loading: false }, admin: { drawerOpen: false } });
    this.store.dispatch(new SignOut());
  }
}
