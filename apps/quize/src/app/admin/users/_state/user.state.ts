import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Page, PageData, ProjectionUserDataTable } from '@damen/models';
import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import { catchError, mergeMap, tap } from 'rxjs';
import {
  snackBarError,
  snackbarSuccess,
} from '../../../_utils/snack-bar.utils';
import { UserService } from '../_service/user-service.abstract';
import {
  CreateUser,
  DeleteUser,
  DownloadCsv,
  GetRegisteredUsers,
  GetUsers,
  GetUsersByQuiz,
  SendInvitationEmail,
  UpdateUser,
  ViewAnswers,
} from './user.actions';
import { DEFAULT_SORT } from '../../../_consts/default-sort';
import { DEFAULT_PAGE } from '../../../_consts/default-page';

export interface UserStateModel {
  data: Record<string, ProjectionUserDataTable>;
  page: PageData;
  id?: string;
}

@State<UserStateModel>({
  name: 'users',
  defaults: {
    data: {},
    page: { length: 0, pageIndex: 0, pageSize: 0 },
  },
})
@Injectable({ providedIn: 'root' })
export class UserState {
  @Selector() static pagedRecords({
    data,
    page,
  }: UserStateModel): Page<ProjectionUserDataTable> {
    return { data: Object.values(data), page };
  }

  @Selector([UserState]) static getUser(id: string) {
    return createSelector([UserState], (state: any) => {
      return state.users.data[id];
    });
  }

  @Selector() static getUserId(state: UserStateModel) {
    return state.id;
  }

  constructor(
    private service: UserService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {}

  /**
   * Get users actions
   */
  @Action(GetUsers)
  getUsers({ setState }: StateContext<UserStateModel>, { data }: GetUsers) {
    return this.service.findAll(data).pipe(
      tap((paged) => {
        const page = paged.page;
        const data: Record<string, ProjectionUserDataTable> = {};
        paged.data.forEach((user) => (data[user._id.toString()] = user));
        setState({ data, page });
      })
    );
  }

  @Action(CreateUser)
  createUser(state: StateContext<UserStateModel>, { data }: CreateUser) {
    return this.service.create(data).pipe(
      tap(() => snackbarSuccess('User Created', this.matSnackBar)),
      catchError(async () =>
        snackBarError(
          'email or registercode already excited!',
          this.matSnackBar
        )
      )
    );
  }

  @Action(UpdateUser)
  updateUser(state: StateContext<UserStateModel>, { id, data }: UpdateUser) {
    return this.service
      .update(id, data)
      .pipe(tap(() => snackbarSuccess('User Updated', this.matSnackBar)));
  }

  @Action(DeleteUser)
  deleteUser(
    { getState, dispatch }: StateContext<UserStateModel>,
    { id, data }: DeleteUser
  ) {
    const { page } = getState();
    const get = new GetUsers([DEFAULT_SORT, DEFAULT_PAGE]);

    return this.service.delete(id, data).pipe(
      mergeMap(() => dispatch(get)),
      tap(() => {
        snackbarSuccess('User Deleted', this.matSnackBar);
      })
    );
  }

  @Action(ViewAnswers)
  viewAnsers(
    { patchState }: StateContext<UserStateModel>,
    { data }: ViewAnswers
  ) {
    patchState({ id: data._id });
  }

  @Action(GetRegisteredUsers)
  getRegisteredUsers(
    { setState }: StateContext<UserStateModel>,
    { user, data }: GetRegisteredUsers
  ) {
    return this.service.findRegisteredUsers(user, data).pipe(
      tap((paged) => {
        const page = paged.page;
        const data: Record<string, ProjectionUserDataTable> = {};
        paged.data.forEach((user) => (data[user._id.toString()] = user));
        setState({ data, page });
      })
    );
  }

  @Action(SendInvitationEmail)
  sendInvitationEmail(
    { setState }: StateContext<UserStateModel>,
    { userId }: SendInvitationEmail
  ) {
    return this.service.sendInvitationEmail(userId);
  }

  @Action(DownloadCsv)
  downloadCsv(
    { setState }: StateContext<UserStateModel>,
    { quizId }: DownloadCsv
  ) {
    return this.service.downloadCsv(quizId);
  }

  @Action(GetUsersByQuiz)
  getUsersByQuiz(
    { setState }: StateContext<UserStateModel>,
    { id, data }: GetUsersByQuiz
  ) {
    return this.service.getUsersByQuiz(id, data).pipe(
      tap((paged) => {
        const page = paged.page;
        const data: Record<string, ProjectionUserDataTable> = {};
        paged.data.forEach((user) => (data[user._id] = user));
        setState({ data, page });
      })
    );
  }
}
