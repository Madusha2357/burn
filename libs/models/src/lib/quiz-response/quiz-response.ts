import { BaseUser } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';
import { QuizResponseStatus } from './quiz-response.enum';

export class UserQuizKey {
  quizId!: string; // primaryKey of Quiz;
  userId!: string; // primaryKey of User;
}

export interface ICreatePublicQuizResponseDto {
  quizId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ICreateQuizResponseDto extends BaseUser {
  userQuizKey: UserQuizKey;
  responses?: QuizResponseResult[];
  isEmailSent?: boolean;
  correctCount?: number;
  totalCount?: number;
  isWinner?: boolean;
  status?: RecordStatus;
  place?: number;
  isDeleted?: boolean;
}

export interface UpdateQuizResponseDto extends BaseUser {
  isEmailSent?: boolean;
  correctCount?: number;
  totalCount?: number;
  isWinner?: boolean;
  status?: RecordStatus;
  responses?: QuizResponseResult[];
  place?: number;
  isDeleted?: boolean;
}

export interface QuizResponseResult {
  questionId: string;
  question?: string;
  answer?: string[];
  response?: string[];
  duration: number;
  responseStatus?: QuizResponseStatus;
}

export class AppendQuizResponseDto {
  responses?: QuizResponseResult[];
}
