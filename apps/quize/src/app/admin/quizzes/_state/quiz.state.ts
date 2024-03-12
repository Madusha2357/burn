import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Page,
  PageData,
  ProjectionQuizDataTable,
  ProjectionQuizResponseOverview,
  ProjectionQuizSelect,
  UpdateQuizResponseDto,
} from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import { tap } from 'rxjs';
import { PATH_ADMIN } from '../../../app-routing.conts';
import { DEFAULT_PAGE } from '../../../_consts/default-page';
import { snackbarSuccess } from '../../../_utils/snack-bar.utils';
import { PATH_QUIZZES } from '../../admin-routing.consts';
import { QuizSelectDialogComponent } from '../_components/quiz-select-dialog/quiz-select-dialog.component';
import { QuizService } from '../_service/quiz-service.abstract';
import {
  CreateQuiz,
  DownloadQuizResults,
  EditQuiz,
  FindQuizByUser,
  FindResultsByQuiz,
  GetQuizzes,
  SelectedQuizzes,
  UpdateQuiz,
  UpdateQuizResponse,
} from './quiz.actions';

export interface QuizStateModel {
  data: Record<string, ProjectionQuizDataTable>;
  searchData: Record<string, ProjectionQuizSelect>;
  page: PageData;
  selected?: ProjectionQuizDataTable[];
  results?: ProjectionQuizResponseOverview[];
}

@State<QuizStateModel>({
  name: 'adminQuiz',
  defaults: {
    data: {},
    searchData: {},
    page: DEFAULT_PAGE,
  },
})
@Injectable({ providedIn: 'root' })
export class QuizState {
  @Selector() static pagedRecords({
    data,
    page,
  }: QuizStateModel): Page<ProjectionQuizDataTable> {
    if (data) return { data: Object.values(data), page };
    else return { data: [], page };
  }

  @Selector() static searchedRecords({
    searchData,
    page,
  }: QuizStateModel): Page<ProjectionQuizSelect> {
    if (searchData) return { data: Object.values(searchData), page };
    else return { data: [], page };
  }

  @Selector([QuizState]) static getQuiz(id: string) {
    return createSelector([QuizState], (state: any) => {
      return state.adminQuiz.data[id];
    });
  }

  @Selector() static seleced({
    selected,
  }: QuizStateModel): ProjectionQuizDataTable[] | undefined {
    return selected;
  }

  @Selector() static results({
    results,
  }: QuizStateModel): ProjectionQuizResponseOverview[] | undefined {
    return results;
  }

  constructor(
    private service: QuizService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {}

  /**
   * Get users actions
   */
  @Action(GetQuizzes)
  getUsers({ patchState }: StateContext<QuizStateModel>, { data }: GetQuizzes) {
    return this.service.findAll(data).pipe(
      tap((paged) => {
        const page = paged.page;
        const users: Record<string, ProjectionQuizDataTable> = {};
        paged.data.forEach((user) => (users[user._id.toString()] = user));
        patchState({ data: users, page });
      })
    );
  }

  @Action(CreateQuiz)
  createQuiz(
    { getState, patchState }: StateContext<QuizStateModel>,
    { data }: CreateQuiz
  ) {
    const currentData = { ...getState().data };
    return this.service.save(data).pipe(
      tap((d) => (currentData[d._id] = d)),
      tap(() => patchState({ data: currentData })),
      tap(() => snackbarSuccess('Quiz Created', this.matSnackBar))
    );
  }

  @Action(EditQuiz)
  editQuiz({ dispatch }: StateContext<QuizStateModel>, { data }: EditQuiz) {
    dispatch(new Navigate([`${PATH_ADMIN}/${PATH_QUIZZES}/${data._id}`]));
  }

  @Action(SelectedQuizzes)
  selectQuiz(
    { patchState }: StateContext<QuizStateModel>,
    { selected }: SelectedQuizzes
  ) {
    console.log(selected);
    return patchState({ selected });
  }

  @Action(FindQuizByUser)
  findQuizByUser(
    { patchState }: StateContext<QuizStateModel>,
    { userId, sortAndPage, init }: FindQuizByUser
  ) {
    return this.service.findAllByUserId(sortAndPage, userId).pipe(
      tap((paged) => {
        if (init) {
          const options = { data: userId, width: '90%' };
          this.matDialog.open(QuizSelectDialogComponent, options);
        }

        const page = paged.page;
        const data: Record<string, ProjectionQuizDataTable> = {};
        paged.data.forEach((user) => (data[user._id.toString()] = user));
        patchState({ data, page });
      })
    );
  }

  @Action(UpdateQuiz)
  updateQuiz(
    { patchState }: StateContext<QuizStateModel>,
    { id, data }: UpdateQuiz
  ) {
    return this.service
      .update(id, data)
      .pipe(tap(() => snackbarSuccess('Quiz Updated', this.matSnackBar)));
  }

  @Action(FindResultsByQuiz)
  findResultsByQuiz(
    { patchState }: StateContext<QuizStateModel>,
    { quizId }: FindResultsByQuiz
  ) {
    return this.service.findResultsByQuiz(quizId).pipe(
      tap((results) => {
        patchState({ results });
      })
    );
  }

  @Action(UpdateQuizResponse)
  updateQuizResponse(
    { dispatch }: StateContext<QuizStateModel>,
    { quizResponseId, place }: UpdateQuizResponse
  ) {
    const quizResponse: UpdateQuizResponseDto = {
      isWinner: true,
      place: place,
    };

    return this.service.updateQuizResponse(quizResponseId, quizResponse).pipe(
      tap((e) => {
        dispatch(new FindResultsByQuiz(e.userQuizKey?.quizId ?? ''));
      })
    );
  }

  @Action(DownloadQuizResults)
  downloadQuizResults(
    { patchState }: StateContext<QuizStateModel>,
    { quizId }: DownloadQuizResults
  ) {
    return this.service.downloadQuizResults(quizId);
  }
}
