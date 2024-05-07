import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {
  ICreateUserDto,
  ILocation,
  ProjectionUserDataTable,
  UpdateUserDto,
  UserStatus,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Subscription, tap } from 'rxjs';
import { saveAction } from '../../../../_utils/crud.utils';
import { CreateUser, UpdateUser } from '../../_state/user.actions';
import * as form from './users-upsert.form';
import { IMPORTS } from './users-upsert.imports';
import { LocationComponent } from 'apps/quize/src/app/login/location-pick/location.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'damen-users-upsert',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './users-upsert.component.html',
  styleUrls: ['./users-upsert.component.scss'],
})
export class UsersUpsertComponent implements OnDestroy {
  formGroup: form.UserFormGroup;

  email = form.email();
  firstName = form.firstName();
  lastName = form.lastName();
  role = form.role();
  timer = form.timer();
  location = form.location();
  password = form.password();
  image = form.image();

  selectedRole?: string;

  user?: ProjectionUserDataTable;
  private subscription: Subscription;

  locatio!: ILocation;

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
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.formGroup = new FormGroup({
      email: this.email,
      lastName: this.lastName,
      firstName: this.firstName,
      role: this.role,
      timer: this.timer,
      location: this.location,
      password: this.password,
      image: this.image,
    });

    this.subscription = this.activatedRoute.data
      .pipe(
        tap((data) => {
          this.user = data['user'];
          if (data && this.user) {
            if (this.user._id) {
              this.email.disable();
            }
            this.formGroup.patchValue(this.user);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  selectTimeRange(event: any) {
    const timeRange = event?.target?.value;
    if (timeRange && !this.selectedTimeRanges.includes(timeRange)) {
      this.selectedTimeRanges.push(timeRange);
    }
  }

  removeTimeRange(index: number) {
    this.selectedTimeRanges.splice(index, 1);
  }

  onSave() {
    const reg: ICreateUserDto = {
      ...this.formGroup.value,
    };
    // Adding new fields to the reg
    reg.status = UserStatus.REGISTERED;
    reg.role = this.selectedRole;
    reg.location = this.locatio;
    reg.registerCode = reg.password;
    reg.timer = this.selectedTimeRanges;

    const createAction = new CreateUser(reg as ICreateUserDto);
    const x: UpdateUserDto = this.formGroup.value;

    const updateAction = new UpdateUser(
      this.user?._id ?? '',
      reg as UpdateUserDto
    );

    saveAction(
      this.formGroup,
      this.store,
      this.matSnackBar,
      createAction,
      updateAction,
      this.user
    ).subscribe();
  }

  onRoleChange(role: string) {
    this.selectedRole = role;
  }

  openMap() {
    const dialogRef = this.dialog.open(LocationComponent, {
      width: '60%',
      height: '60%',
    });
    dialogRef.componentInstance.locationSelected.subscribe(
      (selectedLocation: { lat: number; lon: number }) => {
        if (selectedLocation) {
          this.formGroup.patchValue({
            location: `${selectedLocation.lat}, ${selectedLocation.lon}`,
          });
          this.locatio = {
            lat: selectedLocation.lat,
            lon: selectedLocation.lon,
          };
          dialogRef.close();
        }
      }
    );
  }
}
