import {
  BufferedFile,
  DEFAULT_PROJECTION,
  DecodedPayload,
  DefaultQueryParamsWithQuiz,
  IUpdateQuestionDto,
  Page,
  PageData,
  ProjectionQuestioQuiz,
  ProjectionQuestionDataTableQuery,
} from '@damen/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { MinioClientService } from '../../_base/modules/minio/minio.service';
import { checkForNoRecordFound } from '../../_functions/common-functions';
import { CreateQuestionDto } from '../models/question.dto';
import { Question, QuestionDocument } from '../schema/question.schema';
import { IQuestionService } from './question-service.interface';

@Injectable()
export class QuestionService implements IQuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionRepository: Model<QuestionDocument>,
    private readonly minioClientService: MinioClientService
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    requestUser: DecodedPayload
  ) {
    const clone = { ...createQuestionDto };
    clone.createdBy = requestUser.sub;
    return await this.questionRepository.create(clone);
  }

  async findAll(
    queryParams: DefaultQueryParamsWithQuiz
  ): Promise<Page<QuestionDocument>> {
    const { order, sortByField, limit, skip, projection, quiz } = queryParams;
    const findQuery = this.questionRepository
      .find()
      .sort({ [sortByField]: order })
      .skip(skip * limit)
      .limit(limit);

    switch (projection) {
      case DEFAULT_PROJECTION: {
        findQuery.projection(new ProjectionQuestionDataTableQuery());
        break;
      }
    }
    const data = await findQuery;
    const length = await this.questionRepository
      .find({ quiz: new ObjectId(quiz) })
      .count();

    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return <Page<QuestionDocument>>{ data, page };
  }

  async findById(
    queryParams: DefaultQueryParamsWithQuiz
  ): Promise<Page<QuestionDocument>> {
    const { order, sortByField, limit, skip, projection, quiz } = queryParams;
    const findQuery = this.questionRepository
      .find({ quiz: new ObjectId(quiz) })
      .sort({ [sortByField]: order })
      .skip(skip * limit)
      .limit(limit);

    switch (projection) {
      case DEFAULT_PROJECTION: {
        findQuery.projection(new ProjectionQuestionDataTableQuery());
        break;
      }
    }

    const data = await findQuery;
    const length = await this.questionRepository
      .find({ quiz: new ObjectId(quiz) })
      .count();

    const page: PageData = { length, pageIndex: skip, pageSize: limit };
    return <Page<QuestionDocument>>{ data, page };
  }

  findByOrder(quizId: string, displayOrder: number) {
    return this.questionRepository
      .findOne(
        { quiz: new ObjectId(quizId), displayOrder },
        new ProjectionQuestioQuiz()
      )
      .exec()
      .then((d) => checkForNoRecordFound<QuestionDocument>(d));
  }

  findOne(id: string) {
    return this.questionRepository
      .findOne({ _id: new ObjectId(id) })
      .exec()
      .then((d) => checkForNoRecordFound<QuestionDocument>(d));
  }

  update(
    id: string,
    updateQuestionDto: IUpdateQuestionDto,
    requestUser: DecodedPayload
  ) {
    updateQuestionDto.modifiedBy = requestUser.sub;
    return this.questionRepository
      .findOneAndUpdate({ _id: new ObjectId(id) }, updateQuestionDto, {
        new: true,
      })
      .exec()
      .then((d) => checkForNoRecordFound<QuestionDocument>(d));
  }

  async uploadImage(image: BufferedFile) {
    const name = await this.minioClientService.upload(image);
    return { name };
  }
}
