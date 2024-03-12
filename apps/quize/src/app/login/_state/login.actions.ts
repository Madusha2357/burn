import { ChangePasswordDto, Credentials, SendOtpDto } from '@damen/models';

export class SignIn {
  public static readonly type = '[Login] SignIn';
  constructor(public credentials: Credentials) {}
}

export class SignInWithoutNav {
  public static readonly type = '[Login] SignInWithoutNav';
  constructor(public credentials: Credentials) {}
}

export class CheckWinnerQuizId {
  public static readonly type = '[Login] CheckWinnerQuizId';
  constructor(public userId: string, public quizId: string) {}
}

export class SendOpt {
  public static readonly type = '[Login] SendOpt';
  constructor(public phoneNumber: SendOtpDto) {}
}

export class UpdateSendOpt {
  public static readonly type = '[Login] UpdateSendOpt';
  constructor(public update: boolean) {}
}

export class VerifyOpt {
  public static readonly type = '[Login] VerifyOpt';
  constructor(public payload: VerifyOpt) {}
}

export class ChangePassword {
  public static readonly type = '[Login] ChangePassword';
  constructor(public dto: ChangePasswordDto) {}
}

export class UpdatePasswordChange {
  public static readonly type = '[Login] UpdatePasswordChange';
  constructor(public update: boolean) {}
}

export class UpdateQuizId {
  public static readonly type = '[Login] UpdateQuizId';
  constructor(public quizId?: string) {}
}
