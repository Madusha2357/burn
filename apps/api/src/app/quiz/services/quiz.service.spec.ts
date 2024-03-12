import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
  DEFAULT_SKIP,
  DEFAULT_SORT_BY_FIELD,
  RecordStatus,
} from '@damen/models';
import * as quizStub from '@damen/stubs';
import { NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { clean, close, rootModule } from '../../_utils/mongo-test.utils';
import { Quiz, QuizDocument, QuizSchema } from '../schema/quiz.schema';
import { QuizService } from './quiz.service';

const mongooseModule = MongooseModule.forFeature([
  { name: Quiz.name, schema: QuizSchema },
]);

export async function getModule() {
  return await Test.createTestingModule({
    imports: [rootModule(), mongooseModule],
    providers: [QuizService],
  }).compile();
}

describe('Quiz Service : create', () => {
  let service: QuizService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuizService>(QuizService);
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should create a quiz', async () => {
    const quiz = await service.create(
      quizStub.QUIZ_CREATE_DTO,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(quiz.id).toBeDefined();
  });
});

describe('Quiz Service : findAll', () => {
  let service: QuizService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuizService>(QuizService);

    for (let index = 0; index < 10; index++) {
      await service.create(
        { ...quizStub.QUIZ_CREATE_DTO, name: 'name 0' + index },
        quizStub.DECODED_PAYLOAD_STUB
      );
    }
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should return a page of quizzes with default page options => check total data count', async () => {
    const page = await service.findAll({
      skip: DEFAULT_SKIP,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.page.length).toBe(10);
  });

  it('should return a page of quizzes with default page options => check data length with page limit', async () => {
    const page = await service.findAll({
      skip: DEFAULT_SKIP,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.data.length).toBe(DEFAULT_LIMIT);
  });

  it('should return the second page of quizzes with parameterized page options', async () => {
    const page = await service.findAll({
      skip: 1,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.page.pageIndex).toBe(1);
  });

  it('should return an empty page of quizzes with not in range page options', async () => {
    const page = await service.findAll({
      skip: 2,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.data.length).toBe(0);
  });
});

describe('Quiz Service : findOne', () => {
  let service: QuizService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuizService>(QuizService);
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should return a quiz with valid id', async () => {
    const quiz = await service.create(
      { ...quizStub.QUIZ_CREATE_DTO },
      quizStub.DECODED_PAYLOAD_STUB
    );

    const oneQuiz = await service.findOne(quiz.id);
    expect(oneQuiz.name).toBe(quiz.name);
  });

  it('should return the NotFoundException error when the requested quiz id is invalid', async () => {
    const invalidQuizDocument = quizStub.INVALID_DOCUMENT as QuizDocument;
    await expect(
      async () => await service.findOne(invalidQuizDocument.id.toString())
    ).rejects.toThrow(NotFoundException);
  });
});

describe('Quiz Service : findActive', () => {
  let service: QuizService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuizService>(QuizService);
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should return the NotFoundException error when active quiz is unavailable', async () => {
    await expect(async () => await service.findActive()).rejects.toThrow(
      NotFoundException
    );
  });

  it('should return a quiz with active status and contains the latest created quiz', async () => {
    await service.create(
      { ...quizStub.QUIZ_CREATE_DTO },
      quizStub.DECODED_PAYLOAD_STUB
    );
    const oneQuiz = await service.findActive();
    expect(oneQuiz.status).toBe(RecordStatus.ACTIVE);
  });
});

describe('Quiz Service : update', () => {
  let service: QuizService;
  let module: TestingModule;
  let quiz: QuizDocument;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuizService>(QuizService);

    quiz = await service.create(
      { ...quizStub.QUIZ_CREATE_DTO },
      quizStub.DECODED_PAYLOAD_STUB
    );
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should update the quiz; the name should be updated', async () => {
    quiz;
    const oneQuiz = await service.update(
      quiz.id,
      quizStub.QUIZ_UPDATE_DTO_NAME,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuiz.name).toBe(quizStub.QUIZ_UPDATE_DTO_NAME.name);
  });

  it('should update the quiz; the start date should be updated', async () => {
    quiz;
    const oneQuiz = await service.update(
      quiz.id,
      quizStub.QUIZ_UPDATE_DTO_START_DATE,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuiz.startTime).toEqual(
      quizStub.QUIZ_UPDATE_DTO_START_DATE.startTime
    );
  });

  it('should update the quiz; the end date should be updated', async () => {
    quiz;
    const oneQuiz = await service.update(
      quiz.id,
      quizStub.QUIZ_UPDATE_DTO_END_DATE,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuiz.endTime).toEqual(quizStub.QUIZ_UPDATE_DTO_END_DATE.endTime);
  });

  it('should update the quiz; the end date should be updated', async () => {
    quiz;
    const oneQuiz = await service.update(
      quiz.id,
      quizStub.QUIZ_UPDATE_DTO_END_DATE,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuiz.endTime).toEqual(quizStub.QUIZ_UPDATE_DTO_END_DATE.endTime);
  });

  it('should update the quiz; the status should be updated', async () => {
    quiz;
    const oneQuiz = await service.update(
      quiz.id,
      quizStub.QUIZ_UPDATE_DTO_STATUS_INACTIVE,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuiz.status).toEqual(
      quizStub.QUIZ_UPDATE_DTO_STATUS_INACTIVE.status
    );
  });

  it('should update the quiz; the win count threshold value should be updated', async () => {
    quiz;
    const oneQuiz = await service.update(
      quiz.id,
      quizStub.QUIZ_UPDATE_DTO_START_WIN_COUNT,
      quizStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuiz.minimalAnswerCountForWinning).toEqual(
      quizStub.QUIZ_UPDATE_DTO_START_WIN_COUNT.minimalAnswerCountForWinning.toString()
    );
  });

  it('should return the NotFoundException error when the requested quiz id is invalid', async () => {
    const invalidQuizDocument = quizStub.INVALID_DOCUMENT as QuizDocument;
    await expect(
      async () =>
        await service.update(
          invalidQuizDocument.id.toString(),
          quizStub.QUIZ_UPDATE_DTO_NAME,
          quizStub.DECODED_PAYLOAD_STUB
        )
    ).rejects.toThrow(NotFoundException);
  });
});
