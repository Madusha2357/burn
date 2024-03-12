import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Page, ProjectionQuizDataTable } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { combineLatest, skip, startWith, Subscription, tap } from 'rxjs';
import { DEFAULT_PAGE } from '../../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../../_consts/default-sort';
import { PATH_RESULTS } from '../../../admin-routing.consts';
import { FindResultsByQuiz } from '../../_state/quiz.actions';
import { IMPORTS } from './quiz-list.imports';

@Component({
  selector: 'damen-quiz-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
})
export class QuizListComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() pagedRecords!: Page<ProjectionQuizDataTable>;
  @Input() showAdd = true;
  @Input() displayedColumns: string[] = [];
  @Input() title = 'Quizzes';
  @Input() multiSelect = true;
  @Input() skip = 0;

  @Output() sortAndPage = new EventEmitter<[Sort, PageEvent]>();
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter<ProjectionQuizDataTable>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProjectionQuizDataTable>;

  private subscription?: Subscription;

  selection = new SelectionModel<ProjectionQuizDataTable>(true, []);

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.selection = new SelectionModel<ProjectionQuizDataTable>(
      this.multiSelect,
      []
    );
  }

  ngAfterViewInit(): void {
    const sort = this.sort.sortChange.pipe(startWith(DEFAULT_SORT));
    const page = this.paginator.page.pipe(startWith(DEFAULT_PAGE));
    this.subscription = combineLatest([sort, page])
      .pipe(
        skip(this.skip),
        tap((d) => {
          this.sortAndPage?.emit(d);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onEdit(element: ProjectionQuizDataTable) {
    const nav = new Navigate([element._id], undefined, {
      relativeTo: this.activatedRoute,
    });
    this.store.dispatch(nav);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.pagedRecords.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    const dataSource = this.table
      .dataSource as unknown as ProjectionQuizDataTable[];
    this.selection.select(...dataSource);
  }

  onViewResults(results: ProjectionQuizDataTable) {
    this.store.dispatch(
      new Navigate([`${results._id}/${PATH_RESULTS}`], undefined, {
        relativeTo: this.activatedRoute,
      })
    );
    this.store.dispatch(new FindResultsByQuiz(results._id));
  }
}
