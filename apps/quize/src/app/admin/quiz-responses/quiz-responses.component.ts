import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectionUserDataTable, QuizResponseResult } from '@damen/models';
import { Store } from '@ngxs/store';
import { Subscription, delay, mergeMap, tap, throwError } from 'rxjs';
import { QuizState } from '../quizzes/_state/quiz.state';
import { UserState } from '../users/_state/user.state';
import {
  FilterByQuizID,
  GetQuizResponseById,
} from './_state/quiz-response.actions';
import { QuizResponseState } from './_state/quiz-response.state';

@Component({
  selector: 'damen-quiz-responses',
  templateUrl: './quiz-responses.component.html',
  styleUrls: ['./quiz-responses.component.scss'],
})
export class QuizResponsesComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['question', 'answer', 'response', 'duration', 'status'];
  dataSource = new MatTableDataSource<QuizResponseResult>([]);
  selectedValue?: string;
  response?: ProjectionUserDataTable;
  quizId?: string;
  subsciption?: Subscription;
  progress?: number;
  questionCount?: number;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private store: Store) {
    this.store
      .selectOnce(QuizState.seleced)
      .pipe(
        mergeMap((selected) => {
          console.log(selected);
          if (selected) {
            this.quizId = selected[0]._id;
            return this.store.dispatch(new FilterByQuizID(selected[0]._id));
          } else return throwError(() => new Error('Quiz id is empty!'));
        }),
        mergeMap(() =>
          this.store.selectOnce(QuizResponseState.pagedRecords).pipe(
            tap((res) => {
              this.questionCount = res.data.length;
            })
          )
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subsciption) this.subsciption.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.store
      .selectOnce(UserState.getUserId)
      .pipe(
        mergeMap((id) => {
          if (id && this.quizId)
            return this.store.dispatch(
              new GetQuizResponseById(id, this.quizId)
            );
          else return throwError(() => new Error(''));
        }),
        mergeMap(() =>
          this.store.selectOnce(QuizResponseState.response).pipe(
            delay(10),
            tap((d) => {
              const user = d.user as unknown as ProjectionUserDataTable[];
              this.response = user[0];

              this.dataSource = new MatTableDataSource<QuizResponseResult>(
                d.responses
              );
              this.progress = d.responses.length;
              this.dataSource.paginator = this.paginator;
            })
          )
        )
      )
      .subscribe();
  }
}
