import {
  DecodedPayload,
  DefaultQueryParams,
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
  DEFAULT_SORT_BY_FIELD,
  Page,
  PageData,
  ProjectionQuizDataTableQuery,
  RecordStatus,
  UpdateQuizDto,
} from '@damen/models';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { checkForNoRecordFound } from '../../_functions/common-functions';
import { CreateQuizDto } from '../models/quiz.dto';
import { Quiz, QuizDocument } from '../schema/quiz.schema';
import { QuizFindAllPromise } from '../types/quiz.types';
import { IQuizService } from './quiz-service.interface';

@Injectable()
export class QuizService implements IQuizService {
  constructor(
    @InjectModel(Quiz.name)
    private readonly quizRepository: Model<QuizDocument>
  ) {}

  async create(
    createQuizDto: CreateQuizDto,
    requestUser: DecodedPayload
  ): Promise<QuizDocument> {
    // check for existing
    const existingQuiz = await this.quizRepository.findOne({
      name: createQuizDto.name,
    });

    if (existingQuiz) throw new ConflictException();

    const clone = { ...createQuizDto };
    clone.createdBy = requestUser.sub;
    return await this.quizRepository.create(clone);
  }

  async findAll(
    queryParams: DefaultQueryParams,
    dto: unknown
  ): QuizFindAllPromise {
    const { order, sortByField, limit, skip, projection } = queryParams;
    let length: number;
    const findQuery = this.quizRepository.find();
    if (dto) {
      findQuery.find(dto);
      length = await this.quizRepository.find(dto).count();
    } else {
      length = await this.quizRepository.count();
    }
    findQuery
      .sort({ [sortByField]: order })
      .skip(skip * limit)
      .limit(limit);

    switch (projection) {
      case DEFAULT_PROJECTION: {
        findQuery.projection(new ProjectionQuizDataTableQuery());
        break;
      }
    }

    const data = await findQuery;
    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return <Page<QuizDocument>>{ data, page };
  }

  findOne(id: string): Promise<QuizDocument> {
    const quiz = this.quizRepository
      .findOne({ _id: new ObjectId(id) })
      .exec()
      .then((d) => checkForNoRecordFound<QuizDocument>(d));
    return quiz;
  }

  findActive(): Promise<QuizDocument> {
    const quiz = this.quizRepository
      .findOne({ status: RecordStatus.ACTIVE })
      .sort({ [DEFAULT_SORT_BY_FIELD]: DEFAULT_ORDER })
      // .limit(1)
      .exec()
      .then((d) => checkForNoRecordFound<QuizDocument>(d));
    return quiz;
  }

  update(
    id: string,
    updateQuizDto: UpdateQuizDto,
    requestUser: DecodedPayload
  ) {
    updateQuizDto.modifiedBy = requestUser.sub;
    return this.quizRepository
      .findOneAndUpdate({ _id: new ObjectId(id) }, updateQuizDto, { new: true })
      .exec()
      .then((d) => checkForNoRecordFound<QuizDocument>(d));
  }

  async validate(id: string) {
    if (id) {
      const nowDate = new Date();
      const quiz = await this.quizRepository
        .findOne({ _id: new ObjectId(id) })
        .sort({ [DEFAULT_SORT_BY_FIELD]: DEFAULT_ORDER })
        .exec()
        .then((d) => checkForNoRecordFound<QuizDocument>(d));

      if (quiz.status != RecordStatus.ACTIVE) {
        throw new BadRequestException('Quiz is Not Active');
      } else if (quiz.startTime > quiz.endTime) {
        throw new BadRequestException('Invalid start-end time period');
      } else if (quiz.startTime > nowDate) {
        throw new BadRequestException('Quiz not started yet');
      } else if (quiz.endTime < nowDate) {
        throw new BadRequestException('Quiz expired');
      }
      return quiz;
    }
    throw new NotAcceptableException('Quiz id cannot be empty');
  }
}
