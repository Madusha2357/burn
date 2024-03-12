import { BaseId, BaseTime, BaseUser } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';

export class ProjectionQuizDataTableQuery {
  _id = true;
  name = true;
  startTime = true;
  endTime = true;
  status = true;
  minimalAnswerCountForWinning = true;
  createdAt = true;
  createdBy = true;
  modifiedBy = true;
  modifiedAt = true;
}

export interface ProjectionQuizDataTable extends BaseUser, BaseTime, BaseId {
  name: string;
  startTime: Date;
  endTime: Date;
  status?: RecordStatus;
  minimalAnswerCountForWinning: number;
}

export interface ProjectionQuizSelect extends BaseId {
  name: string;
}
