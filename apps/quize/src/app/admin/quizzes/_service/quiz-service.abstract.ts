import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateQuizDto,
  Page,
  ProjectionQuizDataTable,
  ProjectionQuizResponseOverview,
  UpdateQuizResponseDto,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class QuizService {
  abstract findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionQuizDataTable>>;

  abstract save(dto: ICreateQuizDto): Observable<ProjectionQuizDataTable>;

  abstract findAllByUserId(
    data: [Sort, PageEvent],
    id: string
  ): Observable<Page<ProjectionQuizDataTable>>;

  //abstract findAllByName(name: string): Observable<Page<ProjectionQuizSelect>>;

  abstract update(
    id: string,
    updateQuizDto: UpdateQuizResponseDto
  ): Observable<ProjectionQuizDataTable>;

  abstract findResultsByQuiz(
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]>;

  abstract updateQuizResponse(
    id: string,
    updateQuizResDto: UpdateQuizResponseDto
  ): Observable<ProjectionQuizResponseOverview>;

  abstract downloadQuizResults(quizId: string): unknown;
}
