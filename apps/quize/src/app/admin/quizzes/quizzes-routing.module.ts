import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATH_RESULTS } from '../admin-routing.consts';
import { QuizzesComponent } from './quizzes.component';
import { QuizDataResolver } from './_resolvers/quiz-data.resolver';

const routes: Routes = [
  { path: '', component: QuizzesComponent },
  {
    path: ':id',
    loadComponent: () =>
      import('./_components/quiz-upsert/quiz-upsert.component').then(
        (m) => m.QuizUpsertComponent
      ),
    resolve: { quiz: QuizDataResolver },
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./_components/quiz-results/quiz-results.component').then(
        (m) => m.QuizResultsComponent
      ),
    resolve: { quiz: QuizDataResolver },
  },
  {
    path: `:id/${PATH_RESULTS}`,
    loadComponent: () =>
      import('./_components/quiz-results/quiz-results.component').then(
        (m) => m.QuizResultsComponent
      ),
    resolve: { quiz: QuizDataResolver },
  },
  {
    path: `:id/${PATH_RESULTS}`,
    loadComponent: () =>
      import('./_components/quiz-results/quiz-results.component').then(
        (m) => m.QuizResultsComponent
      ),
    resolve: { quiz: QuizDataResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizzesRoutingModule {}
