import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './questions.component';
import { QuestionDataResolver } from './resolvers/question-data.resolver';

const routes: Routes = [
  { path: '', component: QuestionsComponent },
  {
    path: ':id',
    loadComponent: () =>
      import('./_components/questions-upsert/questions-upsert.component').then(
        (m) => m.QuestionsUpsertComponent
      ),
    resolve: { question: QuestionDataResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionsRoutingModule {}
