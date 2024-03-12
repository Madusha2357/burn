export class GetCurretQuize {
  public static readonly type = '[Site] GetCurretQuize';
}

export class CheckUserParticipation {
  public static readonly type = '[Site] CheckUserParticipation';
}

export class GetCurrentUser {
  public static readonly type = '[Site] GetCurrentUser';
}

export class GetVideoLink {
  public static readonly type = '[Site] GetVideoLink';
  constructor(public videoLink: string) {}
}
