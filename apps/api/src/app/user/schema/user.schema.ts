import {
  Role,
  Address,
  ContactMethod,
  UserStatus,
  Company,
  Location,
  DoctorNotificatoin,
} from '@damen/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../_base/base';

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  registerCode: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  status: UserStatus;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: Location })
  location: Location;

  @Prop()
  time?: string[];

  @Prop()
  timer?: string[];

  @Prop()
  hospital?: string;

  @Prop()
  role: string;

  @Prop()
  phoneNumber: string;

  @Prop([String])
  roles: Role[];

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: DoctorNotificatoin })
  notification: DoctorNotificatoin;

  @Prop([ContactMethod])
  contactMethod: ContactMethod;

  @Prop({ type: Company })
  company: Company;

  @Prop()
  allowMarketingMails: boolean;

  @Prop()
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
