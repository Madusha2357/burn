import {
  AppendQuizResponseDto,
  DecodedPayload,
  DefaultQueryParams,
  DefaultQueryParamsWithUserId,
  DEFAULT_PROJECTION,
  ICreateQuizResponseDto,
  PageData,
  ProjectionQuizResponseDataTableQuery,
  ProjectionQuizResponseOverview,
  ProjectionQuizResponseOverviewQuery,
  ProjectionQuizResponseOverviewQuizQuery,
  ProjectionQuizResponseOverviewUserQuery,
  ProjectionQuizResponseUniqueKeyQuery,
  UpdateQuizResponseDto,
  UserStatus,
  Role,
  UserQuizKey,
  RecordStatus,
  AccessToken,
} from '@damen/models';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { QuestionService } from '../../question/services/question.service';
import { QuizService } from '../../quiz/services/quiz.service';
import { QuizFindAllPromise } from '../../quiz/types/quiz.types';
import { checkForNoRecordFound } from '../../_functions/common-functions';
import {
  CreatePublicQuizResponseDto,
  QuizResponseResultDto,
} from '../models/quiz-response.dto';
import {
  QuizResponse,
  QuizResponseDocument,
} from '../schema/quiz-response.schema';
import { QuizResponseFindAllPromise } from '../types/quiz-response.types';
import { IQuizResponseService } from './quiz-response-service.interface';
import {
  filterSameQuestion,
  getResponseStatus,
} from './quiz-response-service.utils';
import { User } from '../../user/schema/user.schema';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class QuizResponseService implements IQuizResponseService {
  constructor(
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService,
    @InjectModel(QuizResponse.name)
    private readonly quizResponseRepository: Model<QuizResponseDocument>,
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async findResultsByQuizId(quizId) {
    if (quizId) {
      const result = await this.getQuizResults.call(this, quizId);
      if (result.length > 0) {
        return result;
      } else {
        throw new NotFoundException('No quiz available for the input quizId');
      }
    } else {
      throw new NotAcceptableException('Quiz id cannot be empty');
    }
  }

  async downloadQuizResponse(quizId) {
    const result = await this.getQuizResults.call(this, quizId);
    if (result.length > 0) {
      // Use flatMap to create a flat array of modified rows
      const modifiedResult = result.flatMap((r) => {
        const responses = r.responses || [];
        return responses.map((response) => ({
          createdBy: r.createdBy,
          firstName: r.firstName,
          lastName: r.lastName,
          phoneNumber: r.phoneNumber,
          question: response.question,
          answer: response.response.join(', '),
          'company.name': r.company.name,
          'company.title': r.company.title,
          address: r.address,
          city: r.city,
          state: r.state,
          country: r.country,
          allowMarketingMails: r.allowMarketingMails,
          correctCount: r.correctCount,
          status: r.status,
        }));
      });

      const results = stringify(modifiedResult, {
        header: true,
        columns: [
          { key: 'createdBy', header: 'Email' },
          { key: 'firstName', header: 'First name' },
          { key: 'lastName', header: 'Last name' },
          { key: 'phoneNumber', header: 'Phonenumber' },
          { key: 'question', header: 'Question' },
          { key: 'answer', header: 'Answer' },
          { key: 'company.name', header: 'Company name' },
          { key: 'company.title', header: 'Job title' },
          { key: 'address', header: 'Address line' },
          { key: 'city', header: 'City' },
          { key: 'state', header: 'State' },
          { key: 'country', header: 'Country' },
          { key: 'allowMarketingMails', header: 'Add marketing mail' },
          { key: 'correctCount', header: 'Correct answer count' },
          { key: 'status', header: 'Status' },
        ],
      });

      const filename = join(process.cwd(), 'temp.csv');
      writeFileSync(filename, results);
    }
  }

  async getQuizResults(quizId: string) {
    const quizResponses = await this.quizResponseRepository.find({
      'userQuizKey.quizId': quizId,
    });
    const result = [];
    const userIds = quizResponses.map((item) => item.userQuizKey.userId);
    const users = await this.userRepository.find({
      id: userIds,
    });

    let answers = [];

    if (quizResponses && quizResponses.length > 0) {
      quizResponses.map((r) => {
        r.responses.map((e) => {
          answers.push(e.responseStatus);
          const filteredAnswers = answers.filter((c) => c === 'CORRECT').length;
          r.correctCount = filteredAnswers;
        });
        answers = [];
      });

      for (const userQuiz of quizResponses) {
        const userId = userQuiz.userQuizKey.userId;

        for (const user of users) {
          if (user._id.equals(new ObjectId(userId))) {
            const newUser = {
              _id: userQuiz._id,
              createdBy: user.email,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              responses: userQuiz.responses,
              company: {
                name: user.company?.name,
                title: user.company?.title,
              },
              allowMarketingMails: user.allowMarketingMails,
              address: user.address?.addressLine,
              city: user.address?.city,
              state: user.address?.state,
              country: user.address?.country,
              correctCount: userQuiz.correctCount,
              status: userQuiz.status,
              place: userQuiz.place,
            };
            result.push(newUser);
          }
        }
      }
    }

    return result;
  }

  async public(dto: CreatePublicQuizResponseDto) {
    // create a user if not exists
    let user = await this.userRepository.findOne({ email: dto.email }).exec();
    if (user == null) {
      const { email, firstName, lastName } = dto;
      const registerCode = randomUUID();
      const password = randomUUID();
      user = await this.userRepository.create({
        email,
        firstName,
        lastName,
        password,
        registerCode,
        isDeleted: false,
      });
    }

    const decodedPayload: DecodedPayload = {
      id: user._id.toString(),
      status: UserStatus.ACTIVE,
      sub: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: [Role.USER],
    };

    const userQuizKey: UserQuizKey = {
      quizId: dto.quizId,
      userId: user._id.toString(),
    };
    // create user response if not existisn
    let quizResponse = await this.quizResponseRepository
      .findOne({ userQuizKey })
      .exec();
    if (quizResponse == null) {
      const res: QuizResponse = {
        userQuizKey,
        responses: [],
        correctCount: 0,
        totalCount: 0,
        status: RecordStatus.ACTIVE,
      };

      quizResponse = await this.quizResponseRepository.create(res);
    }

    const q: AccessToken = {
      accessToken: this.jwtService.sign(decodedPayload),
      quizResponseId: quizResponse._id.toString(),
    };
    return q;
  }

  async create(
    dto: ICreateQuizResponseDto,
    requestUser: DecodedPayload
  ): Promise<QuizResponseDocument> {
    await this.quizService.validate(dto.userQuizKey.quizId);
    // check exising and return
    const { userId, quizId } = dto.userQuizKey;
    dto.isDeleted = false;
    const existing = await this.quizResponseRepository
      .aggregate()
      .match({ userQuizKey: { quizId, userId } })
      .exec();
    if (existing && existing.length == 1) return existing[0];

    const clone = { ...dto };
    clone.createdBy = requestUser.sub;
    return await this.quizResponseRepository.create(clone);
  }

  async findAll(query: DefaultQueryParams): QuizResponseFindAllPromise {
    const { order, sortByField, limit, skip, projection } = query;
    const findQuery = this.quizResponseRepository
      .find()
      .sort({ [sortByField]: order })
      .skip(skip * limit)
      .limit(limit);

    switch (projection) {
      case DEFAULT_PROJECTION: {
        findQuery.projection(new ProjectionQuizResponseDataTableQuery());
        break;
      }
    }
    const data = await findQuery;
    const length = await this.quizResponseRepository.count();

    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return { data, page };
  }

  findOne(id: string) {
    const quizResponse = this.quizResponseRepository
      .findOne({ _id: new ObjectId(id) })
      .exec()
      .then((d) => checkForNoRecordFound<QuizResponseDocument>(d));
    return quizResponse;
  }

  async findOneByKey(
    quizId: string,
    userId: string
  ): Promise<ProjectionQuizResponseOverview> {
    const data = (await this.quizResponseRepository
      .aggregate()
      .match({ userQuizKey: { quizId, userId } })
      .addFields({ qId: { $toObjectId: '$userQuizKey.quizId' } })
      .addFields({ uId: { $toObjectId: '$userQuizKey.userId' } })
      .lookup({
        from: 'quizzes',
        localField: 'qId',
        foreignField: '_id',
        pipeline: [{ $project: new ProjectionQuizResponseOverviewQuizQuery() }],
        as: 'quiz',
      })
      .lookup({
        from: 'users',
        localField: 'uId',
        foreignField: '_id',
        pipeline: [{ $project: new ProjectionQuizResponseOverviewUserQuery() }],
        as: 'user',
      })
      .project(new ProjectionQuizResponseOverviewQuery())
      .exec()) as unknown as ProjectionQuizResponseOverview;
    return data;
  }

  async update(
    id: string,
    updateQuizResponseDto: UpdateQuizResponseDto,
    requestUser: DecodedPayload
  ) {
    updateQuizResponseDto.modifiedBy = requestUser.sub;
    const quizResponse = await this.findOne(id);
    await this.quizService.validate(quizResponse.userQuizKey.quizId);

    return this.quizResponseRepository
      .findOneAndUpdate({ _id: new ObjectId(id) }, updateQuizResponseDto, {
        new: true,
      })
      .exec()
      .then((d) => checkForNoRecordFound<QuizResponseDocument>(d));
  }

  async softDelete(email: string) {
    const updated: UpdateQuizResponseDto = {
      isDeleted: true,
    };

    return this.quizResponseRepository
      .findOneAndUpdate({ createdBy: email }, updated, {
        new: true,
      })
      .exec();

    ////

    // const filter: UpdateFilter<UpdateQuizResponseDto> = {
    //   __v: 0,
    // };
    // const update: UpdateQuizResponseDto = {
    //   isDeleted: false,
    // };
    // return this.quizResponseRepository.updateMany(filter, update).exec();
  }

  async append(id: string, quizResponseDto: QuizResponseResultDto) {
    const quizResponse = await this.findOne(id);
    console.log('res', quizResponse);
    console.log(quizResponseDto);
    // validate the if the exising response and give error
    const existings = quizResponse.responses.find(
      (res) => res.questionId.toString() === quizResponseDto.questionId
    );

    if (existings) throw new BadRequestException('Answer already provided');

    console.log(existings);

    await this.quizService.validate(quizResponse.userQuizKey.quizId);
    const responses = await this.getSavedQuizResponseById(id, quizResponseDto);
    return this.quizResponseRepository
      .findOneAndUpdate({ _id: new ObjectId(id) }, { responses }, { new: true })
      .exec()
      .then((d) => checkForNoRecordFound<QuizResponseDocument>(d));
  }

  async quizzesByUserId(
    query: DefaultQueryParamsWithUserId
  ): QuizFindAllPromise {
    const { order, sortByField, limit, skip, projection, userId } = query;
    if (userId) {
      const findQuizzesQuery = this.quizResponseRepository.find({
        'userQuizKey.userId': userId,
      });
      findQuizzesQuery.projection(new ProjectionQuizResponseUniqueKeyQuery());
      const quizData = await findQuizzesQuery;

      if (quizData && quizData.length > 0) {
        const quisIds = quizData.map((d) => new ObjectId(d.userQuizKey.quizId));
        const queryObj = { _id: quisIds };
        const data = await this.quizService.findAll(
          {
            skip,
            limit,
            sortByField,
            order,
            projection,
            user: UserStatus.ALL,
            quizId: '',
          },
          queryObj
        );
        return data;
      }
      throw new NotFoundException('No quiz available for the input userId');
    }
    throw new NotAcceptableException('User id cannot be empty');
  }

  async usersByQuizId(quizId: string): Promise<ObjectId[]> {
    if (quizId) {
      const findQuizzesQuery = this.quizResponseRepository.aggregate([
        {
          $match: { 'userQuizKey.quizId': quizId },
        },
        {
          $project: {
            _id: { $toObjectId: '$userQuizKey.userId' },
          },
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$_id' },
          },
        },
        {
          $project: {
            _id: 0,
            userIds: 1,
          },
        },
      ]);

      const quizData = await findQuizzesQuery;
      const ids = quizData[0].userIds;

      return ids;
    }
    throw new NotAcceptableException('User id cannot be empty');
  }

  /**
   * this function is used to retreive already saved responses for a id field of QuizResponse
   * @param id
   * @param quizResponseDto
   * @returns Promise<AppendQuizResponseDto>
   */
  private async getSavedQuizResponseById(
    id: string,
    dto: QuizResponseResultDto
  ): Promise<AppendQuizResponseDto> {
    const quizResponse = await this.findOne(id);
    let responses: QuizResponseResultDto[] = [];
    responses = filterSameQuestion(quizResponse, dto);

    const questionResponse = await this.questionService.findOne(dto.questionId);
    // choises have correct answers
    if (questionResponse.choices) {
      const correctAnswers = questionResponse.choices
        .filter((c) => c.correctAnswer)
        .map((c) => c.text);
      dto.answer = correctAnswers;
      dto.responseStatus = getResponseStatus(correctAnswers, dto.response);
    }

    dto.question = questionResponse.text;
    responses.push(dto);
    return responses as AppendQuizResponseDto;
  }
}
