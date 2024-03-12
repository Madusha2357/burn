import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';

export function snackbarSuccess(message: string, matSnackBar: MatSnackBar) {
  return matSnackBar.open(message, undefined, { panelClass: 'success' });
}

export function snackBarError(message: string, matSnackBar: MatSnackBar) {
  return matSnackBar.open(message, undefined, { panelClass: 'error' });
}

export function snackBarErrorThrow(error: Error, matSnackBar: MatSnackBar) {
  matSnackBar.open(error.message, undefined, { panelClass: 'error' });
  return throwError(() => error);
}
