import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio/lib';
import { environment } from '../../../../environments/environment';
import { VerifyOtpDto } from '@damen/models';

@Injectable()
export class TwilioService {
  private client: Twilio;
  constructor() {
    this.client = new Twilio(environment.TWILIO_SID, environment.TWILIO_TOKEN);
  }

  async sendMessage(receiverPhoneNumber: string) {
    const verifySid = environment.TWILIO_VERIFY_SID;
    await this.client.verify.v2
      .services(verifySid)
      .verifications.create({ to: receiverPhoneNumber, channel: 'sms' });
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const verifySid = environment.TWILIO_VERIFY_SID;
    return this.client.verify.v2.services(verifySid).verificationChecks.create({
      to: verifyOtp.phoneNumber,
      code: verifyOtp.code,
    });
  }
}
