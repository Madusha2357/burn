import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICreateUserDto, ILocation } from '@damen/models';
import { Store } from '@ngxs/store';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { PATH_TNC_FULL } from '../../app-routing.conts';
import { Ng2TelInputModule } from '../../_directives/ng2-tel-input.module';
import { tap } from 'rxjs';
import { MapState } from '../../map/_state/map.state';
import { GetUserM, UpdateUserM } from '../../map/_state/map.actions';
import { LocationComponent } from '../location-pick/location.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { snackbarSuccess } from '../../_utils/snack-bar.utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'damen-user-update',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    Ng2TelInputModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit {
  registerForm!: FormGroup;
  saveUsername?: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  tnc: string = PATH_TNC_FULL;
  status?: string;
  location!: ILocation;
  id?: string;

  selectedTimeRanges: string[] = [];
  timeRanges: string[] = [
    '1:00 - 4:00',
    '4:00 - 7:00',
    '7:00 - 10:00',
    '10:00 - 13:00',
    '13:00 - 16:00',
    '16:00 - 19:00',
    '19:00 - 22:00',
    '22:00 - 23:59',
    '00:00 - 1:00',
  ];

  constructor(
    private store: Store,
    formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.location = { lat: 0, lon: 0 }; // Initialize location as an empty object

    this.registerForm = formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: [null],
      time: [null],
      mobile: [null],
      location: [''], // Empty for now
    });

    navigator.geolocation.getCurrentPosition((p) => {
      this.location = { lat: p.coords.latitude, lon: p.coords.longitude };
      this.registerForm.patchValue({
        location: `${this.location.lat}, ${this.location.lon}`,
      });
    });
  }

  ngOnInit() {
    this.router.params
      .pipe(
        tap((params) => {
          this.status = params['status'];
          this.id = params['id'];
          this.store
            .dispatch(new GetUserM(params['id']))
            .pipe(
              tap(() => {
                const user = this.store.selectSnapshot(MapState.user);
                if (user) {
                  this.registerForm.patchValue(user);
                  if (user.timer) {
                    this.selectedTimeRanges.push(...user.timer);
                  }
                }
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  selectTimeRange(event: any) {
    const timeRange = event?.target?.value;

    if (timeRange && !this.selectedTimeRanges.includes(timeRange)) {
      console.log('timer', timeRange);
      this.selectedTimeRanges.push(timeRange);
    }
  }

  removeTimeRange(index: number) {
    this.selectedTimeRanges.splice(index, 1);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  userRegistration() {
    const reg: ICreateUserDto = {
      ...this.registerForm.value,
      timer: [],
    };
    reg.location = this.location;

    if (this.id) {
      reg.timer = this.selectedTimeRanges;
      reg.location = this.location;
      this.store
        .dispatch(new UpdateUserM(this.id, reg))
        .pipe(
          tap((data) => {
            snackbarSuccess('Successfuly updated!', this.snackBar);
            this.store.dispatch(new Navigate(['/site']));
          })
        )
        .subscribe();
    }
  }

  changeStatus(status: string) {
    this.status = status;
  }

  openMap() {
    const dialogRef = this.dialog.open(LocationComponent, {
      width: '60%',
      height: '60%',
    });
    dialogRef.componentInstance.locationSelected.subscribe(
      (selectedLocation: { lat: number; lon: number }) => {
        if (selectedLocation) {
          this.registerForm.patchValue({
            location: `${selectedLocation.lat}, ${selectedLocation.lon}`,
          });
          this.location = {
            lat: selectedLocation.lat,
            lon: selectedLocation.lon,
          };
          dialogRef.close();
        }
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }
}
