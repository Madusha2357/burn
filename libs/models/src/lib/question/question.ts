import { BaseTime, BaseUser } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';
import { Choice } from './choice';
import { QuestionType } from './question-type';

export interface ICreateQuestionDto extends BaseUser {
  /** Question text explaing the problem */
  text: string;
  /**
   * Type of the quiction
   */
  type: QuestionType;
  choices: Choice[];
  isMultipleChoice: boolean;
  timerInSeconds: number;
  displayOrder: number;
  status: RecordStatus;
  quiz: { _id: string };
  image: string;
  imageMobile: string;
  videoUrl?: string;
}

export interface IUpdateQuestionDto extends BaseUser {
  text?: string;
  videoUrl?: string;
  choices?: Choice[];
  isMultipleChoice?: boolean;
  timerInSeconds?: number;
  displayOrder?: number;
  status?: RecordStatus;
  quiz?: { _id: string };
  image?: string;
}

export interface QuestionDataTable extends BaseUser, BaseTime {
  _id: string;
  text?: string;
  type?: string;
  videoUrl?: string;
  videoUrlMobile?: string;
  choices?: Choice[];
  isMultipleChoice?: boolean;
  timerInSeconds?: number;
  displayOrder: number;
  status?: RecordStatus;
  image: string;
  imageMobile: string;
}
