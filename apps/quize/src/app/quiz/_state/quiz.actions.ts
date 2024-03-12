import { UpdateUserDto } from '@damen/models';

export class StartQuiz {
  public static readonly type = '[Quiz] StartQuiz';
}

export class NextQuestion {
  public static readonly type = '[Quiz] NextQuestion';
  constructor(public order: number) {}
}

export class UpdateUserAddress {
  public static readonly type = '[Quiz] UpdateUserAddress';
  constructor(public updateUser: UpdateUserDto) {}
}
