import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TriggerEventModule } from '../trigger-event/trigger-event.module';
import { QuestionController } from './controllers/question.controller';
import { QuestionEventMiddleware } from './middleware/question-event.middleware';
import { Question, QuestionSchema } from './schema/question.schema';
import { QuestionService } from './services/question.service';
import { MinioClientModule } from '../_base/modules/minio/minio-client.module';

@Module({
  imports: [
    TriggerEventModule,
    MinioClientModule,
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QuestionEventMiddleware).forRoutes(QuestionController);
  }
}
