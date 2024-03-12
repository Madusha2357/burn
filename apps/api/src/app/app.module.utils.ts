import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { QuizResponseModule } from './quiz-response/quiz-response.module';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';

export const IMPORTS = [
  AuthModule,
  UserModule,
  QuizModule,
  QuestionModule,
  QuizResponseModule,
];
