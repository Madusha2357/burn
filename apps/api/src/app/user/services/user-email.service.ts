import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { EmailService } from '../../_base/modules/email/email.service';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserEmailService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<UserDocument>,
    private readonly emailService: EmailService
  ) {}

  async sendInvitationEmail(id: string) {
    const findOne = { _id: new ObjectId(id) };
    const user = await this.userRepository.findOne(findOne).exec();
    this.emailService.createInvitationEmailForUser(user);
  }
}
