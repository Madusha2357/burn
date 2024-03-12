import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ICreateQuizDto, ProjectionQuizDataTable } from '@damen/models';
import { DEFAULT_PAGE } from '../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../_consts/default-sort';

export class GetQuizzes {
  public static readonly type = '[Quiz] GetQuizzes';
  constructor(public data: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE]) {}
}

export class GetQuiz {
  public static readonly type = '[Quiz] GetQuiz';
  constructor(public id: string) {}
}

export class CreateQuiz {
  public static readonly type = '[Quiz] AddQuiz';
  constructor(public data: ICreateQuizDto) {}
}

export class UpdateQuiz {
  public static readonly type = '[Quiz] UpdateQuiz';
  constructor(public id: string, public data: ProjectionQuizDataTable) {}
}

export class EditQuiz {
  public static readonly type = '[Quiz] EditQuiz';
  constructor(public data: ProjectionQuizDataTable) {}
}

export class SelectedQuizzes {
  public static readonly type = '[Quiz] SelectQuiz';
  constructor(public selected: ProjectionQuizDataTable[]) {}
}

export class FindQuizByUser {
  public static readonly type = '[Quiz] FindQuizByUser';
  constructor(
    public userId: string,
    public init = true,
    public sortAndPage: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE]
  ) {}
}

export class FindQuizByName {
  public static readonly type = '[Quiz] FindQuizByName';
  constructor(public name: string) {}
}

export class FindResultsByQuiz {
  public static readonly type = '[Quiz] FindResultsByQuiz';
  constructor(public quizId: string) {}
}

export class UpdateQuizResponse {
  public static readonly type = '[Quiz] UpdateQuizResponse';
  constructor(public quizResponseId: string, public place: number) {}
}

export class DownloadQuizResults {
  public static readonly type = '[Quiz] DownloadQuizResults';
  constructor(public quizId: string) {}
}
