import {
  DecodedPayload,
  DefaultQueryParams,
  UpdateQuizDto,
} from '@damen/models';
import { CreateQuizDto } from '../models/quiz.dto';
import { QuizDocument } from '../schema/quiz.schema';
import { QuizFindAllPromise } from '../types/quiz.types';

export interface IQuizService {
  /**
   * endpoint to create a new Quiz
   * @param CreateQuizDto
   * @param DecodedPayload
   * @returns Promise<QuizDocument>
   */
  create(
    dto: CreateQuizDto,
    requestUser: DecodedPayload
  ): Promise<QuizDocument>;

  /**
   * get a page of quiz in the descending order of the sort field,
   * with a page size and page index
   * @param DefaultQueryParams
   * @returns
   */
  findAll(queryParams: DefaultQueryParams, dto: unknown): QuizFindAllPromise;

  /**
   * find Quiz by id
   * @param string
   */
  findOne(id: string): Promise<QuizDocument>;

  /**
   * find quiz by latest created active status
   */
  findActive(): Promise<QuizDocument>;

  /**
   * update quiz by id
   * @param string
   * @param UpdateQuizDto
   * @param DecodedPayload
   * @returns Promise<QuizDocument>
   */
  update(
    id: string,
    updateQuizDto: UpdateQuizDto,
    requestUser: DecodedPayload
  ): Promise<QuizDocument>;

  /**
   * validate quiz by id
   * @param string
   */
  validate(id: string): Promise<QuizDocument>;
}
