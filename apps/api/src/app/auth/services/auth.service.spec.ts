import { DecodedPayload } from '@damen/models';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '../../../environments/environment';
import { User } from '../../user/schema/user.schema';
import { UserService } from '../../user/services/user.service';
import { compareHashedPassword } from '../../user/utils/user-utils';
import * as utilPath from './auth-spec.conts';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: environment.JWT_TOKEN_SECRET_KEY,
          signOptions: { expiresIn: environment.TOKEN_EXPIRES_IN },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(utilPath.USER_MODEL),
            constructor: jest.fn().mockResolvedValue(utilPath.USER_MODEL),
            findOneByEmail: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    it('should return UnauthorizedException for invalid user', async () => {
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockRejectedValue(new UnauthorizedException());
      expect(() =>
        service.validateUser('invalid@example.com', 'invalidPassword')
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return UnauthorizedException for valid email & invalid password', async () => {
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue(utilPath.USER_DOCUMENT_MODEL);

      expect(() =>
        service.validateUser('user@example.com', 'invalidPassword')
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return payload for valid email & valid password', async () => {
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue(utilPath.USER_DOCUMENT_MODEL_RESPONSE);
      const user = await service.validateUser('user@example.com', 'hello');
      expect(user.sub).toBe(utilPath.USER_DOCUMENT_MODEL.email);
    });

    it('should return findOne user', async () => {
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue(utilPath.USER_DOCUMENT_MODEL);
      expect(
        await userService.findOneByEmail(utilPath.CREATE_USER_DTO.email)
      ).toBe(utilPath.USER_DOCUMENT_MODEL);
    });

    it('should match the password', async () => {
      const passwordText = 'hello';
      const matchedPassword = await compareHashedPassword(
        passwordText,
        utilPath.USER_MODEL.password
      ).then((res) => {
        return res;
      });
      expect(matchedPassword).toBe(true);
    });

    it('should return user object without password', () => {
      const { password, ...result } = utilPath.USER_MODEL;
      expect(result).not.toBe(null);
    });
  });

  describe('signIn()', () => {
    it('should return an invalid access token ', () => {
      const token = service.signIn({} as DecodedPayload);
      const decoded = service.decodeJwt(token.accessToken);
      expect(decoded).toBe(null);
    });

    it('should return access token ', () => {
      const token = service.signIn(utilPath.PAYLOAD);
      expect(token.accessToken).not.toBe(null);
    });
  });

  describe('Decode tokens ', () => {
    it('should decode a valid access token ', () => {
      const decoded = service.decodeJwt(utilPath.VALID_BEARER_TOKEN);
      expect(decoded.sub).toBe('user@gmail.com');
    });

    it('should thorws and error for invalid bearar token', () => {
      expect(() => service.decodeJwt(utilPath.INVALID_BEARER_TOKEN)).toThrow(
        Error
      );
    });

    it('should thorws and error for invalid bearar token', () => {
      expect(() => service.decodeJwt(utilPath.INVALID_BEARER_TOKEN)).toThrow(
        Error
      );
    });

    it('should thorws and error for invalid bearar token payload', () => {
      const decoded = service.decodeJwt(utilPath.INVALID_BEARER_TOKEN2);
      expect(decoded).toBeNull();
    });
  });
});
