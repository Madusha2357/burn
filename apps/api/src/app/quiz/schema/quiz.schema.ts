import { RecordStatus } from '@damen/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Winner } from '@damen/models';
import { Question } from '../../question/schema/question.schema';
import { BaseEntity } from '../../_base/base';

@Schema({ timestamps: true })
export class Quiz extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: String })
  status: RecordStatus;

  @Prop({ type: String, required: true })
  minimalAnswerCountForWinning: number;

  @Prop([{ type: Winner }])
  winners: Winner[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = HydratedDocument<Quiz>;
