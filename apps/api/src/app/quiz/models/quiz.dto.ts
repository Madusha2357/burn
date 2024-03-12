import { ICreateQuizDto, RecordStatus } from '@damen/models';
import { IsNotEmpty } from 'class-validator';

export class CreateQuizDto implements ICreateQuizDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  endTime: Date;

  @IsNotEmpty()
  status: RecordStatus;

  @IsNotEmpty()
  minimalAnswerCountForWinning: number;

  createdBy?: string;
  modifiedBy?: string;
}
