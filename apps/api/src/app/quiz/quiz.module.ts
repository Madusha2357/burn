import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './schema/quiz.schema';
import { QuizController } from './controllers/quiz.controller';
import { QuizService } from './services/quiz.service';
import { QuizEventMiddleware } from './middleware/quiz-event.middleware';
import { TriggerEventModule } from '../trigger-event/trigger-event.module';

@Module({
  imports: [
    TriggerEventModule,
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QuizEventMiddleware).forRoutes(QuizController);
  }
}
