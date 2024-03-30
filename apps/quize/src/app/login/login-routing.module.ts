import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PATH_CREATE_PASSOWORD,
  PATH_REGISTER_CODE,
  PATH_RESET_PASSWORD,
  PATH_SIGNIN,
  PATH_USER_REGISTRATION,
} from '../app-routing.conts';
import { LoginComponent } from './login.component';
import { UserState } from '../admin/users/_state/user.state';
import { NgxsModule } from '@ngxs/store';
import { MapState } from '../map/_state/map.state';
import { environment } from '../../environments/environment';
import { MapHttpService } from '../map/_service/map.service';
import { MapService } from '../map/_service/map.service.abstract';
import { MapMockService } from '../map/_service/map.service.mock';

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
        path: 'user-update/:id/:status',
        // providers: [importProvidersFrom(NgxsModule.forFeature([MapState]))],
        providers: [
          {
            provide: MapService,
            useClass: environment.useMock ? MapMockService : MapHttpService,
          },
          importProvidersFrom(NgxsModule.forFeature([MapState])),
        ],
        loadComponent: () =>
          import('./user-update/user-update.component').then(
            (m) => m.UserUpdateComponent
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
