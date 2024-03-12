import {
  DecodedPayload,
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

export interface IQuizResponseService {
  /**
   * create a new QuizResponse
   * @param CreateQuizResponseDto
   * @param DecodedPayload
   * @returns Promise<QuizResponseDocument>
   */
  create(
    dto: CreateQuizResponseDto,
    requestUser: DecodedPayload
  ): Promise<QuizResponseDocument>;

  /**
   * retrieve all QuizResponses
   * @param DefaultQueryParams
   */
  findAll(query: DefaultQueryParams): QuizResponseFindAllPromise;

  /**
   * retrieve one QuizResponses by id
   * @param string
   */
  findOne(id: string): Promise<QuizResponseDocument>;

  /**
   * retrieve one QuizResponses by quizId & userId
   * @param quizId
   * @param userId
   */
  findOneByKey(
    quizId: string,
    userId: string
  ): Promise<ProjectionQuizResponseOverview>;

  /**
   * update QuizResponse by id
   * @param string
   * @param UpdateQuizResponseDto
   * @param DecodedPayload
   */
  update(
    id: string,
    dto: UpdateQuizResponseDto,
    requestUser: DecodedPayload
  ): Promise<QuizResponseDocument>;

  /**
   * append responses to QuizResponse by id
   * @param string
   * @param QuizResponseDto
   */
  append(
    id: string,
    quizResponseDto: QuizResponseResultDto
  ): Promise<QuizResponseDocument>;

  /**
   * this function is used to retreive already saved quiz responses for a specific userId
   * @param DefaultQueryParams
   * @returns
   */
  quizzesByUserId(query: DefaultQueryParams): QuizFindAllPromise;
}
