import { BaseId } from '@damen/models';

export class ChoiceDto implements BaseId {
  _id: string;
  text: string;
  correctAnswer: boolean;
}
