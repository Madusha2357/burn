import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ICreateUserDto,
  ILocation,
  UserRegistrationDto,
  UserStatus,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { UserRegistration } from '../_state/user-registration/user-registration.actions';
import { RouterLink } from '@angular/router';
import { PATH_TNC_FULL } from '../../app-routing.conts';
import { Ng2TelInputModule } from '../../_directives/ng2-tel-input.module';
import { log } from 'util';
import { MapComponent } from '../../map/map.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocationComponent } from '../location-pick/location.component';

@Component({
  selector: 'damen-user-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    Ng2TelInputModule,
    MatDialogModule,
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent {
  registerForm!: FormGroup;
  saveUsername?: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  tnc: string = PATH_TNC_FULL;
  status?: string;
  location!: ILocation;

  selectedTimeRanges: string[] = [];
  timeRanges: string[] = ['1am - 7am', '7am - 12pm', '12pm - 8pm', '8pm - 1am'];

  constructor(
    private store: Store,
    formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.location = { lat: 0, lon: 0 }; // Initialize location as an empty object

    this.registerForm = formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: [null],
      time: [null],
      location: [''], // Empty for now
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      confirmPassword: [null, Validators.required],
      checkBox: [false, Validators.requiredTrue],
    });

    navigator.geolocation.getCurrentPosition((p) => {
      this.location = { lat: p.coords.latitude, lon: p.coords.longitude };
      this.registerForm.patchValue({
        location: `${this.location.lat}, ${this.location.lon}`,
      });
    });
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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  userRegistration() {
    if (this.registerForm.valid && this.status) {
      const reg: ICreateUserDto = {
        ...this.registerForm.value,
      };
      reg.status = UserStatus.REGISTERED;
      reg.role = this.status;
      reg.location = this.location;
      reg.registerCode = reg.password;
      reg.timer = this.selectedTimeRanges;
      this.store.dispatch(new UserRegistration(reg));
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
