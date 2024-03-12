import {
  ChangePasswordDto,
  Credentials,
  DecodedPayload,
  DefaultQueryParams,
  UpdateUserDto,
} from '@damen/models';
import { CreateUserDto } from '../models/user.dto';
import { User, UserDocument } from '../schema/user.schema';
import { UserFindAllPromise } from '../types/user.types';

export interface IUserService {
  /**
   * Create a new user.
   * @param CreateUserDto
   * @param DecodedPayload
   * @returns
   */
  create(
    createUserDto: CreateUserDto,
    requestUser: DecodedPayload
  ): Promise<UserDocument>;

  /**
   * Create multiple users.
   * @param CreateUserDto[]
   * @returns
   */
  createAll(createUserDto: CreateUserDto[]): Promise<UserDocument[]>;

  /**
   * get a page of users in the descending order of the sort field,
   * with a page size and page index
   * @param DefaultQueryParams
   */
  findAll(query: DefaultQueryParams): UserFindAllPromise;

  /**
   * find user by id
   * @param string
   * @param DecodedPayload
   */
  findOne(id: string, requestUser: DecodedPayload): Promise<UserDocument>;

  /**
   * find user by email
   * @param string
   */
  findOneByEmail(email: string): Promise<UserDocument>;

  /**
   * update user with the provided edited fields
   * @param string
   * @param UpdateUserDto
   * @param DecodedPayload
   */
  update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestUser: DecodedPayload
  ): Promise<UserDocument>;

  /**
   * delete user by id
   * @param string
   */
  remove(id: string): Promise<User>;

  /**
   * Reset the password of a user based on email address
   * @param Credentials
   */
  changePassword(
    credentials: ChangePasswordDto,
    requestUser: DecodedPayload
  ): Promise<UserDocument>;
}
