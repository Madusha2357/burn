/**
 * This utility is related to the integrated testing
 */
import { DecodedPayload, ICreateUserDto } from '@damen/models';
import { USER_PASSWORD_CON } from '@damen/stubs';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AuthService } from '../../auth/services/auth.service';

/**
 * function to create a database user from the connection
 * @param connection: Connection
 * @param collectionName: name of the collection that needs to be created
 * @param userDto: data to enter as the collection document
 */
export function createDatabaseUser(
  connection: Connection,
  collectionName: string,
  userDto: ICreateUserDto
) {
  const collection = connection.collection(collectionName);
  collection.insertOne(userDto);
}

/**
 * retrive the payload which will be converted into JWT
 * @param authService
 * @param email
 * @param password
 * @returns
 */
export async function getDecodedPayload(
  authService: AuthService,
  email: string,
  password: string
): Promise<[DecodedPayload, unknown]> {
  try {
    const data = await authService.validateUser(email, password);
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
/**
 * retrive the access token from the payload
 * @param authService
 * @param payload
 * @returns
 */
export function getAccessToken(
  authService: AuthService,
  payload: DecodedPayload
): string {
  const accessToken = authService.signIn(payload);
  return accessToken.accessToken;
}

/**
 * Create a user through the connection and retrive both decodePayload and token
 * @param app
 * @param connection
 * @param collectionName
 * @param userDto
 * @returns Promise<[DecodedPayload, string]>
 */
export async function createUserFromConnection(
  app: INestApplication,
  // connection: Connection,
  collectionName: string,
  userDto: ICreateUserDto
): Promise<{
  payload: DecodedPayload;
  token: string;
}> {
  const connection = await app.get(getConnectionToken());
  createDatabaseUser(connection, collectionName, userDto);
  const authService = app.get<AuthService>(AuthService);
  const payload = await getDecodedPayload(
    authService,
    userDto.email,
    USER_PASSWORD_CON
  );
  const token = getAccessToken(authService, payload[0]);
  return { payload: payload[0], token };
}

export async function createAdminViaConnection(
  app: INestApplication,
  userDto: ICreateUserDto
) {
  const connection = await app.get(getConnectionToken());
  const model = 'users';
  createDatabaseUser(connection, model, userDto);
  const authService = app.get<AuthService>(AuthService);
  const payload = await getDecodedPayload(
    authService,
    userDto.email,
    USER_PASSWORD_CON
  );
  const token = getAccessToken(authService, payload[0]);
  return { payload: payload[0], token };
}

/**
 * to retrive the request of type get; with and without the token
 */
export function getRequest(
  app: INestApplication,
  url: string,
  accessToken: string
) {
  const req = request(app.getHttpServer())
    .get(url)
    .set('content-type', 'application/json');

  const token = `Bearer ${accessToken}`;

  const reqWithToken = request(app.getHttpServer())
    .get(url)
    .set('content-type', 'application/json')
    .set('Authorization', token);

  return { req, reqWithToken };
}

/**
 * to retrive the request of type post; with and without the token
 */
export function postRequest(
  app: INestApplication,
  url: string,
  accessToken: string
) {
  const req = request(app.getHttpServer())
    .post(url)
    .set('content-type', 'application/json');

  const token = `Bearer ${accessToken}`;

  const reqWithToken = request(app.getHttpServer())
    .post(url)
    .set('content-type', 'application/json')
    .set('Authorization', token);

  return { req, reqWithToken };
}

/**
 * to retrive the request of type patch; with and without the token
 */
export function patchRequest(
  app: INestApplication,
  url: string,
  accessToken: string
) {
  const req = request(app.getHttpServer())
    .patch(url)
    .set('content-type', 'application/json');

  const token = `Bearer ${accessToken}`;

  const reqWithToken = request(app.getHttpServer())
    .patch(url)
    .set('content-type', 'application/json')
    .set('Authorization', token);

  return { req, reqWithToken };
}
