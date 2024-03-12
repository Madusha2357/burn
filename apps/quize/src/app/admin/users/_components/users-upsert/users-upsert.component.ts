import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {
  ICreateUserDto,
  ProjectionUserDataTable,
  UpdateUserDto,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Subscription, tap } from 'rxjs';
import { saveAction } from '../../../../_utils/crud.utils';
import { CreateUser, UpdateUser } from '../../_state/user.actions';
import * as form from './users-upsert.form';
import { IMPORTS } from './users-upsert.imports';

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
  phoneNumber = form.phoneNumber();
  firstName = form.firstName();
  lastName = form.lastName();
  registerCode = form.registerCode();
  address = form.address();

  user?: ProjectionUserDataTable;
  private subscription: Subscription;

  constructor(
    private store: Store,
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = new FormGroup({
      email: this.email,
      phoneNumber: this.phoneNumber,
      lastName: this.lastName,
      firstName: this.firstName,
      registerCode: this.registerCode,
      address: this.address,
    });

    this.subscription = this.activatedRoute.data
      .pipe(
        tap((data) => {
          this.user = data['user'];
          if (data && this.user) {
            if (this.user._id) {
              this.email.disable();
              this.registerCode.disable();
              this.address?.disable();
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

  onSave() {
    const createAction = new CreateUser(this.formGroup.value as ICreateUserDto);
    const x: UpdateUserDto = this.formGroup.value;

    const updateAction = new UpdateUser(
      this.user?._id ?? '',
      x as UpdateUserDto
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
}
