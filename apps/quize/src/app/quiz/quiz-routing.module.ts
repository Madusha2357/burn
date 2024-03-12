import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PATH_QUESTION,
  PATH_QUIZ,
  PATH_QUIZ_FORM,
  PATH_QUIZ_NOT_STARTNG,
  PATH_WELCOME,
} from '../app-routing.conts';
import { QuizComponent } from './quiz.component';

const routes: Routes = [
  {
    path: '',
    component: QuizComponent,
    children: [
      {
        path: '',
        redirectTo: PATH_WELCOME,
        pathMatch: 'full',
      },
      {
        path: PATH_WELCOME,
        loadComponent: () =>
          import('./start-quiz/start-quiz.component').then(
            (m) => m.StartQuizComponent
          ),
      },
      {
        path: PATH_QUESTION,
        loadChildren: () =>
          import('./questions/questions.module').then((m) => m.QuestionsModule),
      },
      {
        path: PATH_QUIZ_FORM,
        loadComponent: () =>
          import('./quiz-form/quiz-form.component').then(
            (m) => m.QuizFormComponent
          ),
      },
      {
        path: PATH_QUIZ_NOT_STARTNG,
        loadComponent: () =>
          import('./quiz-not-starting/quiz-not-starting.component').then(
            (m) => m.QuizNotStartingComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRoutingModule {}
