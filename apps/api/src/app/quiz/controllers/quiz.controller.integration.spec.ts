import {
  DecodedPayload,
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
  ProjectionQuizDataTable,
  RecordStatus,
  URL_PATH_ACTIVE,
  URL_QUIZ,
} from '@damen/models';
import {
  ADMIN_USER_CON,
  QUIZ_CREATE_DTO,
  QUIZ_UPDATE_DTO_END_DATE,
  QUIZ_UPDATE_DTO_NAME,
  QUIZ_UPDATE_DTO_START_DATE,
  QUIZ_UPDATE_DTO_START_WIN_COUNT,
  QUIZ_UPDATE_DTO_STATUS_INACTIVE,
  STANDARD_USER_CON,
} from '@damen/stubs';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createAdminViaConnection,
  getRequest,
  patchRequest,
  postRequest,
} from '../../user/controllers/user-controller-integrate.utils';
import { getApp } from '../../_utils/app-test.utils';
import { cleanApp, close } from '../../_utils/mongo-test.utils';
import { QuizDocument } from '../schema/quiz.schema';
import { QuizService } from '../services/quiz.service';

describe('Quiz Controller : Create() : ADMIN ROLE', () => {
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

    const partialReqest = postRequest(app, `/${URL_QUIZ}`, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 for payload with no Authorization token: (POST) ${URL_QUIZ}`, () => {
    return post.send(QUIZ_CREATE_DTO).expect(401);
  });

  it(`should give 201 for payload with related to a valid payload for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send(QUIZ_CREATE_DTO).expect(201);
  });

  it(`should create a quiz with createdBy is saved with logged in user's email: (POST) ${URL_QUIZ}`, async () => {
    const response = await postWithToken.send(QUIZ_CREATE_DTO);
    expect(response.body.createdBy).toEqual(decodedPayload.sub);
  });

  it(`should give 409 for payload with related to a existing name for quiz: (POST) ${URL_QUIZ}`, async () => {
    await postWithToken.send(QUIZ_CREATE_DTO);
    const req = await postRequest(
      app,
      `/${URL_QUIZ}`,
      accessToken
    ).reqWithToken.send(QUIZ_CREATE_DTO);
    expect(req.status).toBe(409);
  });

  it(`should give 400 for payload with empty name for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, name: '' }).expect(400);
  });

  it(`should give 400 for payload with null name for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, name: null }).expect(400);
  });

  it(`should give 400 for payload with undefined name for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, name: undefined })
      .expect(400);
  });

  it(`should give 400 for payload with empty start Date for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, startTime: '' })
      .expect(400);
  });

  it(`should give 400 for payload with null start Date for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, startTime: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty end Date for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, endTime: '' }).expect(400);
  });

  it(`should give 400 for payload with null end Date for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, endTime: null })
      .expect(400);
  });

  it(`should give 400 for payload with null status for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, status: null }).expect(400);
  });

  it(`should give 400 for payload with empty status for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, status: '' }).expect(400);
  });

  it(`should give 400 for payload with null threshold count for win for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, minimalAnswerCountForWinning: null })
      .expect(400);
  });

  it(`should give 400 for payload with empty threshold count for win for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, minimalAnswerCountForWinning: '' })
      .expect(400);
  });
});

describe('Quiz Controller : FindAll() : ADMIN ROLE', () => {
  let app: INestApplication;
  let accessToken: string;
  let get: request.Test;
  let getWithToken: request.Test;

  beforeAll(async () => {
    app = await getApp();
    await app.init();

    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;

    const service = app.get(QuizService);
    for (let index = 0; index < 10; index++) {
      await service.create(
        {
          ...QUIZ_CREATE_DTO,
          name: `Quiz Name for index: ${index}`,
        },
        userCreated.payload
      );
    }
  });

  beforeEach(async () => {
    const partialReqest = getRequest(app, `/${URL_QUIZ}`, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 with default page of quizzes without token: (GET) ${URL_QUIZ}`, () => {
    return get.expect(401);
  });

  it(`should give 200 with default page of quizzes with token: (GET) ${URL_QUIZ}`, () => {
    return getWithToken.expect(200);
  });

  it(`should give the first page of quizzes with token: (GET) ${URL_QUIZ}`, async () => {
    const response = await getWithToken;
    expect(response.body.page.pageIndex).toBe(DEFAULT_SKIP);
  });

  it(`should retrieve the quizzes with the default limit of the page: (GET) ${URL_QUIZ}`, async () => {
    const response = await getWithToken;
    expect(response.body.page.pageSize).toBe(DEFAULT_LIMIT);
  });

  it(`should capture the total quizzes count within the page: (GET) ${URL_QUIZ}`, async () => {
    const response = await getWithToken;
    expect(response.body.page.length).toBe(10);
  });

  it(`should give 200 with second page of quizzes: (GET) ${URL_QUIZ}`, async () => {
    const response = await getWithToken.query({ skip: 1 }).expect(200);
    expect(response.body.page.pageIndex).toBe('1');
  });

  it(`should give 200 with first page of quizzes with default projection: (GET) ${URL_QUIZ}`, async () => {
    const response = await getWithToken;
    const data: ProjectionQuizDataTable[] = response.body.data;
    expect(data[0].modifiedAt).not.toBeDefined();
  });
});

describe('Quiz Controller: findActive() : ADMIN ROLE', () => {
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

    const service = app.get(QuizService);
    await service.create(
      { ...QUIZ_CREATE_DTO, name: 'Quiz test' },
      userCreated.payload
    );
    await service.create(QUIZ_CREATE_DTO, userCreated.payload);

    url = `/${URL_QUIZ}/${URL_PATH_ACTIVE}`;
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

  it(`should give 401 when requesting an active quiz without token: (GET) ${url}`, () => {
    return get.expect(401);
  });

  it(`should give 200 and a valid active quiz with token: (GET) ${url}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve an quiz with a active status (GET) ${url}`, async () => {
    const response = await getWithToken;
    expect(response.body.status).toBe(RecordStatus.ACTIVE);
  });

  it(`should retrieve the latest quiz with a active status (GET) ${url}`, async () => {
    const response = await getWithToken;
    expect(response.body.name).toBe(QUIZ_CREATE_DTO.name);
  });
});

describe('Quiz Controller : FindOne() : ADMIN ROLE', () => {
  let createdQuiz: QuizDocument;
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

    const service = app.get(QuizService);
    createdQuiz = await service.create(QUIZ_CREATE_DTO, userCreated.payload);
    url = `/${URL_QUIZ}/${createdQuiz.id.toString()}`;
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

  it(`should give 401 when requesting a quiz without token: (GET) ${url}`, () => {
    return get.expect(401);
  });

  it(`should give 200 for a valid quiz id with token: (GET) ${url}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve the same quiz with related to the quiz id: (GET) ${url}`, async () => {
    const response = await getWithToken;
    expect(response.body._id).toBe(createdQuiz.id.toString());
  });

  it(`should give 404 for an wrong quiz id with token: (GET) ${URL_QUIZ}`, () => {
    const url = `/${URL_QUIZ}/63ae92d61be003d87ec4ea14`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(404);
  });

  it(`should give 500 for an invalid quiz id with token: (GET) ${URL_QUIZ}`, () => {
    const url = `/${URL_QUIZ}/invalid`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(500);
  });
});

describe('Quiz Controller : Update() : ADMIN ROLE', () => {
  let app: INestApplication;
  let patch: request.Test;
  let patchWithToken: request.Test;
  let accessToken: string;
  let createdQuiz: QuizDocument;
  let decodedPayload: DecodedPayload;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const service = app.get<QuizService>(QuizService);
    createdQuiz = await service.create(QUIZ_CREATE_DTO, decodedPayload);

    const url = `/${URL_QUIZ}/${createdQuiz.id.toString()}`;
    const partialReqest = patchRequest(app, url, accessToken);
    patch = partialReqest.req;
    patchWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a quiz without token: (PATCH) ${URL_QUIZ}`, () => {
    return patch.send(QUIZ_UPDATE_DTO_NAME).expect(401);
  });

  it(`should give 200 for a valid quiz update with token: (PATCH) ${URL_QUIZ}`, () => {
    return patchWithToken.send(QUIZ_UPDATE_DTO_NAME).expect(200);
  });

  it(`should give 404 for a valid quiz update with POST method with token: (POST) ${URL_QUIZ}`, () => {
    const url = `/${URL_QUIZ}/${createdQuiz.id.toString()}`;
    const post = postRequest(app, url, accessToken).reqWithToken;
    return post.send(QUIZ_UPDATE_DTO_NAME).expect(404);
  });

  it(`should update the same quiz in the quiz id: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_NAME);
    expect(response.body._id).toBe(createdQuiz.id.toString());
  });

  it(`should update the quiz's name: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_NAME);
    expect(response.body.name).toBe(QUIZ_UPDATE_DTO_NAME.name);
  });

  it(`should update the quiz's end Date: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_END_DATE);
    expect(new Date(response.body.endTime)).toEqual(
      QUIZ_UPDATE_DTO_END_DATE.endTime
    );
  });

  it(`should update the quiz's start Date: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_START_DATE);
    expect(new Date(response.body.startTime)).toEqual(
      QUIZ_UPDATE_DTO_START_DATE.startTime
    );
  });

  it(`should update the quiz's minimal Answer Count For Winning: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_START_WIN_COUNT);
    expect(response.body.minimalAnswerCountForWinning).toBe(
      QUIZ_UPDATE_DTO_START_WIN_COUNT.minimalAnswerCountForWinning.toString()
    );
  });
  it(`should update the quiz's status: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_STATUS_INACTIVE);
    expect(response.body.status).toBe(QUIZ_UPDATE_DTO_STATUS_INACTIVE.status);
  });

  it(`should update the quiz's modifiedBy field with logged in users email: (PATCH) ${URL_QUIZ}`, async () => {
    const response = await patchWithToken.send(QUIZ_UPDATE_DTO_NAME);
    expect(response.body.modifiedBy).toEqual(decodedPayload.sub);
  });
});

describe('Quiz Controller : Create() : USER ROLE', () => {
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

    const partialReqest = postRequest(app, `/${URL_QUIZ}`, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 for payload with no Authorization token: (POST) ${URL_QUIZ}`, () => {
    return post.send(QUIZ_CREATE_DTO).expect(401);
  });

  it(`should give 403 for payload with related to a valid payload for USER role: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send(QUIZ_CREATE_DTO).expect(403);
  });

  it(`should give 403 for payload with empty name for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, name: '' }).expect(403);
  });

  it(`should give 403 for payload with null name for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken.send({ ...QUIZ_CREATE_DTO, name: null }).expect(403);
  });

  it(`should give 403 for payload with undefined name for quiz: (POST) ${URL_QUIZ}`, () => {
    return postWithToken
      .send({ ...QUIZ_CREATE_DTO, name: undefined })
      .expect(403);
  });
});

describe('Quiz Controller : FindAll() : USER ROLE', () => {
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
    const partialReqest = postRequest(app, `/${URL_QUIZ}`, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 with default page of quizzes without token: (GET) ${URL_QUIZ}`, () => {
    return get.expect(401);
  });
  it(`should give 403 when requesting a page of quizzes with token for USER Role: (GET) ${URL_QUIZ}`, () => {
    return getWithToken.expect(403);
  });
});

describe('Quiz Controller : findActive() : USER ROLE', () => {
  let app: INestApplication;
  let get: request.Test;
  let getWithToken: request.Test;
  let accessToken: string;
  let url: string;

  beforeAll(async () => {
    app = await getApp();
    await app.init();

    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;

    const service = app.get(QuizService);
    await service.create(
      { ...QUIZ_CREATE_DTO, name: 'Quiz test' },
      userCreated.payload
    );
    await service.create(QUIZ_CREATE_DTO, userCreated.payload);

    url = `/${URL_QUIZ}/${URL_PATH_ACTIVE}`;
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

  it(`should give 401 when requesting an active quiz without token: (GET) ${url}`, () => {
    return get.expect(401);
  });

  it(`should give 200 and a valid active quiz with token: (GET) ${url}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve an quiz with a active status (GET) ${url}`, async () => {
    const response = await getWithToken;
    expect(response.body.status).toBe(RecordStatus.ACTIVE);
  });

  it(`should retrieve the latest quiz with a active status (GET) ${url}`, async () => {
    const response = await getWithToken;
    expect(response.body.name).toBe(QUIZ_CREATE_DTO.name);
  });
});

describe('Quiz Controller : FindOne() : USER ROLE', () => {
  let app: INestApplication;
  let get: request.Test;
  let getWithToken: request.Test;
  let accessToken: string;
  let createdQuiz: QuizDocument;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;

    const service = app.get<QuizService>(QuizService);
    createdQuiz = await service.create(QUIZ_CREATE_DTO, userCreated.payload);

    const url = `/${URL_QUIZ}/${createdQuiz.id.toString()}`;

    const partialReqest = getRequest(app, url, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a quiz without token: (GET) ${URL_QUIZ}`, () => {
    return get.expect(401);
  });

  it(`should give 200 and a quiz; for request with token : (GET) ${URL_QUIZ}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve the quiz details with related to the quiz id: (GET) ${URL_QUIZ}`, async () => {
    const response = await getWithToken.expect(200);
    expect(response.body._id).toBe(createdQuiz.id.toString());
  });

  it(`should give 404 for an wrong quiz id with token: (GET) ${URL_QUIZ}`, () => {
    const url = `/${URL_QUIZ}/63ae92d61be003d87ec4ea14`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(404);
  });
});

describe('Quiz Controller : Update() : USER ROLE', () => {
  let app: INestApplication;
  let patch: request.Test;
  let patchWithToken: request.Test;
  let accessToken: string;
  let createdQuiz: QuizDocument;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;

    const service = app.get<QuizService>(QuizService);
    createdQuiz = await service.create(QUIZ_CREATE_DTO, userCreated.payload);

    const url = `/${URL_QUIZ}/${createdQuiz.id.toString()}`;

    const partialReqest = patchRequest(app, url, accessToken);
    patch = partialReqest.req;
    patchWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a quiz without token for USER role: (PATCH) ${URL_QUIZ}`, () => {
    return patch.send(QUIZ_UPDATE_DTO_NAME).expect(401);
  });

  it(`should give 403 for a valid quiz id for valid payload for USER role: (PATCH) ${URL_QUIZ}`, () => {
    return patchWithToken.send(QUIZ_UPDATE_DTO_NAME).expect(403);
  });

  it(`should give 404 for a valid quiz update with POST method with token for USER role: (POST) ${URL_QUIZ}`, () => {
    const url = `/${URL_QUIZ}/${createdQuiz.id.toString()}`;
    const post = postRequest(app, url, accessToken);
    return post.reqWithToken.send(QUIZ_UPDATE_DTO_NAME).expect(404);
  });
});
