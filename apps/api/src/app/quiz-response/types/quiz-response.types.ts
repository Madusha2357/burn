import { Page, ProjectionQuizResponseDataTable } from '@damen/models';
import { QuizResponseDocument } from '../schema/quiz-response.schema';

export type QuizResponseFindAllPromise = Promise<
  Page<QuizResponseDocument | ProjectionQuizResponseDataTable>
>;
