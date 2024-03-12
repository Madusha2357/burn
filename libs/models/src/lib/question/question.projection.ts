import { BaseId, BaseTime, BaseUser } from '../_base/base';
import { RecordStatus } from '../_base/record-status.enum';
import { Choice } from './choice';

export class ProjectionQuestionDataTableQuery {
  text = true;
  type = true;
  videoUrl = true;
  videoUrlMobile = true;
  choices = true;
  isMultipleChoice = true;
  timerInSeconds = true;
  displayOrder = true;
  status = true;
  image = true;
  imageMobile = true;
  quiz = true;
}

export class ProjectionQuestioQuiz {
  text = true;
  type = true;
  videoUrl = true;
  videoUrlMobile = true;
  isMultipleChoice = true;
  timerInSeconds = true;
  displayOrder = true;
  status = true;
  image = true;
  imageMobile = true;
  quiz = true;
  choices = {
    text: true,
    _id: true,
  };
}

export interface ProjectionQuestionDataTable
  extends BaseUser,
    BaseTime,
    BaseId {
  text: string;
  videoUrl: string;
  choices: Choice[];
  isMultipleChoice: boolean;
  timerInSeconds: number;
  displayOrder: number;
  status: RecordStatus;
  quiz: string;
}

export interface ImageUploaded {
  name: string;
}
