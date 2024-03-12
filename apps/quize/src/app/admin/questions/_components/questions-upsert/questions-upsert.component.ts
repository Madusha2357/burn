import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ICreateQuestionDto,
  ProjectionQuestionDataTable,
  ProjectionQuizDataTable,
  ProjectionQuizSelect,
  ProjectionUserDataTable,
  QuestionType,
  RecordStatus,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { QuizState } from '../../../quizzes/_state/quiz.state';
import {
  CreateQuestion,
  UpdateQuestion,
  UploadImage,
} from '../../_state/question.actions';
import * as form from './questions-upsert.form';

@Component({
  selector: 'damen-questions-upsert',
  standalone: true,
  imports: form.IMPORTS,
  templateUrl: './questions-upsert.component.html',
  styleUrls: ['./questions-upsert.component.scss'],
})
export class QuestionsUpsertComponent implements OnDestroy {
  notifier = new Subject<void>();

  formGroup: form.QuestionFormGroup;

  id = '0';
  text = form.text();
  type = form.type();
  videoUrl = form.videoUrl();
  videoUrlMobile = form.videoUrlMobile();
  image = form.image();
  imageMobile = form.imageMobile();
  timerInSeconds = form.timerInSeconds();
  displayOrder = form.displayOrder();
  quiz = form.quiz(this.notifier);
  choices = form.choices();
  isMultipleChoice = form.isMultipleChoice();
  status = form.status();

  user?: ProjectionUserDataTable;
  quizzes$: Observable<ProjectionQuizSelect[]>;
  quizes!: ProjectionQuizDataTable[];

  statuss = [RecordStatus.ACTIVE, RecordStatus.INACTIVE, RecordStatus.EXPIRED];
  types = [
    QuestionType.TEXT,
    QuestionType.SINGLE_CHOICE,
    QuestionType.MULTIPLE_CHOICE,
  ];

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {
    this.formGroup = new FormGroup({
      text: this.text,
      type: this.type,
      videoUrl: this.videoUrl,
      videoUrlMobile: this.videoUrlMobile,
      image: this.image,
      imageMobile: this.imageMobile,
      timerInSeconds: this.timerInSeconds,
      displayOrder: this.displayOrder,
      quiz: this.quiz,
      choices: this.choices,
      isMultipleChoice: this.isMultipleChoice,
      status: this.status,
    });

    this.quizzes$ = form.quize$();

    this.store
      .selectOnce(QuizState.pagedRecords)
      .pipe(tap((res) => (this.quizes = res.data)))
      .subscribe();

    this.activatedRoute.data
      .pipe(
        takeUntil(this.notifier),
        tap((data) => {
          console.log(data);
          if (data && data['question']) {
            this.id = (data['question'] as ProjectionQuestionDataTable)._id;
            this.formGroup.patchValue(data['question']);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  quizeAutoCompleteDisplayFn(quiz: ProjectionQuizSelect) {
    return quiz && quiz.name ? quiz.name : '';
  }

  onImageChange(event: Event, field: string) {
    this.store.dispatch(new UploadImage(event, field));
  }

  onSave() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.id == '0') {
      this.store.dispatch(
        new CreateQuestion(
          this.formGroup.value as unknown as ICreateQuestionDto
        )
      );
    } else {
      this.store.dispatch(
        new UpdateQuestion(
          this.id,
          this.formGroup.value as unknown as ProjectionQuestionDataTable
        )
      );
    }
  }
}
