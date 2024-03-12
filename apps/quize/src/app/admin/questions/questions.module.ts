import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuizzesBaseModule } from '../quizzes/quizzes-base.module';
import { QuestionsListComponent } from './_components/questions-list/questions-list.component';
import { QuestionsBaseModule } from './questions-base.module';
import { QuestionsRoutingModule } from './questions-routing.module';
import { QuestionsComponent } from './questions.component';

@NgModule({
  declarations: [QuestionsComponent],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    QuestionsListComponent,
    QuestionsBaseModule,
    QuizzesBaseModule,
  ],
})
export class QuestionsModule {}
