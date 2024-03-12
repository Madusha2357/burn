import {
  AuthorizedRequest,
  DefaultQueryParams,
  IUpdateQuestionDto,
} from '@damen/models';
import { CreateQuestionDto } from '../models/question.dto';
import { QuestionDocument } from '../schema/question.schema';
import { QuestionFindAllPromise } from '../types/question.types';

export interface IQuestionController {
  /**
   * endpoint to create a new Quiz
   * @param CreateQuizDto
   * @param AuthorizedRequest
   * @returns Promise<QuestionDocument>
   */
  create(
    dto: CreateQuestionDto,
    req: AuthorizedRequest
  ): Promise<QuestionDocument>;

  /**
   * endpoint to retrive a page of Questions
   * @param DefaultQueryParams
   * consists of {quiz => unique id of quiz, skip => page no, limit => page size, sortByField => sort field, order => sort order projection => projection name },
   * @returns Promise<Page<QuestionDocument>>
   */
  findAll(query: DefaultQueryParams): QuestionFindAllPromise;

  /**
   * endpoint to retrive a question by quizId and displayOrder
   * @returns Promise<QuestionDocument>
   */
  findByOrder(id: string, { displayOrder = 1 }): Promise<QuestionDocument>;

  /**
   * endpoint to retrive a question by id
   * @param id
   * @returns Promise<QuestionDocument>
   */
  findOne(id: string): Promise<QuestionDocument>;

  /**
   * endpoint to update a question by id
   * @param string
   * @param UpdateQuizDto
   * @param AuthorizedRequest
   * @returns Promise<QuestionDocument>
   */
  update(
    id: string,
    updateQuizDto: IUpdateQuestionDto,
    req: AuthorizedRequest
  ): Promise<QuestionDocument>;
}
