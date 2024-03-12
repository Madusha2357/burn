import { Page, ProjectionUserDataTableQuery } from '@damen/models';
import { UserDocument } from '../schema/user.schema';

export type UserFindAllPromise = Promise<
  Page<UserDocument | ProjectionUserDataTableQuery>
>;
