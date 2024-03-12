export class ShowLoading {
  public static readonly type = '[App] ShowLoading';
  constructor(public loading: boolean) {}
}

export class AddAccessToken {
  public static readonly type = '[App] AddAccessToken';
  constructor(public accessToken: string) {}
}

export class RemoveAccessToken {
  public static readonly type = '[App] RemoveAccessToken';
}

export class AddAccessTokenAndNavigate {
  public static readonly type = '[App] AddAccessTokenAndNavigate';
  constructor(public accessToken: string) {}
}

export class SignOut {
  public static readonly type = '[App] SignOut';
}
