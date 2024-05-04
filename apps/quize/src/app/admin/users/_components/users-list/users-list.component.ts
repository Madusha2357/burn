import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import {
  Page,
  ProjectionQuizDataTable,
  ProjectionUserDataTable,
  UserStatus,
} from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  Observable,
  combineLatest,
  filter,
  map,
  mergeMap,
  startWith,
  take,
  tap,
} from 'rxjs';
import { DEFAULT_PAGE } from '../../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../../_consts/default-sort';
import { navigateToUpsert } from '../../../../_utils/crud.utils';
import { FindQuizByUser } from '../../../quizzes/_state/quiz.actions';
import {
  DeleteUser,
  DownloadCsv,
  GetRegisteredUsers,
  GetUsers,
  GetUsersByQuiz,
  SendInvitationEmail,
  ViewAnswers,
} from '../../_state/user.actions';
import { IMPORTS } from './users-list.imports';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { QuizState } from '../../../quizzes/_state/quiz.state';

@Component({
  selector: 'damen-users-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, AfterViewInit {
  @Input() pagedRecords!: Page<ProjectionUserDataTable>;
  filtered?: string;

  displayedColumns: string[] = ['email', 'firstName', 'role', 'actions'];

  users = [
    UserStatus.ALL,
    UserStatus.ACTIVE,
    UserStatus.REGISTERED,
    UserStatus.COMPLETE,
  ];

  quizes!: Observable<ProjectionQuizDataTable[]>;

  quizId?: string;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog
  ) {
    this.quizes = this.store
      .selectOnce(QuizState.pagedRecords)
      .pipe(map((res) => res.data));
  }

  ngOnInit(): void {
    if (this.pagedRecords == undefined)
      throw new Error('Paged QuestionDataTableProjection data not found');
  }

  ngAfterViewInit(): void {
    const sort = this.sort.sortChange.pipe(startWith(DEFAULT_SORT));
    const page = this.paginator.page.pipe(
      startWith({ ...DEFAULT_PAGE, pageSize: 100 })
    );
    combineLatest([sort, page])
      .pipe(tap((d) => this.store.dispatch(new GetUsers(d))))
      .subscribe();
  }

  onViewAnswers(item: ProjectionUserDataTable) {
    this.store.dispatch(new ViewAnswers(item));
    this.store.dispatch(new FindQuizByUser(item._id)).subscribe();
  }

  onAdd() {
    navigateToUpsert(this.activatedRoute, this.store);
  }

  onSelectUserChange(event: Event) {
    const sort = this.sort.sortChange.pipe(startWith(DEFAULT_SORT));
    const page = this.paginator.page.pipe(
      startWith({ ...DEFAULT_PAGE, pageSize: 100 })
    );
    combineLatest([sort, page])
      .pipe(
        tap((d) => {
          this.store.dispatch(new GetRegisteredUsers(event.toString(), d));
        })
      )
      .subscribe();
  }

  onSelectQuizChange(id: string) {
    const sort = this.sort.sortChange.pipe(startWith(DEFAULT_SORT));
    const page = this.paginator.page.pipe(
      startWith({ ...DEFAULT_PAGE, pageSize: 100 })
    );
    combineLatest([sort, page])
      .pipe(
        tap((d) => {
          this.quizId = id;
          this.store.dispatch(new GetUsersByQuiz(id, d));
        })
      )
      .subscribe();
  }

  onEdit(element: ProjectionUserDataTable) {
    const nav = new Navigate([element._id], undefined, {
      relativeTo: this.activatedRoute,
    });
    this.store.dispatch(nav);
  }

  onDelete(element: ProjectionUserDataTable) {
    const ref = this.matDialog.open(ConfirmDialogComponent);
    return ref
      .afterClosed()
      .pipe(
        take(1),
        filter((d) => d == true),
        mergeMap(() =>
          this.store.dispatch(new DeleteUser(element._id, element))
        )
      )
      .subscribe();
  }

  downloadCsv() {
    if (this.quizId) {
      this.store.dispatch(new DownloadCsv(this.quizId));
    } else {
      this.store.dispatch(new DownloadCsv());
    }
  }

  onSendInvitation(el: ProjectionUserDataTable) {
    this.store.dispatch(new SendInvitationEmail(el._id));
  }

  onOpenRegistration(el: ProjectionUserDataTable) {
    const l = window.location;
    window.open(
      `${l.protocol}//${l.host}/#/login/register-code?email=${el.email}`,
      '_blank'
    );
  }
}
