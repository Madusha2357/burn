import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../../../environments/environment';
import { QuestionService } from './_service/question-service.abstract';
import { QuestionMockService } from './_service/question-service.mock';
import { QuestionHttpService } from './_service/question.service';
import { QuestionState } from './_state/question.state';

@NgModule({
  imports: [NgxsModule.forFeature([QuestionState])],
  providers: [
    {
      provide: QuestionService,
      useClass: environment.useMock ? QuestionMockService : QuestionHttpService,
    },
  ],
})
export class QuestionsBaseModule {}
