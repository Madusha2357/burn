import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../../../environments/environment';
import { QuizService } from './_service/quiz-service.abstract';
import { QuizMockService } from './_service/quiz-service.mock';
import { QuizHttpService } from './_service/quiz.service';
import { QuizState } from './_state/quiz.state';

@NgModule({
  imports: [NgxsModule.forFeature([QuizState])],
  providers: [
    {
      provide: QuizService,
      useClass: environment.useMock ? QuizMockService : QuizHttpService,
    },
  ],
})
export class QuizzesBaseModule {}
