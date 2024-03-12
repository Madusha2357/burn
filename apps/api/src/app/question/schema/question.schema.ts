import { QuestionType, RecordStatus } from '@damen/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Quiz } from '../../quiz/schema/quiz.schema';
import { BaseEntity } from '../../_base/base';
import { ChoiceDto } from '../models/choice.dto';

@Schema({ timestamps: true })
export class Question extends BaseEntity {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: String, required: true })
  type: QuestionType;

  @Prop() videoUrl: string;
  @Prop() videoUrlMobile: string;

  @Prop() image: string;
  @Prop() imageMobile: string;

  @Prop([{ type: ChoiceDto }])
  choices: ChoiceDto[];

  @Prop()
  isMultipleChoice: boolean;

  @Prop()
  timerInSeconds: number; //time to allocate for a question to answer (in seconds)

  @Prop({ required: true })
  displayOrder: number; // the order of the questions are displaying

  @Prop({ type: String })
  status: RecordStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' })
  quiz: Quiz;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
export type QuestionDocument = HydratedDocument<Question>;
