import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import {
  Page,
  ProjectionQuestionDataTable,
  ProjectionQuizDataTable,
} from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { DEFAULT_PAGE } from '../../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../../_consts/default-sort';
import { navigateToUpsert } from '../../../../_utils/crud.utils';
import { QuizState } from '../../../quizzes/_state/quiz.state';
import { FilterByQuizID, GetQuestions } from '../../_state/question.actions';
import { IMPORTS } from './questions-list.imports';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'damen-questions-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
})
export class QuestionsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'status',
    'text',
    'type',
    // 'timerInSeconds',
    'displayOrder',
    'actions',
  ];
  quizes!: Observable<ProjectionQuizDataTable[]>;
  filterControl = new FormControl<string>('');
  // quizes!: Observable<ProjectionQuizDataTable[]>;

  @Input() pagedRecords!: Page<ProjectionQuestionDataTable>;
  @Output() sortAndPage = new EventEmitter<[Sort, PageEvent]>();
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter<ProjectionQuestionDataTable>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
    this.quizes = this.store
      .selectOnce(QuizState.pagedRecords)
      .pipe(map((res) => res.data));
  }

  ngOnInit(): void {
    if (this.pagedRecords == undefined)
      throw new Error('Paged QuestionDataTableProjection data not found');
  }

  displayFn(quiz: ProjectionQuizDataTable): string {
    return quiz && quiz.name ? quiz.name : '';
  }

  // private _filter(name: string): ProjectionQuizDataTable[] {
  //   this.onSelectQuizChange(name);
  //   const filterValue = name.toLowerCase();

  //   return this.quizes.filter((quize) =>
  //     quize.name.toLowerCase().includes(filterValue)
  //   );
  // }

  onSelectQuize(e: MatOptionSelectionChange<ProjectionQuizDataTable>) {
    const value = e.source.value;
    this.store.dispatch(new FilterByQuizID(value._id));
  }

  ngAfterViewInit(): void {
    const sort = this.sort.sortChange.pipe(startWith(DEFAULT_SORT));
    const page = this.paginator.page.pipe(
      startWith({ ...DEFAULT_PAGE, pageSize: 100 })
    );
    combineLatest([sort, page])
      .pipe(tap((d) => this.store.dispatch(new GetQuestions(d))))
      .subscribe();
  }

  onAdd() {
    navigateToUpsert(this.activatedRoute, this.store);
  }

  onEdit(element: ProjectionQuizDataTable) {
    const nav = new Navigate([element._id], undefined, {
      relativeTo: this.activatedRoute,
    });
    this.store.dispatch(nav);
  }
}
