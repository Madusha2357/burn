import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { mergeMap, throwError } from 'rxjs';
import { AppState } from '../../_state/app.state';
import { GetCurretQuize } from '../../site/_state/site.actions';
import { SiteState } from '../../site/_state/site.state';
import { CreateQuizResponse } from '../_state/questions/questions.actions';
import { StartQuiz } from '../_state/quiz.actions';

@Component({
  selector: 'damen-start-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-quiz.component.html',
  styleUrls: ['./start-quiz.component.scss'],
})
export class StartQuizComponent {
  quizId?: string;
  controllerSrc: unknown;

  constructor(private store: Store) {
    this.store.dispatch(new GetCurretQuize());
  }
  /**
   * Start the quiz
   */
  startQuiz() {
    this.store
      .selectOnce(SiteState.quizId)
      .pipe(
        mergeMap((quizId) => {
          this.quizId = quizId;
          return this.store.selectOnce(AppState.tokenUser);
        }),
        mergeMap((user) => {
          if (user && this.quizId)
            return this.store.dispatch(
              new CreateQuizResponse(this.quizId, user.id)
            );
          else
            return throwError(() => new Error('Quiz id or user id is empty!'));
        })
      )
      .subscribe();
    this.store.dispatch(new StartQuiz());
  }
}
