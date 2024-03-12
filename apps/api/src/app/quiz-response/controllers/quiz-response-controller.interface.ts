import {
  AuthorizedRequest,
  DefaultQueryParams,
  ProjectionQuizResponseOverview,
  UpdateQuizResponseDto,
} from '@damen/models';
import { QuizFindAllPromise } from '../../quiz/types/quiz.types';
import {
  CreateQuizResponseDto,
  QuizResponseResultDto,
} from '../models/quiz-response.dto';
import { QuizResponseDocument } from '../schema/quiz-response.schema';
import { QuizResponseFindAllPromise } from '../types/quiz-response.types';

export interface IQuizResponseController {
  /**
   * endpoint to create a new QuizResponse
   * @param CreateQuizResponseDto
   * @param AuthorizedRequest
   * @returns
   */
  create(
    dto: CreateQuizResponseDto,
    req: AuthorizedRequest
  ): Promise<QuizResponseDocument>;

  /**
   * endpoint to retrieve all QuizResponses
   * @returns
   */
  findAll(query: DefaultQueryParams): QuizResponseFindAllPromise;

  /**
   * endpoint to retrieve QuizResponse by quizId & userId
   * @param string
   * @param string
   * @returns
   */
  findOneByKey({
    quizId = '',
    userId = '',
  }): Promise<ProjectionQuizResponseOverview>;

  /**
   * endpoint to retrieve QuizResponse by quizId
   * @param string
   * @returns
   */
  findResultsByQuizId({ quizId = '' }): Promise<ProjectionQuizResponseOverview>;

  /**
   * endpoint to retrieve a page of Quizzes by userId
   * @param DefaultQueryParams
   * @returns
   */
  findQuizzesByUser(query: DefaultQueryParams): QuizFindAllPromise;

  /**
   * endpoint to retrieve QuizResponse by id
   * @param string
   * @returns
   */
  findOne(id: string): Promise<QuizResponseDocument>;

  /**
   * endpoint to update QuizResponse by id
   * @param string
   * @param UpdateQuizResponseDto
   * @param AuthorizedRequest
   * @returns
   */
  update(
    id: string,
    dto: UpdateQuizResponseDto,
    req: AuthorizedRequest
  ): Promise<QuizResponseDocument>;

  /**
   * endpoint to append responses to QuizResponse by id
   * @param string
   * @param QuizResponseDto
   * @returns
   */
  append(id: string, dto: QuizResponseResultDto): Promise<QuizResponseDocument>;
}
