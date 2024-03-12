import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateUserDto,
  Page,
  ProjectionEventDataTable,
  ProjectionUserDataTable,
  UpdateUserDto,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class UserService {
  abstract findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>>;

  abstract getOne(id: string): Observable<ProjectionUserDataTable>;

  abstract create(data: ICreateUserDto): Observable<ProjectionUserDataTable>;

  abstract update(
    id: string,
    data: UpdateUserDto
  ): Observable<ProjectionUserDataTable>;

  abstract delete(
    id: string,
    data: UpdateUserDto
  ): Observable<ProjectionUserDataTable>;

  abstract triggerEvent(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionEventDataTable>>;

  abstract findRegisteredUsers(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>>;

  abstract getUsersByQuiz(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>>;

  abstract sendInvitationEmail(userId: string): Observable<void>;

  abstract downloadCsv(quizId?: string): any;
}
