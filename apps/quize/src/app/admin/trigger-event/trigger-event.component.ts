import { Component } from '@angular/core';
import { Page, ProjectionEventDataTable } from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EventState } from './_state/trigger-event.state';

@Component({
  selector: 'damen-trigger-event',
  templateUrl: './trigger-event.component.html',
  styleUrls: ['./trigger-event.component.scss'],
})
export class TriggerEventComponent {
  eventRecords$: Observable<Page<ProjectionEventDataTable>>;

  constructor(private store: Store) {
    this.eventRecords$ = this.store.select(EventState.pagedRecords);
  }
}
