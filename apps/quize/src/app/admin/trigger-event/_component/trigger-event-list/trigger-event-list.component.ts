import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Page, ProjectionEventDataTable } from '@damen/models';
import { Store } from '@ngxs/store';
import { Subject, combineLatest, startWith, takeUntil, tap } from 'rxjs';
import { DEFAULT_PAGE } from '../../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../../_consts/default-sort';
import { TriggerEvent } from '../../_state/trigger-event.actions';
import { IMPORTS } from './trigger-event-list.imports';

@Component({
  selector: 'damen-event-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './trigger-event-list.component.html',
  styleUrls: ['./trigger-event-list.component.scss'],
})
export class TriggerEventListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() eventRecords!: Page<ProjectionEventDataTable>;
  private notifier = new Subject<void>();

  displayedColumns: string[] = [
    'type',
    'status',
    'description',
    'statusCode',
    'createdAt',
    'device',
    'browser',
  ];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (this.eventRecords == undefined)
      throw new Error('Paged EventDataTableProjection data not found');
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    const sort = this.sort.sortChange.pipe(startWith(DEFAULT_SORT));
    const page = this.paginator.page.pipe(startWith(DEFAULT_PAGE));

    combineLatest([sort, page])
      .pipe(
        takeUntil(this.notifier),
        tap((d) => this.store.dispatch(new TriggerEvent(d)))
      )
      .subscribe();
  }
}
