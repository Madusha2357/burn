import { ICreateQuestionDto, QuestionType, RecordStatus } from '@damen/models';
import { IsNotEmpty } from 'class-validator';
import { ChoiceDto } from './choice.dto';

export class CreateQuestionDto implements ICreateQuestionDto {
  @IsNotEmpty()
  type: QuestionType;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  imageMobile: string;

  // @IsNotEmpty()
  choices: ChoiceDto[];

  // @IsNotEmpty()
  isMultipleChoice: boolean;

  // @IsNotEmpty()
  timerInSeconds: number;

  @IsNotEmpty()
  displayOrder: number;

  @IsNotEmpty()
  status: RecordStatus;

  @IsNotEmpty()
  quiz: { _id: string };

  videoUrl?: string;
  videoUrlMobile?: string;

  createdBy?: string;
  modifiedBy?: string;
}
