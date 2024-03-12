import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PATH_ABOUT,
  PATH_CHECK_ANSWERS,
  PATH_SEAXPLORER,
  PATH_TNC,
  PATH_WINNER,
} from '../app-routing.conts';
import { SiteComponent } from './site.component';

const routes: Routes = [
  {
    path: '',
    component: SiteComponent,
  },
  {
    path: PATH_WINNER,
    loadComponent: () =>
      import('./_component/check-winner/check-winner.component').then(
        (m) => m.CheckWinnerComponent
      ),
  },
  {
    path: PATH_SEAXPLORER,
    loadComponent: () =>
      import('./_component/sea-xplorer/sea-xplorer.component').then(
        (m) => m.SeaXplorerComponent
      ),
  },
  {
    path: PATH_ABOUT,
    loadComponent: () =>
      import('./_component/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: PATH_CHECK_ANSWERS,
    loadComponent: () =>
      import('./_component/check-answers/check-answers.component').then(
        (m) => m.CheckAnswersComponent
      ),
  },
  {
    path: PATH_TNC,
    loadComponent: () =>
      import(
        './_component/terms-and-conditions/terms-and-conditions.component'
      ).then((m) => m.TermsAndConditionsComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteRoutingModule {}
