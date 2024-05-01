import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { LoginState } from '../login/_state/login.state';
import { CountdownComponent } from './_design-components/countdown/countdown.component';
import { DestinationsCarouselComponent } from './_design-components/destinations-carousel/destinations-carousel.component';
import { FooterComponent } from './_design-components/footer/footer.component';
import { GetReadyComponent } from './_design-components/get-ready/get-ready.component';
import { IntoVideoComponent } from './_design-components/into-video/into-video.component';
import { NavigationBarComponent } from './_design-components/navigation-bar/navigation-bar.component';
import { SeaExplorerComponent } from './_design-components/sea-explorer/sea-explorer.component';
import { SecondImageAndAboutComponent } from './_design-components/second-image-and-about/second-image-and-about.component';
import { SiteHttpService } from './_service/site.service';
import { SiteService } from './_service/site.service.abstract';
import { SiteMockService } from './_service/site.service.mock';
import { SiteState } from './_state/site.state';
import { SiteRoutingModule } from './site-routing.module';
import { SiteComponent } from './site.component';
import { RegisterCodeState } from '../login/_state/register-code/register-code.state';
import { RegistrationState } from '../login/_state/user-registration/user-registration.state';
import { LoginService } from '../login/_service/login.service.abstract';
import { LoginHttpService } from '../login/_service/login.service';
import { LoginMockService } from '../login/_service/login.service.mock';
import { RouterModule } from '@angular/router';
import { UserUpdateComponent } from '../login/user-update/user-update.component';

@NgModule({
  declarations: [
    SiteComponent,
    IntoVideoComponent,
    CountdownComponent,
    SeaExplorerComponent,
    DestinationsCarouselComponent,
    GetReadyComponent,
  ],
  providers: [
    {
      provide: SiteService,
      useClass: environment.useMock ? SiteMockService : SiteHttpService,
    },
    {
      provide: LoginService,
      useClass: environment.useMock ? LoginMockService : LoginHttpService,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
  ],
  imports: [
    CommonModule,
    FooterComponent,
    RouterModule,
    NavigationBarComponent,
    SiteRoutingModule,
    FormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    NgxsModule.forFeature([
      SiteState,
      LoginState,
      RegisterCodeState,
      RegistrationState,
    ]),
    SecondImageAndAboutComponent,
    MatDialogModule,
    UserUpdateComponent,
    MatDialogModule,
  ],
})
export class SiteModule {}
