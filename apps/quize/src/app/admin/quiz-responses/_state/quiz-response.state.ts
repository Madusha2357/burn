import { Injectable } from '@angular/core';
import {
  Page,
  PageData,
  ProjectionQuestionDataTable,
  ProjectionQuizResponseOverview,
} from '@damen/models';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { QuizResponseService } from '../_service/quiz-response.abstarct';
import { FilterByQuizID, GetQuizResponseById } from './quiz-response.actions';

export interface QuizResponseStateModel {
  response?: ProjectionQuizResponseOverview;
  data: Record<string, ProjectionQuestionDataTable>;
  page: PageData;
}

@State<QuizResponseStateModel>({
  name: 'quizResponse',
})
@Injectable({ providedIn: 'root' })
export class QuizResponseState {
  @Selector()
  static response({
    response,
  }: QuizResponseStateModel): ProjectionQuizResponseOverview {
    return response ?? ({} as ProjectionQuizResponseOverview);
  }

  @Selector() static pagedRecords({
    data,
    page,
  }: QuizResponseStateModel): Page<ProjectionQuestionDataTable> {
    return { data: Object.values(data), page };
  }

  constructor(private service: QuizResponseService) {}

  @Action(GetQuizResponseById)
  getQuizResponse(
    { setState }: StateContext<QuizResponseStateModel>,
    { userId, quizId }: GetQuizResponseById
  ) {
    return this.service.findOneByKey(userId, quizId).pipe(
      tap((response) => {
        const s: ProjectionQuizResponseOverview = {
          user: response[0].user,
          quiz: response[0].quiz,
          responses: response[0].responses,
          _id: '',
        };
        setState({
          response: s,
          page: {} as PageData,
          data: {} as Record<string, ProjectionQuestionDataTable>,
        });
      })
    );
  }

  @Action(FilterByQuizID)
  filterByQuizId(
    { setState }: StateContext<QuizResponseStateModel>,
    { data, id }: FilterByQuizID
  ) {
    return this.service.findByQuizId(data, id).pipe(
      tap((paged) => {
        const page = paged.page;
        const questions: Record<string, ProjectionQuestionDataTable> = {};
        paged.data.forEach((user) => (questions[user._id.toString()] = user));
        setState({
          data: questions,
          page: page,
        });
      })
    );
  }
}
