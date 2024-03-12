import { Component } from '@angular/core';
import {
  Page,
  ProjectionEventDataTable,
  ProjectionUserDataTable,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EventState } from '../trigger-event/_state/trigger-event.state';
import { UserState } from './_state/user.state';

@Component({
  selector: 'damen-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  pagedRecords$: Observable<Page<ProjectionUserDataTable>>;
  eventRecords$: Observable<Page<ProjectionEventDataTable>>;

  constructor(private store: Store) {
    this.pagedRecords$ = this.store.select(UserState.pagedRecords);
    this.eventRecords$ = this.store.select(EventState.pagedRecords);
  }
}
