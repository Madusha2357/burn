import { QuizResponseResult } from '@damen/models';

export class UserGivenAnswer {
  public static readonly type = '[Question] UserGivenAnswer';
  constructor(public id: string, public quizResponse: QuizResponseResult) {}
}

export class CreateQuizResponse {
  public static readonly type = '[Question] CreateQuizResponse';
  constructor(public quizId: string, public userId: string) {}
}
