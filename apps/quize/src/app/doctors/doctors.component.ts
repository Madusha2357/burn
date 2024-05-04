/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { switchMap, tap } from 'rxjs';
import {
  DoctorNotification,
  DoctorNotificationAll,
  GetDoctors,
} from '../map/_state/map.actions';
import { MapState } from '../map/_state/map.state';
import { FooterComponent } from '../site/_design-components/footer/footer.component';
import { NavigationBarComponent } from '../site/_design-components/navigation-bar/navigation-bar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateUserDto } from '@damen/models';

@Component({
  selector: 'damen-doctors',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavigationBarComponent,
    RouterModule,
  ],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
})
export class DoctorsComponent implements AfterViewInit {
  doctors?: any[];
  level: any;
  name?: string;
  age?: any;
  image?: any;
  chunkedCards: any;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      this.level = params['level'];
      this.name = params['name'];
      this.age = params['age'];
      this.image = params['image'];
      this.store
        .dispatch(new GetDoctors())
        .pipe(
          switchMap(() => this.store.select(MapState.hospitals)),
          tap((doctors) => {
            this.doctors = doctors;
            if (doctors) this.chunkedCards = this.chunkArray(doctors, 3);
          })
        )
        .subscribe();
    });

    const x: ICreateUserDto[] = [
      {
        firstName: 'Doctor 1',
      },
      {
        firstName: 'Doctor 2',
      },
      {
        firstName: 'Doctor 3',
      },
      {
        firstName: 'Doctor 4',
      },
    ];
    // this.doctors = doctors;
    this.chunkedCards = this.chunkArray(x, 3);
  }

  chunkArray(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }

  sendDoctor(id: string) {
    const details = [
      {
        level: this.level ?? 'level 2',
        name: this.name ?? 'Name',
        image: this.image ?? 'image.jpg',
        age: this.age ?? '25',
      },
    ] as any;
    console.log('doctor clcicked !', id);
    this.store.dispatch(new DoctorNotification(details, id));
  }

  notifyAll() {
    const details = [
      {
        level: this.level ?? 'level 2',
        name: this.name ?? 'Name',
        image: this.image ?? 'image.jpg',
        age: this.age ?? '25',
      },
    ] as any;
    console.log('doctor all clcicked !');
    this.store.dispatch(new DoctorNotificationAll(details));
  }
}