import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as path from './app-routing.conts';
import { AppGuard } from './_services/app.guard';
import { NgxsModule } from '@ngxs/store';
import { MapState } from './map/_state/map.state';
import { environment } from '../environments/environment';
import { MapHttpService } from './map/_service/map.service';
import { MapService } from './map/_service/map.service.abstract';
import { MapMockService } from './map/_service/map.service.mock';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: path.PATH_ADMIN,
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AppGuard],
  },
  {
    path: path.PATH_LOGIN,
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: path.PATH_SITE,
    loadChildren: () => import('./site/site.module').then((m) => m.SiteModule),
    // canActivate: [AppGuard],
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((r) => r.LandingModule),
  },
  {
    path: 'map',
    providers: [
      {
        provide: MapService,
        useClass: environment.useMock ? MapMockService : MapHttpService,
      },
      importProvidersFrom(NgxsModule.forFeature([MapState])),
    ],
    loadChildren: () =>
      import('./map/map-routing.module').then((r) => r.MapRoutingModule),
  },
  {
    path: 'doctors',
    providers: [
      {
        provide: MapService,
        useClass: environment.useMock ? MapMockService : MapHttpService,
      },
      importProvidersFrom(NgxsModule.forFeature([MapState])),
    ],
    loadChildren: () =>
      import('./doctors/doctors-routing.module').then(
        (r) => r.DoctorsRoutingModule
      ),
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./site/_component/terms-and-conditions/blog/blog.component').then(
        (m) => m.BlogsComponent
      ),
  },
  {
    path: 'articles',
    loadComponent: () =>
      import(
        './site/_component/terms-and-conditions/terms-and-conditions.component'
      ).then((m) => m.TermsAndConditionsComponent),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      useHash: true,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
