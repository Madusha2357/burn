import { Page } from '@damen/models';
import * as questionStub from '@damen/stubs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Question, QuestionDocument } from '../schema/question.schema';
import { QuestionService } from '../services/question.service';
import { QuestionController } from './question.controller';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;
  const questionDocument = { id: Types.ObjectId } as QuestionDocument;
  const authRequest = questionStub.AUTH_ADMIN_REQUEST;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        QuestionService,
        {
          provide: getModelToken(Question.name),
          useValue: { Symbol: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined => controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined => service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return the created question', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(questionDocument);
      expect(
        await controller.create(questionStub.QUESTION_CREATE_DTO, authRequest)
      ).toBe(questionDocument);
    });
  });

  describe('findAll', () => {
    it('should return a page of created question', async () => {
      const questionPage =
        questionStub.QUESTION_PAGE_1_DATA as Page<QuestionDocument>;
      jest.spyOn(service, 'findAll').mockResolvedValue(questionPage);
      expect(await controller.findAll({ skip: 1, limit: 5 })).toBe(
        questionPage
      );
    });
  });

  describe('findOne', () => {
    it('should return the question by question id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(questionDocument);
      expect(await controller.findOne(questionStub.OBJECT_ID)).toBe(
        questionDocument
      );
    });
  });

  describe('update', () => {
    it('should return the update question', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(questionDocument);
      expect(
        await controller.update(
          questionStub.OBJECT_ID,
          questionStub.QUESTION_UPDATE_DTO_TEXT,
          authRequest
        )
      ).toBe(questionDocument);
    });
  });
});
