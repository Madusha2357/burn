import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'enter-infomation',
    loadComponent: () =>
      import('./enter-infomation/enter-infomation.component').then(
        (c) => c.EnterInfomationComponent
      ),
  },
  {
    path: 'quize',
    loadComponent: () =>
      import('./quize/quize.component').then((c) => c.QuizeComponent),
  },
  {
    path: 'finalize-quiz',
    loadComponent: () =>
      import('./finalize-quiz/finalize-quiz.component').then(
        (c) => c.FinalizeQuizComponent
      ),
  },
  {
    path: 'enter-infomation/terms-and-conditions-new',
    loadComponent: () =>
      import(
        './terms-and-condition-new/terms-and-condition-new.component'
      ).then((c) => c.TermsAndConditionNewComponent),
  },
];
