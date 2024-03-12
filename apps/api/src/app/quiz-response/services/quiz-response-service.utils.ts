import { QuizResponseStatus } from '@damen/models';
import { QuizResponseResultDto } from '../models/quiz-response.dto';
import { QuizResponseDocument } from '../schema/quiz-response.schema';

export function getResponseStatus(
  correct: string[],
  input: string[]
): QuizResponseStatus {
  const correctAnswers = correct.filter((element) => {
    return input.includes(element);
  });
  const totalCorrectCount = correct.length;
  const answeredCorrectCount = correctAnswers.length;

  if (input.length == 0) return QuizResponseStatus.SKIPED;
  else if (input.length > 0 && totalCorrectCount == answeredCorrectCount)
    return QuizResponseStatus.CORRECT;
  else return QuizResponseStatus.INCORRECT;
}

export function filterSameQuestion(
  quizResponse: QuizResponseDocument,
  dto: QuizResponseResultDto
): QuizResponseResultDto[] {
  if (
    quizResponse &&
    quizResponse.responses &&
    quizResponse.responses.length > 0
  ) {
    const data = quizResponse.responses;
    return data.filter((d) => d.questionId != dto.questionId);
  }
  return [];
}
