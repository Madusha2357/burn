import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../_base/modules/email/email.module';
import { TriggerEventModule } from '../trigger-event/trigger-event.module';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './schema/user.schema';
import { UserEmailService } from './services/user-email.service';
import { UserService } from './services/user.service';
import { QuizResponseModule } from '../quiz-response/quiz-response.module';

@Module({
  imports: [
    QuizResponseModule,
    TriggerEventModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserEmailService],
  exports: [UserService],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(UserEventMiddleware).forRoutes(UserController);
  // }
}
