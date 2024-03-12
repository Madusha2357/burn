import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { IMPORTS } from './app.module.utils';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGODB_URI),
    // ttl: time to live, limit: home many requests
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    ...IMPORTS,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
