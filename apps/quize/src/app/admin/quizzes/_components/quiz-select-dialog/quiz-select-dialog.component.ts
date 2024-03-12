import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, ProjectionQuizDataTable } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PATH_ADMIN } from 'apps/quize/src/app/app-routing.conts';
import { filter, mergeMap, Observable, take, tap } from 'rxjs';
import { PATH_QUIZ_RESPONSES } from '../../../admin-routing.consts';
import { FindQuizByUser, SelectedQuizzes } from '../../_state/quiz.actions';
import { QuizState } from '../../_state/quiz.state';
import { QuizListComponent } from '../quiz-list/quiz-list.component';

@Component({
  selector: 'damen-quiz-select-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, QuizListComponent, MatButtonModule],
  templateUrl: './quiz-select-dialog.component.html',
  styleUrls: ['./quiz-select-dialog.component.scss'],
})
export class QuizSelectDialogComponent {
  pagedRecords$: Observable<Page<ProjectionQuizDataTable>>;

  @ViewChild(QuizListComponent) quizListComponent?: QuizListComponent;

  displayColumns: string[] = [
    'select',
    'createdAt',
    'name',
    'startTime',
    'endTime',
  ];

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) private userId: string
  ) {
    this.pagedRecords$ = this.store.select(QuizState.pagedRecords);
  }

  onSortAndPage(data: [Sort, PageEvent]) {
    this.store.dispatch(new FindQuizByUser(this.userId, false, data));
  }

  onSelect() {
    const selected = this.quizListComponent?.selection.selected;
    if (selected)
      this.store
        .dispatch(new SelectedQuizzes(selected))
        .pipe(
          mergeMap(() => this.store.select(QuizState.seleced)),
          filter((d) => d != undefined && d.length > 0),
          take(1),
          tap((d?: ProjectionQuizDataTable[]) => {
            if (d && d[0]) {
              this.store.dispatch(
                new Navigate([`${PATH_ADMIN}/${PATH_QUIZ_RESPONSES}`], {
                  userId: this.userId,
                  quizId: d[0]._id,
                })
              );
            }
          })
        )
        .subscribe();
  }
}
