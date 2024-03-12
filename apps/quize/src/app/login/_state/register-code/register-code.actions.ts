export class RegisterCode {
  public static readonly type = '[RegisterCode] RegisterCode';
  constructor(public registerCode: string, public email: string) {}
}
