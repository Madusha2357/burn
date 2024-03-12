import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Page, PageData, ProjectionQuestionDataTable } from '@damen/models';
import { UpdateFormValue } from '@ngxs/form-plugin';
import {
  Action,
  Selector,
  State,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { tap, throwError } from 'rxjs';
import { DEFAULT_PAGE } from '../../../_consts/default-page';
import { snackbarSuccess } from '../../../_utils/snack-bar.utils';
import { QuestionService } from '../_service/question-service.abstract';
import {
  CreateQuestion,
  FilterByQuizID,
  GetQuestions,
  UpdateQuestion,
  UploadImage,
} from './question.actions';

export interface QuestionStateModel {
  data: Record<string, ProjectionQuestionDataTable>;
  page: PageData;
  form?: unknown;
}

@State<QuestionStateModel>({
  name: 'question',
  defaults: {
    data: {},
    page: DEFAULT_PAGE,
    form: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
@Injectable({ providedIn: 'root' })
export class QuestionState {
  @Selector() static pagedRecords({
    data,
    page,
  }: QuestionStateModel): Page<ProjectionQuestionDataTable> {
    return { data: Object.values(data), page };
  }

  @Selector([QuestionState]) static getQuestion(id: string) {
    return createSelector([QuestionState], (state: any) => {
      return state.question.data[id];
    });
  }

  constructor(
    private service: QuestionService,
    private matSnackBar: MatSnackBar
  ) {}

  /**
   * Get users actions
   */
  @Action(GetQuestions)
  findAll(
    { patchState }: StateContext<QuestionStateModel>,
    { data }: GetQuestions
  ) {
    return this.service.findAll(data).pipe(
      tap((paged) => {
        const page = paged.page;
        const questions: Record<string, ProjectionQuestionDataTable> = {};
        paged.data.forEach((user) => (questions[user._id.toString()] = user));
        patchState({ data: questions, page });
      })
    );
  }

  @Action(UploadImage)
  uploadImage(
    { dispatch }: StateContext<QuestionStateModel>,
    { event, feild: propertyPath }: UploadImage
  ) {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      return this.service.uploadImage(formData).pipe(
        tap((d) =>
          dispatch(
            new UpdateFormValue({
              path: 'question.form',
              value: d.name,
              propertyPath,
            })
          )
        )
      );
    } else {
      return throwError(() => new Error('File not selected'));
    }
  }

  @Action(CreateQuestion)
  createQuiz(
    { getState, patchState }: StateContext<QuestionStateModel>,
    { data }: CreateQuestion
  ) {
    const currentData = { ...getState().data };
    return this.service.save(data).pipe(
      tap((d) => (currentData[d._id] = d)),
      tap(() => patchState(currentData)),
      tap(() => snackbarSuccess('Question Created', this.matSnackBar))
    );
  }

  @Action(UpdateQuestion)
  updateQuestion(
    { patchState }: StateContext<QuestionStateModel>,
    { id, data }: UpdateQuestion
  ) {
    return this.service
      .update(id, data)
      .pipe(tap(() => snackbarSuccess('Question Updated', this.matSnackBar)));
  }

  @Action(FilterByQuizID)
  filterByQuizId(
    { patchState }: StateContext<QuestionStateModel>,
    { data, id }: FilterByQuizID
  ) {
    return this.service.findByQuizId(data, id).pipe(
      tap((paged) => {
        const page = paged.page;
        const questions: Record<string, ProjectionQuestionDataTable> = {};
        paged.data.forEach((user) => (questions[user._id.toString()] = user));
        patchState({ data: questions, page });
      })
    );
  }
}
