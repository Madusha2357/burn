import { EventType, RecordStatus } from '@damen/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DecodedPayload } from '../models/decoded-payload.dto';

@Schema({ timestamps: true })
export class TriggerEvent {
  @Prop({ type: String, required: true })
  type: EventType;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object, required: true })
  payload: unknown;

  @Prop({ required: true })
  ip: string;

  @Prop({ type: DecodedPayload })
  user: DecodedPayload;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ required: true })
  method: string;

  @Prop({ type: String })
  status: RecordStatus;

  @Prop({ type: String })
  device: string;

  @Prop({ type: String })
  browser: string;
}

export const TriggerEventSchema = SchemaFactory.createForClass(TriggerEvent);
export type TriggerEventDocument = HydratedDocument<TriggerEvent>;
