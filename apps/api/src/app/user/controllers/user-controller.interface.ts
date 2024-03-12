import {
  AuthorizedRequest,
  ChangePasswordDto,
  DefaultQueryParams,
  ICreateUserDto,
  UpdateUserDto,
} from '@damen/models';
import { UserDocument } from '../schema/user.schema';
import { UserFindAllPromise } from '../types/user.types';

export interface IUserController {
  /**
   * Endpoint to create a new user
   * @param dto
   * @param req - Authorized request
   * @returns Promise<UserDocument>
   */
  create(dto: ICreateUserDto, req: AuthorizedRequest): Promise<UserDocument>;

  /**
   * Endpoint to retrieve a user by id
   * @param id - user id
   * @returns Promise<UserDocument>
   */
  findOne(id: string, req: AuthorizedRequest): Promise<UserDocument>;

  /**
   * Endpoint to retrieve a page of users
   * @param PaginationParams: consists of {skip => page no, limit => page size, sortByField => sort field, order => sort order},
   * @returns Promise<Page<UserDocument>
   */
  findAll(query: DefaultQueryParams): UserFindAllPromise;

  /**
   * Endpoint to update a user by id
   * @param id : unique value to identify the user document
   * @param dto : edited data that needs to be updated
   * @param req - Authorized request
   * @returns Promise<UserDocument>
   */
  update(
    id: string,
    dto: UpdateUserDto,
    req: AuthorizedRequest
  ): Promise<UserDocument>;

  /**
   * Endpoint to change the password of a user
   * @param credential
   * @param req
   * @returns
   */
  changePassword(credentials: ChangePasswordDto, req: AuthorizedRequest);
}
