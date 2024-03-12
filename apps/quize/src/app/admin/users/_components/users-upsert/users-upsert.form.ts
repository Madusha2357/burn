import { FormControl, FormGroup, Validators } from '@angular/forms';

export type UserFormGroup = FormGroup<{
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  registerCode: FormControl<string>;
  address: FormGroup;
}>;

export function email() {
  return new FormControl('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });
}

export function phoneNumber() {
  return new FormControl('', { nonNullable: true });
}

export function firstName() {
  return new FormControl('', { nonNullable: true });
}

export function lastName() {
  return new FormControl('', { nonNullable: true });
}

export function registerCode() {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });
}

export function address() {
  return new FormGroup({
    addressLine: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    state: new FormControl('', { nonNullable: true }),
    country: new FormControl('', { nonNullable: true }),
    zipCode: new FormControl('', { nonNullable: true }),
    allowMarketingMails: new FormControl(false),
  });
}
