import { NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { IMPORTS, IMPORTS_STATE } from './login.module.utils';
import { LoginHttpService } from './_service/login.service';
import { LoginService } from './_service/login.service.abstract';
import { LoginMockService } from './_service/login.service.mock';

@NgModule({
  declarations: [LoginComponent],
  providers: [
    {
      provide: LoginService,
      useClass: environment.useMock ? LoginMockService : LoginHttpService,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
  ],
  imports: [
    LoginRoutingModule,
    NgxsModule.forFeature([...IMPORTS_STATE]),
    ...IMPORTS,
  ],
})
export class LoginModule {}
