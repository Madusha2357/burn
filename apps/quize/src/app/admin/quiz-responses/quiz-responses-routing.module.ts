import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizResponsesComponent } from './quiz-responses.component';

const routes: Routes = [{ path: '', component: QuizResponsesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizResponsesRoutingModule {}
