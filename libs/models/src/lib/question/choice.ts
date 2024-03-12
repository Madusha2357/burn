import { BaseId } from '../_base/base';

export interface Choice extends BaseId {
  text: string;
  correctAnswer: boolean;
}
