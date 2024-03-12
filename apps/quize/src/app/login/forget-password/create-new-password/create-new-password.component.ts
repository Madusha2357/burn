import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, filter, takeUntil, tap } from 'rxjs';
import {
  ChangePassword,
  UpdatePasswordChange,
} from '../../_state/login.actions';
import { LoginState } from '../../_state/login.state';

@Component({
  selector: 'damen-create-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss'],
})
export class CreateNewPasswordComponent implements OnDestroy {
  createNewPasswordForm: FormGroup;
  saveUsername?: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordChanged = false;
  notifier$ = new Subject<void>();
  backToLoginUrl?: string;

  constructor(private store: Store, formBuilder: FormBuilder) {
    this.createNewPasswordForm = formBuilder.group({
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      confirmPassword: ['', Validators.required],
    });

    this.store
      .select(LoginState.passwordChanged)
      .pipe(
        takeUntil(this.notifier$),
        filter((s) => s == true),
        tap(() => (this.passwordChanged = true)),
        tap(() => this.store.dispatch(new UpdatePasswordChange(false)))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  createNewPassword() {
    if (
      this.createNewPasswordForm.valid &&
      this.createNewPasswordForm.value['password'] ==
        this.createNewPasswordForm.value['confirmPassword']
    ) {
      this.store.dispatch(new ChangePassword(this.createNewPasswordForm.value));
    }
  }

  get f() {
    return this.createNewPasswordForm.controls;
  }
}
