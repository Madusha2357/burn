import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ICreateQuestionDto, ProjectionQuestionDataTable } from '@damen/models';
import { DEFAULT_PAGE } from '../../../_consts/default-page';
import { DEFAULT_SORT } from '../../../_consts/default-sort';

export class GetQuestions {
  public static readonly type = '[Question] GetQuestion';
  constructor(public data: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE]) {}
}

export class CreateQuestion {
  public static readonly type = '[Question] CreateQuestion';
  constructor(public data: ICreateQuestionDto) {}
}

export class UploadImage {
  public static readonly type = '[Question] UploadImage';
  constructor(public event: Event, public feild: string) {}
}

export class UpdateQuestion {
  public static readonly type = '[Question] UpdateQuestion';
  constructor(public id: string, public data: ProjectionQuestionDataTable) {}
}

export class FilterByQuizID {
  public static readonly type = '[Question] FilterByQuizID';
  constructor(
    public id: string,
    public data: [Sort, PageEvent] = [DEFAULT_SORT, DEFAULT_PAGE]
  ) {}
}
