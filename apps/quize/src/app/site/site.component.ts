import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppState } from '../_state/app.state';
import { GetCurrentUser } from './_state/site.actions';
import { Navigate } from '@ngxs/router-plugin';
import { tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from './site-dialog';

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
    private dialog: MatDialog
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

  open(notification: any) {
    const baseUrl = 'http://127.0.0.1:5000/uploads/';
    const imageUrl = baseUrl + notification.image;
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      data: { ...notification, imageUrl },
      width: ' 30%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  payment(recipient: string) {
    const subject = 'Payment Details';
    const body = 'Please find attached the payment details.';

    // Construct mailto URL
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open default email client
    window.location.href = mailtoUrl;
  }
}
