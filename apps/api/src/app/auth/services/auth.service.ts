import {
  AccessToken,
  DecodedPayload,
  DecodeJwtToken,
  ERROR_EXPIRED,
  ERROR_INVALID,
  SendOtpDto,
  UserStatus,
  VerifyOtpDto,
} from '@damen/models';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HydratedDocument } from 'mongoose';
import { TwilioService } from '../../_base/modules/twilio/twilio.service';
import { TriggerEventService } from '../../trigger-event/services/trigger-event.service';
import { User } from '../../user/schema/user.schema';
import { UserService } from '../../user/services/user.service';
import { compareHashedPassword } from '../../user/utils/user-utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
    private readonly triggerEventService: TriggerEventService
  ) {}

  async validateUser(email: string, password: string): Promise<DecodedPayload> {
    const user = await this.usersService.findOneByEmail(email);

    const passwordIsMatch = await compareHashedPassword(
      password,
      user.password
    );

    if (passwordIsMatch) {
      return this.userToDecodedPayload(user);
    } else if (user.status == UserStatus.REGISTERED) {
      throw new BadRequestException(ERROR_EXPIRED);
    }

    throw new BadRequestException(ERROR_INVALID);
  }

  private userToDecodedPayload(user: HydratedDocument<User>) {
    const { email, _id, status, firstName, lastName, roles } = user;
    return {
      id: _id.toString(),
      sub: email,
      status,
      firstName,
      lastName,
      roles,
    };
  }

  /**
   * Create a JWT Access Token
   * @param decodePayload
   * @returns AccessToken
   */
  signIn(decodePayload: DecodedPayload): AccessToken {
    return { accessToken: this.jwtService.sign(decodePayload) };
  }

  async sendOtp(sendOtp: SendOtpDto) {
    await this.usersService.findOneByPhoneNumber(sendOtp.phoneNumber);
    try {
      await this.twilioService.sendMessage(sendOtp.phoneNumber);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send SMS');
    }
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const res = await this.twilioService.verifyOtp(verifyOtp);
    if (res && res.status == 'approved') {
      const user = await this.usersService.findOneByPhoneNumber(
        verifyOtp.phoneNumber
      );
      const decoded = this.userToDecodedPayload(user);
      return { accessToken: this.jwtService.sign(decoded) };
    }
    throw new InternalServerErrorException('Verification faild');
  }

  /**
   * Decode JWT Access Token
   * @param bearerToken
   * @returns DecodeJwtToken
   */
  decodeJwt(bearerToken: string): DecodeJwtToken {
    if (bearerToken.length < 8) {
      throw new Error('Bearer token is not valid');
    }
    const token = bearerToken.substring(7);
    return this.jwtService.decode(token) as DecodeJwtToken;
  }

  deviceName(deviceName: string, browserName: string): string {
    if (deviceName == undefined || browserName == undefined) return;
    const device = deviceName.substring(7);
    const browser = browserName.substring(8);
    return this.triggerEventService.getDeviceName(
      device,
      browser
    ) as unknown as string;
  }
}
