import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginState } from './_state/login.state';
import { RegistrationState } from './_state/user-registration/user-registration.state';
import { RegisterCodeState } from './_state/register-code/register-code.state';
import { CommonModule } from '@angular/common';

export const IMPORTS = [CommonModule, MatSnackBarModule];
export const IMPORTS_STATE = [LoginState, RegisterCodeState, RegistrationState];
