import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '../../../../environments/environment';
import { User } from '../../../user/schema/user.schema';
import { UserService } from '../../../user/services/user.service';
import { AuthService } from '../../services/auth.service';
import { USER_MODEL, PAYLOAD } from '../../services/auth-spec.conts';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let authService: AuthService;
  let service: LocalStrategy;

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
            new: jest.fn().mockResolvedValue(USER_MODEL),
            constructor: jest.fn().mockResolvedValue(USER_MODEL),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    service = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate()', () => {
    it('should return an error for valid email & invalid password', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      expect(() =>
        service.validate('user@example.com', 'invalidPassword')
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return an user for valid email & valid password', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(PAYLOAD);
      const user = await service.validate('user@example.com', 'validPassword');

      expect(user).toBe(PAYLOAD);
    });
  });
});
