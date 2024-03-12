import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PATH_QUESTIONS,
  PATH_QUIZZES,
  PATH_QUIZ_RESPONSES,
  PATH_TRIGGER_EVENTS,
  PATH_USER,
} from './admin-routing.consts';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: PATH_USER,
        pathMatch: 'full',
      },
      {
        path: PATH_USER,
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
        data: {
          title: 'Users',
        },
      },
      {
        path: PATH_QUIZZES,
        loadChildren: () =>
          import('./quizzes/quizzes.module').then((m) => m.QuizzesModule),
      },
      {
        path: PATH_QUESTIONS,
        loadChildren: () =>
          import('./questions/questions.module').then((m) => m.QuestionsModule),
      },
      {
        path: PATH_TRIGGER_EVENTS,
        loadChildren: () =>
          import('./trigger-event/trigger-event.module').then(
            (m) => m.TriggerEventModule
          ),
      },
      {
        path: PATH_QUIZ_RESPONSES,
        loadChildren: () =>
          import('./quiz-responses/quiz-responses.module').then(
            (m) => m.QuizResponsesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
