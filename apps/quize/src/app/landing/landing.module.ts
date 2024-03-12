import { NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { LandingRoutingModule } from './landing-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  providers: [
    // {
    //   provide: LoginService,
    //   useClass: environment.useMock ? LoginMockService : LoginHttpService,
    // },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    // NgxsModule.forFeature([SiteState]),
  ],
})
export class LandingModule {}
