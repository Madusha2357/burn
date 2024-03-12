/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { switchMap, tap } from 'rxjs';
import { DoctorNotification, GetDoctors } from '../map/_state/map.actions';
import { MapState } from '../map/_state/map.state';
import { FooterComponent } from '../site/_design-components/footer/footer.component';
import { NavigationBarComponent } from '../site/_design-components/navigation-bar/navigation-bar.component';
import { ActivatedRoute } from '@angular/router';
import { IDoctorNotificatoin } from '@damen/models';

@Component({
  selector: 'damen-doctors',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavigationBarComponent],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
})
export class DoctorsComponent implements AfterViewInit {
  doctors?: any[];
  level: any;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      this.level = params['level'];
      this.store
        .dispatch(new GetDoctors())
        .pipe(
          switchMap(() => this.store.select(MapState.hospitals)),
          tap((doctors) => {
            this.doctors = doctors;
          })
        )
        .subscribe();
    });
  }

  sendDoctor(id: string) {
    const details = {
      level: this.level,
      name: 'madusha',
    } as IDoctorNotificatoin;
    console.log('doctor clcicked !', id);
    this.store.dispatch(new DoctorNotification(details, id));
  }
}
