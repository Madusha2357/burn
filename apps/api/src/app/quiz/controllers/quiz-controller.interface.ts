import {
  AuthorizedRequest,
  DefaultQueryParams,
  ProjectionQuizDataTable,
  UpdateQuizDto,
} from '@damen/models';
import { CreateQuizDto } from '../models/quiz.dto';
import { QuizDocument } from '../schema/quiz.schema';
import { QuizFindAllPromise } from '../types/quiz.types';

export interface IQuizController {
  /**
   * endpoint to create a new Quiz
   * @param CreateQuizDto
   * @param AuthorizedRequest
   * @returns Promise<QuizDocument>
   */
  create(dto: CreateQuizDto, req: AuthorizedRequest): Promise<QuizDocument>;

  /**
   * endpoint to retrive a page of Quiz
   * @param DefaultQueryParams
   * consists of {skip => page no, limit => page size, sortByField => sort field, order => sort order projection => projection name },
   * @returns Promise<Page<QuizDocument>>
   */
  findAll(
    query: DefaultQueryParams,
    dto: ProjectionQuizDataTable
  ): QuizFindAllPromise;

  /**
   * endpoint to retrive the latest created active quiz
   * @returns Promise<QuizDocument>
   */
  findActive(): Promise<QuizDocument>;

  /**
   * endpoint to retrive a quiz by id
   *  @param string
   * @returns Promise<QuizDocument>
   */
  findOne(id: string): Promise<QuizDocument>;

  /**
   *
   * @param string
   * @param UpdateQuizDto
   * @param AuthorizedRequest
   * @returns Promise<QuizDocument>
   */
  update(
    id: string,
    updateQuizDto: UpdateQuizDto,
    req: AuthorizedRequest
  ): Promise<QuizDocument>;

  /**
   * endpoint to validate a quiz by id
   * @param string
   * @returns Promise<QuizDocument>
   */
  validate(id: string): Promise<QuizDocument>;
}
