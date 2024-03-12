import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TriggerEventController } from './controllers/trigger-event.controller';
import {
  TriggerEvent,
  TriggerEventSchema,
} from './schema/trigger-event.schema';
import { TriggerEventService } from './services/trigger-event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TriggerEvent.name, schema: TriggerEventSchema },
    ]),
  ],
  controllers: [TriggerEventController],
  providers: [TriggerEventService],
  exports: [TriggerEventService],
})
export class TriggerEventModule {}
