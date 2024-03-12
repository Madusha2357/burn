import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PATH_CREATE_PASSOWORD,
  PATH_REGISTER_CODE,
  PATH_RESET_PASSWORD,
  PATH_SIGNIN,
  PATH_USER_REGISTRATION,
} from '../app-routing.conts';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: '',
        redirectTo: PATH_SIGNIN,
        pathMatch: 'full',
      },
      {
        path: PATH_SIGNIN,
        loadComponent: () =>
          import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: PATH_REGISTER_CODE,
        loadComponent: () =>
          import('./register-code/register-code.component').then(
            (m) => m.RegisterCodeComponent
          ),
      },
      {
        path: PATH_RESET_PASSWORD,
        loadComponent: () =>
          import('./reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: PATH_USER_REGISTRATION,
        loadComponent: () =>
          import('./user-registration/user-registration.component').then(
            (m) => m.UserRegistrationComponent
          ),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import(
            './forget-password/forget-password-email-send/forget-password-email-send.component'
          ).then((m) => m.ForgetPasswordEmailSendComponent),
      },
      {
        path: PATH_CREATE_PASSOWORD,
        loadComponent: () =>
          import(
            './forget-password/create-new-password/create-new-password.component'
          ).then((m) => m.CreateNewPasswordComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
