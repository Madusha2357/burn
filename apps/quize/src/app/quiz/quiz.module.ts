import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizService } from './_service/quiz.service.abstract';
import { environment } from '../../environments/environment';
import { QuizHttpService } from './_service/quiz.service';
import { QuizMockService } from './_service/quiz.service.mock';
import { NgxsModule } from '@ngxs/store';
import { QuizState } from './_state/quiz.state';
import { QuizComponent } from './quiz.component';
import { QuestionState } from './_state/questions/questions.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SiteState } from '../site/_state/site.state';
import { SiteService } from '../site/_service/site.service.abstract';
import { SiteHttpService } from '../site/_service/site.service';
import { SiteMockService } from '../site/_service/site.service.mock';

@NgModule({
  declarations: [QuizComponent],
  providers: [
    {
      provide: QuizService,
      useClass: environment.useMock ? QuizMockService : QuizHttpService,
    },
    {
      provide: SiteService,
      useClass: environment.useMock ? SiteMockService : SiteHttpService,
    },
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    MatSnackBarModule,
    NgxsModule.forFeature([QuizState, QuestionState, SiteState]),
  ],
})
export class QuizModule {}
