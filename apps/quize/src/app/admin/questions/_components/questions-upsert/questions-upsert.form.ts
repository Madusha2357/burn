import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Choice } from '@damen/models';
import { Store } from '@ngxs/store';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { QuizSelectDialogComponent } from '../../../quizzes/_components/quiz-select-dialog/quiz-select-dialog.component';
import { FindQuizByName } from '../../../quizzes/_state/quiz.actions';
import { QuizState } from '../../../quizzes/_state/quiz.state';
import { QuestionsUpsertChoiceComponent } from './questions-upsert-choice/questions-upsert-choice.component';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

export type QuestionFormGroup = FormGroup<{
  text: FormControl<string>;
  type: FormControl<string>;
  videoUrl: FormControl<string>;
  videoUrlMobile: FormControl<string>;
  image: FormControl<string>;
  imageMobile: FormControl<string>;
  timerInSeconds: FormControl<number>;
  displayOrder: FormControl<number>;
  choices: FormControl<Choice[] | null>;
  quiz: FormControl<string>;
  isMultipleChoice: FormControl<boolean>;
  status: FormControl<string>;
}>;

export function text() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function type() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function videoUrl() {
  return new FormControl('', {
    nonNullable: true,
  });
}
export function videoUrlMobile() {
  return new FormControl('', {
    nonNullable: true,
  });
}

export function image() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function imageMobile() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function timerInSeconds() {
  return new FormControl(60, { nonNullable: true });
}

export function displayOrder() {
  return new FormControl(1, { nonNullable: true });
}

export function choices() {
  return new FormControl<Choice[] | null>(null, { nonNullable: false });
}

export function quiz(notifier: Subject<void>) {
  const store = inject(Store);

  const ctrl = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  ctrl.valueChanges
    .pipe(
      takeUntil(notifier),
      tap((v) => store.dispatch(new FindQuizByName(v)))
    )
    .subscribe();

  return ctrl;
}

export function isMultipleChoice() {
  return new FormControl(false, {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function status() {
  return new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function quize$() {
  const store = inject(Store);
  return store.select(QuizState.searchedRecords).pipe(map((d) => d.data));
}

export const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  NgxsFormPluginModule,
  QuizSelectDialogComponent,
  QuestionsUpsertChoiceComponent,
  //
  MatButtonModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatCheckboxModule,
];
