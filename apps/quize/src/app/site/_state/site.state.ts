import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ProjectionUserDataTable,
  RecordStatus,
  UserStatus,
} from '@damen/models';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { catchError, mergeMap, tap, throwError } from 'rxjs';
import { DEFAULT_PAGE } from '../../_consts/default-page';
import { DEFAULT_SORT } from '../../_consts/default-sort';
import { AppState } from '../../_state/app.state';
import { SiteService } from '../_service/site.service.abstract';
import {
  CheckUserParticipation,
  GetCurrentUser,
  GetCurretQuize,
  GetVideoLink,
} from './site.actions';

export interface SiteStateModel {
  quizeStartTime?: string;
  quizeId?: string;
  status?: RecordStatus;
  data?: Record<string, ProjectionUserDataTable>;
  user?: ProjectionUserDataTable;
  videoLink?: string;
}

@State<SiteStateModel>({ name: 'site' })
@Injectable({ providedIn: 'root' })
export class SiteState {
  constructor(private siteService: SiteService, private store: Store) {}

  @Selector() static quizStartTime(state: SiteStateModel) {
    return state.quizeStartTime;
  }

  @Selector() static hasQuizCompleted(state: SiteStateModel) {
    if (state.status === RecordStatus.INACTIVE) {
      return true;
    }
    return state.user?.status == UserStatus.COMPLETE ? true : false;
  }

  @Selector() static quizId(state: SiteStateModel) {
    return state.quizeId;
  }

  @Selector() static checkUserParticipant(state: SiteStateModel) {
    return state.data;
  }

  @Selector() static getVideoLink(state: SiteStateModel) {
    return state.videoLink;
  }

  /**
   * Loading state
   */
  @Action(GetCurretQuize)
  getTimer({ patchState }: StateContext<SiteStateModel>) {
    return this.siteService.getTimer().pipe(
      tap((res) => {
        const timer = res.startTime.toString();
        patchState({
          quizeStartTime: timer,
          quizeId: res._id,
        });
      }),
      catchError((e) => {
        patchState({
          status: RecordStatus.INACTIVE,
        });
        return throwError(() => e);
      })
    );
  }

  @Action(GetCurrentUser)
  getCurrentUser({ patchState }: StateContext<SiteStateModel>) {
    return this.store.selectOnce(AppState.tokenUser).pipe(
      mergeMap((user) => {
        //patchState({ user });
        if (user) return this.siteService.findUserById(user.id);
        else return throwError(() => new Error('User not found'));
      }),
      tap((user) => {
        patchState({ user });
      })
    );
  }

  @Action(CheckUserParticipation)
  checkUserParticipation({ patchState }: StateContext<SiteStateModel>) {
    const data: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE];

    return this.siteService.findRegisteredUsers('2', data).pipe(
      tap((paged) => {
        const data: Record<string, ProjectionUserDataTable> = {};
        paged.data.forEach((user) => (data[user._id.toString()] = user));
        patchState({ data });
      })
    );
  }

  @Action(GetVideoLink)
  getVideoLink(
    { patchState }: StateContext<SiteStateModel>,
    { videoLink }: GetVideoLink
  ) {
    console.log('v', videoLink);
    patchState({ videoLink });
  }
}
