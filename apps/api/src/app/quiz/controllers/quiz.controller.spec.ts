import * as quizStub from '@damen/stubs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
  DEFAULT_SORT_BY_FIELD,
  Page,
  ProjectionQuizDataTable,
} from '@damen/models';
import { Quiz, QuizDocument } from '../schema/quiz.schema';
import { QuizService } from '../services/quiz.service';
import { QuizController } from './quiz.controller';

describe('QuizController', () => {
  let controller: QuizController;
  let service: QuizService;
  const quizDocument = { id: Types.ObjectId } as QuizDocument;
  const authRequest = quizStub.AUTH_ADMIN_REQUEST;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        QuizService,
        {
          provide: getModelToken(Quiz.name),
          useValue: { Symbol: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    service = module.get<QuizService>(QuizService);
  });

  it('should be defined => controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined => service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return the created quiz', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(quizDocument);
      expect(
        await controller.create(quizStub.QUIZ_CREATE_DTO, authRequest)
      ).toBe(quizDocument);
    });
  });

  describe('findAll', () => {
    it('should return a page of created quiz', async () => {
      const quizPage = quizStub.QUIZ_PAGE_1_DATA as Page<QuizDocument>;
      jest.spyOn(service, 'findAll').mockResolvedValue(quizPage);
      expect(
        await controller.findAll(
          {
            skip: 1,
            limit: 5,
            sortByField: DEFAULT_SORT_BY_FIELD,
            order: DEFAULT_ORDER,
            projection: DEFAULT_PROJECTION,
          },
          {} as ProjectionQuizDataTable
        )
      ).toBe(quizPage);
    });
  });

  describe('findActive', () => {
    it('should return the latest created active quiz', async () => {
      jest.spyOn(service, 'findActive').mockResolvedValue(quizDocument);
      expect(await controller.findActive()).toBe(quizDocument);
    });
  });

  describe('findOne', () => {
    it('should return the quiz by quid id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(quizDocument);
      expect(await controller.findOne(quizStub.OBJECT_ID)).toBe(quizDocument);
    });
  });

  describe('update', () => {
    it('should return the update quiz', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(quizDocument);
      expect(
        await controller.update(
          quizStub.OBJECT_ID,
          quizStub.QUIZ_UPDATE_DTO_NAME,
          authRequest
        )
      ).toBe(quizDocument);
    });
  });
});
