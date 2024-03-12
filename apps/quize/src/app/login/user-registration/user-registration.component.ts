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

@Component({
  selector: 'damen-user-registration',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Ng2TelInputModule],
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

  constructor(private store: Store, formBuilder: FormBuilder) {
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
      this.store.dispatch(new UserRegistration(reg));
    }
  }

  changeStatus(status: string) {
    this.status = status;
  }

  get f() {
    return this.registerForm.controls;
  }
}
