import { BaseUser } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';
import { Winner } from './winner';

export interface ICreateQuizDto extends BaseUser {
  name: string;
  startTime: Date;
  endTime: Date;
  status: RecordStatus;
  minimalAnswerCountForWinning: number;
}

export interface UpdateQuizDto extends BaseUser {
  name?: string;
  startTime?: Date;
  endTime?: Date;
  status?: RecordStatus;
  minimalAnswerCountForWinning?: number;
  winners?: Winner[];
}
