import {
  DecodedPayload,
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
  QuestionDataTable,
  URL_QUESTION,
} from '@damen/models';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  ADMIN_USER_CON,
  INVALID_QUIZ_ID_FOR_QUESTION,
  QUESTION_CREATE_DTO,
  QUESTION_UPDATE_DTO_CHOICES,
  // QUESTION_UPDATE_DTO_CORRECR_ANSWER,
  QUESTION_UPDATE_DTO_START_DISPLAY_ORDER,
  QUESTION_UPDATE_DTO_TEXT,
  QUESTION_UPDATE_DTO_TIME_IN_SEC,
  QUESTION_UPDATE_DTO_VIDEOURL,
  QUIZ_ID_FOR_QUESTION,
  STANDARD_USER_CON,
} from '@damen/stubs';
import {
  createAdminViaConnection,
  getRequest,
  patchRequest,
  postRequest,
} from '../../user/controllers/user-controller-integrate.utils';
import { getApp } from '../../_utils/app-test.utils';
import { cleanApp, close } from '../../_utils/mongo-test.utils';
import { QuestionService } from '../services/question.service';
import { QuestionDocument } from '../schema/question.schema';

describe('Question Controller : Create() : ADMIN ROLE', () => {
  let app: INestApplication;
  let post: request.Test;
  let postWithToken: request.Test;
  let accessToken: string;
  let decodedPayload: DecodedPayload;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const partialReqest = postRequest(app, `/${URL_QUESTION}`, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 for payload with no Authorization token: (POST) ${URL_QUESTION}`, () => {
    return post.send(QUESTION_CREATE_DTO).expect(401);
  });

  it(`should give 201 for payload with related to a valid payload for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken.send(QUESTION_CREATE_DTO).expect(201);
  });

  it(`should create a question with createdBy is saved with logged in user's email: (POST) ${URL_QUESTION}`, async () => {
    const response = await postWithToken.send(QUESTION_CREATE_DTO);
    expect(response.body.createdBy).toEqual(decodedPayload.sub);
  });

  it(`should give 400 for payload with empty text for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken.send({ ...QUESTION_CREATE_DTO, text: '' }).expect(400);
  });

  it(`should give 400 for payload with null text for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, text: null })
      .expect(400);
  });

  it(`should give 400 for payload with undefined text for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, text: undefined })
      .expect(400);
  });

  it(`should give 400 for payload with empty videoUrl for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, videoUrl: '' })
      .expect(400);
  });

  it(`should give 400 for payload with null videoUrl for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, videoUrl: null })
      .expect(400);
  });

  it(`should give 400 for payload with undefined videoUrl for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, videoUrl: undefined })
      .expect(400);
  });

  it(`should give 400 for payload with null choices for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, choices: null })
      .expect(400);
  });

  it(`should give 400 for payload with null correctAnswer for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, correctAnswer: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty correctAnswer for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, correctAnswer: '' })
      .expect(400);
  });

  it(`should give 400 for payload with null timerInSeconds for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, timerInSeconds: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty timerInSeconds for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, timerInSeconds: '' })
      .expect(400);
  });

  it(`should give 400 for payload with null displayOrder for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, displayOrder: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty displayOrder for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, displayOrder: '' })
      .expect(400);
  });

  it(`should give 400 for payload with null status for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, status: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty status for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, status: '' })
      .expect(400);
  });

  it(`should give 400 for payload with null quiz for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, quiz: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty quiz for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken.send({ ...QUESTION_CREATE_DTO, quiz: '' }).expect(400);
  });
});

describe('Question Controller : FindAll() : ADMIN ROLE', () => {
  let app: INestApplication;
  let accessToken: string;
  let get: request.Test;
  let getWithToken: request.Test;

  beforeAll(async () => {
    app = await getApp();
    await app.init();

    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;

    const service = app.get(QuestionService);
    for (let index = 0; index < 10; index++) {
      await service.create(
        {
          ...QUESTION_CREATE_DTO,
          text: `Question Name for index: ${index}`,
        },
        userCreated.payload
      );
    }
  });

  beforeEach(async () => {
    const partialReqest = getRequest(app, `/${URL_QUESTION}`, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 with default page of questions without token: (GET) ${URL_QUESTION}`, () => {
    return get.expect(401);
  });

  it(`should give 500 with default page of questions with token: (GET) ${URL_QUESTION}`, () => {
    return getWithToken.expect(500);
  });

  it(`should give 200 with default page of questions for invalid quiz id with token: (GET) ${URL_QUESTION}`, () => {
    return getWithToken
      .query({ quiz: INVALID_QUIZ_ID_FOR_QUESTION })
      .expect(200);
  });

  it(`should contain empty data in default page of questions for invalid quiz id with token: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken.query({
      quiz: INVALID_QUIZ_ID_FOR_QUESTION,
    });
    expect(response.body.page.length).toBe(0);
  });

  it(`should give 200 with default page of questions for valid quiz id with token: (GET) ${URL_QUESTION}`, () => {
    return getWithToken.query({ quiz: QUIZ_ID_FOR_QUESTION }).expect(200);
  });

  it(`should give the first page of questions with token: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken.query({ quiz: QUIZ_ID_FOR_QUESTION });
    expect(response.body.page.pageIndex).toBe(DEFAULT_SKIP);
  });

  it(`should retrieve the questions with the default limit of the page: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken.query({ quiz: QUIZ_ID_FOR_QUESTION });
    expect(response.body.page.pageSize).toBe(DEFAULT_LIMIT);
  });

  it(`should capture the total questions count within the page: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken.query({ quiz: QUIZ_ID_FOR_QUESTION });
    expect(response.body.page.length).toBe(10);
  });

  it(`should give 200 with second page of questions: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken
      .query({ quiz: QUIZ_ID_FOR_QUESTION, skip: 1 })
      .expect(200);
    expect(response.body.page.pageIndex).toBe('1');
  });

  it(`should give 200 with first page of questions with default projection: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken.query({ quiz: QUIZ_ID_FOR_QUESTION });
    const data: QuestionDataTable[] = response.body.data;
    expect(data[0].modifiedAt).not.toBeDefined();
  });
});

describe('Question Controller : FindOne() : ADMIN ROLE', () => {
  let createdQuestion: QuestionDocument;
  let get: request.Test;
  let getWithToken: request.Test;
  let app: INestApplication;
  let accessToken: string;
  let url: string;

  beforeAll(async () => {
    app = await getApp();
    await app.init();

    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;

    const service = app.get(QuestionService);
    createdQuestion = await service.create(
      QUESTION_CREATE_DTO,
      userCreated.payload
    );
    url = `/${URL_QUESTION}/${createdQuestion.id.toString()}`;
  });

  beforeEach(async () => {
    const partialReqest = getRequest(app, url, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a question without token: (GET) ${url}`, () => {
    return get.expect(401);
  });

  it(`should give 200 for a valid question id with token: (GET) ${url}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve the same question with related to the question id: (GET) ${url}`, async () => {
    const response = await getWithToken;
    expect(response.body._id).toBe(createdQuestion.id.toString());
  });

  it(`should give 404 for an wrong question id with token: (GET) ${URL_QUESTION}`, () => {
    const url = `/${URL_QUESTION}/63ae92d61be003d87ec4ea14`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(404);
  });

  it(`should give 500 for an invalid question id with token: (GET) ${URL_QUESTION}`, () => {
    const url = `/${URL_QUESTION}/invalid`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(500);
  });
});

describe('Question Controller : Update() : ADMIN ROLE', () => {
  let app: INestApplication;
  let patch: request.Test;
  let patchWithToken: request.Test;
  let accessToken: string;
  let createdQuestion: QuestionDocument;
  let decodedPayload: DecodedPayload;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const service = app.get<QuestionService>(QuestionService);
    createdQuestion = await service.create(QUESTION_CREATE_DTO, decodedPayload);

    const url = `/${URL_QUESTION}/${createdQuestion.id.toString()}`;
    const partialReqest = patchRequest(app, url, accessToken);
    patch = partialReqest.req;
    patchWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a question without token: (PATCH) ${URL_QUESTION}`, () => {
    return patch.send(QUESTION_UPDATE_DTO_TEXT).expect(401);
  });

  it(`should give 200 for a valid question update with token: (PATCH) ${URL_QUESTION}`, () => {
    return patchWithToken.send(QUESTION_UPDATE_DTO_TEXT).expect(200);
  });

  it(`should give 404 for a valid question update with POST method with token: (POST) ${URL_QUESTION}`, () => {
    const url = `/${URL_QUESTION}/${createdQuestion.id.toString()}`;
    const post = postRequest(app, url, accessToken).reqWithToken;
    return post.send(QUESTION_UPDATE_DTO_TEXT).expect(404);
  });

  it(`should update the same question in the question id: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(QUESTION_UPDATE_DTO_TEXT);
    expect(response.body._id).toBe(createdQuestion.id.toString());
  });

  it(`should update the question's text: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(QUESTION_UPDATE_DTO_TEXT);
    expect(response.body.text).toBe(QUESTION_UPDATE_DTO_TEXT.text);
  });

  it(`should update the question's choices: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(QUESTION_UPDATE_DTO_CHOICES);
    expect(response.body.choices).not.toEqual(QUESTION_CREATE_DTO.choices);
  });

  // it(`should update the question's correctAnswer: (PATCH) ${URL_QUESTION}`, async () => {
  //   const response = await patchWithToken.send(
  //     QUESTION_UPDATE_DTO_CORRECR_ANSWER
  //   );
  //   expect(response.body.correctAnswer).toEqual(
  //     QUESTION_UPDATE_DTO_CORRECR_ANSWER.correctAnswer
  //   );
  // });

  it(`should update the question's displayOrder: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(
      QUESTION_UPDATE_DTO_START_DISPLAY_ORDER
    );
    expect(response.body.displayOrder).toBe(
      QUESTION_UPDATE_DTO_START_DISPLAY_ORDER.displayOrder
    );
  });

  it(`should update the question's timerInSeconds: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(QUESTION_UPDATE_DTO_TIME_IN_SEC);
    expect(response.body.timerInSeconds).toBe(
      QUESTION_UPDATE_DTO_TIME_IN_SEC.timerInSeconds
    );
  });

  it(`should update the question's videoUrl: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(QUESTION_UPDATE_DTO_VIDEOURL);
    expect(response.body.videoUrl).toBe(QUESTION_UPDATE_DTO_VIDEOURL.videoUrl);
  });

  it(`should update the question's modifiedBy field with logged in users email: (PATCH) ${URL_QUESTION}`, async () => {
    const response = await patchWithToken.send(QUESTION_UPDATE_DTO_TIME_IN_SEC);
    expect(response.body.modifiedBy).toEqual(decodedPayload.sub);
  });
});

describe('Question Controller : Create() : USER ROLE', () => {
  let app: INestApplication;
  let post: request.Test;
  let postWithToken: request.Test;
  let accessToken: string;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;

    const partialReqest = postRequest(app, `/${URL_QUESTION}`, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 for payload with no Authorization token: (POST) ${URL_QUESTION}`, () => {
    return post.send(QUESTION_CREATE_DTO).expect(401);
  });

  it(`should give 403 for payload with related to a valid payload for USER role: (POST) ${URL_QUESTION}`, () => {
    return postWithToken.send(QUESTION_CREATE_DTO).expect(403);
  });

  it(`should give 403 for payload with empty text for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken.send({ ...QUESTION_CREATE_DTO, text: '' }).expect(403);
  });

  it(`should give 403 for payload with null text for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, text: null })
      .expect(403);
  });

  it(`should give 403 for payload with undefined text for question: (POST) ${URL_QUESTION}`, () => {
    return postWithToken
      .send({ ...QUESTION_CREATE_DTO, text: undefined })
      .expect(403);
  });
});

describe('Question Controller : FindAll() : USER ROLE', () => {
  let app: INestApplication;
  let get: request.Test;
  let getWithToken: request.Test;
  let accessToken: string;

  beforeAll(async () => {
    app = await getApp();
    await app.init();

    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;
  });

  beforeEach(async () => {
    const partialReqest = postRequest(app, `/${URL_QUESTION}`, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 with default page of questions without token: (GET) ${URL_QUESTION}`, () => {
    return get.expect(401);
  });
  it(`should give 403 when requesting a page of questions with token for USER Role: (GET) ${URL_QUESTION}`, () => {
    return getWithToken.expect(403);
  });
});

describe('Question Controller : FindOne() : USER ROLE', () => {
  let app: INestApplication;
  let get: request.Test;
  let getWithToken: request.Test;
  let accessToken: string;
  let createdQuestion: QuestionDocument;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;

    const service = app.get<QuestionService>(QuestionService);
    createdQuestion = await service.create(
      QUESTION_CREATE_DTO,
      userCreated.payload
    );

    const url = `/${URL_QUESTION}/${createdQuestion.id.toString()}`;

    const partialReqest = getRequest(app, url, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a question without token: (GET) ${URL_QUESTION}`, () => {
    return get.expect(401);
  });

  it(`should give 200 and a question; for request with token : (GET) ${URL_QUESTION}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve the question details with related to the question id: (GET) ${URL_QUESTION}`, async () => {
    const response = await getWithToken.expect(200);
    expect(response.body._id).toBe(createdQuestion.id.toString());
  });

  it(`should give 404 for an wrong question id with token: (GET) ${URL_QUESTION}`, () => {
    const url = `/${URL_QUESTION}/63ae92d61be003d87ec4ea14`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(404);
  });
});

describe('Question Controller : Update() : USER ROLE', () => {
  let app: INestApplication;
  let patch: request.Test;
  let patchWithToken: request.Test;
  let accessToken: string;
  let createdQuestion: QuestionDocument;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;

    const service = app.get<QuestionService>(QuestionService);
    createdQuestion = await service.create(
      QUESTION_CREATE_DTO,
      userCreated.payload
    );

    const url = `/${URL_QUESTION}/${createdQuestion.id.toString()}`;

    const partialReqest = patchRequest(app, url, accessToken);
    patch = partialReqest.req;
    patchWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a question without token for USER role: (PATCH) ${URL_QUESTION}`, () => {
    return patch.send(QUESTION_UPDATE_DTO_TEXT).expect(401);
  });

  it(`should give 403 for a valid question id for valid payload for USER role: (PATCH) ${URL_QUESTION}`, () => {
    return patchWithToken.send(QUESTION_UPDATE_DTO_TEXT).expect(403);
  });

  it(`should give 404 for a valid question update with POST method with token for USER role: (POST) ${URL_QUESTION}`, () => {
    const url = `/${URL_QUESTION}/${createdQuestion.id.toString()}`;
    const post = postRequest(app, url, accessToken);
    return post.reqWithToken.send(QUESTION_UPDATE_DTO_TEXT).expect(404);
  });
});
