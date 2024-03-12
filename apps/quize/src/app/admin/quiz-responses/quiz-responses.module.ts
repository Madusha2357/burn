import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizResponsesComponent } from './quiz-responses.component';
import { QuizResponsesRoutingModule } from './quiz-responses-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { QuizStatusDirective } from './_directives/quiz-status.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuizResponseService } from './_service/quiz-response.abstarct';
import { QuizResponseMockService } from './_service/quiz-response.mock';
import { QuizResponseHttpService } from './_service/quiz-response.service';
import { environment } from '../../../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { QuizResponseState } from './_state/quiz-response.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [QuizResponsesComponent, QuizStatusDirective],
  imports: [
    CommonModule,
    QuizResponsesRoutingModule,
    MatIconModule,
    MatTableModule,
    NgxsModule.forFeature([QuizResponseState]),
    MatPaginatorModule,
    MatSnackBarModule,
    MatToolbarModule,
  ],
  providers: [
    {
      provide: QuizResponseService,
      useClass: environment.useMock
        ? QuizResponseMockService
        : QuizResponseHttpService,
    },
  ],
})
export class QuizResponsesModule {}
