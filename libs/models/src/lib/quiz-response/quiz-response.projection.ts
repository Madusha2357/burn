import { BaseId, BaseTime, BaseUser } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';
import { QuizResponseResult, UserQuizKey } from './quiz-response';

export class ProjectionQuizResponseUniqueKeyQuery {
  _id = true;
  userQuizKey = true;
}

export interface ProjectionQuizResponseUniqueKey extends BaseId {
  userQuizKey?: UserQuizKey;
}

export class ProjectionQuizResponseDataTableQuery {
  _id = true;
  createdAt = true;
  modifiedAt = true;
  createdBy = true;
  modifiedBy = true;
  userQuizKey = true;
  isEmailSent = true;
  correctCount = true;
  totalCount = true;
  isWinner = true;
  status = true;
}

export interface ProjectionQuizResponseDataTable
  extends BaseUser,
    BaseTime,
    BaseId {
  userQuizKey?: UserQuizKey;
  isEmailSent?: boolean;
  correctCount?: number;
  totalCount?: number;
  isWinner?: boolean;
  status?: RecordStatus;
}

export class ProjectionQuizResponseOverviewQuizQuery {
  _id = true;
  name = true;
  minimalAnswerCountForWinning = true;
}

export class ProjectionQuizResponseOverviewUserQuery {
  _id = true;
  firstName = true;
  lastName = true;
  email = true;
}

export class ProjectionQuizResponseOverviewQuery {
  quiz = true;
  user = true;
  createdBy = true;
  correctCount = true;
  userQuizKey = true;
  responses = true;
  place = true;
  isWinner = true;
}

export interface ProjectionQuizResponseOverview extends BaseId {
  quiz: [
    {
      _id: string;
      name: string;
      minimalAnswerCountForWinning: number;
    }
  ];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  userQuizKey?: UserQuizKey;
  correctCount?: number;
  createdBy?: string;
  responses: QuizResponseResult[];
  place?: number;
  isWinner?: boolean;
}
