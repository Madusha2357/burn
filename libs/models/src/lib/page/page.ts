import { UserStatus } from '../user/user.enum';
import {
  DEFAULT_SKIP,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
} from './pagination-params';

export interface Page<T> {
  data: T[];
  page: PageData;
}

export interface PageData {
  length: number;
  pageIndex: number;
  pageSize: number;
}

export class DefaultQueryParams {
  skip = DEFAULT_SKIP;
  limit = DEFAULT_LIMIT;
  sortByField = DEFAULT_SORT_BY_FIELD;
  order = DEFAULT_ORDER;
  projection = DEFAULT_PROJECTION;
  user = UserStatus.ALL;
  quizId = '';
}

export class DefaultQueryParamsWithQuiz extends DefaultQueryParams {
  quiz?: string;
}

export class DefaultQueryParamsWithUserId extends DefaultQueryParams {
  userId? = '';
}

// export class DefaultQueryParamsWithQuery extends DefaultQueryParams {
//   query?: unknown;
// }
