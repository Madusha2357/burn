import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Page, ProjectionQuizDataTable } from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { navigateToUpsert } from '../../_utils/crud.utils';
import { GetQuizzes } from './_state/quiz.actions';
import { QuizState } from './_state/quiz.state';

@Component({
  selector: 'damen-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss'],
})
export class QuizzesComponent {
  pagedRecords$: Observable<Page<ProjectionQuizDataTable>>;
  displayColumns: string[] = [
    'createdAt',
    'name',
    'startTime',
    'endTime',
    'status',
    'actions',
  ];

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
    this.pagedRecords$ = this.store.select(QuizState.pagedRecords);
  }

  onAdd() {
    navigateToUpsert(this.activatedRoute, this.store);
  }

  onEdit(item: ProjectionQuizDataTable) {
    navigateToUpsert(this.activatedRoute, this.store, item._id);
  }

  onSortAndPage(data: [Sort, PageEvent]) {
    this.store.dispatch(new GetQuizzes(data));
  }
}
