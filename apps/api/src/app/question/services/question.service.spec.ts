import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER,
  DEFAULT_PROJECTION,
  DEFAULT_SKIP,
  DEFAULT_SORT_BY_FIELD,
} from '@damen/models';
import * as questionStub from '@damen/stubs';
import { NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { clean, close, rootModule } from '../../_utils/mongo-test.utils';
import {
  Question,
  QuestionDocument,
  QuestionSchema,
} from '../schema/question.schema';
import { QuestionService } from './question.service';

const mongooseModule = MongooseModule.forFeature([
  { name: Question.name, schema: QuestionSchema },
]);

export async function getModule() {
  return await Test.createTestingModule({
    imports: [rootModule(), mongooseModule],
    providers: [QuestionService],
  }).compile();
}

describe('Question Service : create', () => {
  let service: QuestionService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuestionService>(QuestionService);
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should create a question', async () => {
    const question = await service.create(
      questionStub.QUESTION_CREATE_DTO,
      questionStub.DECODED_PAYLOAD_STUB
    );
    expect(question.id).toBeDefined();
  });
});

describe('Question Service : findAll', () => {
  let service: QuestionService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuestionService>(QuestionService);

    for (let index = 0; index < 10; index++) {
      await service.create(
        { ...questionStub.QUESTION_CREATE_DTO, text: 'name 0' + index },
        questionStub.DECODED_PAYLOAD_STUB
      );
    }
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should return a page of questions that belongs to input quiz id; with default page options => check total data count', async () => {
    const page = await service.findAll({
      quiz: questionStub.QUIZ_ID_FOR_QUESTION,
      skip: DEFAULT_SKIP,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.page.length).toBe(10);
  });

  it('should return a empty page of questions with invalid quiz id; with default page options => check total data count', async () => {
    const page = await service.findAll({
      quiz: questionStub.INVALID_QUIZ_ID_FOR_QUESTION,
      skip: DEFAULT_SKIP,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.page.length).toBe(0);
  });
  it('should return a page of questions with default page options => check data length with page limit', async () => {
    const page = await service.findAll({
      quiz: questionStub.QUIZ_ID_FOR_QUESTION,
      skip: DEFAULT_SKIP,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.data.length).toBe(DEFAULT_LIMIT);
  });

  it('should return the second page of questions with parameterized page options', async () => {
    const page = await service.findAll({
      quiz: questionStub.QUIZ_ID_FOR_QUESTION,
      skip: 1,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.page.pageIndex).toBe(1);
  });

  it('should return an empty page of questions with not in range page options', async () => {
    const page = await service.findAll({
      quiz: questionStub.QUIZ_ID_FOR_QUESTION,
      skip: 2,
      limit: DEFAULT_LIMIT,
      sortByField: DEFAULT_SORT_BY_FIELD,
      order: DEFAULT_ORDER,
      projection: DEFAULT_PROJECTION,
    });
    expect(page.data.length).toBe(0);
  });
});

describe('Question Service : findOne', () => {
  let service: QuestionService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuestionService>(QuestionService);
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should return a question with valid id', async () => {
    const question = await service.create(
      { ...questionStub.QUESTION_CREATE_DTO },
      questionStub.DECODED_PAYLOAD_STUB
    );
    const oneQuestion = await service.findOne(question.id);
    expect(oneQuestion.text).toBe(question.text);
  });

  it('should return the NotFoundException error when the requested question id is invalid', async () => {
    const invalidQuizDocument =
      questionStub.INVALID_DOCUMENT as QuestionDocument;
    await expect(
      async () => await service.findOne(invalidQuizDocument.id.toString())
    ).rejects.toThrow(NotFoundException);
  });
});

describe('Question Service : update', () => {
  let service: QuestionService;
  let module: TestingModule;
  let question: QuestionDocument;

  beforeAll(async () => {
    module = await getModule();
    service = module.get<QuestionService>(QuestionService);

    question = await service.create(
      { ...questionStub.QUESTION_CREATE_DTO },
      questionStub.DECODED_PAYLOAD_STUB
    );
  });

  afterAll(async () => {
    await clean(module);
    await close();
  });

  it('should update the question; the text should be updated', async () => {
    const oneQuestion = await service.update(
      question.id,
      questionStub.QUESTION_UPDATE_DTO_TEXT,
      questionStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuestion.text).toBe(questionStub.QUESTION_UPDATE_DTO_TEXT.text);
  });

  it('should update the question; the video Url should be updated', async () => {
    const oneQuestion = await service.update(
      question.id,
      questionStub.QUESTION_UPDATE_DTO_VIDEOURL,
      questionStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuestion.videoUrl).toEqual(
      questionStub.QUESTION_UPDATE_DTO_VIDEOURL.videoUrl
    );
  });

  it('should update the question; the timer In Seconds should be updated', async () => {
    const oneQuestion = await service.update(
      question.id,
      questionStub.QUESTION_UPDATE_DTO_TIME_IN_SEC,
      questionStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuestion.timerInSeconds).toEqual(
      questionStub.QUESTION_UPDATE_DTO_TIME_IN_SEC.timerInSeconds
    );
  });

  it('should update the question; the choices should be updated', async () => {
    const oneQuestion = await service.update(
      question.id,
      questionStub.QUESTION_UPDATE_DTO_CHOICES,
      questionStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuestion.choices).not.toEqual(
      questionStub.QUESTION_CREATE_DTO.choices
    );
  });

  // it('should update the question; the correct answer should be updated', async () => {
  //   const oneQuestion = await service.update(
  //     question.id,
  //     questionStub.QUESTION_UPDATE_DTO_CORRECR_ANSWER,
  //     questionStub.DECODED_PAYLOAD_STUB
  //   );
  //   expect(oneQuestion.correctAnswer).toEqual(
  //     questionStub.QUESTION_UPDATE_DTO_CORRECR_ANSWER.correctAnswer
  //   );
  // });

  it('should update the question; the display Order value should be updated', async () => {
    const oneQuestion = await service.update(
      question.id,
      questionStub.QUESTION_UPDATE_DTO_START_DISPLAY_ORDER,
      questionStub.DECODED_PAYLOAD_STUB
    );
    expect(oneQuestion.displayOrder).toEqual(
      questionStub.QUESTION_UPDATE_DTO_START_DISPLAY_ORDER.displayOrder
    );
  });

  it('should return the NotFoundException error when the requested question id is invalid', async () => {
    const invalidQuestionDocument =
      questionStub.INVALID_DOCUMENT as QuestionDocument;
    await expect(
      async () =>
        await service.update(
          invalidQuestionDocument.id.toString(),
          questionStub.QUESTION_UPDATE_DTO_TEXT,
          questionStub.DECODED_PAYLOAD_STUB
        )
    ).rejects.toThrow(NotFoundException);
  });
});
