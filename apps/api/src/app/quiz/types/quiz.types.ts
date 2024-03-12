import { Page, ProjectionQuizDataTable } from '@damen/models';
import { QuizDocument } from '../schema/quiz.schema';

export type QuizFindAllPromise = Promise<
  Page<QuizDocument | ProjectionQuizDataTable>
>;
