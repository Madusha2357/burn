import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ICreateQuizDto,
  Page,
  ProjectionQuestionDataTable,
  ProjectionQuizDataTable,
  RecordStatus,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Subscription, tap } from 'rxjs';
import { DEFAULT_PAGE } from '../../../../_consts/default-page';
import { CreateQuiz, UpdateQuiz } from '../../_state/quiz.actions';
import * as utils from './quiz-form.utils';

@Component({
  selector: 'damen-quiz-upsert',
  standalone: true,
  imports: utils.IMPORTS,
  templateUrl: './quiz-upsert.component.html',
  styleUrls: ['./quiz-upsert.component.scss'],
})
export class QuizUpsertComponent {
  id = '0';
  formGroup: utils.QuizeFormGroup;
  name = utils.getNameFormControl();
  startTime = utils.getStatTimeFormControl();
  endTime = utils.getEndTimeFormControl();
  minimalAnswerCountForWinning = utils.getWinningCountFormControl();
  status = utils.getStatusFormControl();

  private subscription: Subscription;
  statuss = [RecordStatus.ACTIVE, RecordStatus.INACTIVE, RecordStatus.EXPIRED];

  pagedRecords: Page<ProjectionQuestionDataTable> = {
    data: [],
    page: DEFAULT_PAGE,
  };

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
    this.formGroup = new FormGroup({
      name: this.name,
      startTime: this.startTime,
      endTime: this.endTime,
      minimalAnswerCountForWinning: this.minimalAnswerCountForWinning,
      status: this.status,
    });

    this.subscription = this.activatedRoute.data
      .pipe(
        tap((data) => {
          if (data && data['quiz']) {
            this.id = (data['quiz'] as ProjectionQuizDataTable)._id;
            this.formGroup.patchValue(data['quiz']);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSave() {
    if (this.id == '0') {
      this.store.dispatch(
        new CreateQuiz(this.formGroup.value as ICreateQuizDto)
      );
    } else {
      this.store.dispatch(
        new UpdateQuiz(this.id, this.formGroup.value as ProjectionQuizDataTable)
      );
    }
  }
}
