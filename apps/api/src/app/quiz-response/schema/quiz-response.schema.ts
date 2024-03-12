import { RecordStatus, UserQuizKey } from '@damen/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../_base/base';
import { QuizResponseResultDto } from '../models/quiz-response.dto';

@Schema({ timestamps: true })
export class QuizResponse extends BaseEntity {
  @Prop({ type: UserQuizKey, required: true, unique: true })
  userQuizKey: UserQuizKey;

  @Prop([{ type: QuizResponseResultDto }])
  responses: QuizResponseResultDto[];

  @Prop()
  isEmailSent?: boolean;

  @Prop()
  isWinner?: boolean;

  @Prop()
  place?: number;

  @Prop()
  correctCount: number;

  @Prop()
  totalCount: number;

  @Prop({ type: String })
  status: RecordStatus;

  @Prop()
  isDeleted?: boolean;
}

export const QuizResponseSchema = SchemaFactory.createForClass(QuizResponse);
export type QuizResponseDocument = HydratedDocument<QuizResponse>;
