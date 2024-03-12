import { DECODED_PAYLOAD_STUB } from '@damen/stubs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestModule } from '../../app-test.module';
import { AuthService } from '../../auth/services/auth.service';
import { close, rootModule } from '../../_utils/mongo-test.utils';
import {
  getAccessToken,
  getDecodedPayload,
} from './user-controller-integrate.utils';

describe('User controller integration  utility tests=>', () => {
  let app: INestApplication;
  let service: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule, rootModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    service = app.get<AuthService>(AuthService);
    await app.init();
  });

  afterAll(async () => {
    await close();
    await app.close();
  });

  describe('basic variables initiation check', () => {
    it('should return payload for valid email & valid password', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockResolvedValue(DECODED_PAYLOAD_STUB);
      const payload = await getDecodedPayload(
        service,
        'user@example.com',
        'hello'
      );
      expect(payload[0].sub).toBe('user@example.com');
    });

    it('should return access token for valid payload', async () => {
      const accessToken = await getAccessToken(service, DECODED_PAYLOAD_STUB);
      expect(accessToken.length).toBeGreaterThan(20);
    });
  });
});
