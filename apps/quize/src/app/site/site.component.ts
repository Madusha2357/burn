import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppState } from '../_state/app.state';
import { tap } from 'rxjs';
import { IDoctorNotificatoin } from '@damen/models';
import { GetCurrentUser } from './_state/site.actions';
import { log } from 'console';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'damen-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  level: any;

  notifications: any[] = [];

  isDoctor?: boolean = false;
  id?: string;

  x = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.level = params['level'];
    });

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
                    this.x = true;
                    if (state.site.user.role == 'hospital') {
                      this.isDoctor = false;
                    } else {
                      this.isDoctor = true;
                    }
                    this.id = state.site.user._id;
                    console.log(
                      'state.site.user.notification',
                      state.site.user.notification
                    );

                    this.notifications = state.site.user.notification;
                  }
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
  }

  update() {
    if (this.id) {
      if (this.isDoctor == true) {
        this.store.dispatch(
          new Navigate([`login/user-update/${this.id}/doctor`])
        );
      } else {
        this.store.dispatch(
          new Navigate([`login/user-update/${this.id}/hospital`])
        );
      }
    }
  }
}
