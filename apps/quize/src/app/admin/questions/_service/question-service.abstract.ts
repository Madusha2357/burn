import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateQuestionDto,
  ImageUploaded,
  Page,
  ProjectionQuestionDataTable,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class QuestionService {
  abstract findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionQuestionDataTable>>;

  abstract save(
    dto: ICreateQuestionDto
  ): Observable<ProjectionQuestionDataTable>;

  abstract uploadImage(formData: FormData): Observable<ImageUploaded>;

  abstract update(
    id: string,
    updateQuestionDto: ProjectionQuestionDataTable
  ): Observable<ProjectionQuestionDataTable>;

  abstract findByQuizId(
    data: [Sort, PageEvent],
    id: string
  ): Observable<Page<ProjectionQuestionDataTable>>;
}
