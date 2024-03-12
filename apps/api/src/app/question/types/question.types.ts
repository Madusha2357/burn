import { Page, ProjectionQuestionDataTable } from '@damen/models';
import { QuestionDocument } from '../schema/question.schema';

export type QuestionFindAllPromise = Promise<
  Page<QuestionDocument | ProjectionQuestionDataTable>
>;
