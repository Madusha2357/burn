import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateUserDto,
  Page,
  ProjectionEventDataTable,
  ProjectionUserDataTable,
  UpdateUserDto,
} from '@damen/models';
import { Observable, of } from 'rxjs';
import { UserService } from './user-service.abstract';

@Injectable({ providedIn: 'root' })
export class UserMockService extends UserService {
  fakeUsers = [...Array(25)].map(() => fakeUser());

  constructor() {
    super();
  }

  override findUser(id: string): Observable<ICreateUserDto> {
    throw new Error('Method not implemented.');
  }

  override getUsersByQuiz(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>> {
    throw new Error('Method not implemented.');
  }

  override delete(
    id: string,
    data: UpdateUserDto
  ): Observable<ProjectionUserDataTable> {
    throw new Error('Method not implemented.');
  }

  override getOne(id: string): Observable<ProjectionUserDataTable> {
    throw new Error('Method not implemented.');
  }

  findRegisteredUsers(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>> {
    throw new Error('Method not implemented.');
  }

  findAll(data: [Sort, PageEvent]): Observable<Page<ProjectionUserDataTable>> {
    const page = data[1];
    const start = page.pageIndex * page.pageSize;
    const end = start + page.pageSize;
    return of({
      data: this.fakeUsers.slice(start, end),
      page: { ...page, length: this.fakeUsers.length },
    });
  }

  triggerEvent(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionEventDataTable>> {
    throw new Error('Method not implemented.');
  }

  create(data: ICreateUserDto): Observable<ProjectionUserDataTable> {
    const fake = fakeUser();
    this.fakeUsers.push(fake);
    return of(fake);
  }

  update(id: string, data: UpdateUserDto): Observable<ProjectionUserDataTable> {
    return of(fakeUser());
  }

  override sendInvitationEmail(userId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override downloadCsv(quizId?: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}

function fakeUser(): ProjectionUserDataTable {
  return {
    _id: '12344',
    email: 'h@exmplae.com',
    firstName: 'Name',
    lastName: 'last Name',
    registerCode: '12333345',
  };
}
