import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DEFAULT_PAGE } from '../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../_consts/default-sort';

export class GetQuizResponseById {
  public static readonly type = '[QuizResponse] GetQuizResponseById';
  constructor(public userId: string, public quizId: string) {}
}

export class GetQuizResponse {
  public static readonly type = '[QuizResponse] GetQuizResponse';
  constructor(public data: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE]) {}
}

export class FilterByQuizID {
  public static readonly type = '[QuizResponse] FilterByQuizID';
  constructor(
    public id: string,
    public data: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE]
  ) {}
}
