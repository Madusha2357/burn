import {
  AuthorizedRequest,
  URL_SIGN_IN,
  VerifyOtpDto,
  SendOtpDto,
} from '@damen/models';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../auth.metadata';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller(`${URL_SIGN_IN}`)
export class SignInController {
  constructor(private readonly authService: AuthService) {}

  // TODO check for the decorators in place or not with Unit tests
  /**
   * Post method for sign in endpoint
   * @param req
   * @returns
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post()
  signIn(@Req() req: AuthorizedRequest, @Res() res: Response) {
    return res.status(200).json(this.authService.signIn(req.user));
  }

  @Public()
  @Post('otp')
  sendOtp(@Body() sendOtp: SendOtpDto) {
    return this.authService.sendOtp(sendOtp);
  }

  @Public()
  @Post('otp/verify')
  verifyOtp(@Body() sendOtp: VerifyOtpDto) {
    return this.authService.verifyOtp(sendOtp);
  }
}
