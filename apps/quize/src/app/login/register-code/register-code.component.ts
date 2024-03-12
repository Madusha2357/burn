import { LayoutModule, MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ERROR_EXPIRED, ERROR_INVALID } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { catchError, mergeMap, take, tap, throwError } from 'rxjs';
import { PATH_LOGIN, PATH_USER_REGISTRATION } from '../../app-routing.conts';
import { RegisterCode } from '../_state/register-code/register-code.actions';

@Component({
  selector: 'damen-register-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, LayoutModule],
  templateUrl: './register-code.component.html',
  styleUrls: ['./register-code.component.scss'],
})
export class RegisterCodeComponent {
  email?: string;
  error?: string;
  inputs = new FormArray<FormControl>([]);

  formGroup: FormGroup = new FormGroup({
    inputs: this.inputs,
  });

  @ViewChild('welcome', { static: true }) secondDialog!: TemplateRef<unknown>;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    public mediaMatcher: MediaMatcher,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.route.queryParams
      .pipe(
        take(1),
        tap((queryParams) => (this.email = queryParams['email']))
      )
      .subscribe();
    for (let index = 0; index < 6; index++) {
      const ctrl = new FormControl('', { nonNullable: false });
      this.inputs.push(ctrl);
    }
  }

  public focusNext(i: number, event: KeyboardEvent) {
    let id;
    if (event.code !== 'Backspace') {
      id = 'input' + (+i + 1);
    } else {
      id = 'input' + (+i - 1);
    }

    if (i < this.inputs.controls.length) {
      const input = this.document.querySelector(`#${id}`) as HTMLInputElement;
      input.focus();
    }
  }

  onValidateCode() {
    const width = this.mediaMatcher.matchMedia('(min-width: 500px)').matches
      ? '30%'
      : '100%';
    const value = this.inputs.value.join('');

    if (this.email && value) {
      this.store
        .dispatch(new RegisterCode(value, this.email))
        .pipe(
          take(1),
          mergeMap(() => {
            const ref = this.matDialog.open(this.secondDialog, {
              width: '420px',
            });
            return ref.afterClosed();
          }),
          tap((d) => {
            if (d == true) {
              const route = `/${PATH_LOGIN}/${PATH_USER_REGISTRATION}`;
              this.store.dispatch(new Navigate([route]));
            }
          }),
          catchError((response: HttpErrorResponse) => {
            const msg = response.error.message;
            if (msg === ERROR_INVALID) {
              this.error =
                'The entered code is incorrect, please check if you have entered the correct code.';
            } else if (msg === ERROR_EXPIRED) {
              this.error =
                'You have already created an account. Login to access the challenge.';
            }
            return throwError(() => 'Error in code');
          })
        )
        .subscribe();
    }
  }

  // registrationCode(value: string): void {
  //   this.value = value;
  //   this.error = undefined;
  // }
}
