import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject, filter, takeUntil, tap } from 'rxjs';
import { SendOpt, UpdateSendOpt, VerifyOpt } from '../../_state/login.actions';
import { LoginState } from '../../_state/login.state';
import { Ng2TelInputModule } from '../../../_directives/ng2-tel-input.module';

@Component({
  selector: 'damen-forget-password-email-send',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Ng2TelInputModule],
  templateUrl: './forget-password-email-send.component.html',
  styleUrls: ['./forget-password-email-send.component.scss'],
})
export class ForgetPasswordEmailSendComponent implements OnDestroy {
  emailForm: FormGroup;
  validateForm: FormGroup;
  isEmailSent = 0;
  notifier$ = new Subject<void>();
  tel: any;
  phoneNumber?: string;
  backToLoginUrl = '';

  constructor(private store: Store, formBuilder: FormBuilder) {
    this.emailForm = formBuilder.group({
      phoneNumber: [null, [Validators.required]],
    });

    this.validateForm = formBuilder.group({
      code: [null, [Validators.required]],
    });

    this.store.dispatch(new UpdateSendOpt(false));

    this.store
      .select(LoginState.otpSent)
      .pipe(
        takeUntil(this.notifier$),
        filter((s) => s == true),
        tap(() => (this.isEmailSent = 1)),
        tap(() => this.store.dispatch(new UpdateSendOpt(false)))
      )
      .subscribe();
  }

  onTelOutput(tel: any) {
    this.tel = tel;
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }

  requestNewPassword() {
    if (this.emailForm.valid) {
      const phoneNumber = this.tel.getNumber();
      this.phoneNumber = this.mask(phoneNumber);
      this.store.dispatch(new SendOpt({ phoneNumber }));
    }
  }

  mask(phoneNumber: string) {
    const endDigits = phoneNumber.slice(-2);
    return endDigits.padStart(phoneNumber.length, '*');
  }

  validate() {
    const phoneNumber = this.tel.getNumber();
    const payload = { phoneNumber, ...this.validateForm.value };
    this.store.dispatch(new VerifyOpt(payload));
  }

  get f() {
    return this.emailForm.controls;
  }

  get fs() {
    return this.validateForm.controls;
  }
}
