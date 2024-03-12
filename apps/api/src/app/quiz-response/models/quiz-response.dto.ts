import {
  ICreatePublicQuizResponseDto,
  ICreateQuizResponseDto,
  QuizResponseStatus,
  RecordStatus,
  UserQuizKey,
} from '@damen/models';
import { IsNotEmpty } from 'class-validator';

export class CreatePublicQuizResponseDto
  implements ICreatePublicQuizResponseDto
{
  firstName: string;
  lastName: string;
  email: string;
  quizId: string;
  isDeleted: boolean;
}

export class CreateQuizResponseDto implements ICreateQuizResponseDto {
  @IsNotEmpty()
  userQuizKey: UserQuizKey;

  isEmailSent?: boolean;
  correctCount?: number;
  totalCount?: number;
  isWinner?: boolean;
  status?: RecordStatus;
  isDeletes?: boolean;
}

export class QuizResponseResultDto {
  @IsNotEmpty()
  questionId: string;

  duration: number;
  question: string;
  answer?: string[];
  response?: string[];
  responseStatus?: QuizResponseStatus;
}
