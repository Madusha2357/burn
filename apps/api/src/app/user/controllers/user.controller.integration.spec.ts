import {
  DecodedPayload,
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
  Role,
  URL_CHANGE_PASSWORD,
  URL_USER,
  ProjectionUserDataTable,
} from '@damen/models';
import {
  ADMIN_USER_CON,
  CHANGE_PASSWORD_DTO,
  FIRST_LAST_NAME,
  PATCH_ROLE_ADMIN,
  STANDARD_USER,
  STANDARD_USER_CON,
  USER_ADMIN,
} from '@damen/stubs';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getApp } from '../../../app/_utils/app-test.utils';
import { cleanApp, close } from '../../_utils/mongo-test.utils';
import { UserDocument } from '../schema/user.schema';
import { UserService } from '../services/user.service';
import {
  createAdminViaConnection,
  getRequest,
  patchRequest,
  postRequest,
} from './user-controller-integrate.utils';

describe('User Controller : Create() : ADMIN ROLE', () => {
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

    const partialReqest = postRequest(app, `/${URL_USER}`, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 for payload with no Authorization token: (POST) ${URL_USER}`, () => {
    return post.send(USER_ADMIN).expect(401);
  });

  it(`should give 201 for payload with related to a valid email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send(USER_ADMIN).expect(201);
  });

  it(`should create a user with USER role irrespective of what defined in the payload: (POST) ${URL_USER}`, async () => {
    const response = await postWithToken.send(USER_ADMIN);
    expect(response.body.roles).not.toEqual([Role.ADMIN]);
  });

  it(`should create a user with createdBy is saved with logged in users email: (POST) ${URL_USER}`, async () => {
    const response = await postWithToken.send(USER_ADMIN);
    expect(response.body.createdBy).toEqual(decodedPayload.sub);
  });

  it(`should give 409 for payload with related to a existing email for user: (POST) ${URL_USER}`, async () => {
    await postWithToken.send(USER_ADMIN);
    const req = await postRequest(
      app,
      `/${URL_USER}`,
      accessToken
    ).reqWithToken.send(USER_ADMIN);
    expect(req.status).toBe(409);
  });

  it(`should give 400 for payload with empty email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, email: '' }).expect(400);
  });

  it(`should give 400 for payload with null email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, email: null }).expect(400);
  });

  it(`should give 400 for payload with undefined email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, email: undefined }).expect(400);
  });

  it(`should give 400 for payload with empty password for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, password: '' }).expect(400);
  });

  it(`should give 400 for payload with null password for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, password: null }).expect(400);
  });

  it(`should give 400 for payload with undefined password for user: (POST) ${URL_USER}`, () => {
    return postWithToken
      .send({ ...USER_ADMIN, password: undefined })
      .expect(400);
  });
});

describe('User Controller : FindAll() : ADMIN ROLE', () => {
  let app: INestApplication;
  let accessToken: string;
  let get: request.Test;
  let getWithToken: request.Test;

  beforeAll(async () => {
    app = await getApp();
    await app.init();

    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;

    const service = app.get(UserService);
    for (let index = 0; index < 10; index++) {
      await service.create(
        {
          ...STANDARD_USER,
          email: index + 'user@obmdigitalfactory.com',
          registerCode: '123456' + index,
        },
        userCreated.payload
      );
    }
  });

  beforeEach(async () => {
    const partialReqest = getRequest(app, `/${URL_USER}`, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 with default page of users without token: (GET) ${URL_USER}`, () => {
    return get.expect(401);
  });

  it(`should give 200 with default page of users with token: (GET) ${URL_USER}`, () => {
    return getWithToken.expect(200);
  });

  it(`should give the first page of users with token: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken;
    expect(response.body.page.pageIndex).toBe(DEFAULT_SKIP);
  });

  it(`should retrieve the users with the default limit of the page: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken;
    expect(response.body.page.pageSize).toBe(DEFAULT_LIMIT);
  });

  it(`should capture the total users count within the page: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken;
    expect(response.body.page.length).toBeGreaterThan(10);
  });

  it(`should give 200 with second page of users: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken.query({ skip: 1 }).expect(200);
    expect(response.body.page.pageIndex).toBe('1');
  });

  it(`should give 200 with first page of users with email projection: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken.query({ projection: 'email' });
    const data: ProjectionUserDataTable[] = response.body.data;
    expect(data[0].email).not.toBe(null);
  });

  it(`should give 200 with first page of users with email projection & should not contain firstName field: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken.query({ projection: 'email' });
    const data: ProjectionUserDataTable = response.body.data;
    expect(data[0].firstName).toBe(undefined);
  });
});

describe('User Controller : FindOne() : ADMIN ROLE', () => {
  let createdUser: UserDocument;
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

    const service = app.get(UserService);
    createdUser = await service.create(STANDARD_USER, userCreated.payload);
    url = `/${URL_USER}/${createdUser.id.toString()}`;
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

  it(`should give 401 when requesting a user without token: (GET) ${URL_USER}`, () => {
    return get.expect(401);
  });

  it(`should give 200 for a valid user id with token: (GET) ${URL_USER}`, () => {
    return getWithToken.expect(200);
  });

  it(`should retrieve the same user with related to the user id: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken;
    expect(response.body._id).toBe(createdUser.id.toString());
  });

  it(`should give 401 for an wrong user id with token: (GET) ${URL_USER}`, () => {
    const url = `/${URL_USER}/63ae92d61be003d87ec4ea14`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(401);
  });

  it(`should give 500 for an invalid user id with token: (GET) ${URL_USER}`, () => {
    const url = `/${URL_USER}/invalid`;
    const reqWithToken = getRequest(app, url, accessToken).reqWithToken;
    return reqWithToken.expect(500);
  });
});

describe('User Controller : Update() : ADMIN ROLE', () => {
  let app: INestApplication;
  let patch: request.Test;
  let patchWithToken: request.Test;
  let accessToken: string;
  let createdUser: UserDocument;
  let decodedPayload: DecodedPayload;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, ADMIN_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const service = app.get<UserService>(UserService);
    createdUser = (await service.create(
      STANDARD_USER,
      decodedPayload
    )) as UserDocument;

    const url = `/${URL_USER}/${createdUser.id.toString()}`;
    const partialReqest = patchRequest(app, url, accessToken);
    patch = partialReqest.req;
    patchWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a user without token: (PATCH) ${URL_USER}`, () => {
    return patch.send(FIRST_LAST_NAME).expect(401);
  });

  it(`should give 200 for a valid user update with token: (PATCH) ${URL_USER}`, () => {
    return patchWithToken.send(FIRST_LAST_NAME).expect(200);
  });

  it(`should give 404 for a valid user update with POST method with token: (POST) ${URL_USER}`, () => {
    const url = `/${URL_USER}/${createdUser.id.toString()}`;
    const post = postRequest(app, url, accessToken).reqWithToken;
    return post.send(FIRST_LAST_NAME).expect(404);
  });

  it(`should update the same user in the user id: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(FIRST_LAST_NAME);
    expect(response.body._id).toBe(createdUser.id.toString());
  });

  it(`should update the user's first name: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(FIRST_LAST_NAME);
    expect(response.body.firstName).toBe('FirstName');
  });

  it(`should update the user's role: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(PATCH_ROLE_ADMIN);
    expect(response.body.roles).toStrictEqual([Role.ADMIN]);
  });

  it(`should update the user's modifiedBy field with logged in users email: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(FIRST_LAST_NAME);
    expect(response.body.modifiedBy).toEqual(decodedPayload.sub);
  });
});

describe('User Controller : ChangePassword() : ADMIN ROLE', () => {
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

    const url = `/${URL_USER}/${URL_CHANGE_PASSWORD}`;
    const partialReqest = postRequest(app, url, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when try to change password without token: (POST) ${URL_USER}`, () => {
    return post.send(CHANGE_PASSWORD_DTO).expect(401);
  });

  it(`should change the password of the relevent user: (POST) ${URL_USER}`, async () => {
    const response = await postWithToken.send(CHANGE_PASSWORD_DTO);
    expect(response.status).toEqual(200);
  });

  it(`should update the password of the same logged in user: (POST) ${URL_USER}`, async () => {
    const response = await postWithToken.send(CHANGE_PASSWORD_DTO);
    expect(response.body._id.toString()).toEqual(decodedPayload.id);
  });
});

describe('User Controller : Create() : USER ROLE', () => {
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

    const partialReqest = postRequest(app, `/${URL_USER}`, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 for payload with no Authorization token: (POST) ${URL_USER}`, () => {
    return post.send(USER_ADMIN).expect(401);
  });
  it(`should give 403 for payload with related to a valid payload for USER role: (POST) ${URL_USER}`, () => {
    return postWithToken.send(USER_ADMIN).expect(403);
  });
  it(`should give 403 for payload with related to a existing email for user: (POST) ${URL_USER}`, () => {
    return postWithToken
      .send({ ...USER_ADMIN, email: 'user@obmdigitalfactory.com' })
      .expect(403);
  });
  it(`should give 403 for payload with empty email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, email: '' }).expect(403);
  });
  it(`should give 403 for payload with null email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, email: null }).expect(403);
  });
  it(`should give 403 for payload with undefined email for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, email: undefined }).expect(403);
  });
  it(`should give 403 for payload with empty password for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, password: '' }).expect(403);
  });
  it(`should give 403 for payload with null password for user: (POST) ${URL_USER}`, () => {
    return postWithToken.send({ ...USER_ADMIN, password: null }).expect(403);
  });
  it(`should give 403 for payload with undefined password for user: (POST) ${URL_USER}`, () => {
    return postWithToken
      .send({ ...USER_ADMIN, password: undefined })
      .expect(403);
  });
});

describe('User Controller : FindAll() : USER ROLE', () => {
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
    const partialReqest = postRequest(app, `/${URL_USER}`, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterAll(async () => {
    await cleanApp(app);
    await close();
    await app.close();
  });

  it(`should give 401 with default page of users without token: (GET) ${URL_USER}`, () => {
    return get.expect(401);
  });
  it(`should give 403 when requesting a page of users with token for USER Role: (GET) ${URL_USER}`, () => {
    return getWithToken.expect(403);
  });
});

describe('User Controller : FindOne() : USER ROLE', () => {
  let app: INestApplication;
  let get: request.Test;
  let getWithToken: request.Test;
  let accessToken: string;
  let decodedPayload: DecodedPayload;
  let createdUser: UserDocument;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const service = app.get<UserService>(UserService);
    createdUser = await service.create(STANDARD_USER, userCreated.payload);

    const url = `/${URL_USER}/${createdUser.id.toString()}`;

    const partialReqest = getRequest(app, url, accessToken);
    get = partialReqest.req;
    getWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a user without token: (GET) ${URL_USER}`, () => {
    return get.expect(401);
  });
  it(`should give 200 for a USER Role with token, response contains logged user details : (GET) ${URL_USER}`, () => {
    return getWithToken.expect(200);
  });
  it(`should retrieve the logged user details with regardless to the user id: (GET) ${URL_USER}`, async () => {
    const response = await getWithToken.expect(200);
    expect(response.body._id).toBe(decodedPayload.id.toString());
  });
  it(`should give 200 for an wrong user id with token, response contains logged user details : (GET) ${URL_USER}`, () => {
    const url = `/${URL_USER}/63ae92d61be003d87ec4ea14`;
    const partialReqest = getRequest(app, url, accessToken);
    return partialReqest.reqWithToken.expect(200);
  });
});

describe('User Controller : Update() : USER ROLE', () => {
  let app: INestApplication;
  let patch: request.Test;
  let patchWithToken: request.Test;
  let accessToken: string;
  let decodedPayload: DecodedPayload;
  let createdUser: UserDocument;

  beforeAll(async () => {
    app = await getApp();
    await app.init();
  });

  beforeEach(async () => {
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const service = app.get<UserService>(UserService);
    createdUser = await service.create(STANDARD_USER, userCreated.payload);

    const url = `/${URL_USER}/${createdUser.id.toString()}`;

    const partialReqest = patchRequest(app, url, accessToken);
    patch = partialReqest.req;
    patchWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when requesting a user without token for USER role: (PATCH) ${URL_USER}`, () => {
    return patch.send(FIRST_LAST_NAME).expect(401);
  });
  it(`should give 200 for a valid same logged in user update with token for USER role: (PATCH) ${URL_USER}`, () => {
    return patchWithToken.send(FIRST_LAST_NAME).expect(200);
  });
  it(`should give 404 for a valid user update with POST method with token for USER role: (POST) ${URL_USER}`, () => {
    const url = `/${URL_USER}/${createdUser.id.toString()}`;
    const post = postRequest(app, url, accessToken);
    return post.reqWithToken.send(FIRST_LAST_NAME).expect(404);
  });
  it(`should update the same logged user irrespective of the user id for USER role: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(FIRST_LAST_NAME);
    expect(response.body._id).toBe(decodedPayload.id);
  });
  it(`should update the logged in user's first name for USER role: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(FIRST_LAST_NAME);
    expect(response.body.firstName).toBe('FirstName');
  });
  it(`should not update the user's role for USER ROLE: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(PATCH_ROLE_ADMIN);
    expect(response.body.roles).toStrictEqual(createdUser.roles);
  });

  it(`should update the user's modifiedBy field with logged in users email: (PATCH) ${URL_USER}`, async () => {
    const response = await patchWithToken.send(FIRST_LAST_NAME);
    expect(response.body.modifiedBy).toEqual(decodedPayload.sub);
  });
});

describe('User Controller : ChangePassword() : USER ROLE', () => {
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
    const userCreated = await createAdminViaConnection(app, STANDARD_USER_CON);
    accessToken = userCreated.token;
    decodedPayload = userCreated.payload;

    const url = `/${URL_USER}/${URL_CHANGE_PASSWORD}`;
    const partialReqest = postRequest(app, url, accessToken);
    post = partialReqest.req;
    postWithToken = partialReqest.reqWithToken;
  });

  afterEach(async () => await cleanApp(app));

  afterAll(async () => {
    await close();
    await app.close();
  });

  it(`should give 401 when try to change password without token for USER ROLE: (POST) ${URL_USER}`, () => {
    return post.send(CHANGE_PASSWORD_DTO).expect(401);
  });
  it(`should change the password of the relevent user for USER ROLE: (POST) ${URL_USER}`, async () => {
    const response = await postWithToken.send(CHANGE_PASSWORD_DTO);
    expect(response.status).toEqual(200);
  });
  it(`should update the password of the same logged in user for USER ROLE: (POST) ${URL_USER}`, async () => {
    const response = await postWithToken.send(CHANGE_PASSWORD_DTO);
    expect(response.body._id.toString()).toEqual(decodedPayload.id);
  });
});
