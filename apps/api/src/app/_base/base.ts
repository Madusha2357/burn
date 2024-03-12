import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  modifiedBy?: string;
}
