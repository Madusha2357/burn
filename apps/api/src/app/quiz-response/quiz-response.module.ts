import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../../environments/environment';
import { QuestionModule } from '../question/question.module';
import { QuizModule } from '../quiz/quiz.module';
import { TriggerEventModule } from '../trigger-event/trigger-event.module';
import { User, UserSchema } from '../user/schema/user.schema';
import { QuizResponseController } from './controllers/quiz-response.controller';
import { QuizResponseEventMiddleware } from './middleware/quiz-response-event.middleware';
import {
  QuizResponse,
  QuizResponseSchema,
} from './schema/quiz-response.schema';
import { QuizResponseService } from './services/quiz-response.service';

@Module({
  imports: [
    QuizModule,
    QuestionModule,
    TriggerEventModule,
    JwtModule.register({
      secret: environment.JWT_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: environment.TOKEN_EXPIRES_IN },
    }),
    MongooseModule.forFeature([
      { name: QuizResponse.name, schema: QuizResponseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [QuizResponseController],
  providers: [QuizResponseService],
  exports: [QuizResponseService],
})
export class QuizResponseModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QuizResponseEventMiddleware)
      .forRoutes(QuizResponseController);
  }
}
