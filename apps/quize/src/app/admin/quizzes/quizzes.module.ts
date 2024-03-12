import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuizzesBaseModule } from './quizzes-base.module';
import { QuizzesRoutingModule } from './quizzes-routing.module';
import { QuizzesComponent } from './quizzes.component';
import { IMPORTS } from './quizzes.module.utils';
import { QuizListComponent } from './_components/quiz-list/quiz-list.component';
import { QuizSelectDialogComponent } from './_components/quiz-select-dialog/quiz-select-dialog.component';

@NgModule({
  declarations: [QuizzesComponent],
  imports: [
    QuizzesBaseModule,
    CommonModule,
    QuizzesRoutingModule,
    QuizListComponent,
    QuizSelectDialogComponent,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    ...IMPORTS,
  ],
})
export class QuizzesModule {}
