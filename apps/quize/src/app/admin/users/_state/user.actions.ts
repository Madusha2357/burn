import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateUserDto,
  ProjectionUserDataTable,
  UpdateUserDto,
} from '@damen/models';

export class GetUsers {
  public static readonly type = '[Users] GetUsers';
  constructor(public data: [Sort, PageEvent]) {}
}

export class CreateUser {
  public static readonly type = '[Users] CreateUser';
  constructor(public data: ICreateUserDto) {}
}

export class GetUser {
  public static readonly type = '[Users] GetUser';
  constructor(public id: string) {}
}

export class UpdateUser {
  public static readonly type = '[Users] UpdateUser';
  constructor(public id: string, public data: UpdateUserDto) {}
}

export class DeleteUser {
  public static readonly type = '[Users] DeleteUser';
  constructor(public id: string, public data: UpdateUserDto) {}
}

export class ViewAnswers {
  public static readonly type = '[Users] ViewAnswers';
  constructor(public data: ProjectionUserDataTable) {}
}

export class GetRegisteredUsers {
  public static readonly type = '[Users] GetRegisteredUsers';
  constructor(public user: string, public data: [Sort, PageEvent]) {}
}

export class SendInvitationEmail {
  public static readonly type = '[Users] SendInvitationEmail';
  constructor(public userId: string) {}
}

export class DownloadCsv {
  public static readonly type = '[Users] DownloadCsv';
  constructor(public quizId?: string) {}
}

export class GetUsersByQuiz {
  public static readonly type = '[Users] GetUsersByQuiz';
  constructor(public id: string, public data: [Sort, PageEvent]) {}
}
