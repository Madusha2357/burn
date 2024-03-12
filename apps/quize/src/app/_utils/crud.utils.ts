import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BaseId } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { catchError, take, throwError } from 'rxjs';
import { snackBarErrorThrow } from './snack-bar.utils';

export function saveAction(
  formGroup: FormGroup,
  store: Store,
  matSnackBar: MatSnackBar,
  createAction: unknown,
  updateAction: unknown,
  base?: BaseId
) {
  if (formGroup.invalid) {
    formGroup.markAllAsTouched();
    return throwError(() => new Error('Form Invalid'));
  }

  let action = createAction;
  if (base && base._id) action = updateAction;
  return store.dispatch(action).pipe(
    take(1),
    catchError((res: Error) => snackBarErrorThrow(res, matSnackBar))
  );
}

export function navigateToUpsert(
  relativeTo: ActivatedRoute,
  store: Store,
  id: string = '0'
) {
  const nav = new Navigate([id], undefined, { relativeTo });
  store.dispatch(nav);
}
