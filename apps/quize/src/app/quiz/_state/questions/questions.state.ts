import { Injectable } from '@angular/core';
import { ICreateQuizResponseDto } from '@damen/models';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { QuizService } from '../../_service/quiz.service.abstract';
import { CreateQuizResponse, UserGivenAnswer } from './questions.actions';
import { tap } from 'rxjs';

export interface QuestionStateModel {
  id?: string;
}

@State<QuestionStateModel>({
  name: 'questions',
  defaults: { id: '' },
})
@Injectable({ providedIn: 'root' })
export class QuestionState {
  constructor(private quizService: QuizService, private store: Store) {}

  @Selector() static createdQuizResponseId(state: QuestionStateModel) {
    return state.id;
  }

  /**
   * Get question action
   */
  @Action(UserGivenAnswer)
  userResponse(
    { dispatch }: StateContext<QuestionStateModel>,
    { id, quizResponse }: UserGivenAnswer
  ) {
    return this.quizService.patchAnswer(id, quizResponse);
  }

  /**
   * Get question action
   */
  @Action(CreateQuizResponse)
  createQuizResponse(
    { patchState }: StateContext<QuestionStateModel>,
    { quizId, userId }: CreateQuizResponse
  ) {
    const createQuizResponse: ICreateQuizResponseDto = {
      userQuizKey: {
        quizId: quizId,
        userId: userId,
      },
    };

    return this.quizService.createQuestionResponse(createQuizResponse).pipe(
      tap((res) => {
        patchState({ id: res._id });
      })
    );
  }
}
