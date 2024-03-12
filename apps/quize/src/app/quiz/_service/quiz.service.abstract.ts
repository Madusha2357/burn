import {
  ICreateQuizResponseDto,
  ProjectionQuizResponseDataTable,
  ProjectionUserDataTable,
  QuestionDataTable,
  QuizResponseResult,
  UpdateUserDto,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class QuizService {
  /**
   * Return the Question data table
   * @param order getting order number from component
   */
  abstract getQuestionByOrder(
    id: string,
    order: number
  ): Observable<QuestionDataTable>;

  /**
   * @param id getting question id from component
   * @param quizResponse getting response from component
   */
  abstract patchAnswer(
    id: string,
    quizResponse: QuizResponseResult
  ): Observable<string>;

  /**
   *
   * @param dto
   */
  abstract createQuestionResponse(
    dto: ICreateQuizResponseDto
  ): Observable<ProjectionQuizResponseDataTable>;

  abstract updateUserAddress(
    id: string,
    updateUserDto: UpdateUserDto
  ): Observable<ProjectionUserDataTable>;
}
