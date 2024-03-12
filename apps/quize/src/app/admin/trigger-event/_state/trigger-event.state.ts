import { Injectable } from '@angular/core';
import { Page, PageData, ProjectionEventDataTable } from '@damen/models';
import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { tap } from 'rxjs';
import { EventService } from '../_service/trigger-event-service.abstract';
import { TriggerEvent } from './trigger-event.actions';

export interface EventStateModel {
  data: Record<string, ProjectionEventDataTable>;
  page: PageData;
}

@State<EventStateModel>({
  name: 'events',
  defaults: {
    data: {},
    page: { length: 0, pageIndex: 0, pageSize: 0 },
  },
})
@Injectable({ providedIn: 'root' })
export class EventState {
  @Selector() static pagedRecords({
    data,
    page,
  }: EventStateModel): Page<ProjectionEventDataTable> {
    return { data: Object.values(data), page };
  }

  @Selector([EventState]) static getUser(id: string) {
    return createSelector([EventState], (state: any) => {
      return state.users.data[id];
    });
  }

  constructor(private service: EventService, private store: Store) {}

  @Action(TriggerEvent)
  triggerEvent(
    { setState }: StateContext<EventStateModel>,
    { data }: TriggerEvent
  ) {
    return this.service.triggerEvent(data).pipe(
      tap((paged) => {
        const page = paged.page;
        const data: Record<string, ProjectionEventDataTable> = {};
        paged.data.forEach((user) => (data[user._id.toString()] = user));
        setState({ data, page });
      })
    );
  }

  // @Action(TriggerEvent)
  // sse({ setState }: StateContext<EventStateModel>, { data }: TriggerEvent) {
  //   return this.service
  //     .getSse()
  //     .pipe(tap(() => this.store.dispatch(new TriggerEvent(data))));
  // }
}
