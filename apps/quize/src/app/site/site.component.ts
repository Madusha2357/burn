import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppState } from '../_state/app.state';
import { tap } from 'rxjs';
import { IDoctorNotificatoin } from '@damen/models';
import { GetCurrentUser } from './_state/site.actions';
import { log } from 'console';

@Component({
  selector: 'damen-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  level: any;

  notifications: any[] = [];

  isDoctor?: boolean = false;

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
}
