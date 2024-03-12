import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { QuestionsListComponent } from '../../../questions/_components/questions-list/questions-list.component';

export type QuizeFormGroup = FormGroup<{
  name: FormControl<string>;
  startTime: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
  minimalAnswerCountForWinning: FormControl<number>;
  status: FormControl<string>;
}>;

export function getNameFormControl() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function getStatTimeFormControl() {
  return new FormControl<Date | null>(null, {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function getEndTimeFormControl() {
  return new FormControl<Date | null>(new Date(), {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function getWinningCountFormControl() {
  return new FormControl(0, {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function getStatusFormControl() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export const IMPORTS = [
  QuestionsListComponent,
  CommonModule,
  //
  NgxMatDatetimePickerModule,
  //
  ReactiveFormsModule,
  MatButtonModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
];
