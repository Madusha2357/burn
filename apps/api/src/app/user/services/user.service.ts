/* eslint-disable prefer-const */
import {
  ChangePasswordDto,
  DecodedPayload,
  DefaultQueryParams,
  DEFAULT_PROJECTION,
  Page,
  PageData,
  ProjectionUserDataTableQuery,
  Role,
  UpdateUserDto,
  ProjectionUserBasic,
  UserStatus,
  ICreateUserDto,
  IDoctorNotificatoin,
} from '@damen/models';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, UpdateFilter } from 'mongodb';
import { Model } from 'mongoose';
import { CreateUserDto } from '../models/user.dto';
import { User, UserDocument } from '../schema/user.schema';
import { UserFindAllPromise } from '../types/user.types';
import { generateHashPassword } from '../utils/user-utils';
import { IUserService } from './user-service.interface';
import {
  checkForSamePassword,
  checkToThrowError,
  removePasswordField,
  requestUserRoleValidity,
} from './user.service-consts.consts';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { stringify } from 'csv-stringify/sync';
import { QuizResponseService } from '../../quiz-response/services/quiz-response.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<UserDocument>,
    private quizResponseServise: QuizResponseService
  ) {
    // this.initialize();
  }

  // async initialize() {
  //   await this.userRepository.create({
  //     email: 'admin@obmdigitalfactory.com',
  //     password: '$2b$10$Qm2p5uXQjFuUvmriNaKHDOGZnRWIEz562qQ5Nm0BBY8J0OLl4/j0u',
  //     roles: ['ADMIN'],
  //     status: 'ACTIVE',
  //   });
  // }

  async create(
    createUserDto: CreateUserDto,
    requestUser: DecodedPayload
  ): Promise<UserDocument> {
    // check for existing

    createUserDto.isDeleted = false;
    createUserDto.status = UserStatus.ACTIVE;
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    console.log('createUserDto', createUserDto);

    if (existingUser) throw new ConflictException();

    const clone = { ...createUserDto };
    clone.createdBy = 'requestUser.email';
    clone.password = generateHashPassword(clone.registerCode);
    clone.roles = [Role.USER];
    return await this.userRepository.create(clone);
  }

  async createAll(createUserDto: CreateUserDto[]) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll(query: DefaultQueryParams): Promise<Page<UserDocument>> {
    const { order, sortByField, limit, skip } = query;
    let findQuery: any;
    findQuery = this.userRepository
      .find({ isDeleted: false })
      .sort({ [sortByField]: order })
      .skip(skip * limit)
      .limit(limit);

    const data = await findQuery;
    const length = await this.userRepository.count();

    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return <Page<UserDocument>>{ data, page };
  }

  async findAllWithFilter(query: DefaultQueryParams): UserFindAllPromise {
    const { order, sortByField, limit, skip, projection, user } = query;
    let findQuery: any;
    if (user == UserStatus.ACTIVE) {
      findQuery = this.userRepository
        .find({ status: UserStatus.ACTIVE, isDeleted: false })
        .sort({ [sortByField]: order })
        .skip(skip * limit)
        .limit(limit);
    } else if (user == UserStatus.REGISTERED) {
      findQuery = this.userRepository
        .find({ status: UserStatus.REGISTERED, isDeleted: false })
        .where()
        .sort({ [sortByField]: order })
        .skip(skip * limit)
        .limit(limit);
    } else if (user == UserStatus.COMPLETE) {
      findQuery = this.userRepository
        .find({ status: UserStatus.COMPLETE, isDeleted: false })
        .where()
        .sort({ [sortByField]: order })
        .skip(skip * limit)
        .limit(limit);
    } else {
      findQuery = this.userRepository
        .find({ isDeleted: false })
        .sort({ [sortByField]: order })
        .skip(skip * limit)
        .limit(limit);
    }
    switch (projection) {
      case 'email': {
        findQuery.projection({ email: true });
        break;
      }
      case DEFAULT_PROJECTION: {
        findQuery.projection(new ProjectionUserDataTableQuery());
        break;
      }
    }

    const data = await findQuery;
    const length = await this.userRepository.count();

    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return { data, page } as Page<UserDocument | ProjectionUserDataTableQuery>;
  }

  async findOneWithPassword(id: string, requestUser: DecodedPayload) {
    let user: UserDocument;
    if (!requestUser.roles.includes(Role.ADMIN)) {
      user = await this.userRepository
        .findOne({ email: requestUser.sub })
        .exec();
    } else
      user = await this.userRepository
        .findOne({ _id: new ObjectId(id) })
        .exec();

    checkToThrowError<User>(user);
    return user;
  }

  async findOne(
    id: string,
    requestUser: DecodedPayload
  ): Promise<UserDocument> {
    //
    // if (!requestUser.roles.includes(Role.ADMIN)) {
    //   user = await this.userRepository
    //     .findOne({ email: requestUser.email }, new ProjectionUserBasic())
    //     .exec();
    // } else

    let user: UserDocument;

    user = await this.userRepository
      .findOne({ _id: new ObjectId(id) }, new ProjectionUserDataTableQuery())
      .exec();

    checkToThrowError<User>(user);
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ email }).exec();
    checkToThrowError<UserDocument>(user);
    return user;
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ phoneNumber }).exec();
    checkToThrowError<UserDocument>(user);
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestUser: DecodedPayload
  ) {
    console.log('user', updateUserDto);
    // ids = requestUserRoleValidity(requestUser, id, updateUserDto);
    removePasswordField(updateUserDto);
    updateUserDto.modifiedBy = requestUser.sub;
    //updateUserDto.status = UserStatus.REGISTERED;

    let x: IDoctorNotificatoin[];

    // only ROLE ADMIN can update others
    if (requestUser.roles.includes(Role.ADMIN)) {
      return this.userRepository
        .findOneAndUpdate({ _id: new ObjectId(id) }, updateUserDto, {
          new: true,
        })
        .exec();
    } else {
      if (updateUserDto.notification) {
        let newA: any[] = [];
        const excistedUser = await this.userRepository
          .findById({
            _id: new ObjectId(id),
          })
          .exec();
        // const exArray = excistedUser.notification;
        // console.log('excistedUser', exArray);
        // newA.push(exArray);
        newA.push(updateUserDto.notification[0]);
        updateUserDto.notification = newA;
        return this.userRepository
          .findOneAndUpdate({ _id: new ObjectId(id) }, updateUserDto, {
            new: true,
          })
          .exec();
      } else {
        return this.userRepository
          .findOneAndUpdate(
            { _id: new ObjectId(requestUser.id) },
            updateUserDto,
            { new: true }
          )
          .exec();
      }
    }
    //updateUserDto.status = UserStatus.ACTIVE; //update status as ACTIVE for every user
  }

  remove(id: string): Promise<User> {
    return this.userRepository
      .findByIdAndRemove({ _id: new ObjectId(id) })
      .exec();
  }

  async softDelete(
    id: string,
    updateUserDto: UpdateUserDto,
    requestUser: DecodedPayload
  ) {
    const updateUser: UpdateUserDto = {
      isDeleted: true,
    };
    // only ROLE ADMIN can update others
    await this.quizResponseServise.softDelete(updateUserDto.email);
    if (requestUser.roles.includes(Role.ADMIN)) {
      return this.userRepository
        .findOneAndUpdate({ _id: new ObjectId(id) }, updateUser, {
          new: true,
        })
        .exec();
    } else {
      return this.userRepository
        .findOneAndUpdate({ _id: new ObjectId(requestUser.id) }, updateUser, {
          new: true,
        })
        .exec();
    }

    //////

    // updateUserDto.isDeleted = false;
    // const filter: UpdateFilter<any> = {
    //   __v: 0,
    // };
    // const update: UpdateUserDto = {
    //   isDeleted: false,
    // };
    // return this.userRepository.updateMany(filter, update).exec();
  }

  /**
   * Reset the password of a user based on email address
   * @param credentials
   */
  async changePassword(
    credentials: ChangePasswordDto,
    requestUser: DecodedPayload
  ) {
    const { password, confirmPassword } = { ...credentials };
    if (password) {
      if (password == confirmPassword) {
        const user = await this.findOneWithPassword(
          requestUser.id,
          requestUser
        );
        await checkForSamePassword(password, user.password);

        const updateUserDto = { password: generateHashPassword(password) };
        return this.userRepository
          .findOneAndUpdate(
            { _id: new ObjectId(requestUser.id) },
            updateUserDto,
            { new: true }
          )
          .exec();
      }
      throw new NotAcceptableException(
        'Password and confirm password are different'
      );
    }
    throw new NotAcceptableException('Invalid input for password');
  }

  async downloadCsv(quizId: string) {
    let users: User[];
    if (quizId == '') {
      users = await this.userRepository
        .aggregate([
          {
            $sort: { createdAt: 1 },
          },
          {
            $addFields: {
              registrationUrl: {
                $concat: [
                  'https://exclusive.damenyachting.com/#/login/register-code?email=',
                  '$email',
                ],
              },
            },
          },
        ])
        .exec();
    } else {
      const userIds = await this.quizResponseServise.usersByQuizId(quizId);
      users = await this.userRepository.find({ _id: { $in: userIds } });
    }

    const filtered = users.filter((x) => x.isDeleted === false);
    const x = stringify(filtered, {
      header: true,
      columns: [
        { key: 'email', header: 'E-mail' },
        { key: 'firstName', header: 'First name' },
        { key: 'lastName', header: 'Last name' },
        { key: 'phoneNumber', header: 'Phonenumber' },
        { key: 'company.name', header: 'Company name' },
        { key: 'company.title', header: 'Job title' },
        // { key: 'status', header: 'Status' },
        { key: 'address.addressLine', header: 'Address Line' },
        { key: 'address.city', header: 'City' },
        { key: 'address.state', header: 'State' },
        { key: 'address.country', header: 'Country' },
        { key: 'registerCode', header: 'Register code' },
        { key: 'allowMarketingMails', header: 'Add Marketing Mail' },
        { key: 'registrationUrl', header: 'Registration url' },
      ],
    });

    const filename = join(process.cwd(), 'temp.csv');
    writeFileSync(filename, x);
  }

  async quizAttempCheck(id: string): Promise<boolean> {
    const user = await this.userRepository
      .findOne({ _id: new ObjectId(id) })
      .exec();

    if (user.company) {
      return true;
    } else {
      return false;
    }
  }

  async getUsersByQuiz(query: DefaultQueryParams) {
    const { quizId } = query;
    const userIds = await this.quizResponseServise.usersByQuizId(quizId);
    const users = await this.findUsersByIds(userIds, query);
    return users;
  }

  async findUsersByIds(userIds: ObjectId[], query?: DefaultQueryParams) {
    const { order, sortByField, limit, skip } = query;
    try {
      const users = await this.userRepository
        .find({ _id: { $in: userIds } })
        .sort({ [sortByField]: order })
        .skip(skip * limit)
        .limit(limit);

      const data = await users;
      const length = await this.userRepository.count();
      const page: PageData = { length, pageIndex: skip, pageSize: limit };

      if (users.length === 0) {
        console.log('No users found with the provided user IDs.');
      } else {
        return <Page<UserDocument>>{ data, page };
      }
    } catch (error) {
      console.error('Error while querying for users:', error);
    }
  }

  async getHospitals(query?: DefaultQueryParams) {
    const users = await this.userRepository.find({ role: 'hospital' });
    const data = await users;
    return data;
  }

  async getDoctors(query?: DefaultQueryParams) {
    const users = await this.userRepository.find({ role: 'doctor' });
    const data = await users;
    return data;
  }
}
