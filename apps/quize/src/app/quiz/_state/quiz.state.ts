import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuestionDataTable, UserStatus } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { catchError, mergeMap, tap, throwError } from 'rxjs';
import { AppState } from '../../_state/app.state';
import {
  PATH_QUESTION,
  PATH_QUIZ,
  PATH_QUIZ_FORM,
  PATH_SITE,
} from '../../app-routing.conts';
import { SiteState } from '../../site/_state/site.state';
import { QuizService } from '../_service/quiz.service.abstract';
import { QuestionState } from './questions/questions.state';
import { NextQuestion, StartQuiz, UpdateUserAddress } from './quiz.actions';

export interface QuizStateModel {
  question?: QuestionDataTable;
}

@State<QuizStateModel>({
  name: 'quiz',
  defaults: { question: {} as QuestionDataTable },
  children: [QuestionState],
})
@Injectable({ providedIn: 'root' })
export class QuizState {
  constructor(private quizService: QuizService, private store: Store) {}

  @Selector() static question(state: QuizStateModel) {
    return state.question;
  }

  /**
   * Get quiz action
   */
  @Action(StartQuiz)
  quizStart({ dispatch, patchState }: StateContext<QuizStateModel>) {
    return this.store.selectOnce(SiteState.quizId).pipe(
      mergeMap((id) => {
        if (id) return this.quizService.getQuestionByOrder(id, 1);
        else return throwError(() => new Error('Quiz id is empty!'));
      }),
      tap((question) => {
        patchState({ question });
        dispatch(new Navigate([`${PATH_QUIZ}/${PATH_QUESTION}`]));
      })
    );
  }

  /**
   * Get next question action
   */
  @Action(NextQuestion)
  nextQuestion(
    { patchState }: StateContext<QuizStateModel>,
    { order }: NextQuestion
  ) {
    return this.store.selectOnce(SiteState.quizId).pipe(
      mergeMap((id) => {
        if (id) return this.quizService.getQuestionByOrder(id, order);
        else return throwError(() => new Error('Quiz id is empty!'));
      }),
      tap((question) => {
        patchState({ question });
      }),
      catchError((error: any) => {
        return this.store.dispatch(new Navigate([`quiz/${PATH_QUIZ_FORM}`]));
      })
    );
  }

  /**
   * Update address
   */
  @Action(UpdateUserAddress)
  updateAddress(
    { dispatch }: StateContext<QuizStateModel>,
    { updateUser }: UpdateUserAddress
  ) {
    let params = new HttpParams();
    params = params.append('value', 'value');

    updateUser.status = UserStatus.COMPLETE;
    return this.store.selectOnce(AppState.tokenUser).pipe(
      mergeMap((user) => {
        if (user)
          return this.quizService.updateUserAddress(user.id, updateUser);
        else return throwError(() => new Error('User not found'));
      }),
      tap(() => {
        dispatch(new Navigate([PATH_SITE], params));
      })
    );
  }
}
