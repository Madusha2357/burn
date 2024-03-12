import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/environment';
import { TriggerEventModule } from '../trigger-event/trigger-event.module';
import { UserModule } from '../user/user.module';
import { SignInController } from './controllers/sign-in.controller';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { AuthEventMiddleware } from './middleware/auth-event.middleware';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local/local.strategy';
import { TwilioModule } from '../_base/modules/twilio/twilio.module';

@Module({
  controllers: [SignInController],
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
    JwtModule.register({
      secret: environment.JWT_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: environment.TOKEN_EXPIRES_IN },
    }),
    TriggerEventModule,
    TwilioModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthEventMiddleware).forRoutes(SignInController);
  }
}
