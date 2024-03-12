import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  Page,
  ProjectionQuestionDataTable,
  ProjectionQuizResponseOverview,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class QuizResponseService {
  abstract findOneByKey(
    userId: string,
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]>;

  abstract findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionQuizResponseOverview>>;

  abstract findByQuizId(
    data: [Sort, PageEvent],
    quiz: string
  ): Observable<Page<ProjectionQuestionDataTable>>;
}
