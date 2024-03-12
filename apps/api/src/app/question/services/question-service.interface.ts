import {
  DecodedPayload,
  DefaultQueryParams,
  UpdateQuizDto,
} from '@damen/models';
import { CreateQuestionDto } from '../models/question.dto';
import { QuestionDocument } from '../schema/question.schema';
import { QuestionFindAllPromise } from '../types/question.types';

export interface IQuestionService {
  /**
   * create a new Question
   * @param CreateQuestionDto
   * @param DecodedPayload
   * @returns Promise<QuestionDocument>
   */
  create(
    dto: CreateQuestionDto,
    requestUser: DecodedPayload
  ): Promise<QuestionDocument>;

  /**
   * get a page of questions which related to the quiz; in the requesting order of the sort field,
   * with a page size and page index
   * @param DefaultQueryParams
   * @returns
   */
  findAll(queryParams: DefaultQueryParams): QuestionFindAllPromise;

  /**
   * find question by quiz id and display order
   */
  findByOrder(quizId: string, displayOrder: number): Promise<QuestionDocument>;

  /**
   * find question by id
   * @param string
   */
  findOne(id: string): Promise<QuestionDocument>;

  /**
   * update question by id
   * @param string,
   * @param UpdateQuestionDto,
   * @param DecodedPayload
   * @returns Promise<QuestionDocument>
   */
  update(
    id: string,
    updateQuizDto: UpdateQuizDto,
    requestUser: DecodedPayload
  ): Promise<QuestionDocument>;
}
