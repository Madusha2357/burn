import { UserStatus } from '../user/user.enum';
import {
  DefaultQueryParams,
  DefaultQueryParamsWithQuiz,
  DefaultQueryParamsWithUserId,
} from './page';
import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
  DEFAULT_SKIP,
  DEFAULT_SORT_BY_FIELD,
} from './pagination-params';

export function applyDefaultPage(
  queryParam: DefaultQueryParams
): DefaultQueryParams {
  const {
    skip = DEFAULT_SKIP,
    limit = DEFAULT_LIMIT,
    sortByField = DEFAULT_SORT_BY_FIELD,
    order = DEFAULT_ORDER,
    projection = DEFAULT_PROJECTION,
    user = UserStatus.ALL,
    quizId = '',
  } = queryParam;
  return { skip, limit, sortByField, order, projection, user, quizId };
}

export function applyDefaultPageWithUserId(
  queryParam: DefaultQueryParamsWithUserId
): DefaultQueryParamsWithUserId {
  const {
    skip = DEFAULT_SKIP,
    limit = DEFAULT_LIMIT,
    sortByField = DEFAULT_SORT_BY_FIELD,
    order = DEFAULT_ORDER,
    projection = DEFAULT_PROJECTION,
    userId = '',
    user = UserStatus.ALL,
    quizId = '',
  } = queryParam;
  return { skip, limit, sortByField, order, projection, userId, user, quizId };
}

export function applyDefaultPageWithQuiz(
  queryParam: DefaultQueryParamsWithQuiz
): DefaultQueryParamsWithQuiz {
  const {
    skip = DEFAULT_SKIP,
    limit = DEFAULT_LIMIT,
    sortByField = DEFAULT_SORT_BY_FIELD,
    order = DEFAULT_ORDER,
    projection = DEFAULT_PROJECTION,
    quiz,
    user = UserStatus.ALL,
    quizId = '',
  } = queryParam;
  return { skip, limit, sortByField, order, projection, quiz, user, quizId };
}

// export function applyDefaultPageWithQuery(
//   queryParam: DefaultQueryParamsWithQuery
// ): DefaultQueryParamsWithQuery {
//   const {
//     skip = DEFAULT_SKIP,
//     limit = DEFAULT_LIMIT,
//     sortByField = DEFAULT_SORT_BY_FIELD,
//     order = DEFAULT_ORDER,
//     projection = DEFAULT_PROJECTION,
//     query,
//   } = queryParam;
//   return { skip, limit, sortByField, order, projection, query };
// }
