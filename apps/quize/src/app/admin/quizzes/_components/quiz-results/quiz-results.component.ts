import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ProjectionUserDataTable,
  ProjectionQuizResponseOverview,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Subscription, take, tap } from 'rxjs';
import { IMPORTS } from '../../quizzes.module.utils';
import { QuizState } from '../../_state/quiz.state';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DownloadQuizResults,
  UpdateQuizResponse,
} from '../../_state/quiz.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'damen-quiz-results',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
})
export class QuizResultsComponent implements OnDestroy, OnInit {
  displayedColumns = ['question', 'answer', 'winner', 'actions'];
  dataSource = new MatTableDataSource<ProjectionQuizResponseOverview>([]);
  selectedValue?: string;
  response?: ProjectionUserDataTable;
  quizId?: string;
  winner!: string;
  subscription?: Subscription;
  winnerForm: FormGroup;

  place?: string;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.subscription = this.store
      .select(QuizState.results)
      .pipe(
        tap((results) => {
          this.dataSource =
            new MatTableDataSource<ProjectionQuizResponseOverview>(results);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          if (results) {
            let correctAnsMax = 0,
              id = '';
            results.forEach((r) => {
              const time = parseInt(r.correctCount as unknown as string);
              if (time > correctAnsMax && r.createdBy) {
                correctAnsMax = time;
                id = r._id;
                this.winner = r.createdBy;
              }
            });
          }
        })
      )
      .subscribe();

    this.winnerForm = this.formBuilder.group({
      place: [null],
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        take(1),
        tap((params) => {
          this.quizId = params['id'];
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onEdit(res: any) {
    if (this.winnerForm.valid) {
      this.store.dispatch(
        new UpdateQuizResponse(res.id, this.winnerForm.value['place'])
      );
      this.winnerForm.reset();
    }
  }

  downloadCsv() {
    if (this.quizId) this.store.dispatch(new DownloadQuizResults(this.quizId));
  }
}
